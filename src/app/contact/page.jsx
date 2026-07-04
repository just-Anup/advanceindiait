'use client'

import { Phone, MessageCircle, Instagram, Facebook } from 'lucide-react'
import { motion } from 'framer-motion'

export default function HelpDeskPage() {

  const contacts = [
    {
      title: 'Call Support',
      desc: '+91 8011211185',
      icon: Phone,
      action: () => window.open('tel:+918011211185')
    },
    {
      title: 'WhatsApp Support',
      desc: 'Chat instantly on WhatsApp',
      icon: MessageCircle,
      action: () => window.open('https://wa.me/918011211185')
    },
    {
      title: 'Instagram',
      desc: '@yourpage',
      icon: Instagram,
      action: () => window.open('https://www.instagram.com/bnmiindia?igsh=YTdyMHJrajV4ZzZn&utm_source=qr')
    },
    {
      title: 'Facebook',
      desc: 'Your Page',
      icon: Facebook,
      action: () => window.open('https://www.facebook.com/share/1AVYsNJM1i/?mibextid=wwXIfr')
    }
  ]

  return (
    <div className="min-h-screen bg-[#0A1229] relative overflow-hidden p-6 md:p-12">

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

      <div className="max-w-6xl mx-auto relative z-10">

        {/* Header */}
        <div className="mb-16">
          <h1 className="bnmi-font-display text-5xl md:text-6xl font-black mb-4 text-[#FBF9F4]">
            Contact Support
          </h1>
          <p className="bnmi-font-body text-lg text-[#D5D8E3] max-w-3xl">
            Get in touch with us through any of these channels. We're here to help you succeed.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-6">

          {contacts.map((item, index) => {
            const Icon = item.icon

            return (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                onClick={item.action}
                className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 cursor-pointer transition-all duration-300 hover:border-[#C9A24B]/30 shadow-[0_10px_60px_rgba(201,162,75,0.08)] hover:shadow-[0_15px_80px_rgba(201,162,75,0.15)]"
              >
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-[#C9A24B]/10 border border-[#C9A24B]/20 flex items-center justify-center group-hover:bg-[#C9A24B]/20 transition-all duration-300">
                    <Icon className="text-[#C9A24B] group-hover:scale-110 transition-transform duration-300" size={28} />
                  </div>

                  <div className="flex-1">
                    <h2 className="bnmi-font-display text-2xl font-bold mb-2 text-[#FBF9F4] group-hover:text-[#C9A24B] transition duration-300">{item.title}</h2>
                    <p className="bnmi-font-body text-[#D5D8E3]">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            )
          })}

        </div>

      </div>
    </div>
  )
}