import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";

// Load the knowledge base at module level
const knowledgeBasePath = path.join(process.cwd(), "data", "consumer_laws_knowledge.json");
const knowledgeBase = JSON.parse(fs.readFileSync(knowledgeBasePath, "utf-8"));

// Simple keyword-based retrieval to find relevant context
function retrieveRelevantContext(query: string): string {
    const queryLower = query.toLowerCase();
    const contextParts: string[] = [];

    // Match laws
    const matchedLaws = knowledgeBase.laws.filter((law: { keywords: string[]; summary: string; key_sections?: string[]; remedies?: string[] }) =>
        law.keywords.some((kw: string) => queryLower.includes(kw.toLowerCase()))
    );
    if (matchedLaws.length > 0) {
        matchedLaws.slice(0, 2).forEach((law: { name: string; summary: string; key_sections?: string[]; remedies?: string[] }) => {
            contextParts.push(`LAW: ${law.name}\n${law.summary}\nKey Sections: ${(law.key_sections || []).slice(0, 3).join("; ")}\nRemedies: ${(law.remedies || []).join(", ")}`);
        });
    }

    // Match authorities
    const matchedAuthorities = knowledgeBase.authorities.filter((auth: { keywords: string[] }) =>
        auth.keywords.some((kw: string) => queryLower.includes(kw.toLowerCase()))
    );
    if (matchedAuthorities.length > 0) {
        matchedAuthorities.slice(0, 2).forEach((auth: { name: string; description: string; contact: string; suitable_for: string[] }) => {
            contextParts.push(`AUTHORITY: ${auth.name}\n${auth.description}\nContact: ${auth.contact}\nFor: ${auth.suitable_for.join(", ")}`);
        });
    }

    // Match procedures
    const matchedProcedures = knowledgeBase.procedures.filter((proc: { keywords: string[] }) =>
        proc.keywords.some((kw: string) => queryLower.includes(kw.toLowerCase()))
    );
    if (matchedProcedures.length > 0) {
        matchedProcedures.slice(0, 1).forEach((proc: { topic: string; steps: string[] }) => {
            contextParts.push(`PROCEDURE: ${proc.topic}\n${proc.steps.join("\n")}`);
        });
    }

    // If no specific match, include general consumer protection act info
    if (contextParts.length === 0) {
        const cpa = knowledgeBase.laws[0];
        contextParts.push(`LAW: ${cpa.name}\n${cpa.summary}`);
        const helpline = knowledgeBase.authorities[0];
        contextParts.push(`AUTHORITY: ${helpline.name}\nContact: ${helpline.contact}`);
    }

    return contextParts.join("\n\n");
}

// Sanitize user input to prevent prompt injection
function sanitizeInput(input: string): string {
    // Remove attempts to override system instructions
    const injectionPatterns = [
        /ignore (previous|above|all) instructions?/gi,
        /forget (previous|above|all) instructions?/gi,
        /you are now/gi,
        /act as/gi,
        /pretend (you are|to be)/gi,
        /system prompt/gi,
        /\[INST\]/gi,
        /<<SYS>>/gi,
    ];

    let sanitized = input.trim().slice(0, 500); // Limit length
    injectionPatterns.forEach((pattern) => {
        sanitized = sanitized.replace(pattern, "");
    });

    return sanitized;
}

