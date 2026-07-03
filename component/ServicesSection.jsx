'use client'

import { useEffect, useState } from 'react'
import { databases } from '@/lib/appwrite'
import { Query } from 'appwrite'
import { motion } from 'framer-motion'

const DATABASE_ID =
  process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID

const COLLECTION_ID = 'services'

export default function ServicesSection() {

  const [services, setServices] = useState([])

  /* ================= FETCH ================= */

  useEffect(() => {

    const fetchServices = async () => {

      try {

        const res =
          await databases.listDocuments(
            DATABASE_ID,
            COLLECTION_ID,
            [
              Query.orderAsc('order'),
              Query.limit(100),
            ]
          )

        setServices(res.documents)

      } catch (error) {

        console.error(error)

      }
    }

    fetchServices()

  }, [])

  return (

<section className="bnmi-font-body relative py-28 overflow-hidden bg-[#0A1229]">

  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap');

    .bnmi-font-display{
      font-family:'Playfair Display',Georgia,serif;
    }

    .bnmi-font-body{
      font-family:'Inter',system-ui,sans-serif;
    }

    @keyframes bnmiFadeUp{
      from{
        opacity:0;
        transform:translateY(35px);
      }
      to{
        opacity:1;
        transform:translateY(0);
      }
    }

    .bnmiFadeUp{
      animation:bnmiFadeUp .8s cubic-bezier(.2,.9,.3,1) both;
    }

    .service-card{
      transition:all .45s cubic-bezier(.2,.9,.3,1);
    }

    .service-card:hover{
      transform:translateY(-8px);
      border-color:rgba(201,162,75,.35);
      box-shadow:0 20px 60px rgba(0,0,0,.35);
    }

    .service-icon{
      transition:transform .45s ease;
    }

    .service-card:hover .service-icon{
      transform:scale(1.08);
    }

    @media(prefers-reduced-motion:reduce){
      .bnmiFadeUp{
        animation:none!important;
      }

      .service-card,
      .service-icon{
        transition:none!important;
      }
    }
  `}</style>

  {/* GOLD GLOW */}

  <div
    className="absolute top-0 left-1/2 -translate-x-1/2 w-[650px] h-[650px] rounded-full opacity-[0.12] blur-[170px] pointer-events-none"
    style={{
      background:"radial-gradient(circle,#C9A24B 0%,transparent 70%)"
    }}
  />

  {/* SECOND GLOW */}

  <div
    className="absolute -bottom-52 -right-44 w-[500px] h-[500px] rounded-full opacity-[0.08] blur-[170px] pointer-events-none"
    style={{
      background:"radial-gradient(circle,#C9A24B 0%,transparent 70%)"
    }}
  />

  {/* GRID */}

  <div
    className="absolute inset-0 opacity-[0.03] pointer-events-none"
    style={{
      backgroundImage:
        "linear-gradient(#C9A24B 1px, transparent 1px),linear-gradient(90deg,#C9A24B 1px, transparent 1px)",
      backgroundSize:"70px 70px"
    }}
  />

  <div className="relative z-10 max-w-7xl mx-auto px-8">

    {/* ================= HEADING START ================= */}

    <div className="text-center max-w-4xl mx-auto bnmiFadeUp">

  {/* SMALL LABEL */}

  <span
    className="
      inline-flex
      items-center
      gap-3
      text-[#C9A24B]
      uppercase
      tracking-[0.28em]
      text-[11px]
      font-medium
      mb-6
    "
  >

    <span className="w-10 h-[1px] bg-[#C9A24B]" />

    Our Expertise

    <span className="w-10 h-[1px] bg-[#C9A24B]" />

  </span>

  {/* HEADING */}

  <h2
    className="
      bnmi-font-display
      text-[#FBF9F4]
      text-4xl
      md:text-5xl
      lg:text-6xl
      font-bold
      leading-tight
    "
  >

    Explore Our

    <br />

    <span className="text-[#C9A24B]">
      Professional Services
    </span>

  </h2>

  {/* DESCRIPTION */}

  <p
    className="
      mt-8
      text-[#D5D8E3]
      text-lg
      leading-9
      max-w-3xl
      mx-auto
    "
  >
    Discover a wide range of professional IT services,
    career-oriented training programs, digital solutions,
    and industry-recognized courses designed to help
    individuals and organizations grow with confidence
    in today's technology-driven world.
  </p>

</div>

{/* ================= SERVICES GRID START ================= */}

<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-16">
  {services.map((item, index) => (

    <motion.div
      key={item.$id}
      initial={{
        opacity: 0,
        y: 40,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.6,
        delay: index * 0.06,
      }}
      viewport={{ once: true }}
      whileHover={{
        y: -8,
      }}
      className="
        service-card
        group
        relative
        overflow-hidden
        rounded-2xl
        bg-white/5
        backdrop-blur-xl
        border
        border-white/10
        p-4
        cursor-pointer
        flex
        flex-col
        items-center
        justify-center
        text-center
      "
    >

      {/* GOLD GLOW */}

      <div
        className="
          absolute
          -top-20
          -right-20
          w-48
          h-48
          rounded-full
          blur-[90px]
          opacity-0
          group-hover:opacity-20
          transition-all
          duration-500
        "
        style={{
          background:
            "radial-gradient(circle,#C9A24B 0%,transparent 70%)",
        }}
      />

      {/* ICON */}

      <div
        className="
          service-icon
          w-16
          h-16
          rounded-xl
          bg-[#C9A24B]/10
          border
          border-[#C9A24B]/20
          flex
          items-center
          justify-center
          mb-3
        "
      >

        {item.imageUrl ? (

          <img
            src={item.imageUrl}
            alt={item.title}
            className="
              w-10
              h-10
              object-cover
              rounded-lg
            "
          />

        ) : (

          <div
            className="
              w-10
              h-10
              rounded-lg
              bg-[#C9A24B]/20
            "
          />

        )}

      </div>

      {/* TITLE */}

      <h3
        className="
          bnmi-font-display
          text-sm
          md:text-base
          font-bold
          text-[#FBF9F4]
          group-hover:text-[#C9A24B]
          transition-colors
          duration-300
          line-clamp-2
        "
      >
        {item.title}
      </h3>

    </motion.div>
  ))}
</div>

    </div>

  </section>

)}

