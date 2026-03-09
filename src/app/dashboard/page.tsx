"use client"

import { useState } from "react"
import FileUpload from "@/components/FileUpload"
import VerificationCard from "@/components/VerificationCard"
import FraudMap from "@/components/FraudMap"
import FraudReportForm from "@/components/FraudReportForm"
import SellerCard from "@/components/SellerCard"
import { Package, Flag, Users, Activity } from "lucide-react"

export default function DashboardPage() {
  const [analyzing, setAnalyzing] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [activeCategory, setActiveCategory] = useState("All")

  const handleAnalyze = () => {
    setAnalyzing(true)
    // Simulate AI analysis delay
    setTimeout(() => {
      setAnalyzing(false)
      setShowResults(true)
    }, 2000)
  }

  return (
    <div className="space-y-24 max-w-7xl mx-auto">
      
      {/* Home / Overview Section */}
      <section id="home" className="pt-4 scroll-mt-28">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-mono text-white">Welcome back, Operative</h1>
          <p className="text-gray-400 mt-2">Here is the current status of the intelligence network.</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <div className="glass-card p-6 rounded-2xl border-white/5 relative overflow-hidden group hover:border-emerald-500/50 transition-all duration-300 hover:-translate-y-1">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-emerald-500/10 rounded-xl rounded-tr-none">
                <Package className="w-6 h-6 text-emerald-400" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1 font-mono">1,204</h3>
            <p className="text-sm text-gray-400">Products Verified</p>
          </div>
          
          <div className="glass-card p-6 rounded-2xl border-white/5 relative overflow-hidden group hover:border-yellow-500/50 transition-all duration-300 hover:-translate-y-1">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-yellow-500/10 rounded-xl rounded-tr-none">
                <Flag className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1 font-mono">84</h3>
            <p className="text-sm text-gray-400">Fraud Reports</p>
          </div>
          
          <div className="glass-card p-6 rounded-2xl border-white/5 relative overflow-hidden group hover:border-emerald-500/50 transition-all duration-300 hover:-translate-y-1">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-emerald-500/10 rounded-xl rounded-tr-none">
                <Users className="w-6 h-6 text-emerald-400" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1 font-mono">3,240</h3>
            <p className="text-sm text-gray-400">Verified Sellers</p>
          </div>
          
          <div className="glass-card p-6 rounded-2xl border-white/5 relative overflow-hidden group hover:border-emerald-500/50 transition-all duration-300 hover:-translate-y-1">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-emerald-500/10 rounded-xl rounded-tr-none">
                <Activity className="w-6 h-6 text-emerald-400 animate-pulse" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-emerald-400 mb-1 font-mono text-glow">Online</h3>
            <p className="text-sm text-gray-400">System Status</p>
          </div>
        </div>
      </section>

      {/* Section 1 - Product Verification */}
      <section id="verification" className="pt-4 scroll-mt-28">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-mono text-white flex items-center gap-3">
            Product Verification
            <span className="bg-emerald-500/10 text-emerald-400 text-xs px-2 py-1 rounded border border-emerald-500/30 uppercase">Primary Scan</span>
          </h1>
          <p className="text-gray-400 mt-2">Upload product evidence or supply a marketplace listing for security clearance.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="h-full">
            <FileUpload onAnalyze={handleAnalyze} />
          </div>

          <div className="h-full relative min-h-[400px]">
            {analyzing ? (
              <div className="absolute inset-0 glass-card rounded-2xl flex flex-col items-center justify-center border-emerald-500/20 glow">
                <div className="relative w-24 h-24 mb-6">
                  <div className="absolute inset-0 border-4 border-emerald-500/20 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center text-emerald-400 font-mono text-sm">
                    AI
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Analyzing Product Signature...</h3>
                <p className="text-sm text-gray-400 text-center max-w-xs">Cross-referencing global database and marketplace seller history.</p>
              </div>
            ) : showResults ? (
              <VerificationCard 
                score={72} 
                risk="Medium" 
                status="Suspicious" 
                sellerScore={65} 
              />
            ) : (
              <div className="absolute inset-0 glass-card rounded-2xl flex flex-col items-center justify-center opacity-50 border-white/5">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                  <span className="text-gray-500">?</span>
                </div>
                <p className="text-gray-400 px-8 text-center">Awaiting data input to generate intelligence report.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Section 2 - Risk Intelligence Map */}
      <section id="map" className="scroll-mt-28 pt-8 border-t border-white/10">
        <div className="mb-8">
          <h2 className="text-3xl font-bold font-mono text-white">Risk Intelligence Map</h2>
          <p className="text-gray-400 mt-2">Real-time geographical tracking of counterfeit product movements and high-risk dispatch zones.</p>
        </div>
        <FraudMap />
      </section>

      {/* Section 3 - Community Fraud Reporting */}
      <section id="reports" className="scroll-mt-28 pt-8 border-t border-white/10">
        <div className="mb-8">
          <h2 className="text-3xl font-bold font-mono text-white">Community Fraud Reports</h2>
          <p className="text-gray-400 mt-2">Contribute and review intelligence from the active operative network.</p>
        </div>
        <FraudReportForm />
      </section>

      {/* Section 4 - Verified Seller Marketplace */}
      <section id="sellers" className="scroll-mt-28 pt-8 border-t border-white/10">
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold font-mono text-white">Verified Seller Directory</h2>
            <p className="text-gray-400 mt-2">Marketplace entities that have passed our rigorous security clearance.</p>
          </div>
        </div>

        <div className="flex gap-4 mb-8 overflow-x-auto pb-4 hide-scrollbar">
          {["All", "Electronics", "Cosmetics", "Fashion", "Appliances"].map((cat) => (
             <button 
               key={cat} 
               onClick={() => setActiveCategory(cat)}
               className={`whitespace-nowrap px-4 py-2 rounded-lg font-medium text-sm transition-colors ${activeCategory === cat ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 text-glow' : 'glass-panel text-gray-400 hover:text-white'}`}
             >
               {cat}
             </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(activeCategory === "All" || activeCategory === "Electronics") && (
            <SellerCard name="PrimeElectronics" marketplace="Amazon" verifiedProduct="Samsung Galaxy S24 Ultra" />
          )}
          {(activeCategory === "All" || activeCategory === "Cosmetics") && (
            <SellerCard name="BeautyAuthentics" marketplace="Nykaa" verifiedProduct="Dyson Airwrap Multi-styler" />
          )}
          {(activeCategory === "All" || activeCategory === "Electronics") && (
             <SellerCard name="TechHub_Official" marketplace="Flipkart" verifiedProduct="Sony WH-1000XM5 Headphones" />
          )}
          {(activeCategory === "All" || activeCategory === "Fashion") && (
             <SellerCard name="SneakerSource" marketplace="Myntra" verifiedProduct="Nike Air Jordan 1 Retro High" />
          )}
          {(activeCategory === "All" || activeCategory === "Electronics") && (
             <SellerCard name="DiscountDeals_IN" marketplace="Amazon" verifiedProduct="Apple AirPods Pro (2nd Gen)" />
          )}
          {(activeCategory === "All" || activeCategory === "Fashion") && (
             <SellerCard name="LuxuryWatches_Req" marketplace="TataCLiQ" verifiedProduct="Rolex Submariner Date" />
          )}
        </div>
      </section>

    </div>
  )
}
