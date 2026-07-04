'use client'

import Link from 'next/link'

export default function AddCourseHome() {
    return (
        <div className="min-h-screen bg-[#0A1229] text-[#FBF9F4] px-4 md:px-8 py-16 md:py-28 relative overflow-hidden">
            {/* Subtle grid texture + ambient glow */}
            <div className="pointer-events-none absolute inset-0 opacity-30" style={{ backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
            <div className="pointer-events-none absolute -top-24 -left-24 w-80 h-80 bg-[#C9A24B]/25 blur-3xl rounded-full" />
            <div className="pointer-events-none absolute top-1/3 -right-24 w-96 h-96 bg-[#C9A24B]/15 blur-3xl rounded-full" />

            <div className="relative mx-auto max-w-6xl bg-white/5 backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-[0_0_60px_rgba(201,162,75,0.10)] border border-white/10">
                <h1 className="text-3xl sm:text-4xl font-bold mb-10 font-[Playfair_Display] tracking-wide">
                    Course Management
                </h1>

                <div className="grid md:grid-cols-3 gap-6">
                    <NavBtn label="List Course With Single Subject" href="/login/institute/add-course/single/list" />
                    <NavBtn label="Add Course With Single Subject" href="/login/institute/add-course/single/add" />
                    <NavBtn label="List Course With Multiple Subject" href="/login/institute/add-course/multiple/list" />
                    <NavBtn label="Add Course With Multiple Subject" href="/login/institute/add-course/multiple/add" />
                    <NavBtn label="List Beauty Course" href="/login/institute/add-course/beauty/list" />
                    <NavBtn label="Add Beauty Course" href="/login/institute/add-course/beauty/add" />
                    <NavBtn label="Semester Course List" href="/login/institute/add-course/semester-course/list" />
                    <NavBtn label="Add Semester Course" href="/login/institute/add-course/semester-course" />
                    <NavBtn label="Internship Certificate" href="/login/institute/add-course/internship/add" />
                    <NavBtn label="Internship Certificate list view" href="/login/institute/add-course/internship/list" />
                    <NavBtn label="Instant Certificate Beauty" href="/login/institute/add-course/beauty_certificate/add" />
                    <NavBtn label="Instant Certificate Beauty list view" href="/login/institute/add-course/beauty_certificate/list" />
                </div>
            </div>
        </div>
    )
}

function NavBtn({ label, href }) {
    return (
        <Link
            href={href}
            className="group relative overflow-hidden rounded-xl px-6 py-4 text-center border border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-300 hover:border-[#C9A24B]/70 hover:shadow-[0_0_24px_rgba(201,162,75,0.20)]"
        >
            {/* gradient overlay */}
            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-[#C9A24B]/20 via-transparent to-transparent" />
            <span className="relative text-[#FBF9F4] font-semibold tracking-wide group-hover:text-[#FBF9F4] transition-colors duration-300">
                {label}
            </span>
        </Link>
    )
}
