'use client'

import { useState, useEffect } from 'react'
import { account, databases } from '@/lib/appwrite'
import { useRouter } from 'next/navigation'
import { Query } from 'appwrite'
import { Eye, EyeOff } from 'lucide-react'

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID

export default function InstituteLogin() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  /* ---------------- AUTO FILL FROM URL ---------------- */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)

    const urlEmail = params.get('email')
    const urlPassword = params.get('password')

    // Avoid cascading renders by batching updates.
    if (urlEmail || urlPassword) {
      if (urlEmail) setEmail(urlEmail)
      if (urlPassword) setPassword(urlPassword)
    }
  }, [])

  /* ---------------- LOGIN ---------------- */
  const login = async (e) => {
    e.preventDefault()

    if (loading) return

    setLoading(true)

    try {
      // DELETE OLD SESSION FIRST
      try {
        await account.deleteSession('current')
      } catch (err) {
        // ignore if no session exists
      }

      // CREATE NEW SESSION
      await account.createEmailPasswordSession(email, password)

      /* ---------------- ADMIN LOGIN ---------------- */
      if (email === 'bnmiindia@gmail.com') {
        localStorage.setItem('adminAuth', 'true')

        setTimeout(() => {
          router.push('/admin')
        }, 500)

        return
      }

      /* ---------------- FRANCHISE CHECK ---------------- */
      const res = await databases.listDocuments(
        DATABASE_ID,
        'franchise_approved',
        [Query.equal('email', email)]
      )

      if (!res.documents.length) {
        alert('Your franchise is not approved yet')

        await account.deleteSession('current')

        setLoading(false)
        return
      }

      /* ---------------- NORMAL USER LOGIN ---------------- */
      router.push('/login/institute/dashboard')
    } catch (error) {
      console.error(error)
      alert(error?.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#edf0f5] flex items-center justify-center p-5 overflow-hidden">
      {/* Background Glow */}
      <div
        className="absolute w-[900px] h-[900px] rounded-full blur-[170px] opacity-20"
        style={{
          background: 'radial-gradient(circle,#F7D354 0%,transparent 70%)'
        }}
      />

      {/* Main Card */}
      <div className="relative w-full max-w-7xl bg-[#FAFAFA] rounded-[40px] overflow-hidden shadow-[0_35px_80px_rgba(0,0,0,0.12)]">
        <div className="grid lg:grid-cols-2">
          {/* ================= LEFT PANEL (FORM) ================= */}
          <div className="relative flex flex-col justify-between px-8 sm:px-12 lg:px-16 py-10 lg:py-14">
            {/* Logo + Heading */}
            <div>
              <div className="flex items-center justify-between">
                <div className="px-6 py-3 rounded-full border border-gray-300 bg-white shadow-sm">
                  <img src="/login-bg.jpg" alt="logo" className="h-8 object-contain" />
                </div>
              </div>

              <div className="mt-10">
                <h1 className="text-4xl sm:text-5xl font-bold text-[#1C1C1C] leading-tight">
                  Institute
                  <br />
                  Login
                </h1>
                <p className="mt-3 text-gray-500 text-base sm:text-lg">
                  Secure access to your BNMI portal
                </p>
              </div>
            </div>

            {/* ================= FORM ================= */}
            <form onSubmit={login} className="mt-8 flex-1 flex flex-col">
              <div className="flex-1">
                {/* Email */}
                <label className="block">
                  <span className="text-sm font-medium text-gray-700">Email</span>
                  <div className="mt-2 relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      className="w-full rounded-2xl border border-gray-200 bg-white px-5 py-4 text-[15px] outline-none focus:ring-4 focus:ring-[#FFD54F]/30 focus:border-[#FFD54F]"
                    />
                  </div>
                </label>

                {/* Password */}
                <label className="block mt-5">
                  <span className="text-sm font-medium text-gray-700">Password</span>
                  <div className="mt-2 relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      className="w-full rounded-2xl border border-gray-200 bg-white px-5 py-4 text-[15px] outline-none focus:ring-4 focus:ring-[#FFD54F]/30 focus:border-[#FFD54F] pr-14"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl flex items-center justify-center bg-white/70 hover:bg-white border border-gray-200"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </label>

                {/* Helper */}
                <div className="mt-4 text-sm text-gray-500">
                  Use your registered institute email to continue.
                </div>
              </div>

              {/* Login Button pinned bottom */}
              <div className="mt-8">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-[22px] bg-[#FFD54F] hover:bg-[#F8CB3F] transition-all duration-300 font-semibold text-[#1C1C1C] shadow-md hover:shadow-xl px-6 py-4 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? 'Logging in...' : 'Login'}
                </button>

                <div className="mt-4 flex justify-between items-center text-xs sm:text-sm text-gray-500">
                  <p>© {new Date().getFullYear()} Advance India IT </p>
                  <p className="hover:text-black cursor-pointer transition">Secure Login</p>
                </div>
              </div>
            </form>
          </div>

          {/* ================= RIGHT PANEL (IMAGE) ================= */}
          <div className="hidden lg:block relative p-6">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FFF5CC] via-[#FFF8E6] to-[#FFE89A] rounded-l-[60px]" />

            <div className="relative h-full rounded-[36px] overflow-hidden shadow-2xl">
              <img src="/login-bg.webp" alt="AIIt" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/10" />

              {/* Top badge */}
              <div className="absolute top-8 left-8 bg-white/90 backdrop-blur-xl border border-white/40 rounded-2xl px-5 py-3 shadow-xl">
                <p className="text-sm font-semibold text-gray-900">Welcome to ADVANCE INDIA IT Portal</p>
                <p className="text-xs text-gray-600 mt-1">Education • Certificates • Results</p>
              </div>

              {/* Side decorative card */}
              <div className="absolute bottom-10 left-10 w-72 bg-white/15 backdrop-blur-xl border border-white/25 rounded-3xl px-6 py-5 shadow-2xl">
                <p className="text-sm text-white font-semibold">Fast & Secure</p>
                <p className="text-xs text-white/80 mt-1">
                  Your credentials are verified using Appwrite.
                </p>
                <div className="mt-4 flex gap-2">
                  {[1, 2, 3].map((n) => (
                    <div
                      key={n}
                      className="flex-1 h-2 rounded-full bg-white/20 overflow-hidden"
                    >
                      <div className="h-full w-2/3 bg-[#FFD54F] rounded-full" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Decorative dots */}
              <div className="absolute right-10 top-24 flex flex-col gap-4">
                <div className="w-3 h-3 rounded-full bg-white/70" />
                <div className="w-2 h-2 rounded-full bg-white/60" />
                <div className="w-4 h-4 rounded-full bg-[#FFD54F]/90" />
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Blobs */}
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[#FFD54F]/20 blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-[#FFD54F]/20 blur-[120px] pointer-events-none" />
      </div>

      {/* Custom Animation */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
        *{ font-family:'Poppins',sans-serif; }
        img{ user-select:none; -webkit-user-drag:none; }
        button{ transition:.35s; }
        button:hover{ transform:translateY(-2px); }
        input{ transition:.3s; }
      `}</style>
    </div>
  )
}

