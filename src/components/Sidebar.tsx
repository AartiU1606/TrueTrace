"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ShieldAlert, Map, Flag, Users, Menu, X, Scale } from "lucide-react"

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true)
  const [activeNavItem, setActiveNavItem] = useState("Product Verification")

  const navItems = [
    { name: "Product Verification", icon: ShieldAlert, path: "#verification" },
    { name: "Risk Intelligence Map", icon: Map, path: "#map" },
    { name: "Fraud Reports", icon: Flag, path: "#reports" },
    { name: "Verified Sellers", icon: Users, path: "#sellers" },
    { name: "Consumer Law Assistant", icon: Scale, path: "#consumer-law" },
  ]

  return (
    <>
      <button
        className="md:hidden fixed top-24 left-4 z-40 p-2 glass-panel rounded-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="w-5 h-5 text-gray-300" /> : <Menu className="w-5 h-5 text-gray-300" />}
      </button>

      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: isOpen ? 0 : -300 }}
        className="fixed top-20 left-0 h-[calc(100vh-5rem)] w-64 glass-panel border-r border-white/5 z-30 transition-transform duration-300 md:translate-x-0"
      >
        <div className="p-6 h-full flex flex-col">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-6">Navigation Workspace</h3>

          <nav className="flex-1 space-y-2">
            {navItems.map((item) => {
              const isActive = activeNavItem === item.name;
              return (
                <a
                  key={item.name}
                  href={item.path}
                  onClick={() => setActiveNavItem(item.name)}
                  className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${isActive
                      ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                    }`}
                >
                  <item.icon className={`w-5 h-5 transition-colors ${isActive ? "text-emerald-400 text-glow" : "group-hover:text-emerald-400"}`} />
                  <span className="font-medium text-sm">{item.name}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute left-0 w-1 h-8 bg-emerald-500 rounded-r-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                    />
                  )}
                </a>
              )
            })}
          </nav>

          <div className="mt-auto p-4 rounded-xl glass-card text-center border-glow">
            <div className="w-2 h-2 rounded-full bg-emerald-500 mx-auto mb-2 shadow-[0_0_10px_rgba(16,185,129,1)] animate-pulse"></div>
            <p className="text-xs text-gray-400">System Status: <span className="text-emerald-400 font-medium">Online</span></p>
          </div>
        </div>
      </motion.aside>
    </>
  )
}
