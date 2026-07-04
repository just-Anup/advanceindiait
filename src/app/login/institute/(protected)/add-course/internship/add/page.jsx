'use client'

import { useState } from 'react'
import { databases, account, storage } from '@/lib/appwrite'
import { ID, Query } from 'appwrite'
import QRCode from 'qrcode'
import { useRouter } from 'next/navigation'

const DATABASE_ID =
  process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID

const BUCKET_ID =
  "6a44e849001ad5b7cc0b"

const COLLECTION_ID =
  "internship_certificates"

export default function AddInternship() {

  const router = useRouter()

  const [loading, setLoading] = useState(false)

  const [studentName, setStudentName] =
    useState('')

  const [internshipTitle, setInternshipTitle] =
    useState('')

  const [shift, setShift] =
    useState('Morning')

  const [days, setDays] =
    useState('')

  const [fromDate, setFromDate] =
    useState('')

  const [toDate, setToDate] =
    useState('')

  const [issueDate, setIssueDate] =
    useState('')

  const [photoFile, setPhotoFile] =
    useState(null)

  const generateCertificate = async () => {

    try {

      if (!studentName) {
        alert("Enter Student Name")
        return
      }

      if (!photoFile) {
        alert("Upload Student Photo")
        return
      }

      setLoading(true)

      const user =
        await account.get()

      // FRANCHISE

      const franchiseRes =
        await databases.listDocuments(
          DATABASE_ID,
          "franchise_approved",
          [
            Query.equal(
              "email",
              user.email
            )
          ]
        )

      if (
        franchiseRes.documents.length === 0
      ) {
        alert("Franchise not found")
        return
      }

      const franchise =
        franchiseRes.documents[0]

        const CERTIFICATE_FEE = 450

const currentWallet =
  Number(franchise.wallet || 0)

if (currentWallet < CERTIFICATE_FEE) {

  alert(
    `Insufficient Wallet Balance.

Required: ₹450
Available: ₹${currentWallet}`
  )

  setLoading(false)

  return
}

      // PHOTO UPLOAD

      const upload =
        await storage.createFile(
          BUCKET_ID,
          ID.unique(),
          photoFile
        )

      const photoUrl =
        `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${upload.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`

      const certificateNo =
        `INT-${Date.now()}`

      const verifyUrl =
        `${window.location.origin}/internship-verify/${certificateNo}`

      const qrCode =
        await QRCode.toDataURL(
          verifyUrl
        )

      await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        {
          
          studentName,
          studentPhoto: photoUrl,

          internshipTitle,
          shift,
          days,

          fromDate,
          toDate,
          issueDate,

          certificateNo,

          franchiseEmail:
            user.email,

          instituteName:
            franchise.instituteName || '',

          logo:
            franchise.certificateLogo ||
            franchise.logo ||
            '',

          signature:
            franchise.signature || '',

          qrCode,
          verifyUrl
        }
      )

     
 const updatedWallet =
  currentWallet - CERTIFICATE_FEE

await databases.updateDocument(
  DATABASE_ID,
  "franchise_approved",
  franchise.$id,
  {
    wallet: String(updatedWallet)
  }
)

// SAVE TRANSACTION

await databases.createDocument(
  DATABASE_ID,
  "wallet_transactions",
  ID.unique(),
  {
    franchiseId: franchise.$id,
    franchiseEmail: user.email,
    type: "Debit",
    amount: 450,
    reason: "Internship Certificate",
    courseName: internshipTitle,
    studentName: studentName,
    certificateNo: certificateNo,
    remainingBalance: String(updatedWallet),
    date: new Date().toLocaleDateString("en-GB")
  }
)

      alert(
        "Internship Certificate Generated Successfully"
      )

      router.push(
        "/login/institute/add-course/internship/list"
      )

    } catch (error) {

      console.log(error)

      alert(
        error.message ||
        "Something went wrong"
      )

    } finally {

      setLoading(false)

    }
  }

  return (

    <div className="min-h-screen bg-[#0A1229] text-[#FBF9F4] px-4 md:px-8 py-16 md:py-28 relative overflow-hidden">

      {/* Subtle grid texture + ambient glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      <div className="pointer-events-none absolute -top-24 -left-24 w-80 h-80 bg-[#C9A24B]/25 blur-3xl rounded-full" />
      <div className="pointer-events-none absolute top-1/3 -right-24 w-96 h-96 bg-[#C9A24B]/15 blur-3xl rounded-full" />

      <div className="relative max-w-7xl mx-auto">
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_0_60px_rgba(201,162,75,0.08)] p-5 md:p-7">
          <div className="mb-8 flex flex-col lg:flex-row justify-between items-start gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold tracking-wide">
                ADD INTERNSHIP CERTIFICATE
              </h2>
              <p className="mt-2 text-sm text-[#FBF9F4]/70">
                Luxury glass UI with gold accents.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl px-4 py-2 shadow-[0_0_30px_rgba(201,162,75,0.10)]">
              <span className="h-2.5 w-2.5 rounded-full bg-[#C9A24B] animate-pulse" />
              <span className="text-sm text-[#FBF9F4]/80 font-[Inter]">{loading ? 'Processing...' : 'Ready'}</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block mb-2 text-sm text-[#FBF9F4]/80">Student Name</label>
              <input
                type="text"
                value={studentName}
                onChange={(e) =>
                  setStudentName(e.target.value.toUpperCase())
                }
                className="w-full rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl px-4 py-3 text-[#FBF9F4] placeholder:text-white/40 outline-none transition-all duration-300 focus:border-[#C9A24B]/70"
                placeholder="Enter student name"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-[#FBF9F4]/80">Student Photo</label>
              <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 transition-all duration-300 hover:border-[#C9A24B]/60">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPhotoFile(e.target.files[0])}
                  className="w-full text-sm file:mr-4 file:rounded-xl file:border file:border-white/10 file:bg-white/5 file:px-4 file:py-2 file:text-[#FBF9F4] file:backdrop-blur-xl hover:file:border-[#C9A24B]/60"
                />
                {photoFile && (
                  <div className="mt-4">
                    <div className="relative group overflow-hidden rounded-xl border border-white/10 bg-black/20">
                      <img
                        src={URL.createObjectURL(photoFile)}
                        alt="Student"
                        className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-80" />
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                        <span className="text-xs px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl text-[#FBF9F4]/90">
                          Preview
                        </span>
                        <span className="text-xs text-[#C9A24B] opacity-90">Zoom on hover</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm text-[#FBF9F4]/80">Internship Title</label>
              <input
                type="text"
                value={internshipTitle}
                onChange={(e) => setInternshipTitle(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl px-4 py-3 text-[#FBF9F4] placeholder:text-white/40 outline-none transition-all duration-300 focus:border-[#C9A24B]/70"
                placeholder="e.g., Data Science Internship"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-[#FBF9F4]/80">Shift</label>
              <select
                value={shift}
                onChange={(e) => setShift(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl px-4 py-3 text-[#FBF9F4] outline-none transition-all duration-300 focus:border-[#C9A24B]/70"
              >
                <option>Morning</option>
                <option>Evening</option>
                <option>Night</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 text-sm text-[#FBF9F4]/80">Internship Days</label>
              <input
                type="number"
                value={days}
                onChange={(e) => setDays(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl px-4 py-3 text-[#FBF9F4] placeholder:text-white/40 outline-none transition-all duration-300 focus:border-[#C9A24B]/70"
                placeholder="e.g., 30"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-[#FBF9F4]/80">Issue Date</label>
              <input
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl px-4 py-3 text-[#FBF9F4] outline-none transition-all duration-300 focus:border-[#C9A24B]/70"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-[#FBF9F4]/80">From Date</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl px-4 py-3 text-[#FBF9F4] outline-none transition-all duration-300 focus:border-[#C9A24B]/70"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-[#FBF9F4]/80">To Date</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl px-4 py-3 text-[#FBF9F4] outline-none transition-all duration-300 focus:border-[#C9A24B]/70"
              />
            </div>
          </div>

          <button
            onClick={generateCertificate}
            disabled={loading}
            className="mt-8 w-full lg:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-[#C9A24B]/60 bg-[#0A1229]/30 px-8 py-3 text-[#FBF9F4] font-semibold transition-all duration-300 hover:border-[#C9A24B] hover:shadow-[0_0_20px_rgba(201,162,75,0.25)] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <span className="text-[#C9A24B]">✦</span>
            {loading ? 'Generating...' : 'Generate Certificate'}
          </button>
        </div>
      </div>
    </div>
  )
}