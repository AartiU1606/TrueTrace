"use client";

import { useState, useRef, useEffect } from "react";
import {
    Send,
    Trash2,
    Scale,
    Shield,
    Loader2,
    BookOpen,
    Phone,
    FileText,
    ChevronRight,
} from "lucide-react";

interface Message {
    id: string;
    role: "user" | "assistant";
    text: string;
    timestamp: Date;
}

const QUICK_QUESTIONS = [
    "What law protects me from counterfeit products?",
    "How can I file a complaint against a fake product seller?",
    "What evidence should I collect for a consumer complaint?",
    "Which authority handles counterfeit product complaints in India?",
    "What are my rights as a consumer under the Consumer Protection Act 2019?",
    "How do I report an online fraud for fake products?",
];

const LEGAL_RESOURCES = [
    { label: "Consumer Court (File Online)", url: "https://edaakhil.nic.in", icon: FileText },
    { label: "National Consumer Helpline", url: "https://consumerhelpline.gov.in", icon: Phone },
    { label: "Cyber Crime Portal", url: "https://cybercrime.gov.in", icon: Shield },
    { label: "CCPA India", url: "https://ccpa-india.nic.in", icon: BookOpen },
];

export default function ConsumerLawChatbot() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "welcome",
            role: "assistant",
            text: "Welcome to the **Consumer Law AI Assistant**. I specialize in Indian consumer protection laws and can help you understand your rights when dealing with counterfeit products, fake sellers, or unfair trade practices.\n\nAsk me anything — such as how to file a complaint, which laws protect you, what evidence to collect, or which authorities to contact.",
            timestamp: new Date(),
        },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const formatText = (text: string) => {
        // Convert markdown-like formatting to JSX-safe HTML
        return text
            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
            .replace(/\*(.*?)\*/g, "<em>$1</em>")
            .split("\n")
            .map((line, i) => {
                const trimmed = line.trim();
                if (trimmed.match(/^[\d]+\./)) {
                    return `<div class="mt-1">${line}</div>`;
                }
                if (trimmed.startsWith("•") || trimmed.startsWith("-")) {
                    return `<div class="ml-2 mt-0.5">${line}</div>`;
                }
                if (!trimmed) return `<div class="mt-2"></div>`;
                return `<div>${line}</div>`;
            })
            .join("");
    };

    const sendMessage = async (text?: string) => {
        const messageText = (text || input).trim();
        if (!messageText || isLoading) return;

        const userMsg: Message = {
            id: `u-${Date.now()}`,
            role: "user",
            text: messageText,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setIsLoading(true);

        try {
            const res = await fetch("/api/consumer-law-chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: messageText }),
            });
            const data = await res.json();
            setMessages((prev) => [
                ...prev,
                {
                    id: `a-${Date.now()}`,
                    role: "assistant",
                    text: data.reply || data.error || "I encountered an issue. Please try again.",
                    timestamp: new Date(),
                },
            ]);
        } catch {
            setMessages((prev) => [
                ...prev,
                {
                    id: `a-err-${Date.now()}`,
                    role: "assistant",
                    text: "⚠️ Network error. Please check your connection and try again.",
                    timestamp: new Date(),
                },
            ]);
        } finally {
            setIsLoading(false);
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    };

    const clearConversation = () => {
        setMessages([
            {
                id: "welcome-new",
                role: "assistant",
                text: "Conversation cleared. How can I assist you with consumer law today?",
                timestamp: new Date(),
            },
        ]);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="flex gap-6 h-[calc(100vh-10rem)] max-h-[800px]">

            {/* Left Panel: Info + Resources */}
            <aside className="hidden lg:flex flex-col gap-4 w-72 flex-shrink-0">
                {/* About */}
                <div className="glass-card p-5 rounded-2xl border-white/10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-emerald-500/15 rounded-xl">
                            <Scale className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                            <div className="text-sm font-bold text-white">AI Legal Assistant</div>
                            <div className="text-xs text-emerald-400 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                                Powered by HuggingFace
                            </div>
                        </div>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed">
                        Specialized in Indian consumer protection law. Provides guidance on counterfeit products, complaint procedures, and legal rights.
                    </p>
                    <div className="mt-4 pt-4 border-t border-white/5">
                        <p className="text-xs text-gray-500 italic">
                            For informational purposes only. Not a substitute for professional legal advice.
                        </p>
                    </div>
                </div>

                {/* Quick Questions */}
                <div className="glass-card p-5 rounded-2xl border-white/10 flex-1 overflow-y-auto">
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Quick Questions</h3>
                    <div className="space-y-2">
                        {QUICK_QUESTIONS.map((q, i) => (
                            <button
                                key={i}
                                onClick={() => sendMessage(q)}
                                disabled={isLoading}
                                className="w-full text-left px-3 py-2.5 rounded-xl bg-white/3 border border-white/8 hover:bg-emerald-500/10 hover:border-emerald-500/30 text-gray-300 hover:text-emerald-300 text-xs leading-relaxed transition-all duration-200 flex items-start gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronRight className="w-3 h-3 mt-0.5 flex-shrink-0 text-gray-600 group-hover:text-emerald-400 transition-colors" />
                                {q}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Official Resources */}
                <div className="glass-card p-5 rounded-2xl border-white/10">
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Official Resources</h3>
                    <div className="space-y-2">
                        {LEGAL_RESOURCES.map((r, i) => (
                            <a
                                key={i}
                                href={r.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-emerald-500/10 text-gray-400 hover:text-emerald-400 transition-all group"
                            >
                                <r.icon className="w-3.5 h-3.5 flex-shrink-0 text-emerald-500/60 group-hover:text-emerald-400 transition-colors" />
                                <span className="text-xs">{r.label}</span>
                            </a>
                        ))}
                    </div>
                </div>
            </aside>

            {/* Main Chat Panel */}
            <div className="flex-1 flex flex-col glass-card rounded-2xl border-white/10 overflow-hidden min-w-0">

                {/* Chat Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-gradient-to-r from-emerald-500/5 to-transparent flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-gradient-to-br from-emerald-600 to-emerald-500 rounded-xl shadow-[0_0_12px_rgba(16,185,129,0.35)]">
                            <Scale className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-white">Consumer Law AI Assistant</h2>
                            <p className="text-xs text-gray-400">Indian Consumer Protection · Legal Guidance · Rights Advisory</p>
                        </div>
                    </div>
                    <button
                        onClick={clearConversation}
                        title="Clear conversation"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-gray-400 hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/10 text-xs font-medium transition-all"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                        Clear
                    </button>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                        >
                            {/* Avatar */}
                            <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${msg.role === "assistant"
                                    ? "bg-gradient-to-br from-emerald-600 to-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                                    : "bg-gradient-to-br from-gray-600 to-gray-500"
                                }`}>
                                {msg.role === "assistant"
                                    ? <Shield className="w-4 h-4 text-white" />
                                    : <span className="text-xs text-white font-bold">U</span>
                                }
                            </div>

                            {/* Bubble */}
                            <div className={`max-w-[75%] ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col gap-1`}>
                                <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.role === "user"
                                        ? "bg-gradient-to-br from-emerald-600 to-emerald-700 text-white rounded-tr-md"
                                        : "bg-white/6 border border-white/8 text-gray-200 rounded-tl-md"
                                    }`}>
                                    {msg.role === "assistant" ? (
                                        <div
                                            className="prose prose-invert prose-sm max-w-none"
                                            dangerouslySetInnerHTML={{ __html: formatText(msg.text) }}
                                        />
                                    ) : (
                                        <p>{msg.text}</p>
                                    )}
                                </div>
                                <span className="text-[10px] text-gray-600 px-1">
                                    {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                </span>
                            </div>
                        </div>
                    ))}

                    {/* Loading indicator */}
                    {isLoading && (
                        <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full flex-shrink-0 bg-gradient-to-br from-emerald-600 to-emerald-500 flex items-center justify-center shadow-[0_0_8px_rgba(16,185,129,0.4)]">
                                <Shield className="w-4 h-4 text-white" />
                            </div>
                            <div className="px-4 py-3 rounded-2xl rounded-tl-md bg-white/6 border border-white/8 flex items-center gap-2">
                                <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
                                <span className="text-sm text-gray-400">Analyzing legal context…</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="px-6 py-4 border-t border-white/5 bg-black/20 flex-shrink-0">
                    {/* Mobile quick questions */}
                    <div className="flex gap-2 overflow-x-auto pb-3 lg:hidden hide-scrollbar">
                        {QUICK_QUESTIONS.slice(0, 3).map((q, i) => (
                            <button
                                key={i}
                                onClick={() => sendMessage(q)}
                                disabled={isLoading}
                                className="whitespace-nowrap px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex-shrink-0 hover:bg-emerald-500/20 transition-colors disabled:opacity-50"
                            >
                                {q.length > 35 ? q.slice(0, 35) + "…" : q}
                            </button>
                        ))}
                    </div>

                    <div className="flex gap-3 items-end">
                        <div className="flex-1 relative">
                            <textarea
                                ref={inputRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Ask about your consumer rights, applicable laws, or complaint procedures…"
                                disabled={isLoading}
                                rows={1}
                                maxLength={500}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all resize-none leading-relaxed"
                                style={{ minHeight: "44px", maxHeight: "120px" }}
                                onInput={(e) => {
                                    const el = e.currentTarget;
                                    el.style.height = "44px";
                                    el.style.height = Math.min(el.scrollHeight, 120) + "px";
                                }}
                            />
                        </div>
                        <button
                            onClick={() => sendMessage()}
                            disabled={isLoading || !input.trim()}
                            className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-500 flex items-center justify-center shadow-[0_4px_14px_rgba(16,185,129,0.35)] hover:shadow-[0_4px_20px_rgba(16,185,129,0.5)] hover:from-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex-shrink-0"
                            title="Send message"
                        >
                            <Send className="w-4 h-4 text-white" />
                        </button>
                    </div>
                    <p className="text-[10px] text-gray-600 mt-2 text-center">
                        Press Enter to send · Shift+Enter for new line · For informational purposes only
                    </p>
                </div>
            </div>
        </div>
    );
}
