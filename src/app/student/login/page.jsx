"use client";

import { useState } from "react";
import { databases } from "@/lib/appwrite";
import { Query } from "appwrite";
import { useRouter } from "next/navigation";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const COLLECTION_ID = "student_admissions";

export default function StudentLogin() {
  const router = useRouter();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const inputUsername = form.username.trim().toLowerCase();
      const inputPassword = String(form.password).trim();

      // 🔍 Fetch matching usernames first
      const res = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID,
        [Query.equal("username", form.username.trim())]
      );

      console.log("INPUT:", inputUsername, inputPassword);
      console.log("DB RESPONSE:", res.documents);

      if (res.documents.length === 0) {
        alert("User not found");
        setLoading(false);
        return;
      }

      // 🔥 Find exact match safely
      const student = res.documents.find((item) => {
        const dbUsername = item.username?.trim().toLowerCase();
        const dbPassword = String(item.password).trim();

        return (
          dbUsername === inputUsername &&
          dbPassword === inputPassword
        );
      });

      if (!student) {
        alert("Invalid credentials");
        setLoading(false);
        return;
      }

      // ✅ SUCCESS
      localStorage.setItem("student", JSON.stringify(student));

      alert("Login Successful");
      router.push("/student/dashboard");

    } catch (err) {
      console.error("LOGIN ERROR:", err);
      alert("Login failed");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A1229] relative overflow-hidden px-4">

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

      <form
        onSubmit={handleLogin}
        className="bg-white/5 backdrop-blur-2xl p-10 rounded-[40px] w-full max-w-md shadow-xl relative z-10 border border-white/10"
      >
        <h2 className="bnmi-font-display text-3xl font-bold text-center mb-2 text-[#FBF9F4]">
          Student Login
        </h2>
        <p className="bnmi-font-body text-[#D5D8E3] text-center mb-8 text-sm">
          Access your courses and progress
        </p>

        {/* Username */}
        <div className="mb-6">
          <label className="bnmi-font-body text-sm text-[#D5D8E3] block mb-2">Username</label>
          <input
            type="text"
            value={form.username}
            onChange={(e) =>
              setForm({ ...form, username: e.target.value })
            }
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[#FBF9F4] placeholder-[#D5D8E3]/50 focus:outline-none focus:ring-2 focus:ring-[#C9A24B] focus:border-[#C9A24B] hover:border-white/20 transition-all"
            placeholder="Enter your username"
            required
          />
        </div>

        {/* Password */}
        <div className="mb-8">
          <label className="bnmi-font-body text-sm text-[#D5D8E3] block mb-2">Password</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[#FBF9F4] placeholder-[#D5D8E3]/50 focus:outline-none focus:ring-2 focus:ring-[#C9A24B] focus:border-[#C9A24B] hover:border-white/20 transition-all"
            placeholder="Enter your password"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`bnmi-font-body w-full py-3 rounded-xl font-semibold text-[#0A1229] transition-all duration-300 ${
            loading
              ? 'bg-[#C9A24B]/50 cursor-not-allowed'
              : 'bg-[#C9A24B] hover:bg-[#d4b05a] shadow-[0_10px_30px_rgba(201,162,75,0.25)] hover:shadow-[0_15px_40px_rgba(201,162,75,0.35)]'
          }`}
        >
          {loading ? "Logging in..." : "SIGN IN"}
        </button>

      </form>
    </div>
  );
}