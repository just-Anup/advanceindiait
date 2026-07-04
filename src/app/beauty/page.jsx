'use client'

import { motion } from 'framer-motion'
import { FiArrowUpRight } from 'react-icons/fi'

export default function BeautyPage() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#0A1229] py-20">

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap');
        
        .bnmi-font-display {
          font-family: 'Playfair Display', Georgia, serif;
        }
        
        .bnmi-font-body {
          font-family: 'Inter', system-ui, sans-serif;
        }
      `}</style>

      {/* BG */}
      <div className="absolute inset-0 bg-[radial-gradient(#C9A24B_1px,transparent_1px)] bg-[size:70px_70px] opacity-[0.03]" />

      <div className="absolute -top-20 left-0 h-[500px] w-[500px] rounded-full bg-gradient-to-r from-[#C9A24B]/30 to-transparent blur-[140px]" />

      <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-gradient-to-l from-[#C9A24B]/20 to-transparent blur-[140px]" />

      <div className="relative mx-auto max-w-[1400px] px-6 z-10">

        {/* Header */}
        <div className="mb-20 text-center">
          <h1 className="bnmi-font-display text-6xl font-black mb-4 text-[#FBF9F4]">
            Beauty & Personal Care Courses
          </h1>
          <p className="bnmi-font-body text-xl text-[#D5D8E3] max-w-3xl mx-auto">
            Master the art of beauty with our comprehensive professional courses designed for the modern beauty industry.
          </p>
        </div>

        {/* Coming Soon */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="group relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[48px] p-16 text-center shadow-[0_10px_60px_rgba(201,162,75,0.08)] hover:border-[#C9A24B]/30 transition-all duration-300"
        >
          <div className="absolute right-8 top-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#C9A24B] text-[#0A1229] group-hover:rotate-45 transition">
            <FiArrowUpRight size={28} />
          </div>

          <h2 className="bnmi-font-display text-4xl font-black mb-4 text-[#FBF9F4]">
            Coming Soon
          </h2>

          <p className="bnmi-font-body text-lg text-[#D5D8E3] max-w-2xl mx-auto mb-6">
            We're crafting the perfect beauty courses for you. Stay tuned for exclusive content on makeup, skincare, haircare, and much more.
          </p>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bnmi-font-body inline-block bg-[#C9A24B] text-[#0A1229] px-8 py-3 rounded-[24px] font-semibold transition-all duration-300 shadow-[0_10px_30px_rgba(201,162,75,0.25)] hover:shadow-[0_15px_40px_rgba(201,162,75,0.35)] hover:bg-[#d4b05a]"
          >
            Notify Me
          </motion.button>
        </motion.div>

      </div>
    </section>
  )
}
