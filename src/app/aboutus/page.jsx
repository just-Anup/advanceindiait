"use client";

import { useState, useEffect, useRef } from "react";
import { databases } from "@/lib/appwrite";
import { Query } from "appwrite";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import {
  FiArrowUpRight,
  FiCheckCircle,
} from "react-icons/fi";

gsap.registerPlugin(ScrollTrigger);

const DATABASE_ID =
  process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;

const COLLECTION_ID = "website";

export default function StagesSection() {
  const [data, setData] = useState(null);

  const sectionRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!databases || !DATABASE_ID)
          return;

        const res =
          await databases.listDocuments(
            DATABASE_ID,
            COLLECTION_ID,
            [Query.limit(1)]
          );

        if (res.documents.length) {
          setData(res.documents[0]);
        }
      } catch (error) {
        console.error(
          "Stages load failed:",
          error
        );
      }
    };

    fetchData();
  }, []);

  /* ================= GSAP ================= */
  useEffect(() => {
    if (!sectionRef.current) return;

    gsap.fromTo(
      sectionRef.current.children,
      {
        opacity: 0,
        y: 100,
      },
      {
        opacity: 1,
        y: 0,
        duration: 1.4,
        stagger: 0.25,
        ease: "power4.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      }
    );
  }, [data]);

  if (!data) return null;

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

      <div
        ref={sectionRef}
        className="
          relative
          mx-auto
          grid
          min-h-screen
          max-w-[1800px]
          grid-cols-1
          items-center
          gap-16
          px-6
          lg:grid-cols-[1.1fr_1fr]
        "
      >

        {/* ================= IMAGE SIDE ================= */}
        <div className="relative flex h-screen items-center justify-start">

          {/* GLOW */}
          <div className="absolute left-10 h-[650px] w-[650px] rounded-full bg-gradient-to-r from-[#C9A24B]/25 to-transparent blur-[140px]" />

          {/* CENTER IMAGE */}
          <motion.div
            whileHover={{
              y: -10,
              scale: 1.02,
            }}
            transition={{
              duration: 0.4,
            }}
            className="
              absolute
              left-10
              z-30
              overflow-hidden
              rounded-[48px]
              border
              border-white/10
              bg-white/5
              shadow-[0_30px_120px_rgba(201,162,75,0.1)]
              backdrop-blur-2xl
              hover:border-[#C9A24B]/35
              transition-all
              duration-300
            "
          >
            <img
              src={data.aboutImageCenter}
              className="
                h-[620px]
                w-[400px]
                object-cover
              "
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          </motion.div>

          {/* TOP IMAGE */}
          <motion.div
            whileHover={{
              y: -10,
              rotate: 4,
            }}
            transition={{
              duration: 0.4,
            }}
            className="
              absolute
              right-16
              top-8
              z-20
              overflow-hidden
              rounded-[38px]
              border
              border-white/10
              bg-white/5
              shadow-[0_20px_80px_rgba(201,162,75,0.08)]
              backdrop-blur-xl
              rotate-6
              hover:border-[#C9A24B]/30
              transition-all
              duration-300
            "
          >
            <img
              src={data.aboutImageTop}
              className="
                h-[290px]
                w-[200px]
                object-cover
              "
            />
          </motion.div>

          {/* BOTTOM IMAGE */}
          <motion.div
            whileHover={{
              y: -10,
              rotate: -4,
            }}
            transition={{
              duration: 0.4,
            }}
             className="
              absolute
              right-16
              top-90
              z-20
              overflow-hidden
              rounded-[38px]
              border
              border-white/10
              bg-white/5
              shadow-[0_20px_80px_rgba(201,162,75,0.08)]
              backdrop-blur-xl
              rotate-6
              hover:border-[#C9A24B]/30
              transition-all
              duration-300
            "
          >
            <img
              src={data.aboutImageBottom}
              className="
                h-[290px]
                w-[200px]
                object-cover
              "
            />
          </motion.div>

          {/* FLOATING CARD */}
          <motion.div
            initial={{
              opacity: 0,
              y: 40,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
            }}
            className="
              absolute
              bottom-15
              right-0
              z-40
              rounded-[32px]
              border
              border-white/10
              bg-white/5
              px-8
              py-6
              shadow-[0_10px_60px_rgba(201,162,75,0.08)]
              backdrop-blur-2xl
              hover:border-[#C9A24B]/30
              transition-all
              duration-300
            "
          >
            <p className="bnmi-font-body text-sm font-medium text-[#D5D8E3]">
              Trusted by Students
            </p>

            <h3 className="bnmi-font-display mt-1 text-6xl font-black text-[#FBF9F4]">
              10K+
            </h3>

            <div className="bnmi-font-body mt-2 flex items-center gap-2 text-sm text-[#C9A24B]">
              <FiCheckCircle />
              Growing Every Day
            </div>
          </motion.div>
        </div>

        {/* ================= CONTENT ================= */}
        <div className="flex min-h-screen flex-col justify-center">

          {/* TAG */}
          <div
            className="
              mb-5
              inline-flex
              w-fit
              items-center
              gap-2
              rounded-full
              border
              border-[#C9A24B]/30
              bg-[#C9A24B]/10
              px-5
              py-2
              text-sm
              font-semibold
              uppercase
              tracking-[0.25em]
              text-[#C9A24B]
            "
          >
            ABOUT US
          </div>

          {/* TITLE */}
          <h2
            className="
              bnmi-font-display
              mb-8
              max-w-4xl
              text-7xl
              font-black
              leading-[0.95]
              tracking-tight
              text-[#FBF9F4]
            "
          >
           
          </h2>

          {/* DESC */}
          <p
            className="
              bnmi-font-body
              mb-14
              max-w-5xl
              text-xl
              leading-[2]
              text-[#D5D8E3]
            "
          >
            {data.aboutDescription}
          </p>

          {/* MISSION */}
          <motion.div
            whileHover={{
              y: -5,
            }}
            className="
              group
              relative
              mb-8
              w-full
              overflow-hidden
              rounded-[40px]
              border
              border-white/10
              bg-white/5
              p-10
              shadow-[0_10px_60px_rgba(201,162,75,0.08)]
              backdrop-blur-2xl
              transition
              hover:border-[#C9A24B]/30
              duration-300
            "
          >

            <div className="absolute right-6 top-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#C9A24B] text-[#0A1229] transition group-hover:rotate-45">
              <FiArrowUpRight size={22} />
            </div>

            <h3 className="bnmi-font-display mb-5 text-4xl font-black text-[#FBF9F4]">
              {data.missionTitle}
            </h3>

            <p className="bnmi-font-body max-w-6xl text-lg leading-[2] text-[#D5D8E3]">
              {data.missionContent}
            </p>
          </motion.div>

          {/* VISION */}
          <motion.div
            whileHover={{
              y: -5,
            }}
            className="
              group
              relative
              w-full
              overflow-hidden
              rounded-[40px]
              border
              border-white/10
              bg-white/5
              p-10
              shadow-[0_10px_60px_rgba(201,162,75,0.08)]
              backdrop-blur-2xl
              transition
              hover:border-[#C9A24B]/30
              duration-300
            "
          >

            <div className="absolute right-6 top-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#C9A24B] text-[#0A1229] transition group-hover:rotate-45">
              <FiArrowUpRight size={22} />
            </div>

            <h3 className="bnmi-font-display mb-5 text-4xl font-black text-[#FBF9F4]">
              {data.visionTitle}
            </h3>

            <p className="bnmi-font-body max-w-6xl text-lg leading-[2] text-[#D5D8E3]">
              {data.visionContent}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}