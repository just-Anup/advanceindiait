import { Star, Quote } from 'lucide-react'

export default function TestimonialCard({
  name,
  role,
  image,
  text,
}) {
  return (
    <div className="bnmi-font-body min-w-[420px] max-w-[420px] bg-[#0F1936] border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.35)] p-7 transition-all duration-300 hover:shadow-[0_25px_60px_rgba(201,162,75,0.12)] hover:border-[#C9A24B]/30 hover:-translate-y-1">

      {/* Top Row */}
      <div className="flex justify-between items-center mb-5">

        {/* Stars */}
        <div className="flex gap-1 text-[#C9A24B]">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={15} fill="#C9A24B" strokeWidth={0} />
          ))}
        </div>

        {/* Image */}
        {image && image !== '' && (
          <img
            src={image}
            alt={name || 'student'}
            className="w-14 h-14 rounded-full object-cover border-2 border-[#C9A24B]/40 shadow"
          />
        )}
      </div>

      {/* Text */}
      <div className="relative mb-7">
        <Quote
          size={34}
          className="absolute -top-2 -left-1 text-[#C9A24B]/15"
          fill="currentColor"
          strokeWidth={0}
        />

        <p className="relative text-[#C4CAE0] text-[15px] leading-relaxed pl-7">
          {text}
        </p>
      </div>

      {/* Name + Role */}
      <div className="border-t border-white/10 pt-4">
        <h3 className="bnmi-font-display text-lg font-semibold text-[#FBF9F4]">
          {name || 'Student Name'}
        </h3>
        <p className="text-sm text-[#C9A24B] font-medium mt-0.5">
          {role || 'Student'}
        </p>
      </div>
    </div>
  )
}