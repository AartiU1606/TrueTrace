"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ShieldCheck, Mail, Lock } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabaseClient"

interface AuthFormProps {
  mode: "login" | "signup"
}

export default function AuthForm({ mode }: AuthFormProps) {
  const isLogin = mode === "login"
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSignInWithPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) { setError(error.message); return }
      router.push("/dashboard")
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (password !== confirmPassword) { setError("Passwords do not match"); return }
    setLoading(true)
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/dashboard` },
      })
      if (error) { setError(error.message); return }
      setError("Check your email to confirm your account before signing in.")
    } finally {
      setLoading(false)
    }
  }

  const handleSignInWithOAuth = async (provider: string) => {
    setError(null)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: provider as 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` },
    })
    if (error) setError(error.message)
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md p-8 glass-card rounded-2xl relative overflow-hidden"
    >
      {/* Background glow effects */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-emerald-500 rounded-full blur-[100px] opacity-20"></div>
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-emerald-500 rounded-full blur-[100px] opacity-20"></div>

      <div className="relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-4">
            <ShieldCheck className="w-12 h-12 text-emerald-500 relative z-10" />
            <div className="absolute inset-0 bg-emerald-500 blur-xl opacity-50"></div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            {isLogin ? "Sign in to your account" : "Create Account"}
          </h2>
        </div>

        <form onSubmit={isLogin ? handleSignInWithPassword : handleSignUp} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-300">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                placeholder="name@example.com"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-300">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          {!isLogin && (
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-300">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2.5 rounded-lg border-glow transition-all duration-300 mt-6 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : (isLogin ? "Sign In" : "Create Account")}
          </button>
        </form>

        {error && (
          <p className={`text-sm text-center mt-4 ${
            error.startsWith('Check your email') ? 'text-emerald-400' : 'text-red-400'
          }`}>{error}</p>
        )}

        <div className="my-6 flex items-center">
          <div className="flex-1 border-t border-white/10"></div>
          <span className="px-4 text-sm text-gray-500">or</span>
          <div className="flex-1 border-t border-white/10"></div>
        </div>

        <button 
          onClick={() => handleSignInWithOAuth('google')}
          className="w-full bg-white/5 hover:bg-white/10 text-white font-medium py-2.5 rounded-lg border border-white/10 transition-all duration-300 flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </button>

        <div className="mt-6 text-center">
          {isLogin ? (
            <Link 
              href="/signup"
              className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Don't have an account? Sign up
            </Link>
          ) : (
            <Link 
              href="/login"
              className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Already have an account? Sign in
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  )
}
