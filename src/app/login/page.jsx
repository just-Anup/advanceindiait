'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function LoginSelect() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A1229] relative overflow-hidden">

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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/5 backdrop-blur-2xl p-12 rounded-[48px] w-full max-w-md shadow-xl flex flex-col gap-8 relative z-10 border border-white/10"
      >

        {/* LOGO SECTION */}
        <div className="text-center">
          <h2 className="bnmi-font-display text-4xl font-black mb-2 text-[#FBF9F4]">
            Welcome
          </h2>
          <p className="bnmi-font-body text-[#D5D8E3]">
            Select your login type to continue
          </p>
        </div>

        {/* INSTITUTE LOGIN */}
        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push('/login/institute')}
          className="bnmi-font-body w-full bg-[#C9A24B] text-[#0A1229] py-4 rounded-[24px] font-semibold text-lg transition-all duration-300 shadow-[0_10px_30px_rgba(201,162,75,0.25)] hover:shadow-[0_15px_40px_rgba(201,162,75,0.35)] hover:bg-[#d4b05a]"
        >
          Institute Login
        </motion.button>

      </motion.div>
    </div>
  )
}
