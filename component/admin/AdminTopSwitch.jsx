"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  Menu,
  X,
  LayoutDashboard,
  Image,
  FileText,
  Users,
  Wallet,
  HelpCircle,
  Megaphone,
  LogOut
} from "lucide-react";

import { account } from "@/lib/appwrite";

export default function AdminSidebar() {

  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await account.deleteSession("current");
      router.replace("/login");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {/* 🔥 MOBILE TOGGLE BUTTON */}
      <button
        onClick={() => setOpen(true)}
        className="fixed left-4 top-4 z-50 rounded-2xl border border-white/10 bg-[#0A1229]/90 p-3 text-[#C9A24B] shadow-[0_14px_40px_rgba(201,162,75,0.18)] backdrop-blur-2xl transition hover:border-[#C9A24B]/40 lg:hidden"
      >
        <Menu size={22} />
      </button>

      {/* 🔲 OVERLAY */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-[#0A1229]/80 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* 📌 SIDEBAR */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-72 overflow-hidden border-r border-white/10 bg-[#0A1229]/95 shadow-[0_30px_120px_rgba(201,162,75,0.14)] backdrop-blur-2xl
          transform ${open ? "translate-x-0" : "-translate-x-full"}
          transition duration-300 ease-in-out
          lg:translate-x-0
          flex flex-col
        `}
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

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#C9A24B_1px,transparent_1px)] bg-size-[56px_56px] opacity-[0.03]" />
        <div className="pointer-events-none absolute -top-24 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-[#C9A24B]/15 blur-[100px]" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-72 w-72 rounded-full bg-linear-to-r from-[#C9A24B]/15 to-transparent blur-[100px]" />

        {/* HEADER */}
        <div className="relative flex items-center justify-between border-b border-white/10 p-5">
          <h1 className="bnmi-font-display text-2xl font-black text-[#FBF9F4]">
            BNMI Admin
          </h1>

          {/* CLOSE BUTTON (mobile) */}
          <button
            onClick={() => setOpen(false)}
            className="rounded-xl border border-white/10 p-2 text-[#D5D8E3] transition hover:border-[#C9A24B]/35 hover:text-[#C9A24B] lg:hidden"
          >
            <X />
          </button>
        </div>

        {/* SWITCH BUTTON */}
        <div className="p-4">
          <Link
            href="/admin/website/navbar"
            className="bnmi-font-body block rounded-2xl border border-[#C9A24B]/30 bg-[#C9A24B]/10 py-3 text-center font-semibold text-[#C9A24B] shadow-[0_14px_40px_rgba(201,162,75,0.12)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#C9A24B]/60 hover:bg-[#C9A24B] hover:text-[#0A1229]"
          >
            Website Management
          </Link>
        </div>

        {/* MENU */}
        <nav className="relative flex-1 space-y-1 overflow-y-auto px-3">

          <MenuItem icon={<LayoutDashboard size={18} />} label="Dashboard" href="/admin/dashboard" pathname={pathname} />

          <MenuItem icon={<Users size={18} />} label="Franchise List" href="/admin/dashboard/franchise" pathname={pathname} />

          <MenuItem icon={<FileText size={18} />} label="Certificate List" href="/admin/dashboard/certificates" pathname={pathname} />

          <MenuItem icon={<Image size={18} />} label="Course Section" href="/admin/dashboard/course" pathname={pathname} />

          <MenuItem icon={<Image size={18} />} label="Single Course Section" href="/admin/dashboard/addsingleccourse" pathname={pathname} />

          <MenuItem icon={<Image size={18} />} label="Multiple Course Section" href="/admin/dashboard/multiple-courses" pathname={pathname} />


          <MenuItem icon={<Image size={18} />} label="Semester Course Section" href="/admin/dashboard/semester" pathname={pathname} />


          <MenuItem icon={<Image size={18} />} label="Beauty Course Section" href="/admin/dashboard/beauty-course" pathname={pathname} />

          <MenuItem icon={<FileText size={18} />} label="Upload Question Bank" href="/admin/dashboard/upload-questions" pathname={pathname} />
          <MenuItem icon={<FileText size={18} />} label="Upload Online Exam Questions" href="/admin/dashboard/upload-online-exam" pathname={pathname} />

          <MenuItem icon={<Wallet size={18} />} label="Wallet Recharge" href="/admin/dashboard/wallet" pathname={pathname} />

          <MenuItem icon={<Wallet size={18} />} label="Courier Wallet Recharge" href="/admin/dashboard/courier-wallet" pathname={pathname} />

          <MenuItem icon={<FileText size={18} />} label="View Installment" href="/admin/dashboard/installment" pathname={pathname} />

          <MenuItem icon={<Image size={18} />} label="Upload Image" href="/admin/dashboard/upload-image" pathname={pathname} />

          <MenuItem icon={<HelpCircle size={18} />} label="Helpdesk" href="/admin/dashboard/helpdesk" pathname={pathname} />

          <MenuItem icon={<Megaphone size={18} />} label="Marketing" href="/admin/dashboard/marketing-material" pathname={pathname} />

        </nav>

        {/* LOGOUT */}
        <div className="relative border-t border-white/10 p-4">
          <button
            onClick={handleLogout}
            className="bnmi-font-body flex w-full items-center justify-center gap-2 rounded-2xl border border-red-400/30 bg-red-500/10 py-3 font-semibold text-red-200 transition-all duration-300 hover:-translate-y-0.5 hover:border-red-300/50"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>

      </aside>
    </>
  );
}

/* 🔹 MENU ITEM */
function MenuItem({ icon, label, href, pathname }) {

  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`
        bnmi-font-body flex items-center gap-3 rounded-2xl border px-4 py-3 font-medium transition-all duration-300
        ${isActive
          ? "border-[#C9A24B] bg-[#C9A24B] text-[#0A1229] shadow-[0_14px_40px_rgba(201,162,75,0.18)]"
          : "border-transparent text-[#D5D8E3] hover:border-[#C9A24B]/35 hover:bg-white/5 hover:text-[#C9A24B]"}
      `}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}