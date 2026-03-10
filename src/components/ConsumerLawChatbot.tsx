"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    MessageCircle,
    X,
    Send,
    Scale,
    ChevronDown,
    Loader2,
    Shield,
} from "lucide-react";

interface Message {
    id: string;
    role: "user" | "bot";
    text: string;
    timestamp: Date;
}

const STARTER_QUESTIONS = [
    "What law protects me if I bought a fake product?",
    "How do I file a complaint in consumer court?",
    "How can I report a counterfeit seller online?",
    "What are my refund rights for a fake product?",
];

export default function ConsumerLawChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "welcome",
            role: "bot",
            text: "👋 Hello! I'm your **Consumer Law Assistant**.\n\nI can help you understand your legal rights when you encounter counterfeit products — including which Indian laws protect you, how to file complaints, and which authorities to contact.\n\nWhat would you like to know?",
            timestamp: new Date(),
        },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 300);
        }
    }, [isOpen]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = async (text?: string) => {
        const messageText = text || input.trim();
        if (!messageText || isLoading) return;

        const userMsg: Message = {
            id: `user-${Date.now()}`,
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
            const replyText =
                data.reply ||
                data.error ||
                "I'm having trouble responding right now. Please try again.";

            setMessages((prev) => [
                ...prev,
                {
                    id: `bot-${Date.now()}`,
                    role: "bot",
                    text: replyText,
                    timestamp: new Date(),
                },
            ]);
        } catch {
            setMessages((prev) => [
                ...prev,
                {
                    id: `bot-error-${Date.now()}`,
                    role: "bot",
                    text: "⚠️ Network error. Please check your connection and try again.",
                    timestamp: new Date(),
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const formatBotText = (text: string) => {
        // Convert **bold**, bullet points, and line breaks
        return text
            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
            .split("\n")
            .map((line, i) => {
                if (line.match(/^\d+\./)) {
                    return `<div class="cl-step">${line}</div>`;
                }
                if (line.startsWith("•") || line.startsWith("-")) {
                    return `<div class="cl-bullet">${line}</div>`;
                }
                return `<span>${line}</span>`;
            })
            .join("<br/>");
    };

    return (
        <>
            {/* Styles */}
            <style>{`
        .cl-step { padding: 2px 0; }
        .cl-bullet { padding: 2px 0; }
        .cl-scrollbar::-webkit-scrollbar { width: 4px; }
        .cl-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .cl-scrollbar::-webkit-scrollbar-thumb { background: rgba(16,185,129,0.3); border-radius: 2px; }
        .cl-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(16,185,129,0.6); }
      `}</style>

            {/* Floating Button */}
            <div
                style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 9999 }}
            >
                <AnimatePresence>
                    {!isOpen && (
                        <motion.button
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsOpen(true)}
                            title="Consumer Law Assistant"
                            style={{
                                width: 60,
                                height: 60,
                                borderRadius: "50%",
                                background: "linear-gradient(135deg, #059669, #10b981)",
                                border: "2px solid rgba(16,185,129,0.4)",
                                boxShadow:
                                    "0 0 0 0 rgba(16,185,129,0.4), 0 8px 32px rgba(16,185,129,0.4)",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                animation: "chatbot-pulse 2.5s infinite",
                            }}
                        >
                            <Scale style={{ width: 28, height: 28, color: "white" }} />
                        </motion.button>
                    )}
                </AnimatePresence>

                {/* Pulse animation */}
                <style>{`
          @keyframes chatbot-pulse {
            0% { box-shadow: 0 0 0 0 rgba(16,185,129,0.5), 0 8px 32px rgba(16,185,129,0.3); }
            70% { box-shadow: 0 0 0 14px rgba(16,185,129,0), 0 8px 32px rgba(16,185,129,0.3); }
            100% { box-shadow: 0 0 0 0 rgba(16,185,129,0), 0 8px 32px rgba(16,185,129,0.3); }
          }
        `}</style>

                {/* Chat Window */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 30, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 30, scale: 0.95 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                            style={{
                                position: "fixed",
                                bottom: 90,
                                right: 24,
                                width: 380,
                                maxWidth: "calc(100vw - 32px)",
                                height: 560,
                                maxHeight: "calc(100vh - 120px)",
                                borderRadius: 20,
                                background: "rgba(7, 11, 18, 0.97)",
                                border: "1px solid rgba(16,185,129,0.25)",
                                boxShadow:
                                    "0 24px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(16,185,129,0.1), inset 0 1px 0 rgba(255,255,255,0.05)",
                                display: "flex",
                                flexDirection: "column",
                                overflow: "hidden",
                                backdropFilter: "blur(20px)",
                            }}
                        >
                            {/* Header */}
                            <div
                                style={{
                                    padding: "16px 18px",
                                    background:
                                        "linear-gradient(135deg, rgba(5,150,105,0.2) 0%, rgba(16,185,129,0.1) 100%)",
                                    borderBottom: "1px solid rgba(16,185,129,0.2)",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 12,
                                    flexShrink: 0,
                                }}
                            >
                                <div
                                    style={{
                                        width: 38,
                                        height: 38,
                                        borderRadius: "50%",
                                        background: "linear-gradient(135deg, #059669, #10b981)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        flexShrink: 0,
                                        boxShadow: "0 0 12px rgba(16,185,129,0.4)",
                                    }}
                                >
                                    <Scale style={{ width: 20, height: 20, color: "white" }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div
                                        style={{
                                            fontWeight: 700,
                                            fontSize: 14,
                                            color: "white",
                                            letterSpacing: 0.3,
                                        }}
                                    >
                                        Consumer Law Assistant
                                    </div>
                                    <div
                                        style={{
                                            fontSize: 11,
                                            color: "#10b981",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 4,
                                        }}
                                    >
                                        <span
                                            style={{
                                                width: 6,
                                                height: 6,
                                                borderRadius: "50%",
                                                background: "#10b981",
                                                display: "inline-block",
                                                boxShadow: "0 0 4px #10b981",
                                            }}
                                        />
                                        AI-Powered · Indian Consumer Law Expert
                                    </div>
                                </div>
                                <div style={{ display: "flex", gap: 6 }}>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        title="Minimize"
                                        style={{
                                            width: 28,
                                            height: 28,
                                            borderRadius: 8,
                                            background: "rgba(255,255,255,0.05)",
                                            border: "1px solid rgba(255,255,255,0.1)",
                                            cursor: "pointer",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            color: "#9ca3af",
                                            transition: "all 0.15s",
                                        }}
                                        onMouseOver={(e) => {
                                            (e.currentTarget.style.background = "rgba(255,255,255,0.1)");
                                            (e.currentTarget.style.color = "white");
                                        }}
                                        onMouseOut={(e) => {
                                            (e.currentTarget.style.background = "rgba(255,255,255,0.05)");
                                            (e.currentTarget.style.color = "#9ca3af");
                                        }}
                                    >
                                        <ChevronDown style={{ width: 14, height: 14 }} />
                                    </button>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        title="Close"
                                        style={{
                                            width: 28,
                                            height: 28,
                                            borderRadius: 8,
                                            background: "rgba(255,255,255,0.05)",
                                            border: "1px solid rgba(255,255,255,0.1)",
                                            cursor: "pointer",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            color: "#9ca3af",
                                            transition: "all 0.15s",
                                        }}
                                        onMouseOver={(e) => {
                                            (e.currentTarget.style.background = "rgba(239,68,68,0.15)");
                                            (e.currentTarget.style.color = "#f87171");
                                        }}
                                        onMouseOut={(e) => {
                                            (e.currentTarget.style.background = "rgba(255,255,255,0.05)");
                                            (e.currentTarget.style.color = "#9ca3af");
                                        }}
                                    >
                                        <X style={{ width: 14, height: 14 }} />
                                    </button>
                                </div>
                            </div>

                            {/* Messages */}
                            <div
                                className="cl-scrollbar"
                                style={{
                                    flex: 1,
                                    overflowY: "auto",
                                    padding: "16px 14px",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 12,
                                }}
                            >
                                {messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        style={{
                                            display: "flex",
                                            flexDirection: msg.role === "user" ? "row-reverse" : "row",
                                            alignItems: "flex-start",
                                            gap: 8,
                                        }}
                                    >
                                        {msg.role === "bot" && (
                                            <div
                                                style={{
                                                    width: 28,
                                                    height: 28,
                                                    borderRadius: "50%",
                                                    background: "linear-gradient(135deg, #059669, #10b981)",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    flexShrink: 0,
                                                    marginTop: 2,
                                                }}
                                            >
                                                <Shield style={{ width: 14, height: 14, color: "white" }} />
                                            </div>
                                        )}
                                        <div
                                            style={{
                                                maxWidth: "80%",
                                                padding: "10px 14px",
                                                borderRadius:
                                                    msg.role === "user"
                                                        ? "16px 4px 16px 16px"
                                                        : "4px 16px 16px 16px",
                                                background:
                                                    msg.role === "user"
                                                        ? "linear-gradient(135deg, #059669, #10b981)"
                                                        : "rgba(255,255,255,0.06)",
                                                border:
                                                    msg.role === "user"
                                                        ? "none"
                                                        : "1px solid rgba(255,255,255,0.08)",
                                                color: msg.role === "user" ? "white" : "#e5e7eb",
                                                fontSize: 13,
                                                lineHeight: 1.6,
                                                wordBreak: "break-word",
                                            }}
                                        >
                                            {msg.role === "bot" ? (
                                                <div
                                                    dangerouslySetInnerHTML={{
                                                        __html: formatBotText(msg.text),
                                                    }}
                                                />
                                            ) : (
                                                msg.text
                                            )}
                                            <div
                                                style={{
                                                    fontSize: 10,
                                                    color:
                                                        msg.role === "user"
                                                            ? "rgba(255,255,255,0.6)"
                                                            : "rgba(156,163,175,0.7)",
                                                    marginTop: 4,
                                                    textAlign: "right",
                                                }}
                                            >
                                                {msg.timestamp.toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {isLoading && (
                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        <div
                                            style={{
                                                width: 28,
                                                height: 28,
                                                borderRadius: "50%",
                                                background: "linear-gradient(135deg, #059669, #10b981)",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                flexShrink: 0,
                                            }}
                                        >
                                            <Shield style={{ width: 14, height: 14, color: "white" }} />
                                        </div>
                                        <div
                                            style={{
                                                padding: "10px 14px",
                                                borderRadius: "4px 16px 16px 16px",
                                                background: "rgba(255,255,255,0.06)",
                                                border: "1px solid rgba(255,255,255,0.08)",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 8,
                                            }}
                                        >
                                            <Loader2
                                                style={{
                                                    width: 14,
                                                    height: 14,
                                                    color: "#10b981",
                                                    animation: "spin 1s linear infinite",
                                                }}
                                            />
                                            <span style={{ fontSize: 12, color: "#9ca3af" }}>
                                                Analyzing legal context…
                                            </span>
                                            <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
                                        </div>
                                    </div>
                                )}

                                <div ref={messagesEndRef} />
                            </div>

                            {/* Starter questions (only show if only welcome message exists) */}
                            {messages.length === 1 && (
                                <div
                                    style={{
                                        padding: "0 14px 12px",
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 6,
                                    }}
                                >
                                    <div
                                        style={{
                                            fontSize: 10,
                                            color: "#6b7280",
                                            fontWeight: 600,
                                            textTransform: "uppercase",
                                            letterSpacing: 0.8,
                                            marginBottom: 2,
                                        }}
                                    >
                                        Quick questions
                                    </div>
                                    {STARTER_QUESTIONS.map((q, i) => (
                                        <button
                                            key={i}
                                            onClick={() => sendMessage(q)}
                                            style={{
                                                padding: "7px 12px",
                                                background: "rgba(16,185,129,0.06)",
                                                border: "1px solid rgba(16,185,129,0.2)",
                                                borderRadius: 10,
                                                color: "#6ee7b7",
                                                fontSize: 12,
                                                cursor: "pointer",
                                                textAlign: "left",
                                                transition: "all 0.15s",
                                                lineHeight: 1.4,
                                            }}
                                            onMouseOver={(e) => {
                                                (e.currentTarget.style.background =
                                                    "rgba(16,185,129,0.12)");
                                                (e.currentTarget.style.borderColor =
                                                    "rgba(16,185,129,0.4)");
                                            }}
                                            onMouseOut={(e) => {
                                                (e.currentTarget.style.background =
                                                    "rgba(16,185,129,0.06)");
                                                (e.currentTarget.style.borderColor =
                                                    "rgba(16,185,129,0.2)");
                                            }}
                                        >
                                            {q}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Input area */}
                            <div
                                style={{
                                    padding: "12px 14px",
                                    borderTop: "1px solid rgba(255,255,255,0.07)",
                                    background: "rgba(255,255,255,0.02)",
                                    flexShrink: 0,
                                    display: "flex",
                                    gap: 8,
                                    alignItems: "center",
                                }}
                            >
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Ask about your consumer rights…"
                                    disabled={isLoading}
                                    maxLength={500}
                                    style={{
                                        flex: 1,
                                        padding: "10px 14px",
                                        background: "rgba(255,255,255,0.05)",
                                        border: "1px solid rgba(255,255,255,0.1)",
                                        borderRadius: 12,
                                        color: "white",
                                        fontSize: 13,
                                        outline: "none",
                                        transition: "border-color 0.2s",
                                    }}
                                    onFocus={(e) =>
                                        (e.currentTarget.style.borderColor = "rgba(16,185,129,0.5)")
                                    }
                                    onBlur={(e) =>
                                        (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")
                                    }
                                />
                                <button
                                    onClick={() => sendMessage()}
                                    disabled={isLoading || !input.trim()}
                                    title="Send"
                                    style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 12,
                                        background:
                                            isLoading || !input.trim()
                                                ? "rgba(16,185,129,0.2)"
                                                : "linear-gradient(135deg, #059669, #10b981)",
                                        border: "none",
                                        cursor: isLoading || !input.trim() ? "not-allowed" : "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        flexShrink: 0,
                                        transition: "all 0.2s",
                                        boxShadow:
                                            isLoading || !input.trim()
                                                ? "none"
                                                : "0 4px 12px rgba(16,185,129,0.3)",
                                    }}
                                >
                                    <Send
                                        style={{
                                            width: 16,
                                            height: 16,
                                            color:
                                                isLoading || !input.trim()
                                                    ? "rgba(16,185,129,0.5)"
                                                    : "white",
                                        }}
                                    />
                                </button>
                            </div>

                            {/* Footer disclaimer */}
                            <div
                                style={{
                                    padding: "6px 14px 10px",
                                    textAlign: "center",
                                    fontSize: 10,
                                    color: "#4b5563",
                                }}
                            >
                                For informational purposes only · Not a substitute for legal advice
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Chat icon when window is open */}
            {isOpen && (
                <div
                    style={{
                        position: "fixed",
                        bottom: 24,
                        right: 24,
                        zIndex: 10000,
                    }}
                >
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsOpen(false)}
                        title="Close chat"
                        style={{
                            width: 60,
                            height: 60,
                            borderRadius: "50%",
                            background: "linear-gradient(135deg, #059669, #10b981)",
                            border: "2px solid rgba(16,185,129,0.5)",
                            boxShadow: "0 8px 24px rgba(16,185,129,0.4)",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <MessageCircle style={{ width: 26, height: 26, color: "white" }} />
                    </motion.button>
                </div>
            )}
        </>
    );
}
