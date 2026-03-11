"use client"

import { motion } from "framer-motion"
import { ShieldCheck, ShieldAlert, ShieldX, TrendingUp, AlertCircle, CheckCircle2, Info } from "lucide-react"
import type { PredictiveResult } from "./PredictiveUpload"

interface PredictiveAnalysisCardProps {
  result: PredictiveResult
}

const riskConfig = {
  Authentic: {
    gradient: "from-emerald-500/20 to-emerald-900/10",
    border: "border-emerald-500/30",
    glow: "shadow-[0_0_40px_rgba(16,185,129,0.15)]",
    textColor: "text-emerald-400",
    bgBadge: "bg-emerald-500/20 border-emerald-500/40",
    icon: ShieldCheck,
    barColor: "bg-emerald-500",
    barGlow: "shadow-[0_0_10px_rgba(16,185,129,0.6)]",
    ringColor: "#10b981",
    ringGlow: "rgba(16,185,129,0.4)",
  },
  Suspicious: {
    gradient: "from-yellow-500/15 to-yellow-900/10",
    border: "border-yellow-500/30",
    glow: "shadow-[0_0_40px_rgba(234,179,8,0.1)]",
    textColor: "text-yellow-400",
    bgBadge: "bg-yellow-500/20 border-yellow-500/40",
    icon: ShieldAlert,
    barColor: "bg-yellow-500",
    barGlow: "shadow-[0_0_10px_rgba(234,179,8,0.6)]",
    ringColor: "#eab308",
    ringGlow: "rgba(234,179,8,0.4)",
  },
  "Likely Fake": {
    gradient: "from-red-500/15 to-red-900/10",
    border: "border-red-500/30",
    glow: "shadow-[0_0_40px_rgba(239,68,68,0.1)]",
    textColor: "text-red-400",
    bgBadge: "bg-red-500/20 border-red-500/40",
    icon: ShieldX,
    barColor: "bg-red-500",
    barGlow: "shadow-[0_0_10px_rgba(239,68,68,0.6)]",
    ringColor: "#ef4444",
    ringGlow: "rgba(239,68,68,0.4)",
  },
}

export default function PredictiveAnalysisCard({ result }: PredictiveAnalysisCardProps) {
  const cfg = riskConfig[result.risk_label as keyof typeof riskConfig] ?? riskConfig["Suspicious"]
  const Icon = cfg.icon
  const circumference = 2 * Math.PI * 52
  const dashOffset = circumference - (result.authenticity_score / 100) * circumference

  const metaSignals = result.meta_signals

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`h-full glass-card rounded-2xl p-6 lg:p-8 border bg-gradient-to-br ${cfg.gradient} ${cfg.border} ${cfg.glow} flex flex-col gap-6`}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-widest font-mono mb-1">AI Prediction Result</p>
          <h3 className={`text-xl font-bold font-mono ${cfg.textColor}`}>
            {result.risk_label}
          </h3>
        </div>
        <div className={`p-3 rounded-xl border ${cfg.bgBadge}`}>
          <Icon className={`w-6 h-6 ${cfg.textColor}`} />
        </div>
      </div>

      {/* Score Ring + Confidence */}
      <div className="flex items-center gap-6">
        {/* SVG Ring */}
        <div className="relative w-32 h-32 flex-shrink-0">
          <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
            <motion.circle
              cx="60" cy="60" r="52" fill="none"
              stroke={cfg.ringColor}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: dashOffset }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
              style={{ filter: `drop-shadow(0 0 6px ${cfg.ringGlow})` }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              className={`text-3xl font-bold font-mono ${cfg.textColor}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              {result.authenticity_score}%
            </motion.span>
            <span className="text-xs text-gray-500 font-mono">Auth Score</span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex-1 space-y-4">
          {/* Confidence bar */}
          <div>
            <div className="flex justify-between text-xs text-gray-400 mb-1.5">
              <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3" /> Confidence</span>
              <span className={`font-mono font-bold ${cfg.textColor}`}>{result.confidence}%</span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-2">
              <motion.div
                className={`h-2 rounded-full ${cfg.barColor} ${cfg.barGlow}`}
                initial={{ width: 0 }}
                animate={{ width: `${result.confidence}%` }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
              />
            </div>
          </div>

          {/* Authenticity score bar */}
          <div>
            <div className="flex justify-between text-xs text-gray-400 mb-1.5">
              <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Authenticity</span>
              <span className={`font-mono font-bold ${cfg.textColor}`}>{result.authenticity_score}%</span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-2">
              <motion.div
                className={`h-2 rounded-full ${cfg.barColor} ${cfg.barGlow}`}
                initial={{ width: 0 }}
                animate={{ width: `${result.authenticity_score}%` }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Meta signals */}
      {metaSignals && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Price Signal", value: metaSignals.price_flag },
            { label: "Seller Trust", value: metaSignals.seller_flag },
            { label: "Platform", value: metaSignals.market_flag },
          ].map((item) => {
            const isGood = ["Market Rate", "Trusted Platform", "Verified Platform"].includes(item.value)
            const isBad = ["Severe Underpricing", "Suspicious Keywords", "Unknown Platform"].includes(item.value)
            return (
              <div key={item.label} className={`rounded-xl p-3 text-center border ${isGood ? "bg-emerald-500/5 border-emerald-500/20" : isBad ? "bg-red-500/5 border-red-500/20" : "bg-white/5 border-white/5"}`}>
                <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                <p className={`text-xs font-semibold font-mono ${isGood ? "text-emerald-400" : isBad ? "text-red-400" : "text-yellow-400"}`}>{item.value}</p>
              </div>
            )
          })}
        </div>
      )}

      {/* Explanation */}
      <div className="rounded-xl bg-white/3 border border-white/5 p-4 flex gap-3">
        <Info className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-gray-300 leading-relaxed">{result.explanation}</p>
      </div>

      {/* Risk label footer */}
      <div className={`flex items-center gap-2 rounded-xl px-4 py-3 border ${cfg.bgBadge}`}>
        {result.risk_label === "Authentic" ? (
          <CheckCircle2 className={`w-4 h-4 ${cfg.textColor}`} />
        ) : (
          <AlertCircle className={`w-4 h-4 ${cfg.textColor}`} />
        )}
        <span className={`text-sm font-mono font-semibold ${cfg.textColor}`}>
          {result.risk_label === "Authentic"
            ? "Safe to purchase — product appears genuine"
            : result.risk_label === "Suspicious"
            ? "Proceed with caution — verify before buying"
            : "High risk — do not purchase this listing"}
        </span>
      </div>
    </motion.div>
  )
}
