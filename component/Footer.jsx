'use client'

import { useEffect, useRef, useState } from 'react'
import { databases } from '@/lib/appwrite'
import { Query } from 'appwrite'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import {
  faFacebookF,
  faInstagram,
  faYoutube,
  faLinkedinIn,
} from '@fortawesome/free-brands-svg-icons'

import {
  GraduationCap,
  MapPinned,
  Phone,
  Mail,
} from 'lucide-react'

import Link from 'next/link'

gsap.registerPlugin(ScrollTrigger)

const DATABASE_ID =
  process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID

const COLLECTION_ID = 'website'

export default function Footer() {

  const footerRef = useRef(null)

  const [data, setData] = useState(null)

  /* ================= FETCH ================= */

  useEffect(() => {

    const fetchData = async () => {

      try {

        if (!databases || !DATABASE_ID)
          return

        const res =
          await databases.listDocuments(
            DATABASE_ID,
            COLLECTION_ID,
            [Query.limit(1)]
          )

        if (res.documents.length) {

          setData(res.documents[0])

        }

      } catch (error) {

        console.error(
          'Footer fetch failed:',
          error
        )

      }
    }

    fetchData()

  }, [])

  /* ================= GSAP ================= */

  useEffect(() => {

    if (!footerRef.current) return

    gsap.fromTo(
      footerRef.current.querySelectorAll(
        '.footer-anim'
      ),
      {
        opacity: 0,
        y: 60,
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 85%',
        },
      }
    )

  }, [data])

  if (!data) return null

  return (
    <footer
      ref={footerRef}
      className="
        relative
        overflow-hidden
        bg-[#0A1229]
        text-[#FBF9F4]
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

      {/* BG GLOW */}

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

      {/* ================= MAIN ================= */}

      <div
        className="
          relative
          z-10
          max-w-7xl
          mx-auto
          px-6
          md:px-10
          py-24
          grid
          grid-cols-1
          md:grid-cols-2
          lg:grid-cols-5
          gap-14
        "
      >

        {/* ================= LOGO ================= */}

        <div className="footer-anim">

          {/* LOGO */}
          <div className="flex items-center gap-4">

            <div
              className="
                w-14
                h-14
                rounded-full
                bg-[#C9A24B]
                flex
                items-center
                justify-center
              "
            >
              <GraduationCap
                className="text-[#0A1229]"
                size={28}
              />
            </div>

            <div>

              <h2
                className="
                  bnmi-font-display
                  text-2xl
                  font-black
                  text-[#FBF9F4]
                "
              >
                AdvanceIndiaIT
              </h2>

              <p
                className="
                  text-[#C9A24B]
                  font-semibold
                  text-sm
                "
              >
                Franchise Provider
              </p>

            </div>

          </div>

          {/* ABOUT */}
          <p
            className="
              bnmi-font-body
              mt-8
              text-[#D5D8E3]
              leading-9
              text-[16px]
            "
          >
            {data.footerAboutText}
          </p>

          {/* SOCIAL */}
          <div className="flex gap-4 mt-8">

            {[
              faFacebookF,
              faInstagram,
              faYoutube,
              faLinkedinIn,
            ].map((icon, i) => (

              <a
                key={i}
                href="#"
                className="
                  w-14
                  h-14
                  rounded-full
                  bg-white/5
                  border
                  border-white/10
                  flex
                  items-center
                  justify-center
                  text-[#C9A24B]
                  hover:bg-[#C9A24B]
                  hover:text-[#0A1229]
                  hover:border-[#C9A24B]
                  transition-all
                  duration-300
                  shadow-sm
                "
              >

                <FontAwesomeIcon icon={icon} />

              </a>

            ))}

          </div>

        </div>

        {/* ================= ABOUT ================= */}

        <div className="footer-anim">

          <h3
            className="
              bnmi-font-display
              text-2xl
              font-black
              mb-8
              text-[#FBF9F4]
            "
          >
            About AdvanceindiaIT
          </h3>

          <ul
            className="
              bnmi-font-body
              space-y-5
              text-[#D5D8E3]
              font-medium
            "
          >

            <li className="hover:text-[#C9A24B] transition cursor-pointer">
              About Us
            </li>

            <li className="hover:text-[#C9A24B] transition cursor-pointer">
              Franchise Registration
            </li>

            <li className="hover:text-[#C9A24B] transition cursor-pointer">
              Become A Teacher
            </li>

            <li className="hover:text-[#C9A24B] transition cursor-pointer">
              All Institutes
            </li>

            <li className="hover:text-[#C9A24B] transition cursor-pointer">
              Contact Us
            </li>

          </ul>

        </div>

        {/* ================= COURSES ================= */}

        <div className="footer-anim">

          <h3
            className="
              bnmi-font-display
              text-2xl
              font-black
              mb-8
              text-[#FBF9F4]
            "
          >
            Popular Courses
          </h3>

          <ul
            className="
              bnmi-font-body
              space-y-5
              text-[#D5D8E3]
              font-medium
            "
          >

            <li className="hover:text-[#C9A24B] transition cursor-pointer">Development</li>
            <li className="hover:text-[#C9A24B] transition cursor-pointer">Arts & Design</li>
            <li className="hover:text-[#C9A24B] transition cursor-pointer">Visual Design</li>
            <li className="hover:text-[#C9A24B] transition cursor-pointer">Graphic Design</li>
            <li className="hover:text-[#C9A24B] transition cursor-pointer">Digital Marketing</li>

          </ul>

        </div>

        {/* ================= CONTACT ================= */}

        <div className="footer-anim">

          <h3
            className="
              bnmi-font-display
              text-2xl
              font-black
              mb-8
              text-[#FBF9F4]
            "
          >
            Contact Info
          </h3>

          <div className="bnmi-font-body space-y-8">

            {/* ADDRESS */}
            <div className="flex gap-4">

              <MapPinned
                className="
                  text-[#C9A24B]
                  shrink-0
                  mt-1
                "
              />

              <p
                className="
                  text-[#D5D8E3]
                  leading-8
                "
              >
                {data.footerAddress}
              </p>

            </div>

            {/* PHONE */}
            <div className="flex gap-4">

              <Phone
                className="
                  text-[#C9A24B]
                  shrink-0
                  mt-1
                "
              />

              <p
                className="
                  text-[#D5D8E3]
                "
              >
                {data.footerPhone}
              </p>

            </div>

            {/* EMAIL */}
            <div className="flex gap-4">

              <Mail
                className="
                  text-[#C9A24B]
                  shrink-0
                  mt-1
                "
              />

              <p
                className="
                  text-[#D5D8E3]
                "
              >
                {data.footerEmail}
              </p>

            </div>

          </div>

        </div>

        {/* ================= APP / BUTTON ================= */}

        <div className="footer-anim">

          <h3
            className="
              bnmi-font-display
              text-2xl
              font-black
              mb-8
              text-[#FBF9F4]
            "
          >
            Verification
          </h3>

          <p
            className="
              bnmi-font-body
              text-[#D5D8E3]
              leading-9
            "
          >
            Verify student certificates and
            institute records directly from
            our portal.
          </p>

          {/* BUTTON */}
          <Link href="/verify/verification">

            <button
              className="
                mt-8
                w-full
                bg-[#C9A24B]
                hover:bg-[#d4b05a]
                text-[#0A1229]
                py-5
                rounded-2xl
                font-bold
                transition-all
                duration-300
                shadow-[0_10px_30px_rgba(201,162,75,0.25)]
                hover:shadow-[0_15px_40px_rgba(201,162,75,0.35)]
              "
            >
              STUDENT VERIFICATION
            </button>

          </Link>

        </div>

      </div>

      {/* ================= COPYRIGHT ================= */}

      <div
        className="
          relative
          z-10
          border-t
          border-white/10
          py-7
          text-center
          text-[#D5D8E3]
          text-sm
          bnmi-font-body
        "
      >
        © Copyright 2026 BNMI. All Rights Reserved.
      </div>

    </footer>
  )
}