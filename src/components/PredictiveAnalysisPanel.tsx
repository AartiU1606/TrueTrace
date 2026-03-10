"use client"

import { motion, Variants } from "framer-motion"
import { Brain, ShieldCheck, ShieldAlert, AlertTriangle, Eye, Sparkles } from "lucide-react"

export interface PredictiveResult {
    authenticity_score: number
    risk_level: "Low" | "Medium" | "High"
    confidence: string
    analysis_summary: string
    visual_anomalies: string[]
    clip_scores?: Record<string, number>
}

interface PredictiveAnalysisPanelProps {
    result: PredictiveResult
}

export default function PredictiveAnalysisPanel({ result }: PredictiveAnalysisPanelProps) {
    const { authenticity_score, risk_level, confidence, analysis_summary, visual_anomalies, clip_scores } = result

    const getRiskGradient = () => {
        if (risk_level === "Low") return "from-emerald-500/20 to-emerald-600/5"
        if (risk_level === "Medium") return "from-yellow-500/20 to-yellow-600/5"
        return "from-red-500/20 to-red-600/5"
    }

    const getRiskBorder = () => {
        if (risk_level === "Low") return "border-emerald-500/40"
        if (risk_level === "Medium") return "border-yellow-500/40"
        return "border-red-500/40"
    }

    const getRiskColor = () => {
        if (risk_level === "Low") return "text-emerald-400"
        if (risk_level === "Medium") return "text-yellow-400"
        return "text-red-400"
    }

    const getScoreColor = () => {
        if (authenticity_score > 70) return "text-emerald-400"
        if (authenticity_score > 40) return "text-yellow-400"
        return "text-red-400"
    }

    const getBarColor = () => {
        if (authenticity_score > 70) return "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
        if (authenticity_score > 40) return "bg-yellow-500"
        return "bg-red-500"
    }

    const getRiskIcon = () => {
        if (risk_level === "Low") return <ShieldCheck className="w-5 h-5 text-emerald-400" />
        if (risk_level === "Medium") return <AlertTriangle className="w-5 h-5 text-yellow-400" />
        return <ShieldAlert className="w-5 h-5 text-red-400" />
    }

    const container: Variants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.12 } }
    }

    const item: Variants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
    }

    // Top CLIP scores to display (excluding very low ones)
    const topClipScores = clip_scores
        ? Object.entries(clip_scores)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 4)
        : []

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-4"
        >
            {/* Header Badge */}
            <motion.div variants={item} className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/30">
                    <Brain className="w-4 h-4 text-violet-400" />
                    <span className="text-xs font-bold text-violet-400 uppercase tracking-wider">CLIP Predictive Analysis</span>
                </div>
                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/5 border border-white/10">
                    <Sparkles className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-400 font-mono">openai/clip-vit-base-patch32</span>
                </div>
            </motion.div>

            {/* Main Score Card */}
            <motion.div
                variants={item}
                className={`rounded-2xl p-6 border bg-gradient-to-br ${getRiskGradient()} ${getRiskBorder()} relative overflow-hidden`}
            >
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/3 rounded-bl-full blur-3xl pointer-events-none" />

                <div className="flex items-start justify-between mb-5">
                    <div>
                        <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Authenticity Score</p>
                        <div className="flex items-baseline gap-2">
                            <span className={`text-6xl font-black tracking-tighter font-mono ${getScoreColor()}`}>
                                {authenticity_score}
                            </span>
                            <span className="text-gray-400 text-lg font-bold">/100</span>
                        </div>
                    </div>
                    <div className="text-right space-y-2">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-sm font-bold ${risk_level === "Low"
                                ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400"
                                : risk_level === "Medium"
                                    ? "bg-yellow-500/10 border-yellow-500/50 text-yellow-400"
                                    : "bg-red-500/10 border-red-500/50 text-red-400"
                            }`}>
                            {getRiskIcon()}
                            {risk_level} Risk
                        </div>
                        <div className="block text-right">
                            <span className="text-xs text-gray-500">Confidence: </span>
                            <span className="text-xs font-bold text-white font-mono">{confidence}</span>
                        </div>
                    </div>
                </div>

                {/* Score Bar */}
                <div className="w-full bg-black/30 rounded-full h-2.5 mb-5">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${authenticity_score}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className={`h-2.5 rounded-full ${getBarColor()}`}
                    />
                </div>

                {/* Analysis Summary */}
                <div className="bg-black/20 rounded-xl p-4 border border-white/5">
                    <p className="text-sm text-gray-300 leading-relaxed">{analysis_summary}</p>
                </div>
            </motion.div>

            {/* Visual Anomalies */}
            {visual_anomalies.length > 0 && (
                <motion.div variants={item} className="rounded-2xl p-5 bg-red-500/5 border border-red-500/30">
                    <div className="flex items-center gap-2 mb-3">
                        <Eye className="w-4 h-4 text-red-400" />
                        <h4 className="text-sm font-bold text-red-400 uppercase tracking-wider">Visual Anomalies Detected</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {visual_anomalies.map((anomaly) => (
                            <span
                                key={anomaly}
                                className="px-3 py-1 bg-red-500/10 border border-red-500/30 rounded-full text-xs text-red-300 font-medium"
                            >
                                ⚠ {anomaly}
                            </span>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* CLIP Score Breakdown */}
            {topClipScores.length > 0 && (
                <motion.div variants={item} className="rounded-2xl p-5 glass-panel border border-white/10">
                    <div className="flex items-center gap-2 mb-4">
                        <Brain className="w-4 h-4 text-violet-400" />
                        <h4 className="text-sm font-bold text-gray-300 uppercase tracking-wider">CLIP Vision Scores</h4>
                    </div>
                    <div className="space-y-3">
                        {topClipScores.map(([label, score]) => {
                            const isAuthentic = label.includes("authentic") || label.includes("genuine")
                            const barColor = isAuthentic ? "bg-emerald-500" : "bg-red-500/70"
                            const textColor = isAuthentic ? "text-emerald-400" : "text-red-400"
                            return (
                                <div key={label}>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-xs text-gray-400 capitalize">{label}</span>
                                        <span className={`text-xs font-bold font-mono ${textColor}`}>{score}%</span>
                                    </div>
                                    <div className="w-full bg-white/5 rounded-full h-1.5">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${Math.min(score, 100)}%` }}
                                            transition={{ duration: 1, ease: "easeOut" }}
                                            className={`h-1.5 rounded-full ${barColor}`}
                                        />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </motion.div>
            )}

            {/* No anomaly green state */}
            {visual_anomalies.length === 0 && risk_level === "Low" && (
                <motion.div variants={item} className="rounded-2xl p-4 bg-emerald-500/5 border border-emerald-500/20 flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                    <p className="text-sm text-emerald-300">No visual anomalies detected. Packaging signals are consistent with authentic products.</p>
                </motion.div>
            )}
        </motion.div>
    )
}
