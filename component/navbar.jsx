'use client'

import { useEffect, useState } from 'react'
import { databases } from '@/lib/appwrite'
import Link from 'next/link'
import { Query } from 'appwrite'
import { Menu, X, ChevronDown, GraduationCap } from 'lucide-react'

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID
const WEBSITE_COLLECTION = 'website'

export default function Navbar() {
  const [navbarData, setNavbarData] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)

  /* ---------------- FETCH CMS DATA ---------------- */
  useEffect(() => {
    const fetchNavbar = async () => {
      try {
        if (!databases) return

        const res = await databases.listDocuments(
          DATABASE_ID,
          WEBSITE_COLLECTION,
          [Query.limit(1)]
        )

        if (res.documents.length) {
          setNavbarData(res.documents[0])
        }
      } catch (error) {
        console.error('Navbar CMS load failed:', error)
      }
    }

    fetchNavbar()
  }, [])

  return (

<header className="bnmi-font-body fixed top-0 left-0 w-full z-50">

  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap');

    .bnmi-font-display{
      font-family:'Playfair Display',Georgia,serif;
    }

    .bnmi-font-body{
      font-family:'Inter',system-ui,sans-serif;
    }

    .navbar-glass{
      background:rgba(10,18,41,.92);
      backdrop-filter:blur(22px);
      border-bottom:1px solid rgba(255,255,255,.08);
    }

    .gold-hover{
      transition:all .35s ease;
    }

    .gold-hover:hover{
      color:#C9A24B;
    }

    .nav-btn{
      transition:all .35s ease;
    }

    .nav-btn:hover{
      transform:translateY(-2px);
      box-shadow:0 12px 30px rgba(201,162,75,.25);
    }

    .logo-hover{
      transition:transform .35s ease;
    }

    .logo-hover:hover{
      transform:scale(1.05);
    }

    @media(prefers-reduced-motion:reduce){
      .gold-hover,
      .nav-btn,
      .logo-hover{
        transition:none!important;
      }
    }
  `}</style>

  {/* GOLD GLOW */}

  <div
    className="absolute inset-x-0 top-0 h-24 pointer-events-none opacity-20"
    style={{
      background:
        "radial-gradient(circle at top,#C9A24B 0%,transparent 70%)",
    }}
  />

  <div className="navbar-glass">

    {/* ================= TOP BAR START ================= */}

    <div className="border-b border-[#C9A24B]/15">

  <div className="max-w-7xl mx-auto px-8 py-5">

    <div className="flex items-center justify-between">

      {/* ================= LEFT LOGO ================= */}

      <div className="flex items-center gap-4 logo-hover">

        {navbarData?.logoUrl ? (

          <img
            src={navbarData.logoUrl}
            alt="Logo"
            className="h-20 w-auto object-contain"
          />

        ) : (

          <div
            className="
              w-20
              h-20
              rounded-full
              border
              border-[#C9A24B]/25
              bg-white/5
              backdrop-blur-xl
              flex
              items-center
              justify-center
            "
          >
            <GraduationCap
              size={40}
              className="text-[#C9A24B]"
            />
          </div>

        )}

      </div>

      {/* ================= CENTER ================= */}

      <div className="text-center px-6">

        <span
          className="
            block
            uppercase
            tracking-[0.35em]
            text-[11px]
            text-[#C9A24B]
            mb-3
          "
        >
          Excellence • Innovation • Success
        </span>

        <h1
          className="
            bnmi-font-display
            text-[#FBF9F4]
            text-3xl
            md:text-4xl
            lg:text-5xl
            font-bold
            leading-tight
          "
        >
          {navbarData?.topBarText || "ADVANCE INDIA IT"}
        </h1>

      </div>

      {/* ================= RIGHT LOGO ================= */}

      <div className="flex items-center gap-4 logo-hover">

        {navbarData?.logoUrl ? (

          <img
            src={navbarData.logoUrl}
            alt="Logo"
            className="h-20 w-auto object-contain"
          />

        ) : (

          <div
            className="
              w-20
              h-20
              rounded-full
              border
              border-[#C9A24B]/25
              bg-white/5
              backdrop-blur-xl
              flex
              items-center
              justify-center
            "
          >
            <GraduationCap
              size={40}
              className="text-[#C9A24B]"
            />
          </div>

        )}

      </div>

    </div>

  </div>

</div>

{/* ================= MENU BAR START ================= */}
<div className="border-b border-white/5">

  <div className="max-w-7xl mx-auto px-8">

    <div className="h-[78px] flex items-center justify-between">

      {/* ================= NAVIGATION ================= */}

      <nav className="hidden lg:flex items-center gap-10">

        <NavItem title="HOME" href="/" />
        <NavItem title="ABOUT" href="/aboutus" />
        <NavItem title="COURSES" href="/#courses" />
        <NavItem title="CERTIFICATION" href="/certificate-demo" />
        <NavItem title="VERIFICATION" href="/verify/verification" />
        <NavItem title="FRANCHISE" href="/franchise/signup" />
        <NavItem title="CONTACT" href="/contact" />

      </nav>

      {/* ================= RIGHT SIDE ================= */}

      <div className="hidden lg:flex items-center gap-5">

        {/* LOGIN */}

        <Link
          href="/login/institute"
          className="
            gold-hover
            text-[#FBF9F4]
            font-medium
            tracking-wide
          "
        >
          Login
        </Link>

        {/* STUDENT LOGIN */}

        <Link href="/student/login">

          <button
            className="
              nav-btn
              px-7
              py-3
              rounded-full
              border
              border-[#C9A24B]
              bg-[#C9A24B]
              text-[#0A1229]
              font-semibold
              hover:bg-transparent
              hover:text-[#C9A24B]
              transition-all
              duration-300
            "
          >
            Student Login
          </button>

        </Link>

      </div>

      {/* ================= MOBILE MENU BUTTON ================= */}

      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="
          lg:hidden
          w-12
          h-12
          rounded-xl
          border
          border-[#C9A24B]/30
          bg-white/5
          backdrop-blur-xl
          flex
          items-center
          justify-center
          text-[#C9A24B]
          hover:bg-[#C9A24B]/10
          transition-all
          duration-300
        "
      >

        {menuOpen ? (
          <X size={24} />
        ) : (
          <Menu size={24} />
        )}

      </button>

    </div>

  </div>

</div>



{/* ================= MOBILE MENU START ================= */}

{menuOpen && (

  <div
    className="
      lg:hidden
      bg-[#0A1229]/95
      backdrop-blur-2xl
      border-t
      border-[#C9A24B]/15
      shadow-2xl
    "
  >

    <div className="px-6 py-8 flex flex-col">

      {/* MENU ITEMS */}

      <div className="flex flex-col">

        <MobileNav href="/" title="HOME" />
        <MobileNav href="/aboutus" title="ABOUT" />
        <MobileNav href="/#courses" title="COURSES" />
        <MobileNav href="/certificate-demo" title="CERTIFICATION" />
        <MobileNav href="/verify/verification" title="VERIFICATION" />
        <MobileNav href="/franchise/signup" title="FRANCHISE FORM" />
        <MobileNav href="/contact" title="CONTACT" />

      </div>

      {/* GOLD DIVIDER */}

      <div className="my-8 h-px bg-gradient-to-r from-transparent via-[#C9A24B]/50 to-transparent" />

      {/* LOGIN BUTTONS */}

      <div className="flex flex-col gap-4">

        {/* INSTITUTE LOGIN */}

        <Link
          href="/login/institute"
          className="
            w-full
            text-center
            py-3.5
            rounded-xl
            border
            border-white/10
            bg-white/5
            backdrop-blur-xl
            text-[#FBF9F4]
            font-medium
            hover:border-[#C9A24B]/40
            hover:text-[#C9A24B]
            transition-all
            duration-300
          "
          onClick={() => setMenuOpen(false)}
        >
          Institute Login
        </Link>

        {/* STUDENT LOGIN */}

        <Link
          href="/student/login"
          onClick={() => setMenuOpen(false)}
        >

          <button
            className="
              w-full
              py-3.5
              rounded-xl
              bg-[#C9A24B]
              text-[#0A1229]
              font-semibold
              hover:bg-[#d6b15a]
              transition-all
              duration-300
              shadow-[0_12px_35px_rgba(201,162,75,.25)]
            "
          >
            Student Login
          </button>

        </Link>

      </div>

      {/* FOOTER TEXT */}

      <div className="mt-8 text-center">

        <p className="text-xs tracking-[0.25em] uppercase text-[#C9A24B]/80">
          Excellence • Innovation • Success
        </p>

      </div>

    </div>

  </div>

)}

</div>

</header>

  )
}
/* ================= NAV ITEM ================= */

function NavItem({ title, href }) {
  return (
    <Link
      href={href}
      className="
        relative
        group
        text-[15px]
        font-medium
        tracking-[0.12em]
        uppercase
        text-[#FBF9F4]
        transition-all
        duration-300
      "
    >
      <span className="group-hover:text-[#C9A24B] transition-colors duration-300">
        {title}
      </span>

      <span
        className="
          absolute
          left-0
          -bottom-2
          h-[2px]
          w-0
          bg-[#C9A24B]
          transition-all
          duration-300
          group-hover:w-full
        "
      />
    </Link>
  )
}

/* ================= DROPDOWN ================= */

function NavDropdown({ title, href }) {
  return (
    <Link
      href={href}
      className="
        relative
        group
        flex
        items-center
        gap-2
        text-[15px]
        uppercase
        tracking-[0.12em]
        text-[#FBF9F4]
        transition-all
        duration-300
      "
    >
      <span className="group-hover:text-[#C9A24B] transition-colors duration-300">
        {title}
      </span>

      <ChevronDown
        size={16}
        className="transition-transform duration-300 group-hover:rotate-180 group-hover:text-[#C9A24B]"
      />

      <span
        className="
          absolute
          left-0
          -bottom-2
          h-[2px]
          w-0
          bg-[#C9A24B]
          transition-all
          duration-300
          group-hover:w-full
        "
      />
    </Link>
  )
}

/* ================= MOBILE NAV ================= */

function MobileNav({ title, href }) {
  return (
    <Link
      href={href}
      className="
        group
        flex
        items-center
        justify-between
        py-4
        border-b
        border-white/5
        text-[#FBF9F4]
        uppercase
        tracking-[0.15em]
        text-[14px]
        font-medium
        transition-all
        duration-300
      "
    >
      <span className="group-hover:text-[#C9A24B] transition-colors duration-300">
        {title}
      </span>

      <span
        className="
          w-8
          h-8
          rounded-full
          border
          border-[#C9A24B]/25
          flex
          items-center
          justify-center
          text-[#C9A24B]
          opacity-0
          -translate-x-2
          group-hover:opacity-100
          group-hover:translate-x-0
          transition-all
          duration-300
        "
      >
        →
      </span>
    </Link>
  )
}
