"use client"

import { motion } from "framer-motion"
import { BadgeCheck, Store, Package } from "lucide-react"

interface SellerCardProps {
  name: string
  marketplace: string
  verifiedProduct: string
  productImage?: string
}

export default function SellerCard({ name, marketplace, verifiedProduct, productImage }: SellerCardProps) {
  return (
    <motion.div 
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="glass-panel border-emerald-500/20 hover:border-emerald-500/50 rounded-2xl p-6 relative overflow-hidden group"
    >
      <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
      
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className="flex gap-4 items-center">
          <div className="w-12 h-12 rounded-xl bg-black/50 border border-emerald-500/20 flex items-center justify-center overflow-hidden">
            {productImage ? (
              <img src={productImage} alt={verifiedProduct} className="w-full h-full object-cover" />
            ) : (
              <Package className="w-6 h-6 text-emerald-400" />
            )}
          </div>
          <div>
            <h3 className="font-bold text-white flex items-center gap-2">
              {name}
            </h3>
            <span className="text-xs text-gray-400 flex items-center gap-1 mt-1">
              <Store className="w-3 h-3" /> {marketplace}
            </span>
          </div>
        </div>
        
        <div className="text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 border bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-glow">
          <BadgeCheck className="w-4 h-4" /> VERIFIED
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-white/5">
        <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider mb-1">Verified Product Benchmark</p>
        <p className="text-sm font-medium text-gray-300">{verifiedProduct}</p>
      </div>
    </motion.div>
  )
}
