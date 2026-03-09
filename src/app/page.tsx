"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Navbar from "@/components/Navbar"
import SpringCard from "@/components/SpringCard"
import LensCard from "@/components/LensCard"
import { ShieldCheck, Search, Database, Users, TrendingUp, AlertOctagon, Activity, FileWarning, BadgeCheck, Network, Cpu } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  return (
    <main className="min-h-screen bg-black text-white selection:bg-emerald-500/30">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background glow & grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-600/20 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight">
                Verify Product <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600 text-glow">Authenticity</span> <br />
                Before You Buy.
              </h1>
              <p className="text-lg text-gray-400 mb-8 max-w-xl leading-relaxed">
                TrueTrace analyzes product listings, seller reputation, pricing patterns, and marketplace risk signals to identify counterfeit or suspicious products using advanced AI.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/dashboard" className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl border-glow transition-all shadow-[0_0_20px_rgba(4,120,87,0.4)] flex items-center gap-2">
                  <Search className="w-5 h-5"/> Verify Product
                </Link>
                <button className="px-8 py-4 glass-panel hover:bg-white/10 text-white font-bold rounded-xl transition-all flex items-center gap-2">
                  <Activity className="w-5 h-5"/> View Demo
                </button>
              </div>
            </motion.div>

            {/* Right Visual (Interactive Dashboard Preview via SpringCard concept) */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative lg:h-[500px] w-full flex items-center justify-center perspective-[1000px]"
            >
              <div className="relative w-full max-w-md">
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="glass-card p-6 rounded-2xl border-white/10 shadow-2xl relative z-20 overflow-hidden hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all duration-300"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-bl-full blur-2xl"></div>
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">AI Analysis</span>
                    <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold font-mono rounded border border-emerald-500/30">Match: 98%</span>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-3 glass-panel rounded-xl">
                      <ShieldCheck className="w-8 h-8 text-emerald-400" />
                      <div>
                        <div className="text-sm font-bold text-white">Authenticity Score</div>
                        <div className="text-xs text-gray-400">High Confidence Rating</div>
                      </div>
                      <div className="ml-auto text-xl font-bold text-emerald-400 font-mono">94/100</div>
                    </div>
                    <div className="flex items-center gap-4 p-3 glass-panel rounded-xl">
                      <TrendingUp className="w-8 h-8 text-yellow-400" />
                      <div>
                        <div className="text-sm font-bold text-white">Price Anomaly</div>
                        <div className="text-xs text-gray-400">Deviation from norm</div>
                      </div>
                      <div className="ml-auto text-lg font-bold text-yellow-500 font-mono">-12%</div>
                    </div>
                  </div>
                </motion.div>

                {/* Floating elements behind */}
                <motion.div 
                  animate={{ y: [0, 15, 0], x: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                  whileHover={{ scale: 1.05 }}
                  className="absolute -top-10 -right-10 p-4 glass-panel rounded-xl border border-emerald-500/30 z-10 hidden sm:block delay-100 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all duration-300 cursor-default"
                >
                  <div className="flex items-center gap-3">
                    <BadgeCheck className="w-6 h-6 text-emerald-400" />
                    <div>
                      <div className="text-xs text-white font-bold">Trusted Seller</div>
                      <div className="text-[10px] text-gray-400">Amazon Marketplace</div>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  animate={{ y: [0, -15, 0], x: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 2 }}
                  whileHover={{ scale: 1.05 }}
                  className="absolute -bottom-10 -left-10 p-4 glass-panel rounded-xl border border-red-500/30 z-30 hidden sm:block hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all duration-300 cursor-default"
                >
                  <div className="flex items-center gap-3">
                    <AlertOctagon className="w-6 h-6 text-red-500" />
                    <div>
                      <div className="text-xs text-white font-bold">Risk Signal</div>
                      <div className="text-[10px] text-red-400">24 Fraud Reports</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 relative border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 font-mono tracking-tighter">THE VERIFICATION <span className="text-emerald-500 text-glow">PROTOCOL</span></h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Our three-step intelligence pipeline secures your digital transactions instantly.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <SpringCard 
              number="01"
              title="Input Data"
              description="Upload images or paste a product link from any major marketplace."
              icon={<Search className="w-8 h-8" />}
            />
            <SpringCard 
              number="02"
              title="AI Risk Analysis"
              description="System evaluates seller credibility, price patterns, and packaging authenticity."
              icon={<Cpu className="w-8 h-8" />}
            />
            <SpringCard 
              number="03"
              title="Authenticity Decision"
              description="Users receive a clear, actionable recommendation: Safe, Wait, or Avoid."
              icon={<ShieldCheck className="w-8 h-8" />}
            />
          </div>
        </div>
      </section>

      {/* Platform Modules Overview */}
      <section className="py-24 relative bg-black/50 border-t border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_left,rgba(4,120,87,0.1)_0%,transparent_100%)] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Core Modules</h2>
              <p className="text-gray-400 max-w-xl">Deep analysis across four dedicated intelligence vectors.</p>
            </div>
            <Link href="/dashboard" className="text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-2 transition-colors mt-4 md:mt-0">
              Access Full Suite <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <LensCard 
              title="Product Verification" 
              description="Deep scanning of product assets" 
              icon={<Search className="w-6 h-6" />} 
            />
            <LensCard 
              title="Risk Intelligence Map" 
              description="Geospatial fraud cluster tracking" 
              icon={<Network className="w-6 h-6" />} 
            />
            <LensCard 
              title="Community Reports" 
              description="Crowdsourced counterfeit database" 
              icon={<AlertOctagon className="w-6 h-6" />} 
            />
            <LensCard 
              title="Verified Sellers" 
              description="Trusted vendor registry network" 
              icon={<BadgeCheck className="w-6 h-6" />} 
            />
          </div>
        </div>
      </section>

      {/* AI Visualization Section */}
      <section className="py-32 relative overflow-hidden">
        {/* Animated Background Beams/Rays mock */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-1/2 left-0 w-full h-[2px] bg-emerald-500 shadow-[0_0_20px_#10B981] -rotate-12 translate-y-[-100px]"></div>
          <div className="absolute top-1/2 left-0 w-full h-[2px] bg-emerald-500 shadow-[0_0_20px_#10B981] rotate-12 translate-y-[100px]"></div>
          <div className="absolute top-1/2 left-1/2 w-[2px] h-full bg-emerald-500 shadow-[0_0_20px_#10B981] -rotate-45 -translate-x-1/2 -translate-y-1/2"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Neural Inspection Engine</h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-16 text-lg">
            Our proprietary models parse visual data point-by-point, comparing millimeter-level variances against authentic schematics.
          </p>
          
          <div className="max-w-4xl mx-auto glass-card rounded-2xl p-2 border-emerald-500/20 glow">
            <div className="w-full aspect-[21/9] bg-black rounded-xl overflow-hidden relative flex items-center justify-center border border-white/5">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-30 mix-blend-luminosity"></div>
              {/* Overlay elements */}
              <div className="absolute inset-0 bg-black/60"></div>
              
              <div className="relative z-10 grid grid-cols-3 gap-8 w-full px-8">
                <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} className="border border-emerald-500/50 p-6 rounded-lg bg-emerald-500/5 flex flex-col items-center">
                  <Scan className="w-8 h-8 text-emerald-400 mb-2"/>
                  <span className="text-white font-mono text-sm">Packaging Analysis</span>
                </motion.div>
                <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }} className="border border-emerald-500/50 p-6 rounded-lg bg-emerald-500/5 flex flex-col items-center">
                  <Database className="w-8 h-8 text-emerald-400 mb-2"/>
                  <span className="text-white font-mono text-sm">Similarity: 98.4%</span>
                </motion.div>
                <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity, delay: 1 }} className="border border-emerald-500/50 p-6 rounded-lg bg-emerald-500/5 flex flex-col items-center relative">
                  <Activity className="w-8 h-8 text-emerald-400 mb-2"/>
                  <span className="text-white font-mono text-sm">Anomaly: NONE</span>
                </motion.div>
              </div>

               {/* Scanning line animation */}
               <motion.div 
                 animate={{ y: ["-100%", "300%"] }} 
                 transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                 className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-transparent to-emerald-500/40 border-b border-emerald-400 shadow-[0_5px_15px_rgba(16,185,129,0.3)]"
               />
            </div>
          </div>
        </div>
      </section>

      {/* Impact Statistics Section */}
      <section className="py-24 relative border-t border-white/5 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card p-10 rounded-2xl text-center border-emerald-500/20"
            >
               <h4 className="text-5xl font-bold font-mono text-white mb-2 text-glow shadow-emerald-500">12,000+</h4>
               <p className="text-emerald-400 font-medium uppercase tracking-wider text-sm">Product Verifications</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="glass-card p-10 rounded-2xl text-center border-red-500/20"
            >
               <h4 className="text-5xl font-bold font-mono text-white mb-2" style={{textShadow: "0 0 10px rgba(239, 68, 68, 0.5)"}}>2,000+</h4>
               <p className="text-red-400 font-medium uppercase tracking-wider text-sm">Suspicious Flags</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="glass-card p-10 rounded-2xl text-center border-emerald-500/20"
            >
               <h4 className="text-5xl font-bold font-mono text-white mb-2 text-glow shadow-emerald-500">150+</h4>
               <p className="text-emerald-400 font-medium uppercase tracking-wider text-sm">Verified Sellers</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 bg-black/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-500" />
            <span className="font-bold text-lg tracking-wider text-white">TRUE<span className="text-emerald-500">TRACE</span></span>
          </div>
          <p className="text-gray-500 text-sm">© 2026 TrueTrace Platform. Verified. Secure. Authentic.</p>
        </div>
      </footer>
    </main>
  )
}

function Scan(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7V5a2 2 0 0 1 2-2h2"></path>
      <path d="M17 3h2a2 2 0 0 1 2 2v2"></path>
      <path d="M21 17v2a2 2 0 0 1-2 2h-2"></path>
      <path d="M7 21H5a2 2 0 0 1-2-2v-2"></path>
    </svg>
  )
}
function ArrowRight(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"></line>
      <polyline points="12 5 19 12 12 19"></polyline>
    </svg>
  )
}
