"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Client, Databases } from "appwrite";

/* ================= APPWRITE ================= */
const client = new Client();

client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

const databases = new Databases(client);

const DATABASE_ID = "6a3f68390018f40d999e";
const COLLECTION_ID = "brand_logos";
const BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID;

export default function PremiumBrandSlider() {

  const [brands, setBrands] = useState([]);

  /* ================= FETCH ================= */

  useEffect(() => {

    const fetchBrands = async () => {

      try {

        const res =
          await databases.listDocuments(
            DATABASE_ID,
            COLLECTION_ID
          );

        const filtered =
          res.documents.map((doc) => ({

            id: doc.$id,

            title:
              doc.title || "Brand",

            image:
              doc.image?.includes("http")
                ? doc.image
                : `https://cloud.appwrite.io/v1/storage/buckets/${BUCKET_ID}/files/${doc.image}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`,

          }));

        setBrands(filtered);

      } catch (err) {

        console.log(err);

      }
    };

    fetchBrands();

  }, []);

  return (
    <section
      className="
        relative
        overflow-hidden
        py-28
        bg-[#0A1229]
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

      {/* SOFT BG GLOW */}

      <div
        className="
          absolute
          top-0
          left-1/2
          -translate-x-1/2
          w-[700px]
          h-[700px]
          opacity-[0.08]
          blur-[160px]
          rounded-full
        "
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

      {/* ================= TOP MARQUEE ================= */}

      <div
        className="
          relative
          mb-16
          overflow-hidden
          border-y
          border-white/10
          bg-white/5
          py-5
          backdrop-blur-xl
        "
      >

        <motion.div
          initial={{ x: 0 }}
          animate={{ x: "-50%" }}
          transition={{
            repeat: Infinity,
            duration: 20,
            ease: "linear",
          }}
          className="
            flex
            min-w-max
            items-center
            gap-16
          "
        >

          {[...Array(10)].map((_, i) => (

            <div
              key={i}
              className="
                flex
                items-center
                gap-6
              "
            >

              <span
                className="
                  text-2xl
                  text-[#C9A24B]
                "
              >
                ✦
              </span>

              <h2
                className="
                  bnmi-font-body
                  whitespace-nowrap
                  text-2xl
                  font-semibold
                  tracking-wide
                  text-[#FBF9F4]
                "
              >
                BNMIINDIA.COM{" "}

                <span
                  className="
                    text-[#C9A24B]
                  "
                >
                  BNMIINDIA.ORG
                </span>{" "}

                ADVANCEINDIAIT.IN
              </h2>

            </div>

          ))}

        </motion.div>

      </div>

      {/* ================= MAIN CONTAINER ================= */}

      <div
        className="
          relative
          mx-auto
          w-[96%]
          overflow-hidden
          rounded-[48px]
          border
          border-white/10
          bg-white/5
          backdrop-blur-2xl
          py-24
          shadow-[0_20px_80px_rgba(201,162,75,0.08)]
          hover:border-[#C9A24B]/30
          transition-all
          duration-300
        "
      >

        {/* LEFT FADE */}

        <div
          className="
            absolute
            left-0
            top-0
            z-20
            h-full
            w-52
            bg-gradient-to-r
            from-[#0A1229]
            via-[#0A1229]/90
            to-transparent
          "
        />

        {/* RIGHT FADE */}

        <div
          className="
            absolute
            right-0
            top-0
            z-20
            h-full
            w-52
            bg-gradient-to-l
            from-[#0A1229]
            via-[#0A1229]/90
            to-transparent
          "
        />

        {/* ================= HEADING ================= */}

        <div
          className="
            absolute
            left-1/2
            top-8
            z-30
            -translate-x-1/2
          "
        >

          <div
            className="
              flex
              items-center
              gap-6
            "
          >

            <div
              className="
                h-[2px]
                w-20
                bg-gradient-to-r
                from-transparent
                to-[#C9A24B]
              "
            />

            <h2
              className="
                bnmi-font-display
                whitespace-nowrap
                text-sm
                font-bold
                tracking-[0.5em]
                text-[#C9A24B]
              "
            >
              BRANDS WE WORK WITH
            </h2>

            <div
              className="
                h-[2px]
                w-20
                bg-gradient-to-l
                from-transparent
                to-[#C9A24B]
              "
            />

          </div>

        </div>

        {/* ================= SLIDER ================= */}

        <div className="group flex overflow-hidden">

          <motion.div
            initial={{ x: 0 }}
            animate={{ x: "-50%" }}
            transition={{
              repeat: Infinity,
              duration: 30,
              ease: "linear",
            }}
            className="
              flex
              min-w-max
              items-center
              gap-16
              pr-16
            "
          >

            {[...brands, ...brands].map(
              (brand, index) => (

                <motion.div
                  key={index}
                  whileHover={{
                    scale: 1.08,
                    y: -8,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 220,
                    damping: 16,
                  }}
                  className="
                    group/card
                    relative
                    flex
                    h-40
                    w-72
                    items-center
                    justify-center
                    rounded-[34px]
                    border
                    border-white/10
                    bg-white/5
                    backdrop-blur-2xl
                    overflow-hidden
                    shadow-[0_10px_40px_rgba(201,162,75,0.08)]
                    hover:border-[#C9A24B]/30
                    transition-all
                    duration-300
                  "
                >

                  {/* SOFT GLOW */}

                  <div
                    className="
                      absolute
                      inset-0
                      opacity-0
                      transition
                      duration-700
                      group-hover/card:opacity-100
                    "
                  >
                    <div
                      className="
                        absolute
                        inset-0
                        bg-gradient-to-r
                        from-[#C9A24B]/20
                        via-[#C9A24B]/10
                        to-[#C9A24B]/20
                        blur-3xl
                      "
                    />
                  </div>

                  {/* INNER */}

                  <div
                    className="
                      absolute
                      inset-[1px]
                      rounded-[32px]
                      bg-white/5
                    "
                  />

                  {/* LOGO */}

                  <motion.img
                    src={brand.image}
                    alt={brand.title}
                    draggable={false}
                    whileHover={{
                      scale: 1.12,
                    }}
                    transition={{
                      duration: 0.4,
                    }}
                    className="
                      relative
                      z-10
                      max-h-[90px]
                      max-w-[180px]
                      object-contain
                      opacity-100
                    "
                  />

                </motion.div>

              )
            )}

          </motion.div>

        </div>

      </div>

    </section>
  );
}