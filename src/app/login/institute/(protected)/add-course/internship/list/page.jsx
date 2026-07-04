'use client'

import { useEffect, useState } from 'react'
import { databases, account } from '@/lib/appwrite'
import { Query } from 'appwrite'
import Link from 'next/link'

const DATABASE_ID =
  process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID

const COLLECTION_ID =
  'internship_certificates'

export default function InternshipList() {

  const [certificates, setCertificates] =
    useState([])

  const [loading, setLoading] =
    useState(true)

  const [search, setSearch] =
    useState('')

  const fetchCertificates = async () => {

    try {

      const user =
        await account.get()

      const res =
        await databases.listDocuments(
          DATABASE_ID,
          COLLECTION_ID,
          [
            Query.equal(
              "franchiseEmail",
              user.email
            ),
            Query.limit(100)
          ]
        )

      setCertificates(
        res.documents.reverse()
      )

    } catch (error) {

      console.log(error)

    } finally {

      setLoading(false)

    }
  }

  useEffect(() => {

    fetchCertificates()

  }, [])

  const deleteCertificate =
    async (id) => {

      const confirmDelete =
        confirm(
          "Delete this certificate?"
        )

      if (!confirmDelete) return

      try {

        await databases.deleteDocument(
          DATABASE_ID,
          COLLECTION_ID,
          id
        )

        fetchCertificates()

      } catch (error) {

        console.log(error)

        alert("Delete failed")
      }
    }

  const filtered =
    certificates.filter((item) =>
      item.studentName
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )
    )

  if (loading) {

    return (
      <div className="min-h-screen bg-[#0A1229] text-[#FBF9F4] flex items-center justify-center">
        <div className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_0_40px_rgba(201,162,75,0.18)]">
          <span className="h-2.5 w-2.5 rounded-full bg-[#C9A24B] animate-pulse" />
          <span>Loading...</span>
        </div>
      </div>
    )
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

          <div className="mb-6 flex flex-col lg:flex-row justify-between gap-4">

            <div>
              <h2 className="text-2xl md:text-3xl font-semibold tracking-wide">
                INTERNSHIP CERTIFICATE LIST
              </h2>
              <p className="mt-2 text-sm text-[#FBF9F4]/70">
                Premium glass UI with luxury gold accents.
              </p>
            </div>

            <Link
              href="/login/institute/internship/add"
            >
              <span className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl font-semibold border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_0_30px_rgba(201,162,75,0.12)] transition-all duration-300 hover:border-[#C9A24B]/80 hover:shadow-[0_0_40px_rgba(201,162,75,0.25)]">
                <span className="text-[#C9A24B]">+</span>
                Add Internship
              </span>
            </Link>

          </div>

          {/* SEARCH */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search Student Name..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl outline-none transition-all duration-300 focus:border-[#C9A24B]/70"
            />
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">

            <table className="w-full min-w-[1100px] border-collapse">

              <thead>

                <tr className="bg-white/5">

                  <th className="p-4 border-b border-white/10 text-left text-sm font-medium text-[#FBF9F4]/80">
                    Sr
                  </th>

                  <th className="p-4 border-b border-white/10 text-left text-sm font-medium text-[#FBF9F4]/80">
                    Photo
                  </th>

                  <th className="p-4 border-b border-white/10 text-left text-sm font-medium text-[#FBF9F4]/80">
                    Student Name
                  </th>

                  <th className="p-4 border-b border-white/10 text-left text-sm font-medium text-[#FBF9F4]/80">
                    Internship
                  </th>

                  <th className="p-4 border-b border-white/10 text-left text-sm font-medium text-[#FBF9F4]/80">
                    Shift
                  </th>

                  <th className="p-4 border-b border-white/10 text-left text-sm font-medium text-[#FBF9F4]/80">
                    Days
                  </th>

                  <th className="p-4 border-b border-white/10 text-left text-sm font-medium text-[#FBF9F4]/80">
                    Issue Date
                  </th>

                  <th className="p-4 border-b border-white/10 text-left text-sm font-medium text-[#FBF9F4]/80">
                    Certificate No
                  </th>

                  <th className="p-4 border-b border-white/10 text-left text-sm font-medium text-[#FBF9F4]/80">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {filtered.map(
                  (item, index) => (

                    <tr
                      key={item.$id}
                      className="transition-all duration-300 hover:bg-white/5"
                    >

                      <td className="p-4 border-b border-white/10 text-center text-sm text-[#FBF9F4]/90">
                        {index + 1}
                      </td>

                      <td className="p-4 border-b border-white/10 text-center">

                        <img
                          src={item.studentPhoto}
                          alt=""
                          className="w-14 h-14 object-cover rounded-full mx-auto border border-white/10 transition-transform duration-300 group-hover:scale-110 hover:scale-110"
                        />

                      </td>

                      <td className="p-4 border-b border-white/10 text-sm">
                        {item.studentName}
                      </td>

                      <td className="p-4 border-b border-white/10 text-sm">
                        {item.internshipTitle}
                      </td>

                      <td className="p-4 border-b border-white/10 text-sm">
                        {item.shift}
                      </td>

                      <td className="p-4 border-b border-white/10 text-sm">
                        {item.days}
                      </td>

                      <td className="p-4 border-b border-white/10 text-sm">
                        {item.issueDate}
                      </td>

                      <td className="p-4 border-b border-white/10 text-sm">
                        {item.certificateNo}
                      </td>

                      <td className="p-4 border-b border-white/10">

                        <div className="flex gap-2 flex-wrap">

                          <Link
                            href={`/login/institute/add-course/internship/view/${item.$id}`}
                          >
                            <span className="inline-flex items-center justify-center px-4 py-2 rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl text-[#FBF9F4] transition-all duration-300 hover:border-[#C9A24B]/80 hover:shadow-[0_0_18px_rgba(201,162,75,0.22)]">
                              View
                            </span>
                          </Link>

                          <button
                            onClick={() =>
                              deleteCertificate(
                                item.$id
                              )
                            }
                            className="inline-flex items-center justify-center px-4 py-2 rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl text-[#FBF9F4] transition-all duration-300 hover:border-[#C9A24B]/80 hover:shadow-[0_0_18px_rgba(201,162,75,0.22)]"
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )}

                {filtered.length === 0 && (

                  <tr>

                    <td
                      colSpan="9"
                      className="text-center p-10 text-[#FBF9F4]/70"
                    >
                      No Internship Certificates Found
                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>

  )
}
