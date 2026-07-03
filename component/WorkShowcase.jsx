"use client"

import { useEffect, useState } from "react"
import { databases } from "@/lib/appwrite"
import { useRouter } from "next/navigation"
import { Query } from "appwrite"
import { ArrowUpRight } from "lucide-react"

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID
const COLLECTION = "course_categories"
const BUCKET_ID = "6a44e849001ad5b7cc0b" // change if your bucket id is different

export default function WorkShowcase() {

  const [categories, setCategories] = useState([])
  const router = useRouter()

  useEffect(() => {
    loadCategories()
  }, [])

const loadCategories = async () => {
  try {

    if (!databases || !DATABASE_ID) return   // FIX

    const res = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION,
      [Query.orderAsc("$createdAt")]
    )

    setCategories(res.documents)

  } catch (error) {
    console.error("Categories load failed:", error)
  }
}

  const getImage = (imageId) => {

    if (!imageId) return ""

    return `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${imageId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`

  }

  return (

    <section className="bnmi-font-body relative py-28 bg-[#0A1229] overflow-hidden">

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap');
        .bnmi-font-display { font-family: 'Playfair Display', Georgia, serif; }
        .bnmi-font-body { font-family: 'Inter', system-ui, sans-serif; }

        @keyframes bnmi-fade-up {
          from { opacity: 0; transform: translateY(28px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .bnmi-showcase-card {
          animation: bnmi-fade-up 0.7s cubic-bezier(0.2,0.9,0.3,1) both;
        }
        .bnmi-showcase-img {
          transition: transform 0.6s cubic-bezier(0.2,0.9,0.3,1);
        }
        .bnmi-showcase-card:hover .bnmi-showcase-img {
          transform: scale(1.06);
        }
        .bnmi-showcase-overlay {
          transition: opacity 0.5s ease;
        }
        .bnmi-showcase-arrow {
          transition: transform 0.4s cubic-bezier(0.2,0.9,0.3,1), opacity 0.4s ease;
        }
        @media (prefers-reduced-motion: reduce) {
          .bnmi-showcase-card { animation: none !important; opacity: 1; }
          .bnmi-showcase-img { transition: none; }
        }
      `}</style>

      {/* AMBIENT GLOW */}
      <div
        className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-[0.1] blur-[150px] pointer-events-none"
        style={{ background: "radial-gradient(circle, #C9A24B, transparent 70%)" }}
      />

      {/* FAINT GRID TEXTURE */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#C9A24B 1px, transparent 1px), linear-gradient(90deg, #C9A24B 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-8">

        {/* HEADING */}

        <div className="text-center mb-16">

          <span className="inline-block text-[11px] uppercase tracking-[0.28em] text-[#C9A24B] font-medium mb-5">
            Latest Work
          </span>

          <h2 className="bnmi-font-display text-4xl md:text-6xl font-bold text-[#FBF9F4] leading-tight">
            Project & Course <br />
            <span className="text-[#C9A24B]">Showcase</span>
          </h2>

        </div>

        {/* GRID */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          {categories.map((item, index) => (

            <div
              key={item.$id}
              onClick={() => router.push(`/courses/${item.slug}`)}
              className="bnmi-showcase-card group relative overflow-hidden rounded-lg cursor-pointer border border-white/10 hover:border-[#C9A24B]/30 transition-colors duration-500"
              style={{ animationDelay: `${index * 0.08}s` }}
            >

              <div className="relative w-full aspect-[4/3] overflow-hidden bg-[#0F1936]">
                <img
                  src={getImage(item.imageId)}
                  alt={item.name}
                  className="bnmi-showcase-img w-full h-full object-cover"
                />

                {/* PERMANENT BOTTOM GRADIENT */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A1229] via-[#0A1229]/20 to-transparent" />
              </div>

              {/* HOVER OVERLAY */}
              <div
                className="bnmi-showcase-overlay absolute inset-0 bg-[#0A1229]/70 backdrop-blur-[2px]
                opacity-0 group-hover:opacity-100"
              >

                <div className="absolute top-6 right-6 w-12 h-12 rounded-full border border-[#C9A24B]/40 bg-[#0A1229]/60 flex items-center justify-center
                  bnmi-showcase-arrow opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0">
                  <ArrowUpRight size={20} className="text-[#C9A24B]" />
                </div>

                <div className="absolute bottom-8 left-8 right-8">

                  <h4 className="bnmi-font-display font-bold text-xl tracking-wide text-[#FBF9F4]">
                    {item.name}
                  </h4>

                  <p className="text-[#C9A24B] text-sm mt-2">
                    {item.subtitle}
                  </p>

                </div>

              </div>

              {/* ALWAYS-VISIBLE LABEL (fallback when not hovered) */}
              <div className="absolute bottom-6 left-6 right-6 group-hover:opacity-0 transition-opacity duration-300">
                <h4 className="bnmi-font-display font-semibold text-lg text-[#FBF9F4]">
                  {item.name}
                </h4>
              </div>

            </div>

          ))}

        </div>

      </div>

    </section>

  )

}