"use client"

import Link from "next/link"
import Image from "next/image"
import { ShieldCheck, LogIn, Search } from "lucide-react"

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 glass-panel border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Left: Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 flex items-center justify-center">
                <ShieldCheck className="w-8 h-8 text-emerald-500 group-hover:text-accent transition-colors duration-300 relative z-10" />
                <div className="absolute inset-0 bg-emerald-500 blur-lg opacity-50 group-hover:opacity-80 transition-opacity duration-300"></div>
              </div>
              <span className="font-bold text-xl tracking-wider text-white">TRUE<span className="text-emerald-500 text-glow ml-1">TRACE</span></span>
            </Link>
          </div>

          {/* Center: Navigation (Visual Only) */}
          <div className="hidden md:flex items-center space-x-8">
            <span className="text-sm cursor-default font-medium text-gray-300 hover:text-emerald-400 transition-colors">Features</span>
            <span className="text-sm cursor-default font-medium text-gray-300 hover:text-emerald-400 transition-colors">How It Works</span>
            <span className="text-sm cursor-default font-medium text-gray-300 hover:text-emerald-400 transition-colors">Fraud Intelligence</span>
            <span className="text-sm cursor-default font-medium text-gray-300 hover:text-emerald-400 transition-colors">Verified Sellers</span>
          </div>

          {/* Right: Buttons */}
          <div className="flex items-center space-x-4">
            <Link 
              href="/login" 
              className="px-6 py-2.5 text-sm font-medium bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg border-glow transition-all duration-300 flex items-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              Login
            </Link>
          </div>

        </div>
      </div>
    </nav>
  )
}
