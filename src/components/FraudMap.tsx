"use client"

import { useState, useRef, useEffect } from "react"
import { motion, useAnimationControls } from "framer-motion"
import { Plus, Minus, Move, Navigation } from "lucide-react"

const nodes = [
  { id: "Delhi", x: 350, y: 250, status: "Fraud", size: 6 },
  { id: "Mumbai", x: 250, y: 480, status: "Verified", size: 6 },
  { id: "Bangalore", x: 330, y: 620, status: "Verified", size: 6 },
  { id: "Chennai", x: 420, y: 600, status: "Verified", size: 8 },
  { id: "Coimbatore", x: 340, y: 670, status: "Verified", size: 6 },
  { id: "Madurai", x: 370, y: 720, status: "Verified", size: 6 },
  { id: "Trichy", x: 390, y: 680, status: "Fraud", size: 6 },
  { id: "Salem", x: 370, y: 640, status: "Fraud", size: 6 }
]

const chennaiDistricts = [
  { id: "Tambaram", x: 415, y: 612, status: "Fraud", size: 3 },
  { id: "Velachery", x: 425, y: 608, status: "Verified", size: 3 },
  { id: "Guindy", x: 422, y: 604, status: "Fraud", size: 3 },
  { id: "T Nagar", x: 418, y: 600, status: "Fraud", size: 3 },
  { id: "Adyar", x: 428, y: 602, status: "Verified", size: 3 }
]

