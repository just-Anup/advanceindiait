'use client'

export const dynamic = "force-dynamic";

import { useState } from "react"
import { databases } from "@/lib/appwrite"
import { Query } from "appwrite"
import { motion } from "framer-motion"
import { FiX, FiCheckCircle, FiArrowUpRight } from "react-icons/fi"

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID
const BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID

export default function VerifyHome() {

  const [activeTab, setActiveTab] = useState("student")

  const [atc, setAtc] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const [certificateNo, setCertificateNo] = useState("")

  const [franchise, setFranchise] = useState(null)
  const [student, setStudent] = useState(null)

  const [loading, setLoading] = useState(false)
  const [exam, setExam] = useState(null)
  const [franchiseData, setFranchiseData] = useState(null)
  const [showModal, setShowModal] = useState(false)

  // 🔵 ATC VERIFY (UNCHANGED)
  const handleATCSearch = async () => {

    if (!atc) return alert("Enter ATC Code")

    setLoading(true)

    try {

      const res = await databases.listDocuments(
        DATABASE_ID,
        "franchise_approved",
        [Query.equal("atcCode", atc)]
      )

      if (!res.documents.length) {
        alert("Invalid ATC Code ❌")
        setFranchise(null)
      } else {
        setFranchise(res.documents[0])
        setStudent(null)
      }

    } catch {
      alert("Search failed")
    }

    setLoading(false)
  }

  // 🟢 STUDENT VERIFY (ONLY THIS UPDATED)
  const handleStudentVerify = async () => {

    if (!certificateNo) {
      return alert("Enter Certificate Number")
    }

    setLoading(true)

    try {

      const res = await databases.listDocuments(
        DATABASE_ID,
        "student_admissions",
        [
          Query.equal("certificateNo", certificateNo)
        ]
      )

      if (!res.documents.length) {
        alert("Invalid Certificate Number ❌")
        setStudent(null)
      } else {
        setStudent(res.documents[0]) // ✅ show student
        setShowModal(true)
        const studentData = res.documents[0]

// 🔵 FETCH EXAM RESULT
try {
  const examRes = await databases.listDocuments(
    DATABASE_ID,
    "exam_results",
    [
      Query.equal("studentName", studentData.studentName),
Query.equal("course", studentData.courseName)
    ]
  )

  if (examRes.documents.length) {
    setExam(examRes.documents[0])
  }

} catch (err) {
  console.log("Exam fetch error:", err)
}

// 🟣 FETCH FRANCHISE
try {
  const franRes = await databases.listDocuments(
    DATABASE_ID,
    "franchise_approved",
    [
    Query.equal("instituteName", studentData.instituteName)
    ]
  )

  if (franRes.documents.length) {
    setFranchiseData(franRes.documents[0])
  }

} catch (err) {
  console.log("Franchise fetch error:", err)
}
        setFranchise(null)
      }

    } catch (err) {
      console.log(err)
      alert("Verification failed")
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#0A1229] flex items-center justify-center p-4 relative overflow-hidden">

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap');
        
        .bnmi-font-display {
          font-family: 'Playfair Display', Georgia, serif;
        }
        
        .bnmi-font-body {
          font-family: 'Inter', system-ui, sans-serif;
        }
      `}</style>

      {/* BG ELEMENTS */}
      <div className="absolute inset-0 bg-[radial-gradient(#C9A24B_1px,transparent_1px)] bg-[size:70px_70px] opacity-[0.03]" />

      <div className="absolute -top-20 left-0 h-[500px] w-[500px] rounded-full bg-gradient-to-r from-[#C9A24B]/30 to-transparent blur-[140px]" />

      <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-gradient-to-l from-[#C9A24B]/20 to-transparent blur-[140px]" />

      {/* MAIN CONTAINER */}
      <div className="w-full max-w-5xl relative z-10">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="bnmi-font-display text-5xl md:text-6xl font-black text-[#FBF9F4] mb-4">
            Verification Portal
          </h1>
          <p className="bnmi-font-body text-lg text-[#D5D8E3]">
            Verify Your Franchise & Student Credentials
          </p>
        </motion.div>

        {/* CARD */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 p-8 md:p-12 shadow-[0_30px_120px_rgba(201,162,75,0.1)]"
        >

          {/* TABS */}
          <div className="flex gap-2 md:gap-4 mb-10 border-b border-white/10 pb-6">

            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setActiveTab("student")}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 bnmi-font-body ${
                activeTab === "student"
                  ? "bg-[#C9A24B] text-[#0A1229] shadow-[0_10px_30px_rgba(201,162,75,0.3)]"
                  : "text-[#D5D8E3] hover:text-[#FBF9F4] hover:border-[#C9A24B]/30"
              }`}
            >
              👤 Student Verification
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setActiveTab("atc")}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 bnmi-font-body ${
                activeTab === "atc"
                  ? "bg-[#C9A24B] text-[#0A1229] shadow-[0_10px_30px_rgba(201,162,75,0.3)]"
                  : "text-[#D5D8E3] hover:text-[#FBF9F4] hover:border-[#C9A24B]/30"
              }`}
            >
              🏢 Franchise Verification
            </motion.button>

          </div>

          {/* STUDENT TAB */}
          {activeTab === "student" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >

              <div>
                <label className="bnmi-font-body text-sm text-[#D5D8E3] block mb-3">
                  Certificate Number
                </label>
                <input
                  placeholder="Enter Your Certificate Number"
                  value={certificateNo}
                  onChange={(e) => setCertificateNo(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-[#FBF9F4] placeholder-[#D5D8E3]/50 focus:outline-none focus:ring-2 focus:ring-[#C9A24B] focus:border-[#C9A24B] hover:border-white/20 transition-all bnmi-font-body"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                onClick={handleStudentVerify}
                className="w-full bg-gradient-to-r from-[#C9A24B] to-[#d4b05a] text-[#0A1229] py-4 rounded-xl hover:shadow-[0_15px_40px_rgba(201,162,75,0.35)] font-semibold transition-all duration-300 bnmi-font-body"
              >
                {loading ? "Verifying..." : "Verify Student"}
              </motion.button>

            </motion.div>
          )}

          {/* FRANCHISE TAB */}
          {activeTab === "atc" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >

              <div>
                <label className="bnmi-font-body text-sm text-[#D5D8E3] block mb-3">
                  ATC Code
                </label>
                <input
                  type="text"
                  placeholder="Enter Your ATC Code"
                  value={atc}
                  onChange={(e) => setAtc(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-[#FBF9F4] placeholder-[#D5D8E3]/50 focus:outline-none focus:ring-2 focus:ring-[#C9A24B] focus:border-[#C9A24B] hover:border-white/20 transition-all bnmi-font-body"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                onClick={handleATCSearch}
                className="w-full bg-gradient-to-r from-[#C9A24B] to-[#d4b05a] text-[#0A1229] py-4 rounded-xl hover:shadow-[0_15px_40px_rgba(201,162,75,0.35)] font-semibold transition-all duration-300 bnmi-font-body"
              >
                {loading ? "Verifying..." : "Verify Franchise"}
              </motion.button>

            </motion.div>
          )}

        </motion.div>

        {/* FRANCHISE RESULT */}
        {franchise && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-8 bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 p-8 md:p-10 shadow-[0_30px_120px_rgba(201,162,75,0.1)]"
          >

            <div className="flex items-center gap-3 mb-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#C9A24B]/20 border border-[#C9A24B]/30">
                <FiCheckCircle className="text-[#C9A24B]" size={24} />
              </div>
              <h2 className="bnmi-font-display text-3xl font-bold text-[#C9A24B]">
                ✓ Verified Franchise
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <p className="bnmi-font-body text-sm text-[#D5D8E3] mb-1">Institute Name</p>
                <p className="bnmi-font-display text-lg font-bold text-[#FBF9F4]">{franchise.instituteName}</p>
              </div>

              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <p className="bnmi-font-body text-sm text-[#D5D8E3] mb-1">Owner Name</p>
                <p className="bnmi-font-display text-lg font-bold text-[#FBF9F4]">{franchise.name}</p>
              </div>

              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <p className="bnmi-font-body text-sm text-[#D5D8E3] mb-1">ATC Code</p>
                <p className="bnmi-font-display text-lg font-bold text-[#C9A24B]">{franchise.atcCode}</p>
              </div>

              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <p className="bnmi-font-body text-sm text-[#D5D8E3] mb-1">Email</p>
                <p className="bnmi-font-body text-lg text-[#FBF9F4]">{franchise.email}</p>
              </div>

              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <p className="bnmi-font-body text-sm text-[#D5D8E3] mb-1">Mobile</p>
                <p className="bnmi-font-body text-lg text-[#FBF9F4]">{franchise.mobile}</p>
              </div>

              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <p className="bnmi-font-body text-sm text-[#D5D8E3] mb-1">City</p>
                <p className="bnmi-font-body text-lg text-[#FBF9F4]">{franchise.city}</p>
              </div>

            </div>

          </motion.div>
        )}

      </div>

      {/* STUDENT MODAL */}
      {showModal && student && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setShowModal(false)}
        >

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 p-8 md:p-12 shadow-[0_50px_150px_rgba(201,162,75,0.2)] relative"
          >

            {/* CLOSE BUTTON */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-[#C9A24B]/30 text-[#D5D8E3] hover:text-[#C9A24B] transition-all"
            >
              <FiX size={24} />
            </motion.button>

            {/* HEADER */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#C9A24B]/20 border border-[#C9A24B]/30">
                  <FiCheckCircle className="text-[#C9A24B]" size={32} />
                </div>
              </div>
              <h2 className="bnmi-font-display text-3xl font-bold text-[#C9A24B] mb-2">
                Verified Student
              </h2>
              <p className="bnmi-font-body text-[#D5D8E3]">Official BNMI Verification Certificate</p>
            </div>

            {/* STUDENT PROFILE */}
            <div className="text-center mb-10 pb-8 border-b border-white/10">

              {student.photoId && (
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  src={`${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${student.photoId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`}
                  className="w-32 h-32 rounded-full border-4 border-[#C9A24B]/30 shadow-lg mx-auto mb-4 object-cover"
                />
              )}

              <h3 className="bnmi-font-display text-2xl font-bold text-[#FBF9F4] mb-3">
                {student.studentName}
              </h3>

              <div className="inline-block bg-[#C9A24B]/20 border border-[#C9A24B]/30 text-[#C9A24B] px-6 py-2 rounded-full bnmi-font-body font-semibold">
                {student.courseName}
              </div>

            </div>

            {/* STUDENT DETAILS */}
            <div className="mb-6">

              <h4 className="bnmi-font-display text-lg font-bold text-[#C9A24B] mb-4 flex items-center gap-2">
                <FiArrowUpRight size={20} />
                Student Details
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                  <p className="bnmi-font-body text-xs text-[#D5D8E3] mb-1">Admission Date</p>
                  <p className="bnmi-font-body font-semibold text-[#FBF9F4]">{student.admissionDate}</p>
                </div>

                <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                  <p className="bnmi-font-body text-xs text-[#D5D8E3] mb-1">Duration</p>
                  <p className="bnmi-font-body font-semibold text-[#FBF9F4]">{student.duration || "6 Months"}</p>
                </div>

                <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                  <p className="bnmi-font-body text-xs text-[#D5D8E3] mb-1">Certificate No</p>
                  <p className="bnmi-font-body font-semibold text-[#C9A24B]">{student.certificateNo}</p>
                </div>

                <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                  <p className="bnmi-font-body text-xs text-[#D5D8E3] mb-1">Grade</p>
                  <p className="bnmi-font-body font-semibold text-[#FBF9F4]">{exam?.grade || "—"}</p>
                </div>

              </div>

              {exam?.percentage && (
                <div className="bg-white/5 rounded-2xl p-4 border border-white/10 mt-4">
                  <p className="bnmi-font-body text-xs text-[#D5D8E3] mb-1">Percentage</p>
                  <p className="bnmi-font-display text-2xl font-bold text-[#C9A24B]">{exam.percentage}%</p>
                </div>
              )}

            </div>

            {/* FRANCHISE DETAILS */}
            {franchiseData && (
              <div>

                <h4 className="bnmi-font-display text-lg font-bold text-[#C9A24B] mb-4 flex items-center gap-2">
                  <FiArrowUpRight size={20} />
                  Franchise Details
                </h4>

                {franchiseData?.logo && (
                  <div className="flex justify-center mb-6">
                    <motion.img
                      whileHover={{ scale: 1.05 }}
                      src={
                        franchiseData.logo.startsWith("http")
                          ? franchiseData.logo
                          : `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${franchiseData.logo}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`
                      }
                      className="h-20 object-contain drop-shadow-md"
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                    <p className="bnmi-font-body text-xs text-[#D5D8E3] mb-1">Institute</p>
                    <p className="bnmi-font-body font-semibold text-[#FBF9F4]">{student.instituteName}</p>
                  </div>

                  <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                    <p className="bnmi-font-body text-xs text-[#D5D8E3] mb-1">Email</p>
                    <p className="bnmi-font-body font-semibold text-[#FBF9F4]">{franchiseData?.email || "—"}</p>
                  </div>

                  <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                    <p className="bnmi-font-body text-xs text-[#D5D8E3] mb-1">Phone</p>
                    <p className="bnmi-font-body font-semibold text-[#FBF9F4]">{franchiseData?.mobile || "—"}</p>
                  </div>

                  <div className="bg-white/5 rounded-2xl p-4 border border-white/10 md:col-span-2">
                    <p className="bnmi-font-body text-xs text-[#D5D8E3] mb-1">Address</p>
                    <p className="bnmi-font-body font-semibold text-[#FBF9F4]">{franchiseData?.city} {franchiseData?.address || "Not Available"}</p>
                  </div>

                </div>

              </div>
            )}

          </motion.div>

        </motion.div>
      )}

    </div>
  )
}