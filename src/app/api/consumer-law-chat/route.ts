import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";

// Load the knowledge base at module level
const knowledgeBasePath = path.join(process.cwd(), "data", "consumer_laws_knowledge.json");
const knowledgeBase = JSON.parse(fs.readFileSync(knowledgeBasePath, "utf-8"));

// Simple keyword-based retrieval to find relevant context (RAG)
function retrieveRelevantContext(query: string): string {
    const queryLower = query.toLowerCase();
    const contextParts: string[] = [];

    // Match laws
    const matchedLaws = knowledgeBase.laws.filter((law: { keywords: string[] }) =>
        law.keywords.some((kw: string) => queryLower.includes(kw.toLowerCase()))
    );
    if (matchedLaws.length > 0) {
        matchedLaws.slice(0, 2).forEach((law: { name: string; summary: string; key_sections?: string[]; remedies?: string[] }) => {
            contextParts.push(
                `LAW: ${law.name}\n${law.summary}\nKey Sections: ${(law.key_sections || []).slice(0, 3).join("; ")}\nRemedies: ${(law.remedies || []).join(", ")}`
            );
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

    // Default: include CPA summary + helpline
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
    const injectionPatterns = [
        /ignore (previous|above|all) instructions?/gi,
        /forget (previous|above|all) instructions?/gi,
        /you are now/gi,
        /pretend (you are|to be)/gi,
        /\[INST\]/gi,
        /<<SYS>>/gi,
        /\[\/INST\]/gi,
    ];
    let sanitized = input.trim().slice(0, 500);
    injectionPatterns.forEach((p) => { sanitized = sanitized.replace(p, ""); });
    return sanitized;
}

// Guard: only answer consumer-law related queries
function isConsumerLawRelated(query: string): boolean {
    const allowedTopics = [
        "consumer", "fraud", "fake", "counterfeit", "product", "seller", "law", "legal",
        "report", "complaint", "refund", "rights", "court", "protection", "act", "india",
        "helpline", "authority", "purchase", "online", "marketplace", "evidence", "compensation",
        "return", "replace", "trademark", "brand", "genuine", "authentic", "mislead", "scam",
        "cheat", "deceive", "dispute", "ecommerce", "amazon", "flipkart", "CCPA", "cyber",
        "police", "FIR", "case", "remedy", "file", "justice", "BIS", "bureau of indian standards",
        "CCPA", "central consumer protection", "ISI", "warranty", "guarantee"
    ];
    const queryLower = query.toLowerCase();
    return allowedTopics.some((topic) => queryLower.includes(topic.toLowerCase()));
}

// Fallback: return structured knowledge-base answer without AI model
function generateFallbackResponse(query: string, context: string): string {
    const q = query.toLowerCase();

    if (q.includes("file") || q.includes("complaint") || q.includes("court")) {
        return "To file a complaint for a counterfeit product in India:\n1. Gather evidence (receipts, product photos, seller screenshots)\n2. Send a written complaint to the seller demanding remedy within 15-30 days\n3. File online at edaakhil.nic.in (Consumer Court portal — free to file)\n4. Contact National Consumer Helpline: 1800-11-4000 (toll-free)\n\nUnder the Consumer Protection Act 2019, you can claim a full refund, replacement, and compensation for mental agony.";
    }
    if (q.includes("refund") || q.includes("return") || q.includes("money back")) {
        return "You have a legal right to a full refund for counterfeit or misrepresented products under:\n• Consumer Protection Act 2019 — unfair trade practice\n• Sale of Goods Act 1930 — breach of implied condition of description\n\nSteps: (1) Contact seller/platform immediately, (2) Escalate to platform grievance officer, (3) File at edaakhil.nic.in if unresolved within 30 days. You can also claim compensation for harassment and mental agony.";
    }
    if (q.includes("report") || q.includes("authority") || q.includes("helpline")) {
        return "Report a counterfeit seller to:\n• National Consumer Helpline: 1800-11-4000 or consumerhelpline.gov.in\n• Cyber Crime Portal (online fraud): cybercrime.gov.in or call 1930\n• Central Consumer Protection Authority: ccpa-india.nic.in\n• Consumer Court: edaakhil.nic.in\n• Local Police: File FIR under IPC Section 420 (cheating) and Trade Marks Act";
    }
    if (q.includes("evidence") || q.includes("proof") || q.includes("document")) {
        return "Collect the following evidence for a counterfeit product complaint:\n1. Original purchase receipt or invoice\n2. Order confirmation email and screenshots of the seller listing\n3. Clear photographs of the product, packaging, and any defects\n4. Screenshots of all communications with the seller\n5. Bank statement showing payment\n6. Delivery receipt or courier tracking record\n7. Expert assessment or test report (if available)\n\nKeep originals safe — do not discard the product until your complaint is resolved.";
    }
    if (q.includes("law") || q.includes("act") || q.includes("protect") || q.includes("right")) {
        return "Key laws protecting you against counterfeit products in India:\n• **Consumer Protection Act 2019** — primary consumer rights law; selling counterfeits is an 'unfair trade practice' punishable with up to 7 years imprisonment\n• **Trade Marks Act 1999** — criminal penalties for selling goods with false trademarks\n• **IT Act 2000** — covers online fraud and digital cheating by impersonation\n• **Sale of Goods Act 1930** — implies quality and authenticity warranties in every sale\n• **Legal Metrology Act 2009** — requires correct labeling, MRP, and packaging information\n• **E-Commerce Rules 2020** — mandates platform grievance redressal within 30 days";
    }

    // Generic fallback using context
    return `Based on Indian consumer protection laws:\n\n${context.split("\n").slice(0, 6).join("\n")}\n\nFor specific guidance, contact the **National Consumer Helpline** at 1800-11-4000 (toll-free) or visit consumerhelpline.gov.in.`;
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
                reply: "I'm specialized in Indian consumer protection law and counterfeit product issues. Please ask me about your consumer rights, how to report fake products, applicable laws, or how to file a complaint. How can I help you today?"
            });
        }

        // Retrieve relevant legal context (RAG)
        const context = retrieveRelevantContext(message);

        const hfApiKey = process.env.HUGGINGFACE_API_KEY;
        if (!hfApiKey) {
            // No API key — still return a useful response from knowledge base
            return NextResponse.json({ reply: generateFallbackResponse(message, context) });
        }

        // Build prompt for Mistral-7B-Instruct format
        const systemPrompt = `You are an AI assistant specialized in Indian consumer protection laws. 
Provide clear, accurate, and concise legal guidance on:
- Counterfeit product complaints and consumer rights
- Legal protections under Indian law
- Reporting authorities and complaint procedures
- Evidence collection for consumer complaints

Focus on Indian regulations including: Consumer Protection Act 2019, Central Consumer Protection Authority (CCPA), Bureau of Indian Standards (BIS), Trade Marks Act 1999, IT Act 2000, and E-Commerce Rules 2020.

If unsure about specific details, say the information should be verified with official authorities.
Keep answers practical, structured, and actionable.`;

        const userPrompt = `Relevant legal context for this query:
${context}

User question: ${message}

Provide a helpful, accurate answer with specific laws, authorities, and actionable steps where applicable.`;

        // Mistral-7B-Instruct uses <s>[INST] ... [/INST] prompt format
        const prompt = `<s>[INST] ${systemPrompt}

${userPrompt} [/INST]`;

        // Try Mistral-7B-Instruct first, then fall back to flan-t5-large
        let reply = "";

        const modelsToTry = [
            "mistralai/Mistral-7B-Instruct-v0.2",
            "google/flan-t5-large",
        ];

        for (const model of modelsToTry) {
            try {
                const isFlanT5 = model.includes("flan-t5");
                const requestBody = isFlanT5
                    ? {
                        inputs: `${systemPrompt}\n\nContext:\n${context}\n\nQuestion: ${message}\n\nAnswer:`,
                        parameters: { max_new_tokens: 400, temperature: 0.3, do_sample: false },
                    }
                    : {
                        inputs: prompt,
                        parameters: { max_new_tokens: 512, temperature: 0.4, do_sample: true, return_full_text: false },
                    };

                const hfResponse = await fetch(
                    `https://api-inference.huggingface.co/models/${model}`,
                    {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${hfApiKey}`,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(requestBody),
                        signal: AbortSignal.timeout(25000),
                    }
                );

                if (!hfResponse.ok) {
                    console.warn(`Model ${model} returned ${hfResponse.status}, trying next...`);
                    continue;
                }

                const hfData = await hfResponse.json();

                let generated = "";
                if (Array.isArray(hfData) && hfData[0]?.generated_text) {
                    generated = hfData[0].generated_text.trim();
                } else if (typeof hfData === "object" && hfData.generated_text) {
                    generated = hfData.generated_text.trim();
                }

                // Strip the prompt echo from Mistral responses (sometimes it repeats)
                if (generated.includes("[/INST]")) {
                    generated = generated.split("[/INST]").slice(-1)[0].trim();
                }

                if (generated && generated.length > 20) {
                    reply = generated;
                    break;
                }
            } catch (modelErr) {
                console.warn(`Model ${model} failed:`, modelErr);
                continue;
            }
        }

        // Final fallback: knowledge-base driven answer
        if (!reply || reply.length < 15) {
            reply = generateFallbackResponse(message, context);
        }

        return NextResponse.json({ reply });

    } catch (err: unknown) {
        console.error("Consumer law chat error:", err);
        // Always respond helpfully
        return NextResponse.json({
            reply: "I'm having a temporary issue connecting to the AI model, but I can still help!\n\n**For counterfeit product issues in India:**\n• Call the National Consumer Helpline: **1800-11-4000** (toll-free)\n• File at Consumer Court online: **edaakhil.nic.in**\n• Report cyber fraud: **cybercrime.gov.in** or call **1930**\n\n**Key Protection:** Consumer Protection Act 2019 — selling counterfeits is an unfair trade practice with penalties up to 7 years imprisonment.\n\nPlease try your question again in a moment."
        });
    }
}
