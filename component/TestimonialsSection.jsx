'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { databases } from '@/lib/appwrite'
import { Query } from 'appwrite'
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import TestimonialCard from '../component/TestimonialCard'

const DATABASE_ID =
  process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID

const COLLECTION_ID = 'testimonials'

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] =
    useState([])

  const [isPaused, setIsPaused] =
    useState(false)

  /* ================= FETCH ================= */

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        if (!databases || !DATABASE_ID)
          return

        const res =
          await databases.listDocuments(
            DATABASE_ID,
            COLLECTION_ID,
            [Query.orderAsc('order')]
          )

        setTestimonials(
          res?.documents || []
        )
      } catch (err) {
        console.error(
          'Testimonials load failed:',
          err
        )

        setTestimonials([])
      }
    }

    fetchTestimonials()
  }, [])

  /* ================= EMPTY ================= */

  if (
    !Array.isArray(testimonials) ||
    testimonials.length === 0
  ) {
    return null
  }

  return (
    <section
      className="
        bnmi-font-body
        py-28
        bg-[#0A1229]
        relative
        overflow-hidden
      "
    >

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap');
        .bnmi-font-display { font-family: 'Playfair Display', Georgia, serif; }
        .bnmi-font-body { font-family: 'Inter', system-ui, sans-serif; }

        @keyframes bnmi-drift-slow {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-3%, 3%); }
        }
        .bnmi-arrow-btn {
          transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease, transform 0.3s ease;
        }
        .bnmi-arrow-btn:hover {
          transform: translateY(-50%) scale(1.06);
        }
      `}</style>

      {/* AMBIENT GLOW */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full opacity-[0.1] blur-[150px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, #C9A24B, transparent 70%)', animation: 'bnmi-drift-slow 18s ease-in-out infinite' }}
      />

      {/* FAINT GRID TEXTURE */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(#C9A24B 1px, transparent 1px), linear-gradient(90deg, #C9A24B 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />

      {/* HEADING */}

      <div className="relative z-10 text-center mb-16 px-6">

        <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-[#C9A24B] font-medium mb-5">
          <Quote size={14} />
          Testimonials
        </span>

        <h2 className="bnmi-font-display text-4xl md:text-6xl font-bold text-[#FBF9F4] leading-tight">
          What Our <span className="text-[#C9A24B]">Students</span> <br />
          Have to Say
        </h2>

      </div>

      {/* LEFT BUTTON */}

      <button
        aria-label="Previous"
        className="
          bnmi-arrow-btn
          absolute
          left-4
          top-1/2
          -translate-y-1/2
          z-30
          w-12
          h-12
          rounded-full
          bg-[#0F1936]
          border
          border-[#C9A24B]/25
          shadow-xl
          text-[#C9A24B]
          flex
          items-center
          justify-center
          hover:bg-[#C9A24B]
          hover:text-[#0A1229]
        "
      >
        <ChevronLeft size={22} />
      </button>

      {/* RIGHT BUTTON */}

      <button
        aria-label="Next"
        className="
          bnmi-arrow-btn
          absolute
          right-4
          top-1/2
          -translate-y-1/2
          z-30
          w-12
          h-12
          rounded-full
          bg-[#0F1936]
          border
          border-[#C9A24B]/25
          shadow-xl
          text-[#C9A24B]
          flex
          items-center
          justify-center
          hover:bg-[#C9A24B]
          hover:text-[#0A1229]
        "
      >
        <ChevronRight size={22} />
      </button>

      {/* SLIDER */}

      <div
        className="relative z-10 overflow-hidden px-10"
        onMouseEnter={() =>
          setIsPaused(true)
        }
        onMouseLeave={() =>
          setIsPaused(false)
        }
      >

        {/* LEFT FADE */}

        <div className="absolute left-0 top-0 z-20 h-full w-24 bg-gradient-to-r from-[#0A1229] to-transparent pointer-events-none" />

        {/* RIGHT FADE */}

        <div className="absolute right-0 top-0 z-20 h-full w-24 bg-gradient-to-l from-[#0A1229] to-transparent pointer-events-none" />

        {/* CONTINUOUS AUTO SLIDER */}

        <motion.div
          animate={{
            x: isPaused
              ? undefined
              : ['0%', '-50%'],
          }}
          transition={{
            repeat: Infinity,
            duration: 35,
            ease: 'linear',
          }}
          className="
            flex
            min-w-max
            gap-6
            py-4
          "
        >

          {[...testimonials, ...testimonials].map(
            (t, index) => (
              <motion.div
                key={index}
                whileHover={{
                  y: -10,
                  scale: 1.03,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 220,
                  damping: 16,
                }}
                className="flex-shrink-0"
              >

                <TestimonialCard
                  name={t.name}
                  role={t.role}
                  image={t.imageUrl}
                  text={t.text}
                />

              </motion.div>
            )
          )}

        </motion.div>
      </div>
    </section>
  )
}