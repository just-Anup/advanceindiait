"use client";

export default function AnnouncementBar() {
  const announcements = [
    "🎉 Welcome to ADVANCE INDIA IT",
    "📢 WE PROVIDE CUSTOMISE WEBISTE AT EFFORDABLE PRICE",
    "💰 WWW.ADVANCEINDIAIT.IN",
    "📚 NORNAL WEBISTE , MEDIAM WEBSITE . ADVANCE WEBSITE AVAILABLE",
    "🏆 Government Registered Institute ",
    "📞 Contact Us Today ",
  ];

  return (
    <>
      <div className="relative w-full overflow-hidden bg-gradient-to-r from-[#C9A24B] via-[#C9A24B] to-[#C9A24B] shadow-md border-y border-red-400">
        <div className="marquee py-3 hover:[animation-play-state:paused]">
          {[...announcements, ...announcements].map((item, index) => (
            <span
              key={index}
              className="mx-12 text-black font-bold text-[15px] md:text-[17px] tracking-wide whitespace-nowrap"
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      <style jsx>{`
        .marquee {
          display: flex;
          width: max-content;
          animation: marquee 100s linear infinite;
        }

        @keyframes marquee {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </>
  );
}