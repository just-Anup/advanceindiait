'use client'

import { useEffect, useState } from 'react'
import { databases, account } from '@/lib/appwrite'
import { Query } from 'appwrite'
import Link from 'next/link'

const DATABASE_ID =
  process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID

const COLLECTION_ID =
  'participation_certificates'

export default function ParticipationList() {

  const [certificates, setCertificates] =
    useState([])

  const [loading, setLoading] =
    useState(true)

  const [search, setSearch] =
    useState('')

  useEffect(() => {

    fetchCertificates()

  }, [])

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
              'franchiseEmail',
              user.email
            ),
            Query.orderDesc(
              '$createdAt'
            ),
            Query.limit(500)
          ]
        )

      setCertificates(
        res.documents
      )

    } catch (error) {

      console.log(error)

      alert(
        'Failed to load certificates'
      )

    } finally {

      setLoading(false)

    }

  }

  const filteredCertificates =
    certificates.filter((item) => {

      const searchText =
        search.toLowerCase()

      return (

        item.studentName
          ?.toLowerCase()
          .includes(searchText)

        ||

        item.courseName
          ?.toLowerCase()
          .includes(searchText)

        ||

        item.certificateNo
          ?.toLowerCase()
          .includes(searchText)

      )

    })

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

        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div>

            <h1 className="text-3xl md:text-4xl font-semibold tracking-wide">
              Participation Certificates
            </h1>

            <p className="mt-2 text-sm text-[#FBF9F4]/70">
              Premium certificate management with gold-accent glass UI.
            </p>

          </div>

          <Link
            href="/login/institute/add-course/beauty_certificate/add"
            className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl font-semibold border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_0_30px_rgba(201,162,75,0.12)] transition-all duration-300 hover:border-[#C9A24B]/80 hover:shadow-[0_0_40px_rgba(201,162,75,0.25)]"
          >
            <span className="text-[#C9A24B]">+</span>
            Add Certificate
          </Link>

        </div>

        <div className="mb-8">

          <input
            type="text"
            placeholder="Search Student / Course / Certificate No"
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl outline-none transition-all duration-300 focus:border-[#C9A24B]/70"
          />

        </div>

        {loading ? (

          <div className="text-center py-20">

            <div className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">

              <span className="h-2.5 w-2.5 rounded-full bg-[#C9A24B] animate-pulse" />
              <span>Loading...</span>

            </div>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <div className="min-w-[900px] rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_0_60px_rgba(201,162,75,0.08)]">

              <table className="w-full">

                <thead>

                  <tr className="bg-white/5">

                    <th className="p-4 text-left text-sm font-medium text-[#FBF9F4]/80 border-b border-white/10">
                      Sl No
                    </th>

                    <th className="p-4 text-left text-sm font-medium text-[#FBF9F4]/80 border-b border-white/10">
                      Certificate No
                    </th>

                    <th className="p-4 text-left text-sm font-medium text-[#FBF9F4]/80 border-b border-white/10">
                      Student Name
                    </th>

                    <th className="p-4 text-left text-sm font-medium text-[#FBF9F4]/80 border-b border-white/10">
                      Course Name
                    </th>

                    <th className="p-4 text-left text-sm font-medium text-[#FBF9F4]/80 border-b border-white/10">
                      Duration
                    </th>

                    <th className="p-4 text-left text-sm font-medium text-[#FBF9F4]/80 border-b border-white/10">
                      Completion Date
                    </th>

                    <th className="p-4 text-left text-sm font-medium text-[#FBF9F4]/80 border-b border-white/10">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredCertificates.length === 0 ? (

                    <tr>

                      <td
                        colSpan="7"
                        className="text-center p-10 text-[#FBF9F4]/70"
                      >
                        No Certificates Found
                      </td>

                    </tr>

                  ) : (

                    filteredCertificates.map(
                      (item, index) => (

                        <tr
                          key={item.$id}
                          className="transition-all duration-300 hover:bg-white/5 group"
                        >

                          <td className="p-4 border-b border-white/10 text-sm text-[#FBF9F4]/90">

                            {index + 1}

                          </td>

                          <td className="p-4 border-b border-white/10 text-sm">

                            {item.certificateNo}

                          </td>

                          <td className="p-4 border-b border-white/10 text-sm">

                            {item.studentName}

                          </td>

                          <td className="p-4 border-b border-white/10 text-sm">

                            {item.courseName}

                          </td>

                          <td className="p-4 border-b border-white/10 text-sm text-[#FBF9F4]/80">

                            {item.courseDuration}

                          </td>

                          <td className="p-4 border-b border-white/10 text-sm text-[#FBF9F4]/80">

                            {item.dateOfCompletion}

                          </td>

                          <td className="p-4 border-b border-white/10">

                            <div className="flex flex-wrap gap-2">

                              <Link
                                href={`/login/institute/add-course/beauty_certificate/view/${item.certificateNo}`}
                                target="_blank"
                                className="inline-flex items-center justify-center px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-[#FBF9F4] backdrop-blur-xl transition-all duration-300 hover:border-[#C9A24B]/80 hover:shadow-[0_0_18px_rgba(201,162,75,0.25)]"
                              >
                                View Certificate
                              </Link>

                              <Link
                                href={`/login/institute/add-course/beauty_certificate/marksheet/${item.certificateNo}`}
                                target="_blank"
                                className="inline-flex items-center justify-center px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-[#FBF9F4] backdrop-blur-xl transition-all duration-300 hover:border-[#C9A24B]/80 hover:shadow-[0_0_18px_rgba(201,162,75,0.25)]"
                              >
                                View Marksheet
                              </Link>

                              <a
                                href={item.verifyUrl}
                                target="_blank"
                                className="inline-flex items-center justify-center px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-[#FBF9F4] backdrop-blur-xl transition-all duration-300 hover:border-[#C9A24B]/80 hover:shadow-[0_0_18px_rgba(201,162,75,0.25)]"
                              >
                                Verify
                              </a>

                            </div>

                          </td>

                        </tr>

                      )
                    )

                  )}

                </tbody>

              </table>

            </div>

          </div>

        )}

      </div>

    </div>

  )
}
