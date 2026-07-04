"use client";

import { useEffect, useState } from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

import {
  DollarSign,
  ShoppingCart,
  CreditCard,
  FileText
} from "lucide-react";

import { databases } from "@/lib/appwrite";

const DATABASE_ID =
  process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;

const COLORS = ["#22c55e", "#f97316"];

export default function Dashboard() {

  // =========================
  // STATES
  // =========================

  const [admissionCount, setAdmissionCount] = useState(0);

  const [certificateCount, setCertificateCount] = useState(0);

  const [franchiseCount, setFranchiseCount] = useState(0);

  const [enquiryCount, setEnquiryCount] = useState(0);

  const [courseCount, setCourseCount] = useState(0);

  const [barData, setBarData] = useState([]);

  const [pieData, setPieData] = useState([
    { name: "Admissions", value: 0 },
    { name: "Certificates", value: 0 }
  ]);

  // =========================
  // LOAD
  // =========================

  useEffect(() => {

    loadDashboard();

  }, []);

  // =========================
  // LOAD DASHBOARD
  // =========================

const loadDashboard = async () => {

  try {

    // =========================
    // LOAD ALL TOGETHER (FAST)
    // =========================

    const [
      admissionRes,
      certificateRes,
      franchiseRes,
      enquiryRes,
      singleCourses,
      beautyCourses,
      multipleCourses
    ] = await Promise.all([

      databases.listDocuments(
        DATABASE_ID,
        "student_admissions",
        []
      ),

      databases.listDocuments(
        DATABASE_ID,
        "certificates",
        []
      ),

      databases.listDocuments(
        DATABASE_ID,
        "franchise_approved",
        []
      ),

      databases.listDocuments(
        DATABASE_ID,
        "student_enquiries",
        []
      ),

      databases.listDocuments(
        DATABASE_ID,
        "courses_master",
        []
      ),

      databases.listDocuments(
        DATABASE_ID,
        "beauty_courses_master",
        []
      ),

      databases.listDocuments(
        DATABASE_ID,
        "courses_master_multiple",
        []
      )

    ]);

    // =========================
    // COUNTS
    // =========================

    setAdmissionCount(admissionRes.total);

    setCertificateCount(certificateRes.total);

    setFranchiseCount(franchiseRes.total);

    setEnquiryCount(enquiryRes.total);

    const totalCourses =
      singleCourses.total +
      beautyCourses.total +
      multipleCourses.total;

    setCourseCount(totalCourses);

    // =========================
    // PIE
    // =========================

    setPieData([
      {
        name: "Admissions",
        value: admissionRes.total
      },
      {
        name: "Certificates",
        value: certificateRes.total
      }
    ]);

    // =========================
    // BAR
    // =========================

    setBarData([
      {
        name: "Enquiries",
        total: enquiryRes.total
      },
      {
        name: "Admissions",
        total: admissionRes.total
      },
      {
        name: "Certificates",
        total: certificateRes.total
      },
      {
        name: "Courses",
        total: totalCourses
      },
      {
        name: "Franchises",
        total: franchiseRes.total
      }
    ]);

  } catch (err) {

    console.log(
      "DASHBOARD ERROR:",
      err
    );

  }

};

  return (

    <div className="min-h-screen bg-[#0A1229] text-[#FBF9F4] p-4 md:p-8 relative overflow-hidden">

      {/* ambient glow + subtle grid */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,162,75,0.18),transparent_55%)]" />
        <div className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(to_right,rgba(255,255,255,0.7)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.7)_1px,transparent_1px)] [background-size:42px_42px]" />
      </div>

      {/* content */}
      <div className="relative">

        {/* HEADER */}
        <div className="mb-6 py-5 px-8 rounded-3xl">
          <div className="space-y-3">
            <h1 className="font-[Playfair_Display] text-2xl md:text-3xl font-semibold tracking-wide">
              Dashboard
            </h1>
            <p className="font-[Inter] text-white/70">
              Welcome to BNMI Dashboard
            </p>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-6 px-0">
          <StatCard
            title="Enquiries"
            amount={enquiryCount}
            icon={<DollarSign />}
          />

          <StatCard
            title="Admissions"
            amount={admissionCount}
            icon={<ShoppingCart />}
          />

          <StatCard
            title="Certificates"
            amount={certificateCount}
            icon={<CreditCard />}
          />

          <StatCard
            title="Courses"
            amount={courseCount}
            icon={<FileText />}
          />

          <StatCard
            title="Franchises"
            amount={franchiseCount}
            icon={<FileText />}
          />
        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* BAR CHART */}
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 md:p-6 hover:border-[#C9A24B]/60 transition-all duration-300">
            <h2 className="font-[Playfair_Display] font-semibold mb-4 tracking-wide">
              Overall Statistics
            </h2>

            <div className="w-full h-[300px]">
              <ResponsiveContainer>
                <BarChart data={barData}>
                  <XAxis
                    dataKey="name"
                    stroke="rgba(251,249,244,0.75)"
                    tick={{ fill: "rgba(251,249,244,0.75)", fontFamily: "Inter" }}
                  />
                  <YAxis
                    stroke="rgba(251,249,244,0.75)"
                    tick={{ fill: "rgba(251,249,244,0.75)", fontFamily: "Inter" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(10,18,41,0.92)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: "14px",
                      color: "#FBF9F4",
                      backdropFilter: "blur(12px)"
                    }}
                    labelStyle={{ color: "#FBF9F4", fontFamily: "Inter" }}
                  />
                  <Bar
                    dataKey="total"
                    fill="#C9A24B"
                    radius={[10, 10, 4, 4]}
                    style={{ filter: "drop-shadow(0px 0px 14px rgba(201,162,75,0.35))" }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* PIE CHART */}
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 md:p-6 flex flex-col items-center hover:border-[#C9A24B]/60 transition-all duration-300">
            <h2 className="font-[Playfair_Display] font-semibold mb-4 tracking-wide">
              Admissions vs Certificates
            </h2>

            <div className="w-full h-[300px]">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={60}
                    outerRadius={90}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={
                          index === 0
                            ? "#C9A24B"
                            : "rgba(201,162,75,0.55)"
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(10,18,41,0.92)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: "14px",
                      color: "#FBF9F4",
                      backdropFilter: "blur(12px)"
                    }}
                    labelStyle={{ color: "#FBF9F4", fontFamily: "Inter" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex justify-around w-full mt-4">
              <div className="text-center">
                <p className="text-xl font-semibold text-[#FBF9F4] font-[Inter]">
                  {admissionCount}
                </p>
                <p className="text-sm text-white/70 font-[Inter]">
                  Admissions
                </p>
              </div>

              <div className="text-center">
                <p className="text-xl font-semibold text-[#FBF9F4] font-[Inter]">
                  {certificateCount}
                </p>
                <p className="text-sm text-white/70 font-[Inter]">
                  Certificates
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>

  );

}

/* =========================
   STAT CARD
========================= */

function StatCard({
  title,
  amount,
  icon
}) {

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 hover:border-[#C9A24B]/70 transition-all duration-300 group relative overflow-hidden">
      {/* ambient gold */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          background:
            "radial-gradient(ellipse at top, rgba(201,162,75,0.22), transparent 55%), radial-gradient(ellipse at bottom, rgba(201,162,75,0.14), transparent 60%)"
        }}
      />

      <div className="relative flex justify-between items-center mb-2">
        <p className="font-[Inter] text-white/80 group-hover:text-white transition-colors">
          {title}
        </p>

        <div className="bg-white/10 border border-white/10 p-2 rounded-xl">
          <span className="text-[#C9A24B]">{icon}</span>
        </div>
      </div>

      <h2 className="relative text-2xl font-semibold font-[Inter]">
        {amount}
      </h2>
    </div>
  );

}