// Check if query is consumer-law related
function isConsumerLawRelated(query: string): boolean {
    const allowedTopics = [
        "consumer", "fraud", "fake", "counterfeit", "product", "seller", "law", "legal",
        "report", "complaint", "refund", "rights", "court", "protection", "act", "india",
        "helpline", "authority", "purchase", "online", "marketplace", "evidence", "compensation",
        "return", "replace", "trademark", "brand", "genuine", "authentic", "mislead", "scam",
        "cheat", "deceive", "dispute", "ecommerce", "amazon", "flipkart", "CCPA", "cyber",
        "police", "FIR", "case", "remedy", "file", "justice"
    ];
    const queryLower = query.toLowerCase();
    return allowedTopics.some((topic) => queryLower.includes(topic.toLowerCase()));
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const rawMessage: string = body.message || "";

        if (!rawMessage.trim()) {
            return NextResponse.json({ error: "Message is required" }, { status: 400 });
        }

        const message = sanitizeInput(rawMessage);

        // Guard: only answer consumer-law related queries
        if (!isConsumerLawRelated(message)) {
            return NextResponse.json({
                reply: "I'm specialized in consumer protection law and counterfeit product issues. Please ask me about your consumer rights, how to report fake products, applicable laws, or how to file a complaint. How can I help you today?"
            });
        }

        // Retrieve relevant legal context (RAG)
        const context = retrieveRelevantContext(message);

        // Construct the prompt
        const prompt = `You are a legal assistant specializing in Indian consumer protection law.
Provide accurate, helpful legal guidance related to counterfeit products, consumer rights, and complaint procedures.
Only answer questions related to consumer law, product authenticity, and consumer rights. Do not answer unrelated topics.

Context (relevant Indian laws and procedures):
${context}

User Question: ${message}

Answer clearly with actionable steps. Mention specific laws, authorities, or procedures where applicable. Keep the answer concise and practical.`;

        const hfApiKey = process.env.HUGGINGFACE_API_KEY;
        if (!hfApiKey) {
            return NextResponse.json({ error: "HuggingFace API key not configured" }, { status: 500 });
        }

        // Call HuggingFace Inference API – google/flan-t5-large
        const hfResponse = await fetch(
            "https://api-inference.huggingface.co/models/google/flan-t5-large",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${hfApiKey}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    inputs: prompt,
                    parameters: {
                        max_new_tokens: 512,
                        temperature: 0.3,
                        do_sample: false,
                    },
                }),
                signal: AbortSignal.timeout(30000),
            }
        );

        if (!hfResponse.ok) {
            const errText = await hfResponse.text();
            console.error("HuggingFace API error:", hfResponse.status, errText);
            // Always fall back to knowledge-base driven response
            const fallback = generateFallbackResponse(message, context);
            return NextResponse.json({ reply: fallback });
        }

        const hfData = await hfResponse.json();

        // flan-t5-large returns array of objects with generated_text
        let reply = "";
        if (Array.isArray(hfData) && hfData[0]?.generated_text) {
            reply = hfData[0].generated_text.trim();
        } else if (typeof hfData === "object" && hfData.generated_text) {
            reply = hfData.generated_text.trim();
        } else {
            // Fallback to context-based response
            reply = generateFallbackResponse(message, context);
        }

        if (!reply || reply.length < 10) {
            reply = generateFallbackResponse(message, context);
        }

        return NextResponse.json({ reply });
    } catch (err: unknown) {
        console.error("Consumer law chat error:", err);
        // Always respond helpfully even on unexpected errors
        return NextResponse.json({
            reply: "I'm temporarily unable to connect to the AI model, but I can still help! For counterfeit product issues in India:\n• **Call the National Consumer Helpline**: 1800-11-4000 (toll-free)\n• **File online at Consumer Court**: edaakhil.nic.in\n• **Report cyber fraud**: cybercrime.gov.in or call 1930\n• **Key law**: Consumer Protection Act 2019 — protects you against all unfair trade practices including sale of counterfeit goods.\n\nPlease try your question again in a moment."
        });
    }
}

// Fallback: build a helpful response directly from the knowledge base context
function generateFallbackResponse(query: string, context: string): string {
    const queryLower = query.toLowerCase();

    if (queryLower.includes("file") || queryLower.includes("complaint") || queryLower.includes("court")) {
        return "To file a complaint for a counterfeit product in India:\n1. Gather evidence (receipts, product photos, seller screenshots)\n2. Send a written complaint to the seller demanding remedy within 15-30 days\n3. File online at edaakhil.nic.in (Consumer Court portal — free to file)\n4. Contact National Consumer Helpline: 1800-11-4000 (toll-free)\nUnder the Consumer Protection Act 2019, you can claim a full refund, replacement, and compensation for mental agony.";
    }

    if (queryLower.includes("refund") || queryLower.includes("return") || queryLower.includes("money")) {
        return "You have a legal right to a full refund for counterfeit or misrepresented products under:\n• Consumer Protection Act 2019 — unfair trade practice\n• Sale of Goods Act 1930 — breach of implied condition of description\nSteps: (1) Contact the seller/platform immediately, (2) Escalate to platform grievance officer, (3) File complaint at edaakhil.nic.in if unresolved. You can also claim compensation for harassment.";
    }

    if (queryLower.includes("report") || queryLower.includes("authority") || queryLower.includes("helpline")) {
        return "Report a counterfeit seller to:\n• National Consumer Helpline: 1800-11-4000 or consumerhelpline.gov.in\n• Cyber Crime Portal (for online fraud): cybercrime.gov.in or call 1930\n• Central Consumer Protection Authority: ccpa-india.nic.in\n• Consumer Court: edaakhil.nic.in\n• Local Police: File FIR under IPC Section 420 (cheating) and Trade Marks Act";
    }

    if (queryLower.includes("law") || queryLower.includes("act") || queryLower.includes("protect")) {
        return "Key laws protecting you against counterfeit products in India:\n• Consumer Protection Act 2019 — primary consumer rights law; selling counterfeits is an 'unfair trade practice'\n• Trade Marks Act 1999 — criminal penalties for selling goods with false trademarks\n• IT Act 2000 — covers online fraud and digital cheating\n• Sale of Goods Act 1930 — implies quality and description warranties in every sale\n• E-Commerce Rules 2020 — mandates platform grievance redressal within 30 days";
    }

    // Generic response using context
    return `Based on Indian consumer protection laws: ${context.split("\n").slice(0, 4).join(" ")} For specific guidance, contact the National Consumer Helpline at 1800-11-4000 or visit consumerhelpline.gov.in.`;
}
