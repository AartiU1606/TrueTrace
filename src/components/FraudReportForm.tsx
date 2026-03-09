"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AlertOctagon, Upload, ArrowRight, ShieldAlert, BadgeCheck } from "lucide-react"

const MOCK_REPORTS = [
  { id: 1, product: "AirPods Pro Gen 2", marketplace: "Flipkart", seller: "TechHavenRetail", reports: 12, status: "Investigating" },
  { id: 2, product: "Dyson Airwrap", marketplace: "Insta_Store_Official", seller: "@luxury_hair", reports: 45, status: "Flagged" },
  { id: 3, product: "Nike Air Jordan 1", marketplace: "Myntra", seller: "SneakerHeadz", reports: 3, status: "Verified Auto" },
]

export default function FraudReportForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    }, 1500)
  }

  return (
    <div className="space-y-8">
      {/* Report Form */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-6 lg:p-8"
      >
        <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
          <AlertOctagon className="w-6 h-6 text-red-500 text-glow" />
          <div>
            <h2 className="text-xl font-bold text-white">Community Fraud Report</h2>
            <p className="text-sm text-gray-400">Contribute to the intelligence network to protect others.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase text-gray-400 tracking-wider">Product Link / Name</label>
              <input type="text" required className="w-full bg-black/40 border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-red-500 transition-colors" placeholder="e.g., Fake AirPods Link" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase text-gray-400 tracking-wider">Marketplace</label>
                <input type="text" required className="w-full bg-black/40 border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-red-500 transition-colors" placeholder="e.g., Amazon" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase text-gray-400 tracking-wider">Seller Name</label>
                <input type="text" required className="w-full bg-black/40 border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-red-500 transition-colors" placeholder="Seller ID" />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase text-gray-400 tracking-wider">Evidence (Images/Screenshots)</label>
            <div 
              onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-all cursor-pointer ${
                dragActive ? "border-emerald-500 bg-emerald-500/10 text-glow shadow-[0_0_15px_rgba(16,185,129,0.3)]" : "border-white/20 hover:bg-white/5 hover:border-red-500/50"
              }`}
            >
              <Upload className={`w-6 h-6 mx-auto mb-2 transition-colors ${dragActive ? "text-emerald-400" : "text-gray-500"}`} />
              <span className="text-sm text-gray-400">Drag files here or click to upload</span>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase text-gray-400 tracking-wider">Incident Description</label>
            <textarea required rows={3} className="w-full bg-black/40 border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all resize-none shadow-sm" placeholder="Describe why you believe this is counterfeit..." />
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-red-600/20 hover:bg-red-600/40 text-red-500 border border-red-500/50 hover:border-red-500 font-bold py-3 rounded-lg transition-all duration-300 flex justify-center items-center gap-2"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
            ) : showSuccess ? (
              <>Report Submitted Successfully <BadgeCheck className="w-5 h-5"/></>
            ) : (
              <>Submit Fraud Report <ArrowRight className="w-5 h-5"/></>
            )}
          </button>
        </form>
      </motion.div>

      {/* Reports Table */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-white/10 border-glow">
        <div className="p-6 border-b border-white/10 bg-black/40">
          <h3 className="font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-emerald-400" />
            Live Intelligence Network
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10 text-xs uppercase tracking-wider text-gray-400">
                <th className="p-4 font-semibold">Product</th>
                <th className="p-4 font-semibold">Marketplace</th>
                <th className="p-4 font-semibold">Seller</th>
                <th className="p-4 font-semibold">Reports</th>
                <th className="p-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {MOCK_REPORTS.map((report, idx) => (
                  <motion.tr 
                    key={report.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                  >
                    <td className="p-4 font-medium text-white text-sm">{report.product}</td>
                    <td className="p-4 text-gray-400 text-sm">{report.marketplace}</td>
                    <td className="p-4 text-gray-400 text-sm font-mono">{report.seller}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded bg-black/50 text-xs font-bold ${report.reports > 10 ? 'text-red-400' : 'text-yellow-400'}`}>
                        {report.reports}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded font-bold text-xs border ${
                        report.status === 'Flagged' ? 'bg-red-500/10 text-red-400 border-red-500/30' : 
                        report.status === 'Investigating' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' :
                        'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      }`}>
                        {report.status}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
