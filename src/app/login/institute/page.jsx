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

    if (urlEmail) setEmail(urlEmail)
    if (urlPassword) setPassword(urlPassword)

  }, [])

  /* ---------------- LOGIN ---------------- */
  const login = async (e) => {

  e.preventDefault();

  if (loading) return;

  setLoading(true);

  try {

    // DELETE OLD SESSION FIRST
    try {
      await account.deleteSession("current");
    } catch (err) {
      // ignore if no session exists
    }

    // CREATE NEW SESSION
    await account.createEmailPasswordSession(email, password);

    /* ---------------- ADMIN LOGIN ---------------- */
    if (email === "bnmiindia@gmail.com") {

      localStorage.setItem("adminAuth", "true");

      setTimeout(() => {
        router.push("/admin");
      }, 500);

      return;
    }

    /* ---------------- FRANCHISE CHECK ---------------- */
    const res = await databases.listDocuments(
      DATABASE_ID,
      "franchise_approved",
      [Query.equal("email", email)]
    );

    if (!res.documents.length) {

      alert("Your franchise is not approved yet");

      await account.deleteSession("current");

      setLoading(false);

      return;
    }

    /* ---------------- NORMAL USER LOGIN ---------------- */
    router.push("/login/institute/dashboard");

  } catch (error) {

    console.error(error);

    alert(error?.message || "Invalid credentials");

  } finally {

    setLoading(false);

  }

};

  return (

    <div className="min-h-screen flex items-center justify-center bg-[#0A1229] px-4 relative overflow-hidden">

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

      <div className="w-full max-w-6xl bg-white/5 backdrop-blur-2xl rounded-3xl overflow-hidden shadow-xl flex flex-col md:flex-row relative z-10 border border-white/10">

        {/* ================= LEFT SIDE ================= */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-[#C9A24B]/20 to-[#C9A24B]/5 items-center justify-center relative p-10 border-r border-white/10">

          {/* circles */}
          <div className="absolute top-10 right-10 w-40 h-40 bg-white/5 rounded-full border border-white/10"></div>

          <div className="absolute bottom-10 left-10 w-52 h-52 bg-white/5 rounded-full border border-white/10"></div>

          {/* logo */}
          <div className="z-10 text-center">

            <img
              src="/logo.png"
              alt="logo"
              className="w-64 mx-auto"
            />

          </div>

        </div>

        {/* ================= RIGHT SIDE ================= */}
        <div className="w-full md:w-1/2 p-8 sm:p-12">

          <h2 className="bnmi-font-display text-3xl font-bold mb-2 text-[#FBF9F4]">
            Welcome Back
          </h2>

          <p className="bnmi-font-body text-[#D5D8E3] mb-8">
            Please login to your account to continue
          </p>

          <form onSubmit={login} className="space-y-6">

            {/* EMAIL */}
            <div>

              <label className="bnmi-font-body text-sm text-[#D5D8E3] block mb-2">
                Email Address
              </label>

              <input
                type="email"
                placeholder="youremail@gmail.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[#FBF9F4] placeholder-[#D5D8E3]/50 focus:outline-none focus:ring-2 focus:ring-[#C9A24B] focus:border-[#C9A24B] hover:border-white/20 transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

            </div>

            {/* PASSWORD */}
            <div className="relative">

              <label className="bnmi-font-body text-sm text-[#D5D8E3] block mb-2">
                Password
              </label>

              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-12 text-[#FBF9F4] placeholder-[#D5D8E3]/50 focus:outline-none focus:ring-2 focus:ring-[#C9A24B] focus:border-[#C9A24B] hover:border-white/20 transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[42px] text-[#D5D8E3] hover:text-[#C9A24B] transition"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>

            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className={`bnmi-font-body w-full py-3 rounded-xl font-semibold text-[#0A1229] transition-all duration-300 ${
                loading
                  ? 'bg-[#C9A24B]/50 cursor-not-allowed'
                  : 'bg-[#C9A24B] hover:bg-[#d4b05a] shadow-[0_10px_30px_rgba(201,162,75,0.25)] hover:shadow-[0_15px_40px_rgba(201,162,75,0.35)]'
              }`}
            >
              {loading ? 'Logging in...' : 'SIGN IN'}
            </button>

          </form>

          {/* DIVIDER */}
          <div className="my-8 border-t border-white/10"></div>

          {/* PWA SECTION */}
          <div className="text-center">

            <p className="bnmi-font-display font-semibold text-[#FBF9F4] mb-2">
              📱 Install as Progressive Web App (Mobile App) for Students
            </p>

            <p className="bnmi-font-body text-sm text-[#D5D8E3] mb-4">
              Access your courses anytime, anywhere with our mobile app experience
            </p>

            <button className="w-full border border-[#C9A24B] text-[#C9A24B] py-3 rounded-xl font-medium hover:bg-[#C9A24B]/10 hover:border-[#C9A24B] transition-all duration-300">
              📲 App is under progress (Coming soon)
            </button>

          </div>

        </div>

      </div>

    </div>

  )
}