'use client'

import { useEffect, useState } from 'react'
import { databases } from '@/lib/appwrite'
import Link from 'next/link'
import { Query } from 'appwrite'
import { Menu, X, ChevronDown } from 'lucide-react'

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID
const WEBSITE_COLLECTION = 'website'

export default function Navbar() {
  const [navbarData, setNavbarData] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)

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
    setMounted(true)
  }, [])

  /* ---------------- SCROLL LISTENER ---------------- */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* ---------------- LOCK BODY SCROLL ON MOBILE MENU ---------------- */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap');

        .bnmi-font-display { font-family: 'Playfair Display', Georgia, serif; }
        .bnmi-font-body { font-family: 'Inter', system-ui, sans-serif; }

        @keyframes bnmi-fade-down {
          from { opacity: 0; transform: translateY(-14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bnmi-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes bnmi-scale-in {
          from { opacity: 0; transform: scale(0.94); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes bnmi-sheen {
          0% { transform: translateX(-120%) skewX(-15deg); }
          100% { transform: translateX(220%) skewX(-15deg); }
        }
        @keyframes bnmi-slide-in {
          from { opacity: 0; transform: translateX(24px); }
          to { opacity: 1; transform: translateX(0); }
        }

        .bnmi-nav-item {
          position: relative;
          padding-bottom: 4px;
        }
        .bnmi-nav-item::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: 0;
          width: 0%;
          height: 1.5px;
          background: #C9A24B;
          transition: width 0.35s cubic-bezier(0.65, 0, 0.35, 1);
        }
        .bnmi-nav-item:hover::after {
          width: 100%;
        }

        .bnmi-cta {
          position: relative;
          overflow: hidden;
        }
        .bnmi-cta::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 40%;
          height: 100%;
          background: linear-gradient(120deg, transparent, rgba(255,255,255,0.35), transparent);
          transform: translateX(-120%) skewX(-15deg);
        }
        .bnmi-cta:hover::before {
          animation: bnmi-sheen 0.9s ease;
        }

        @media (prefers-reduced-motion: reduce) {
          .bnmi-nav-item::after { transition: none; }
          .bnmi-cta::before { animation: none !important; }
        }
      `}</style>

      <header
        className={`bnmi-font-body fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-[#0A1229]/95 backdrop-blur-md shadow-[0_4px_30px_rgba(10,18,41,0.25)] py-3'
            : 'bg-[#0A1229] py-5'
        }`}
        style={{
          borderBottom: '1px solid rgba(201,162,75,0.18)',
        }}
      >
        <div className="max-w-[1800px] mx-auto px-6 lg:px-16">
          <div className="flex items-center justify-between">

            {/* ================= LOGO / SEAL ================= */}
            <Link
              href="/"
              className="flex items-center gap-3 group"
              style={mounted ? { animation: 'bnmi-fade-down 0.7s cubic-bezier(0.2,0.9,0.3,1) both' } : { opacity: 0 }}
            >
              {navbarData?.logoUrl ? (
                <img
                  src={navbarData.logoUrl}
                  alt="logo"
                  className={`object-contain transition-all duration-500 ${scrolled ? 'h-12' : 'h-16'}`}
                />
              ) : (
                <>
                  <div
                    className={`relative flex items-center justify-center rounded-full border transition-all duration-500 ${
                      scrolled ? 'w-10 h-10' : 'w-12 h-12'
                    }`}
                    style={{
                      borderColor: '#C9A24B',
                      background: 'radial-gradient(circle at 30% 30%, #16204A, #0A1229)',
                    }}
                  >
                    <span
                      className="bnmi-font-display text-[#C9A24B] font-bold"
                      style={{ fontSize: scrolled ? '15px' : '18px' }}
                    >
                      B
                    </span>
                    <span
                      className="absolute inset-0 rounded-full border transition-all duration-500 group-hover:scale-125 group-hover:opacity-0"
                      style={{ borderColor: '#C9A24B', opacity: 0.5 }}
                    />
                  </div>

                  <div className="flex flex-col leading-none">
                    <h1
                      className={`bnmi-font-display font-bold text-[#FBF9F4] tracking-tight transition-all duration-500 ${
                        scrolled ? 'text-[22px]' : 'text-[28px]'
                      }`}
                    >
                      {navbarData?.siteName || 'BNMI India'}
                    </h1>
                    <span className="text-[10px] uppercase tracking-[0.28em] text-[#C9A24B] font-medium mt-1">
                      Accredited &middot; Est. Excellence
                    </span>
                  </div>
                </>
              )}
            </Link>

            {/* ================= DESKTOP MENU ================= */}
            <nav className="hidden lg:flex items-center gap-9">
              {[
                { title: 'Home', href: '/' },
                { title: 'About', href: '/aboutus' },
                { title: 'Course', href: '/#courses', dropdown: true },
                { title: 'Certification', href: '/certificate-demo', dropdown: true },
                { title: 'Verification', href: '/verify/verification', dropdown: true },
                { title: 'Franchise Form', href: '/franchise/signup' },
              ].map((item, i) => (
                <div
                  key={item.title}
                  style={mounted ? { animation: `bnmi-fade-down 0.6s cubic-bezier(0.2,0.9,0.3,1) both`, animationDelay: `${0.08 * i}s` } : { opacity: 0 }}
                >
                  {item.dropdown ? (
                    <NavDropdown title={item.title} href={item.href} />
                  ) : (
                    <NavItem title={item.title} href={item.href} />
                  )}
                </div>
              ))}
            </nav>

            {/* ================= RIGHT BUTTONS ================= */}
            <div
              className="hidden lg:flex items-center gap-7"
              style={mounted ? { animation: 'bnmi-fade-down 0.7s cubic-bezier(0.2,0.9,0.3,1) both', animationDelay: '0.4s' } : { opacity: 0 }}
            >
              <Link
                href="/login/institute"
                className="bnmi-nav-item text-[#EDE7D9] font-medium text-[15px] tracking-wide hover:text-[#C9A24B] transition-colors duration-300"
              >
                Institute Login
              </Link>

              <Link href="/student/login">
                <button
                  className="bnmi-cta bg-[#C9A24B] hover:bg-[#D9B564] text-[#0A1229] font-semibold text-[14px] tracking-wide px-7 py-3 rounded-sm transition-all duration-300 shadow-[0_4px_18px_rgba(201,162,75,0.3)] hover:shadow-[0_6px_24px_rgba(201,162,75,0.45)] hover:-translate-y-0.5"
                >
                  Student Login
                </button>
              </Link>
            </div>

            {/* ================= MOBILE BUTTON ================= */}
            <button
              className="lg:hidden text-[#FBF9F4] relative z-[60]"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <span className="relative block w-7 h-7">
                <Menu
                  size={28}
                  className={`absolute inset-0 transition-all duration-300 ${menuOpen ? 'opacity-0 rotate-90 scale-75' : 'opacity-100 rotate-0 scale-100'}`}
                />
                <X
                  size={28}
                  className={`absolute inset-0 transition-all duration-300 ${menuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-75'}`}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* ================= MOBILE MENU OVERLAY ================= */}
      {menuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-[#0A1229]/60 backdrop-blur-sm"
          style={{ animation: 'bnmi-fade-in 0.3s ease both' }}
          onClick={() => setMenuOpen(false)}
        />
      )}

      <div
        className={`lg:hidden fixed top-0 right-0 h-full w-[82%] max-w-[360px] z-50 bg-[#0F1936] border-l border-[#C9A24B]/20 shadow-[-10px_0_40px_rgba(0,0,0,0.4)] transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full pt-28 px-8 pb-10 bnmi-font-body">
          <nav className="flex flex-col gap-1">
            {[
              { title: 'Home', href: '/' },
              { title: 'About', href: '/aboutus' },
              { title: 'Course', href: '/#courses' },
              { title: 'Certification', href: '/certificate-demo' },
              { title: 'Verification', href: '/verify/verification' },
              { title: 'Contact', href: '/contact' },
            ].map((item, i) => (
              <MobileNav
                key={item.title}
                href={item.href}
                title={item.title}
                delay={i * 0.06}
                open={menuOpen}
                onClick={() => setMenuOpen(false)}
              />
            ))}
          </nav>

          <div className="border-t border-[#C9A24B]/15 mt-8 pt-8 flex flex-col gap-4">
            <Link
              href="/login/institute"
              onClick={() => setMenuOpen(false)}
              className="w-full border border-[#C9A24B]/50 text-[#EDE7D9] text-center py-3.5 font-medium tracking-wide rounded-sm hover:bg-[#C9A24B]/10 transition-colors duration-300"
              style={menuOpen ? { animation: 'bnmi-slide-in 0.5s cubic-bezier(0.2,0.9,0.3,1) both', animationDelay: '0.4s' } : {}}
            >
              Institute Login
            </Link>

            <Link href="/student/login" onClick={() => setMenuOpen(false)}>
              <button
                className="w-full bg-[#C9A24B] text-[#0A1229] py-3.5 font-semibold tracking-wide rounded-sm shadow-[0_4px_18px_rgba(201,162,75,0.3)]"
                style={menuOpen ? { animation: 'bnmi-slide-in 0.5s cubic-bezier(0.2,0.9,0.3,1) both', animationDelay: '0.48s' } : {}}
              >
                Student Login
              </button>
            </Link>
          </div>

          <p className="mt-auto text-[11px] uppercase tracking-[0.2em] text-[#5B6478]">
            Accredited &middot; Est. Excellence
          </p>
        </div>
      </div>
    </>
  )
}

/* ================= NAV ITEM ================= */
function NavItem({ title, href }) {
  return (
    <Link
      href={href}
      className="bnmi-nav-item text-[#EDE7D9] font-medium text-[15px] tracking-wide hover:text-[#C9A24B] transition-colors duration-300"
    >
      {title}
    </Link>
  )
}

/* ================= DROPDOWN STYLE ITEM ================= */
function NavDropdown({ title, href }) {
  return (
    <Link
      href={href}
      className="bnmi-nav-item flex items-center gap-1 text-[#EDE7D9] font-medium text-[15px] tracking-wide hover:text-[#C9A24B] transition-colors duration-300 group"
    >
      {title}
      <ChevronDown size={15} strokeWidth={2.25} className="transition-transform duration-300 group-hover:rotate-180 group-hover:text-[#C9A24B]" />
    </Link>
  )
}

/* ================= MOBILE NAV ================= */
function MobileNav({ title, href, delay = 0, open, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="text-[#EDE7D9] font-medium text-[17px] border-b border-white/5 py-4 hover:text-[#C9A24B] transition-colors duration-300"
      style={open ? { animation: 'bnmi-slide-in 0.5s cubic-bezier(0.2,0.9,0.3,1) both', animationDelay: `${delay}s` } : { opacity: 0 }}
    >
      {title}
    </Link>
  )
}