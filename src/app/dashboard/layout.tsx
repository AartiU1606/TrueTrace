import Sidebar from "@/components/Sidebar"
import { Bell, Search, UserCircle2 } from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30">
      {/* Top Background Aesthetic */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-900/10 blur-[150px] rounded-full"></div>
      </div>

      {/* Top Navigation */}
      <nav className="fixed top-0 w-full h-20 glass-panel border-b border-white/5 z-40 flex items-center justify-between px-6 lg:px-10">
        <div className="flex items-center gap-6 w-full max-w-2xl">
          <div className="flex items-center gap-2 lg:mr-8 hidden sm:flex">
            <span className="font-bold text-xl tracking-wider text-white">TRUE<span className="text-emerald-500 text-glow">TRACE</span></span>
            <span className="px-2 py-0.5 ml-2 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold font-mono rounded border border-emerald-500/30 flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
              SECURE
            </span>
          </div>
          
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search products, sellers, or marketplaces..."
              className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-mono"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_#EF4444]"></span>
          </button>
          <button className="flex items-center gap-2 p-1.5 pr-3 glass-panel rounded-full hover:bg-white/10 transition-colors">
            <UserCircle2 className="w-7 h-7 text-emerald-500" />
            <span className="text-sm font-medium hidden md:block">Operative</span>
          </button>
        </div>
      </nav>

      <Sidebar />

      {/* Main Workspace Workspace */}
      <main className="pt-24 pb-12 px-4 md:pl-72 md:pr-8 xl:pr-12 relative z-10 transition-all duration-300 w-full">
        {children}
      </main>
    </div>
  )
}
