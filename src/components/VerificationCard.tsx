"use client"

import { motion, Variants } from "framer-motion"
import { ShieldAlert, TrendingDown, Info, PackageOpen, Award } from "lucide-react"

interface VerificationCardProps {
  score: number;
  risk: "Low" | "Medium" | "High";
  status: string;
  sellerScore: number;
}

export default function VerificationCard({ score, risk, status, sellerScore }: VerificationCardProps) {
  
  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "Low": return "text-emerald-400 bg-emerald-500/10 border-emerald-500/50"
      case "Medium": return "text-yellow-400 bg-yellow-500/10 border-yellow-500/50"
      case "High": return "text-red-400 bg-red-500/10 border-red-500/50"
      default: return "text-gray-400 bg-gray-500/10 border-gray-500/50"
    }
  }

  const getStatusColor = (statusRisk: string) => {
    switch (statusRisk) {
      case "Safe": return "text-emerald-400"
      case "Suspicious": return "text-yellow-400"
      case "Avoid Purchase": return "text-red-500"
      default: return "text-gray-400"
    }
  }

  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  }

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-4 h-full"
    >
      {/* Top Main Score */}
      <motion.div variants={item} className="glass-card rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-bl-full blur-2xl"></div>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-gray-400 font-medium text-sm">Authenticity Score</h3>
            <div className="flex items-baseline gap-2 mt-2">
              <span className={`text-5xl font-bold tracking-tighter ${score > 80 ? 'text-emerald-400' : score > 50 ? 'text-yellow-400' : 'text-red-500'}`}>
                {score}%
              </span>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-bold border ${getRiskColor(risk)}`}>
            Risk: {risk}
          </div>
        </div>
        
        <div className="w-full bg-white/10 rounded-full h-2 mb-4">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className={`h-2 rounded-full ${score > 80 ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : score > 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
          />
        </div>

        <p className="text-sm font-medium">Status: <span className={`${getStatusColor(status)} font-bold`}>{status}</span></p>
      </motion.div>

      {/* Grid for minor stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div variants={item} className="glass-panel rounded-2xl p-4 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-2 text-gray-400">
            <Award className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Seller Trust</span>
          </div>
          <span className="text-2xl font-bold text-white">{sellerScore}%</span>
        </motion.div>

        <motion.div variants={item} className="glass-panel rounded-2xl p-4 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-2 text-gray-400">
            <TrendingDown className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Price Anomaly</span>
          </div>
          <span className="text-2xl font-bold text-yellow-400">Detected -25%</span>
        </motion.div>

        <motion.div variants={item} className="glass-panel rounded-2xl p-4 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-2 text-gray-400">
            <ShieldAlert className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Market Risk</span>
          </div>
          <span className="text-2xl font-bold text-emerald-400">Low</span>
        </motion.div>
      </div>

      {/* AI Packaging Match */}
      <motion.div variants={item} className="glass-panel rounded-2xl p-5 border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <PackageOpen className="w-5 h-5 text-emerald-400" />
            <h4 className="font-medium text-white">AI Packaging Similarity</h4>
          </div>
          <span className="text-emerald-400 font-bold">89% Match</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-black/50 rounded-lg aspect-square border border-white/5 relative overflow-hidden group">
            <div className="absolute top-2 left-2 bg-black/70 text-xs px-2 py-1 flex rounded-md z-10 text-gray-300">Listing Image</div>
             {/* Mock crosshair overlay */}
             <div className="absolute inset-0 border border-emerald-500/30 m-4 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 border border-emerald-500/50 rounded-full"></div>
             </div>
          </div>
          <div className="bg-black/50 rounded-lg aspect-square border border-white/5 relative overflow-hidden group">
            <div className="absolute top-2 left-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 text-xs px-2 py-1 rounded-md z-10 font-medium">Verified Database</div>
             {/* Mock network pattern */}
             <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.1)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
          </div>
        </div>
      </motion.div>

      {/* Final Recommendation */}
      <motion.div variants={item} className={`rounded-2xl p-5 border ${risk === 'High' ? 'bg-red-500/10 border-red-500/50' : 'glass-card border-glow'} flex items-start gap-4`}>
        <div className={`p-3 rounded-xl ${risk === 'High' ? 'bg-red-500/20 text-red-500' : 'bg-emerald-500/20 text-emerald-400'}`}>
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div>
          <h4 className="font-bold text-white text-lg mb-1">Final Recommendation</h4>
          <p className="text-sm text-gray-300">
            {risk === 'High' 
              ? "Multiple risk signals detected. Price is anomalously low for this category, and seller has a high dispute rate. Do not proceed."
              : "Product signals match verified authentic databases. Seller reputation is strong. Safe to proceed with purchase."}
          </p>
        </div>
      </motion.div>

    </motion.div>
  )
}
