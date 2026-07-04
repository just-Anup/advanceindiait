'use client'

import { useState } from 'react'
import { account } from '@/lib/appwrite'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'

export default function WebsiteLogin() {

  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const login = async () => {

    setLoading(true)

    try {

      await account.deleteSession('current').catch(() => {})

      await account.createEmailPasswordSession(email, password)

      if (email !== 'bnmiindia@gmail.com') {
        alert('Not authorized as Website Manager')
        await account.deleteSession('current')
        setLoading(false)
        return
      }

      router.push('/admin')

    } catch (err) {
      alert('Invalid credentials')
      setLoading(false)
    }
  }

  return (

    <div className="min-h-screen flex items-center justify-center bg-[#0A1229] relative overflow-hidden px-4">

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap');
        
        .bnmi-font-display {
          font-family: 'Playfair Display', Georgia, serif;
        }
        
        .bnmi-font-body {
          font-family: 'Inter', system-ui, sans-serif;
        }
      `}</style>

      {/* BG GLOW */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[650px] h-[650px] rounded-full opacity-[0.08] blur-[170px] pointer-events-none"
        style={{
          background: "radial-gradient(circle,#C9A24B 0%,transparent 70%)"
        }}
      />

      {/* GRID */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#C9A24B 1px, transparent 1px),linear-gradient(90deg,#C9A24B 1px, transparent 1px)",
          backgroundSize: "70px 70px"
        }}
      />

      <div className="w-full max-w-md bg-white/5 backdrop-blur-2xl rounded-[40px] overflow-hidden shadow-xl relative z-10 border border-white/10 p-10">

        <h2 className="bnmi-font-display text-3xl font-bold mb-2 text-[#FBF9F4] text-center">
          Website Manager
        </h2>

        <p className="bnmi-font-body text-[#D5D8E3] text-center mb-8">
          Login to access the admin dashboard
        </p>

        {/* Email */}

        <div className="mb-5">
          <label className="bnmi-font-body text-sm text-[#D5D8E3] mb-2 block">
            Email Address
          </label>

          <input
            type="email"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[#FBF9F4] placeholder-[#D5D8E3]/50 focus:outline-none focus:ring-2 focus:ring-[#C9A24B] focus:border-[#C9A24B] hover:border-white/20 transition-all"
            placeholder="youremail@gmail.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>


        {/* Password */}

        <div className="mb-6 relative">

          <label className="bnmi-font-body text-sm text-[#D5D8E3] mb-2 block">
            Password
          </label>

          <input
            type={showPassword ? "text" : "password"}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-12 text-[#FBF9F4] placeholder-[#D5D8E3]/50 focus:outline-none focus:ring-2 focus:ring-[#C9A24B] focus:border-[#C9A24B] hover:border-white/20 transition-all"
            placeholder="Enter your password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-[42px] text-[#D5D8E3] hover:text-[#C9A24B] transition"
          >
            {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
          </button>

        </div>


        {/* Login Button */}

        <button
          onClick={login}
          disabled={loading}
          className={`bnmi-font-body w-full py-3 rounded-xl font-semibold text-[#0A1229] transition-all duration-300 ${
            loading
              ? 'bg-[#C9A24B]/50 cursor-not-allowed'
              : 'bg-[#C9A24B] hover:bg-[#d4b05a] shadow-[0_10px_30px_rgba(201,162,75,0.25)] hover:shadow-[0_15px_40px_rgba(201,162,75,0.35)]'
          }`}
        >
          {loading ? "Logging in..." : "LOGIN"}
        </button>

      </div>

    </div>

  )
}