export default function FraudMap() {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(2.5)
  const [isDragging, setIsDragging] = useState(false)
  
  // Controls for drag position
  const controls = useAnimationControls()

  // Initialize focus on Tamil Nadu
  useEffect(() => {
    controls.set({ x: -100, y: -450 })
  }, [controls])

  const handleZoomIn = () => setScale(s => Math.min(s + 1, 8))
  const handleZoomOut = () => setScale(s => Math.max(s - 1, 1))
  const handleReset = () => {
    setScale(2.5)
    controls.start({ x: -100, y: -450, transition: { type: "spring", stiffness: 100 } })
  }

  const isDeepZoom = scale >= 4.5

  // Abstract India polygon path
  const indiaOutline = "M280,100 L320,80 L360,120 L400,100 L450,150 L480,250 L520,350 L500,450 L450,550 L400,700 L350,800 L300,750 L250,650 L200,500 L150,400 L200,300 L250,200 Z"

  return (
    <div className="glass-card rounded-2xl p-1 relative overflow-hidden group">
      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-emerald-500/50 m-4 rounded-tl-lg pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-emerald-500/50 m-4 rounded-tr-lg pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-emerald-500/50 m-4 rounded-bl-lg pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-emerald-500/50 m-4 rounded-br-lg pointer-events-none"></div>
      
      <div className="absolute top-6 left-8 z-20 pointer-events-none">
        <h3 className="text-xl font-bold font-mono text-white flex items-center gap-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_#EF4444]"></div>
          LIVE INTELLIGENCE STREAM
        </h3>
        <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">
          {isDeepZoom ? "Focus Region: Chennai Sector" : "Focus Region: Tamil Nadu Sector"}
        </p>
      </div>

      <div className="absolute bottom-6 left-8 z-20 flex flex-col gap-2 pointer-events-none bg-black/50 p-3 rounded-xl border border-white/5 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
          <span className="text-xs text-gray-300 font-medium tracking-wide">Verified Node</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
          <span className="text-xs text-gray-300 font-medium tracking-wide">Fraud Hotspot</span>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2 bg-black/50 p-2 rounded-xl border border-white/10 backdrop-blur-md">
        <button onClick={handleZoomIn} className="p-2 hover:bg-emerald-500/20 text-gray-300 hover:text-emerald-400 rounded-lg transition-colors" title="Zoom In">
          <Plus className="w-5 h-5" />
        </button>
        <div className="w-full h-px bg-white/10"></div>
        <button onClick={handleReset} className="p-2 hover:bg-emerald-500/20 text-gray-300 hover:text-emerald-400 rounded-lg transition-colors" title="Focus Tamil Nadu / Reset">
          <Navigation className="w-5 h-5" />
        </button>
        <div className="w-full h-px bg-white/10"></div>
        <button onClick={handleZoomOut} className="p-2 hover:bg-emerald-500/20 text-gray-300 hover:text-emerald-400 rounded-lg transition-colors" title="Zoom Out">
          <Minus className="w-5 h-5" />
        </button>
        <div className="flex justify-center mt-2">
           <Move className={`w-4 h-4 ${isDragging ? 'text-emerald-400' : 'text-gray-500'}`} />
        </div>
      </div>

      <div 
        ref={containerRef}
        className="w-full h-[600px] bg-black rounded-xl overflow-hidden relative cursor-grab active:cursor-grabbing border border-white/5"
      >
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        
        <motion.div
          ref={mapRef}
          animate={controls}
          drag
          dragConstraints={containerRef}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => setIsDragging(false)}
          className="w-[800px] h-[1000px] origin-center relative"
          style={{ scale }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
        >
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 1000">
            {/* Outline representing India */}
            <path 
              d={indiaOutline} 
              fill="rgba(16, 185, 129, 0.02)" 
              stroke="rgba(16, 185, 129, 0.2)" 
              strokeWidth="2" 
              strokeDasharray="4 4"
            />
            
            {/* Grid styling inside map */}
            <g opacity="0.1">
              {Array.from({ length: 20 }).map((_, i) => (
                <line key={`v-${i}`} x1={i * 40} y1="0" x2={i * 40} y2="1000" stroke="#10B981" strokeWidth="1" />
              ))}
              {Array.from({ length: 25 }).map((_, i) => (
                <line key={`h-${i}`} x1="0" y1={i * 40} x2="800" y2={i * 40} stroke="#10B981" strokeWidth="1" />
              ))}
            </g>

            {/* Main Nodes */}
            {nodes.map(node => (
              <g key={node.id} style={{ opacity: isDeepZoom && node.id === "Chennai" ? 0.3 : 1 }}>
                <motion.circle 
                  cx={node.x} 
                  cy={node.y} 
                  r={node.size} 
                  fill={node.status === "Verified" ? "#10B981" : "#EF4444"}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, delay: Math.random() }}
                  className="drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                />
                <circle 
                  cx={node.x} 
                  cy={node.y} 
                  r={node.size * 2} 
                  fill="none"
                  stroke={node.status === "Verified" ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"}
                  strokeWidth="1"
                />
                {(!isDeepZoom || node.id !== "Chennai") && (
                  <text x={node.x + 12} y={node.y + 4} fill="rgba(255,255,255,0.7)" fontSize="10" fontFamily="monospace">
                    {node.id}
                  </text>
                )}
              </g>
            ))}

            {/* Deep Zoom Chennai Nodes */}
            {isDeepZoom && chennaiDistricts.map(node => (
              <g key={node.id}>
                {/* Connection to center of Chennai */}
                <line 
                  x1={420} 
                  y1={600} 
                  x2={node.x} 
                  y2={node.y} 
                  stroke="rgba(255,255,255,0.1)" 
                  strokeWidth="0.5" 
                  strokeDasharray="2 2"
                />
                
                <motion.circle 
                  cx={node.x} 
                  cy={node.y} 
                  r={node.size} 
                  fill={node.status === "Verified" ? "#10B981" : "#EF4444"}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]"
                />
                
                <motion.text 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  x={node.x + 6} 
                  y={node.y + 1} 
                  fill="rgba(255,255,255,0.9)" 
                  fontSize="4" 
                  fontFamily="monospace"
                >
                  {node.id}
                </motion.text>
              </g>
            ))}
          </svg>
        </motion.div>
      </div>
    </div>
  )
}
