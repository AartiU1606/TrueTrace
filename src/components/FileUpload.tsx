"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Upload, Link2, Search, Store } from "lucide-react"

export default function FileUpload({ onAnalyze }: { onAnalyze: () => void }) {
  const [dragActive, setDragActive] = useState(false)
  const [uploadType, setUploadType] = useState<"file" | "link">("file")
  const [marketSearch, setMarketSearch] = useState("")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  
  const marketplaces = ["Amazon", "Flipkart", "Myntra", "Nykaa", "TataCLiQ", "Other"]
  
  const filteredMarkets = marketplaces.filter(m => m.toLowerCase().includes(marketSearch.toLowerCase()))

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
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      // Simulate file load
      setTimeout(() => onAnalyze(), 1000)
    }
  }

  return (
    <div className="w-full glass-card rounded-2xl p-6 lg:p-8">
      <div className="flex gap-4 mb-6 border-b border-white/10 pb-4">
        <button 
          onClick={() => setUploadType("file")}
          className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg transition-all ${uploadType === "file" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "text-gray-400 hover:bg-white/5"}`}
        >
          <Upload className="w-4 h-4" /> Images
        </button>
        <button 
          onClick={() => setUploadType("link")}
          className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg transition-all ${uploadType === "link" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "text-gray-400 hover:bg-white/5"}`}
        >
          <Link2 className="w-4 h-4" /> Product Link
        </button>
      </div>

      {uploadType === "file" ? (
        <motion.div 
          whileHover={{ scale: 1.01 }}
          className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 flex flex-col items-center justify-center cursor-pointer hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] ${
            dragActive ? "border-emerald-500 bg-emerald-500/10 text-glow scale-105" : "border-white/20 bg-black/20 hover:border-emerald-500/50 hover:bg-white/5"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={() => onAnalyze()} />
          <Upload className={`w-12 h-12 mb-4 transition-colors ${dragActive ? "text-emerald-400" : "text-gray-500"}`} />
          <p className="text-lg font-semibold text-white mb-2">Drag & Drop Product Images</p>
          <p className="text-sm text-gray-400">or click to browse from your device</p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Paste Amazon, Flipkart, or any marketplace URL..."
              className="w-full bg-white/5 border border-white/20 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-mono text-sm"
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="relative">
          <Store className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
          <input 
            type="text"
            placeholder="Search Marketplace..."
            value={marketSearch}
            onChange={(e) => {
              setMarketSearch(e.target.value)
              setIsDropdownOpen(true)
            }}
            onFocus={() => setIsDropdownOpen(true)}
            onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
            className="w-full bg-black/40 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all cursor-text relative z-10"
          />
          {isDropdownOpen && (
            <div className="absolute top-12 left-0 w-full bg-[#111] border border-white/10 rounded-lg shadow-xl z-50 max-h-48 overflow-y-auto">
              {filteredMarkets.length > 0 ? filteredMarkets.map(m => (
                <div 
                  key={m} 
                  onClick={() => {
                    setMarketSearch(m)
                    setIsDropdownOpen(false)
                  }}
                  className="px-4 py-2 text-sm text-gray-300 hover:bg-emerald-500/20 hover:text-white cursor-pointer transition-colors"
                >
                  {m}
                </div>
              )) : (
                <div className="px-4 py-2 text-sm text-gray-500">No results found.</div>
              )}
            </div>
          )}
        </div>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-gray-400">@</span>
          <input 
            type="text" 
            placeholder="Seller Name"
            className="w-full bg-black/40 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
          />
        </div>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-gray-400">₹</span>
          <input 
            type="number" 
            placeholder="Product Price"
            className="w-full bg-black/40 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
          />
        </div>
      </div>

      <button 
        onClick={onAnalyze}
        className="w-full mt-6 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl border-glow transition-all duration-300 shadow-lg shadow-emerald-900/50 flex items-center justify-center gap-3 relative overflow-hidden group"
      >
        <span className="relative z-10 flex items-center gap-2">Initiate AI Analysis <Search className="w-5 h-5"/></span>
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[length:200%_auto] animate-gradient"></div>
      </button>
    </div>
  )
}
