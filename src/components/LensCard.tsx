"use client"

import { useState } from "react"
import { motion } from "framer-motion"

interface LensCardProps {
  title: string
  description: string
  icon: React.ReactNode
  imageSrc?: string
}

export default function LensCard({ title, description, icon, imageSrc }: LensCardProps) {
  const [hovered, setHovered] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  return (
    <div 
      className="relative overflow-hidden rounded-2xl glass-card border border-white/10 group h-64 cursor-crosshair"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
    >
      {/* Background visual (abstract tech pattern or image) */}
      <div className="absolute inset-0 bg-gradient-to-br from-black to-emerald-950/20 z-0">
        {imageSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageSrc} alt="" className="w-full h-full object-cover opacity-30 select-none pointer-events-none" />
        ) : (
          <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.1)_1px,transparent_1px)] bg-[size:10px_10px] opacity-20"></div>
        )}
      </div>

      {/* Lens effect using radial gradient mapped to cursor position */}
      {hovered && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300"
          animate={{
            background: `radial-gradient(150px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(16,185,129,0.15), transparent 40%)`
          }}
        />
      )}

      {/* Content */}
      <div className="absolute inset-0 z-20 p-6 flex flex-col justify-end">
        <div className="transform transition-transform duration-300 group-hover:-translate-y-2">
          <div className="bg-black/50 w-12 h-12 rounded-xl flex items-center justify-center border border-white/10 mb-4 text-emerald-400 group-hover:bg-emerald-500/20 group-hover:border-emerald-500/50 transition-colors">
            {icon}
          </div>
          <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
          <p className="text-sm text-gray-400 max-w-[90%] opacity-0 group-hover:opacity-100 transition-opacity duration-300 -translate-y-2 group-hover:translate-y-0 text-shadow">
            {description}
          </p>
        </div>
      </div>

      {/* Persistent subtle glow line base */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/10 to-transparent z-20 group-hover:via-emerald-500 transition-all duration-500"></div>
    </div>
  )
}
