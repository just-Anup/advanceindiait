"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ID } from "appwrite";
import { databases, storage } from "@/lib/appwrite";
import { Query } from "appwrite";

const DATABASE_ID =
  process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;

const COLLECTION_ID = "team";

const BUCKET_ID =
  process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID;

export default function TeamSlider() {
  const [team, setTeam] = useState([]);
  const [isPaused, setIsPaused] =
    useState(false);

  /* ================= FETCH TEAM ================= */

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res =
          await databases.listDocuments(
            DATABASE_ID,
            COLLECTION_ID,
            [Query.orderAsc("order")]
          );

        setTeam(res.documents || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTeam();
  }, []);

  /* ================= IMAGE URL ================= */

  const getImageUrl = (image) => {
    if (!image) return "/placeholder.png";

    try {
      if (
        typeof image === "string" &&
        image.startsWith("http")
      ) {
        return image;
      }

      if (typeof image === "string") {
        return storage.getFileView(
          BUCKET_ID,
          image
        ).href;
      }

      if (typeof image === "object") {
        const id =
          image.$id ||
          image.fileId ||
          image.id;

        if (id) {
          return storage.getFileView(
            BUCKET_ID,
            id
          ).href;
        }
      }

      return "/placeholder.png";
    } catch {
      return "/placeholder.png";
    }
  };

  /* ================= LOADING ================= */

  if (!team.length) {
    return (
      <section className="py-16 text-center text-[#FBF9F4] bg-[#0A1229]">
        Loading team...
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden bg-[#0A1229] py-20 text-[#FBF9F4]">

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap');
        
        .bnmi-font-display {
          font-family: 'Playfair Display', Georgia, serif;
        }
        
        .bnmi-font-body {
          font-family: 'Inter', system-ui, sans-serif;
        }

        @keyframes slideTeam {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-1000px);
          }
        }

        .team-slider-motion {
          animation: slideTeam 28s linear infinite;
        }

        .team-slider-motion.paused {
          animation-play-state: paused;
        }
      `}</style>

      {/* BACKGROUND */}

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,162,75,0.08),transparent_65%)]" />

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

      {/* CONTENT */}

      <div className="relative z-10 max-w-7xl mx-auto px-4">

        {/* HEADING */}

        <div className="text-center mb-14 relative z-10">

          <span className="inline-flex items-center gap-3 text-[#C9A24B] uppercase tracking-[0.28em] text-[11px] font-medium mb-6">
            <span className="w-10 h-[1px] bg-[#C9A24B]" />
            Our Team
            <span className="w-10 h-[1px] bg-[#C9A24B]" />
          </span>

          <h2 className="bnmi-font-display text-4xl md:text-5xl font-bold text-[#FBF9F4]">
            Meet Our{" "}
            <span className="text-[#C9A24B]">
              Professional Team
            </span>
          </h2>

          <p className="bnmi-font-body text-[#D5D8E3] mt-4 max-w-2xl mx-auto">
            Meet the creative minds and skilled professionals
            powering our vision forward.
          </p>
        </div>

        {/* LEFT FADE */}

        <div className="absolute left-0 top-0 z-20 h-full w-32 bg-gradient-to-r from-[#0A1229] to-transparent pointer-events-none" />

        {/* RIGHT FADE */}

        <div className="absolute right-0 top-0 z-20 h-full w-32 bg-gradient-to-l from-[#0A1229] to-transparent pointer-events-none" />

        {/* ================= SLIDER ================= */}

        <div
          className="overflow-hidden relative z-10"
          onMouseEnter={() =>
            setIsPaused(true)
          }
          onMouseLeave={() =>
            setIsPaused(false)
          }
        >

          <motion.div
            className={`
              flex
              items-center
              gap-8
              pr-8
              team-slider-motion
              ${isPaused ? 'paused' : ''}
            `}
          >

            {[...team, ...team].map(
              (member, index) => (
                <motion.div
                  key={index}
                  whileHover={{
                    y: -10,
                    scale: 1.03,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 220,
                    damping: 16,
                  }}
                  className="
                    relative
                    overflow-hidden
                    rounded-[32px]
                    border
                    border-white/10
                    bg-white/5
                    shadow-[0_10px_60px_rgba(201,162,75,0.08)]
                    w-[320px]
                    flex-shrink-0
                    hover:border-[#C9A24B]/30
                    transition-all
                    duration-300
                  "
                >

                  {/* GLOW */}

                  <div className="absolute inset-0 opacity-0 transition duration-700 hover:opacity-100">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#C9A24B]/20 via-[#C9A24B]/10 to-[#C9A24B]/20 blur-3xl" />
                  </div>

                  {/* IMAGE */}

                  <div className="relative overflow-hidden p-3">

                    <img
                      src={getImageUrl(
                        member.imageUrl
                      )}
                      alt={member.name}
                      draggable={false}
                      className="
  w-full
  h-[260px]
  md:h-[320px]
  object-cover
  object-top
  rounded-[26px]
  transition-transform
  duration-500
  hover:scale-105
"
                    />

                    <div className="absolute inset-0 rounded-[26px] bg-[#C9A24B]/0 hover:bg-[#C9A24B]/10 transition duration-500" />
                  </div>

                  {/* CONTENT */}

                  <div className="p-5 text-center relative z-10">

                    <h4 className="bnmi-font-display font-bold text-xl text-[#FBF9F4]">
                      {member.name}
                    </h4>

                    <p className="bnmi-font-body text-[#C9A24B] text-sm mt-2">
                      {member.role}
                    </p>

                    <p className="bnmi-font-body text-[#D5D8E3] text-xs mt-3 leading-relaxed">
                      {member.experience}
                    </p>

                  </div>
                </motion.div>
              )
            )}

          </motion.div>
        </div>
      </div>
    </section>
  );
}