"use client";

import { useRouter } from "next/navigation";

export default function AdminSelect() {

  const router = useRouter();

  const cards = [
    {
      title: "Website Management",
      description:
        "Manage homepage, banners, content, and premium UI sections.",
      image:
        "https://images.unsplash.com/photo-1559028012-481c04fa702d",
      route: "/admin/website",
      label: "Content Panel",
    },
    {
      title: "Admin Management",
      description:
        "Manage users, dashboards, reports, and system control.",
      image:
        "https://images.unsplash.com/photo-1551836022-d5d88e9218df",
      route: "/admin/dashboard",
      label: "Control Panel",
    },
  ];

  return (

    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0A1229] px-4 py-16">

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap');

        .bnmi-font-display {
          font-family: 'Playfair Display', Georgia, serif;
        }

        .bnmi-font-body {
          font-family: 'Inter', system-ui, sans-serif;
        }
      `}</style>

      <div className="absolute inset-0 bg-[radial-gradient(#C9A24B_1px,transparent_1px)] bg-size-[70px_70px] opacity-[0.03]" />
      <div className="absolute -top-24 left-1/2 h-162.5 w-162.5 -translate-x-1/2 rounded-full bg-[#C9A24B]/15 blur-[170px]" />
      <div className="absolute bottom-0 left-0 h-120 w-120 rounded-full bg-linear-to-r from-[#C9A24B]/20 to-transparent blur-[140px]" />
      <div className="absolute right-0 top-1/3 h-110 w-110 rounded-full bg-linear-to-l from-[#C9A24B]/15 to-transparent blur-[140px]" />

      <div className="relative z-10 w-full max-w-6xl">

        <div className="mb-12 text-center">
          <div className="bnmi-font-body mb-5 inline-flex rounded-full border border-[#C9A24B]/30 bg-[#C9A24B]/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#C9A24B]">
            Admin Console
          </div>

          <h1 className="bnmi-font-display text-4xl font-black leading-tight text-[#FBF9F4] md:text-6xl">
            BNMI Administration
          </h1>

          <p className="bnmi-font-body mx-auto mt-5 max-w-2xl text-base leading-8 text-[#D5D8E3] md:text-lg">
            Select a secure management area to control website content, users, reports, and system operations.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">

          {cards.map((card) => (
            <button
              key={card.title}
              type="button"
              onClick={() => router.push(card.route)}
              className="group relative overflow-hidden rounded-[40px] border border-white/10 bg-white/5 text-left shadow-[0_30px_120px_rgba(201,162,75,0.10)] backdrop-blur-2xl transition-all duration-300 hover:-translate-y-2 hover:border-[#C9A24B]/35 hover:shadow-[0_35px_130px_rgba(201,162,75,0.16)]"
            >
              <div className="absolute inset-0 bg-linear-to-br from-white/10 via-transparent to-[#C9A24B]/10 opacity-70" />

              <div className="relative h-64 overflow-hidden">
                <img
                  src={card.image}
                  alt={card.title}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#0A1229] via-[#0A1229]/40 to-transparent" />
                <div className="absolute left-6 top-6 rounded-full border border-[#C9A24B]/30 bg-[#0A1229]/50 px-4 py-2 backdrop-blur-xl">
                  <span className="bnmi-font-body text-xs font-semibold uppercase tracking-[0.2em] text-[#C9A24B]">
                    {card.label}
                  </span>
                </div>
              </div>

              <div className="relative p-8">
                <h2 className="bnmi-font-display mb-4 text-3xl font-black text-[#FBF9F4]">
                  {card.title}
                </h2>

                <p className="bnmi-font-body min-h-14 text-base leading-7 text-[#D5D8E3]">
                  {card.description}
                </p>

                <div className="mt-8 inline-flex items-center rounded-2xl bg-[#C9A24B] px-6 py-3 text-sm font-bold uppercase tracking-[0.14em] text-[#0A1229] shadow-[0_14px_40px_rgba(201,162,75,0.25)] transition-all duration-300 group-hover:bg-[#d4b05a] group-hover:shadow-[0_18px_50px_rgba(201,162,75,0.35)]">
                  Enter Panel →
                </div>
              </div>
            </button>
          ))}

        </div>

      </div>

    </section>

  );
}