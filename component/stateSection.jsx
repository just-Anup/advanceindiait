'use client'

import CounterGSAP from '../component/CounterGSAP'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  BookOpen,
  GraduationCap,
  Users,
  Star,
} from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

export default function StatsSection() {

  const sectionRef = useRef(null)

  useEffect(() => {

    gsap.fromTo(
      sectionRef.current.children,
      {
        opacity: 0,
        y: 80,
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
          toggleActions: 'play none none reset',
        },
      }
    )

  }, [])

  const stats = [
    {
      number: 7687,
      title: 'Total Institute',
      icon: <BookOpen size={28} />,
      bg: 'bg-[#C9A24B]/15',
      iconColor: 'text-[#C9A24B]',
    },
    {
      number: 1235,
      title: 'Total Course',
      icon: <GraduationCap size={28} />,
      bg: 'bg-[#C9A24B]/15',
      iconColor: 'text-[#C9A24B]',
    },
    {
      number: 151053,
      title: 'Total Student',
      icon: <Users size={28} />,
      bg: 'bg-[#C9A24B]/15',
      iconColor: 'text-[#C9A24B]',
    },
    {
      number: 19728,
      title: 'Reviews',
      icon: <Star size={28} />,
      bg: 'bg-[#C9A24B]/15',
      iconColor: 'text-[#C9A24B]',
    },
  ]

  return (
    <section
      className="
        relative
        z-20
        w-full
        bg-[#0A1229]
        px-4
        md:px-10
        py-20
      "
    >

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap');
        
        .bnmi-font-display {
          font-family: 'Playfair Display', Georgia, serif;
        }
        
        .bnmi-font-body {
          font-family: 'Inter', system-ui, sans-serif;
        }
      `}</style>

      {/* GOLD GLOW */}
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

      <div
        ref={sectionRef}
        className="
          relative
          z-10
          max-w-7xl
          mx-auto
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-4
          gap-7
        "
      >

        {stats.map((item, index) => (

          <div
            key={index}
            className="
              bg-white/5
              backdrop-blur-xl
              border
              border-white/10
              rounded-[30px]
              px-8
              py-8
              shadow-[0_10px_40px_rgba(201,162,75,0.08)]
              hover:-translate-y-2
              hover:border-[#C9A24B]/30
              transition-all
              duration-500
              group
            "
          >

            <div className="flex items-start gap-5">

              {/* ICON */}
              <div
                className={`
                  w-16
                  h-16
                  rounded-full
                  flex
                  items-center
                  justify-center
                  ${item.bg}
                  ${item.iconColor}
                  group-hover:scale-110
                  transition-all
                  duration-300
                `}
              >
                {item.icon}
              </div>

              {/* CONTENT */}
              <div>

                <h2
                  className="
                    bnmi-font-display
                    text-5xl
                    font-black
                    text-[#FBF9F4]
                    leading-none
                  "
                >
                  <CounterGSAP end={item.number} />
                </h2>

                <p
                  className="
                    bnmi-font-body
                    mt-3
                    text-[#D5D8E3]
                    text-lg
                    font-medium
                  "
                >
                  {item.title}
                </p>

              </div>

            </div>

          </div>

        ))}

      </div>

    </section>
  )
}