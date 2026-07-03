"use client";

import { useEffect, useState } from "react";
import { databases } from "@/lib/appwrite";
import { Query } from "appwrite";
import { Search, MoveRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const DB = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const COLLECTION = "website";

export default function HeroSection() {

  const [slides, setSlides] = useState([]);
  const [settings, setSettings] = useState(null);

  const [current, setCurrent] = useState(0);

  /* ================= FETCH CMS ================= */

  useEffect(() => {

    const fetchData = async () => {
      try {

        const res = await databases.listDocuments(
          DB,
          COLLECTION,
          [Query.orderAsc("$createdAt")]
        );

        /* HERO IMAGES */
        const heroImages = res.documents.filter(
          (d) => d.type === "hero"
        );

        /* SETTINGS */
        const heroSettings = res.documents.find(
          (d) => d.type === "hero_settings"
        );

        setSlides(heroImages);
        setSettings(heroSettings);

      } catch (err) {
        console.log(err);
      }
    };

    fetchData();

  }, []);

  /* ================= AUTO SLIDER ================= */

  useEffect(() => {

    if (
      settings?.heroType !== "slider" ||
      slides.length <= 1
    )
      return;

    const interval = setInterval(() => {

      setCurrent((prev) =>
        prev === slides.length - 1 ? 0 : prev + 1
      );

    }, 4000);

    return () => clearInterval(interval);

  }, [slides, settings]);

  const activeSlide = slides[current];

return (
  <section className="bnmi-font-body relative min-h-screen bg-[#0A1229] overflow-hidden flex items-center">

    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap');

      .bnmi-font-display{
        font-family:'Playfair Display',Georgia,serif;
      }

      .bnmi-font-body{
        font-family:'Inter',system-ui,sans-serif;
      }

      @keyframes heroFade{
        from{
          opacity:0;
          transform:translateY(30px);
        }
        to{
          opacity:1;
          transform:translateY(0);
        }
      }

      .heroFade{
        animation:heroFade .8s cubic-bezier(.2,.9,.3,1) both;
      }

      .glass-card{
        backdrop-filter:blur(18px);
        background:rgba(255,255,255,.05);
        border:1px solid rgba(255,255,255,.08);
      }

      .hero-btn{
        transition:all .35s ease;
      }

      .hero-btn:hover{
        transform:translateY(-3px);
        box-shadow:0 15px 45px rgba(201,162,75,.35);
      }

      .search-box{
        transition:.35s ease;
      }

      .search-box:focus-within{
        border-color:#C9A24B;
        box-shadow:0 0 0 1px rgba(201,162,75,.35);
      }

      @media(prefers-reduced-motion:reduce){
        .heroFade{
          animation:none!important;
        }
      }
    `}</style>

    {/* ================= GOLD GLOW ================= */}

    <div
      className="absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full blur-[170px] opacity-[0.12] pointer-events-none"
      style={{
        background:
          "radial-gradient(circle,#C9A24B 0%,transparent 70%)",
      }}
    />

    <div
      className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full blur-[180px] opacity-[0.08] pointer-events-none"
      style={{
        background:
          "radial-gradient(circle,#C9A24B 0%,transparent 70%)",
      }}
    />

    {/* ================= GRID TEXTURE ================= */}

    <div
      className="absolute inset-0 opacity-[0.03] pointer-events-none"
      style={{
        backgroundImage:
          "linear-gradient(#C9A24B 1px, transparent 1px), linear-gradient(90deg,#C9A24B 1px, transparent 1px)",
        backgroundSize: "70px 70px",
      }}
    />

    {/* ================= BACKGROUND IMAGE ================= */}

    <div className="absolute inset-0">

      <AnimatePresence mode="wait">

        {activeSlide?.image && (

          <motion.img
            key={activeSlide.image}
            src={activeSlide.image}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 w-full h-full object-cover"
          />

        )}

      </AnimatePresence>

      {/* PREMIUM DARK OVERLAY */}

      <div className="absolute inset-0 bg-[#0A1229]/82" />

      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg,#0A1229 8%,rgba(10,18,41,.88) 40%,rgba(10,18,41,.55) 100%)",
        }}
      />

    </div>

    {/* ================= MAIN CONTAINER ================= */}

    <div
      className="
      relative
      z-20
      max-w-7xl
      mx-auto
      w-full
      px-8
      lg:px-10
      py-32
      grid
      lg:grid-cols-2
      gap-20
      items-center
    "
    >

      {/* ================= LEFT CONTENT START ================= */}

      <div className="heroFade">

  {/* SMALL LABEL */}

  <span className="inline-flex items-center gap-3 mb-8">

    <span className="w-10 h-[1px] bg-[#C9A24B]" />

    <span className="uppercase tracking-[0.28em] text-[11px] font-medium text-[#C9A24B]">
      Excellence In Education
    </span>

  </span>

  {/* HEADING */}

  <h1 className="bnmi-font-display text-[#FBF9F4] text-5xl md:text-6xl xl:text-7xl font-bold leading-[1.1] max-w-3xl">

    <span className="text-[#C9A24B]">
      {activeSlide?.blueText || "Empower"}
    </span>

    <br />

    {activeSlide?.title || "Your Future With Quality Education"}

  </h1>

  {/* DESCRIPTION */}

  <p className="mt-8 text-[#D5D8E3] text-lg leading-9 max-w-2xl">

    {activeSlide?.description ||
      "Build your future with industry-recognized courses, experienced mentors, practical learning, and internationally accepted certifications that prepare you for real-world success."}

  </p>

  {/* HIGHLIGHT BOX */}

  <div className="mt-10 glass-card rounded-xl p-6 max-w-xl border border-[#C9A24B]/20">

    <div className="flex flex-wrap gap-8">

      <div>

        <h3 className="bnmi-font-display text-3xl font-bold text-[#C9A24B]">
          10K+
        </h3>

        <p className="text-[#D5D8E3] text-sm mt-2">
          Students Trained
        </p>

      </div>

      <div className="w-px bg-white/10 hidden md:block" />

      <div>

        <h3 className="bnmi-font-display text-3xl font-bold text-[#C9A24B]">
          150+
        </h3>

        <p className="text-[#D5D8E3] text-sm mt-2">
          Professional Courses
        </p>

      </div>

      <div className="w-px bg-white/10 hidden md:block" />

      <div>

        <h3 className="bnmi-font-display text-3xl font-bold text-[#C9A24B]">
          100%
        </h3>

        <p className="text-[#D5D8E3] text-sm mt-2">
          Practical Learning
        </p>

      </div>

    </div>

  </div>

  {/* SEARCH SECTION START */}

<div
  className="
    mt-12
    max-w-2xl
    glass-card
    rounded-2xl
    overflow-hidden
    border
    border-white/10
    search-box
  "
>

  <div className="flex flex-col sm:flex-row items-stretch">

    {/* INPUT */}

    <div className="flex-1 flex items-center px-6">

      <Search
        size={20}
        className="text-[#C9A24B] mr-4 shrink-0"
      />

      <input
        type="text"
        placeholder="Search your favourite course..."
        className="
          w-full
          bg-transparent
          py-6
          outline-none
          text-[#FBF9F4]
          placeholder:text-[#A5ADBF]
        "
      />

    </div>

    {/* BUTTON */}

    <button
      className="
        hero-btn
        flex
        items-center
        justify-center
        gap-3
        px-10
        py-6
        bg-[#C9A24B]
        hover:bg-[#d7b15b]
        text-[#0A1229]
        font-semibold
        transition-all
        duration-300
      "
    >

      Search Courses

      <MoveRight size={20} />

    </button>

  </div>

</div>

{/* BOTTOM FEATURES */}

<div className="mt-10 flex flex-wrap gap-8">

  <div className="flex items-center gap-3">

    <div className="w-2 h-2 rounded-full bg-[#C9A24B]" />

    <span className="text-[#D5D8E3] text-sm">
      Industry Recognized Certification
    </span>

  </div>

  <div className="flex items-center gap-3">

    <div className="w-2 h-2 rounded-full bg-[#C9A24B]" />

    <span className="text-[#D5D8E3] text-sm">
      Practical Skill Development
    </span>

  </div>

  <div className="flex items-center gap-3">

    <div className="w-2 h-2 rounded-full bg-[#C9A24B]" />

    <span className="text-[#D5D8E3] text-sm">
      Placement Assistance
    </span>

  </div>

</div>

</div>

{/* ================= RIGHT SECTION START ================= */}
<div className="relative heroFade flex justify-center lg:justify-end">

  {/* GOLD RING */}

  <div
    className="
      absolute
      w-[520px]
      h-[520px]
      rounded-full
      border
      border-[#C9A24B]/15
      top-1/2
      left-1/2
      -translate-x-1/2
      -translate-y-1/2
      pointer-events-none
    "
  />

  {/* SECOND RING */}

  <div
    className="
      absolute
      w-[430px]
      h-[430px]
      rounded-full
      border
      border-white/5
      top-1/2
      left-1/2
      -translate-x-1/2
      -translate-y-1/2
      pointer-events-none
    "
  />

  {/* GOLD GLOW */}

  <div
    className="
      absolute
      w-[420px]
      h-[420px]
      rounded-full
      blur-[120px]
      opacity-20
      pointer-events-none
    "
    style={{
      background:
        "radial-gradient(circle,#C9A24B 0%,transparent 70%)",
    }}
  />

  {/* IMAGE CARD */}

  <motion.div
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    className="
      relative
      z-20
      rounded-[32px]
      overflow-hidden
      border
      border-white/10
      bg-white/5
      backdrop-blur-xl
      shadow-[0_35px_90px_rgba(0,0,0,.45)]
    "
  >

    {activeSlide?.studentImage && (

      <motion.img
        key={activeSlide.studentImage}
        src={activeSlide.studentImage}
        initial={{ scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.8 }}
        className="
          w-full
          max-w-[560px]
          object-contain
        "
      />

    )}

  </motion.div>

  {/* FLOATING CARD */}

  <motion.div
    initial={{ opacity: 0, y: 25 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.3 }}
    className="
      absolute
      bottom-8
      -left-8
      z-30
      glass-card
      rounded-2xl
      px-6
      py-5
      border
      border-[#C9A24B]/20
      shadow-2xl
    "
  >

    <div className="flex items-center gap-5">

      <div
        className="
          w-16
          h-16
          rounded-full
          bg-[#C9A24B]/10
          border
          border-[#C9A24B]/25
          flex
          items-center
          justify-center
        "
      >
        <Search
          size={28}
          className="text-[#C9A24B]"
        />
      </div>

      <div>

        <h3 className="bnmi-font-display text-4xl font-bold text-[#FBF9F4]">
          4500+
        </h3>

        <p className="text-[#D5D8E3] text-sm mt-1">
          Active Students
        </p>

      </div>

    </div>

  </motion.div>

  {/* TOP RIGHT BADGE */}

  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.45 }}
    className="
      absolute
      top-10
      right-0
      z-30
      glass-card
      rounded-xl
      px-5
      py-4
      border
      border-white/10
    "
  >

    <p className="text-[#C9A24B] text-xs uppercase tracking-[0.25em]">
      Trusted By
    </p>

    <h4 className="mt-2 text-[#FBF9F4] text-xl font-semibold">
      500+ Institutes
    </h4>

  </motion.div>

</div>

{/* ================= SLIDER START ================= */}

{/* ================= SLIDER DOTS ================= */}

{settings?.heroType === "slider" && slides.length > 1 && (

  <div
    className="
      absolute
      bottom-10
      left-1/2
      -translate-x-1/2
      z-30
      flex
      items-center
      gap-4
    "
  >

    {slides.map((_, index) => (

      <button
        key={index}
        onClick={() => setCurrent(index)}
        className={`
          relative
          transition-all
          duration-500
          rounded-full
          overflow-hidden
          ${
            current === index
              ? "w-12 h-3 bg-[#C9A24B]"
              : "w-3 h-3 bg-white/25 hover:bg-white/50"
          }
        `}
      >

        {current === index && (
          <motion.div
            layoutId="heroIndicator"
            className="absolute inset-0 rounded-full bg-[#C9A24B]"
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
            }}
          />
        )}

      </button>

    ))}

  </div>

)}

    </div>
  </section>
);
}