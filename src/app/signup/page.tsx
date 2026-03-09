"use client"

import { useState, useEffect } from "react"
import Navbar from "@/components/Navbar"
import AuthForm from "@/components/AuthForm"
import { motion } from "framer-motion"

export default function SignupPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <main className="min-h-screen bg-black relative flex flex-col pt-20">
      <Navbar />
      
      {/* Background aesthetics */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(4,120,87,0.15)_0%,transparent_100%)]"></div>
        {/* Animated particles abstraction */}
        {mounted && (
          <div className="absolute w-full h-full">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  opacity: 0, 
                  left: `${Math.random() * 100}%`, 
                  top: `${Math.random() * 100}%` 
                }}
                animate={{ 
                  opacity: [0, 0.5, 0],
                  y: [0, -100]
                }}
                transition={{
                  duration: 5 + Math.random() * 5,
                  repeat: Infinity,
                  delay: Math.random() * 5
                }}
                className="absolute w-1 h-1 bg-emerald-500 rounded-full blur-[1px]"
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 flex items-center justify-center relative z-10 px-4 my-8">
        <AuthForm mode="signup" />
      </div>
    </main>
  )
}
