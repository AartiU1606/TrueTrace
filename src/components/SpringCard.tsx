"use client"

import { useRef, useState } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"

interface SpringCardProps {
  number: string
  title: string
  description: string
  icon: React.ReactNode
}

export default function SpringCard({ number, title, description, icon }: SpringCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x)
  const mouseYSpring = useSpring(y)

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return

    const rect = ref.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height

    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5

    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="relative h-72 w-full rounded-2xl glass-card border border-white/10 p-8 flex flex-col items-center justify-center text-center cursor-pointer group"
    >
      <div 
        style={{ transform: "translateZ(50px)" }}
        className="absolute top-4 right-6 text-4xl font-bold text-white/5 font-mono pointer-events-none transition-all duration-300 group-hover:text-emerald-500/10"
      >
        {number}
      </div>

      <div 
        style={{ transform: "translateZ(75px)" }}
        className="bg-black/40 w-16 h-16 rounded-2xl flex items-center justify-center border border-white/10 mb-6 text-emerald-400 group-hover:scale-110 transition-transform duration-300"
      >
        {icon}
      </div>

      <div style={{ transform: "translateZ(50px)" }}>
        <h3 className="text-xl font-bold text-white mb-3 tracking-wide">{title}</h3>
        <p className="text-sm text-gray-400 leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  )
}
