'use client'

import { useEffect, useState } from 'react'
import { databases, account } from '@/lib/appwrite'
import { Query } from 'appwrite'

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID

export default function ListPage() {

  const [courses, setCourses] = useState([])
  const [editCourse, setEditCourse] = useState(null)

  const [courseFees, setCourseFees] = useState('')
  const [minimumFees, setMinimumFees] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchCourses()
  }, [])

  const deleteCourse = async (id) => {

    if (!id) return

    try {

      await databases.deleteDocument(
        DATABASE_ID,
        "franchise_multiple_courses",
        id
      )

      fetchCourses()

    } catch (error) {

      console.log("Delete Error:", error)
    }
  }

  const openEdit = (course) => {

    setEditCourse(course)
    setCourseFees(course.courseFees)
    setMinimumFees(course.minimumFees)
  }

  const updateFees = async () => {

    if (!editCourse) return

    try {

      await databases.updateDocument(
        DATABASE_ID,
        "franchise_multiple_courses",
        editCourse.$id,
        {
          courseFees: Number(courseFees),
          minimumFees: Number(minimumFees)
        }
      )

      setEditCourse(null)

      fetchCourses()

    } catch (error) {

      console.log("Update Error:", error)
    }
  }

  const fetchCourses = async () => {

    const user = await account.get()

    const res = await databases.listDocuments(
      DATABASE_ID,
      "franchise_multiple_courses",
      [
        Query.equal("franchiseEmail", user.email)
      ]
    )

    setCourses(res.documents)
  }

  return (

    <div className="relative min-h-screen bg-[#0A1229] text-[#FBF9F4] p-3 sm:p-5 lg:p-10 overflow-hidden">

      {/* Ambient glow + subtle grid */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(900px_300px_at_20%_0%,rgba(201,162,75,0.16),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(700px_280px_at_90%_30%,rgba(201,162,75,0.10),transparent)]" />
        <div className="absolute inset-0 opacity-[0.12] bg-[linear-gradient(to_right,rgba(255,255,255,0.25)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.25)_1px,transparent_1px)] bg-[size:48px_48px]" />
      </div>

      <div className="relative">

        {/* HEADER */}
        <div className="mb-8 pt-2">
          <h1 className="font-playfair text-2xl sm:text-3xl font-bold tracking-wide leading-tight">
            LIST COURSES ADDED MULTIPLE SUBJECT
          </h1>
          <p className="text-white/70 mt-2 text-sm sm:text-base">
            Manage fees for your added courses. Premium, secure, and consistent.
          </p>
        </div>

        {/* SEARCH */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by course code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-3 sm:p-4 bg-white/5 backdrop-blur border border-white/10 rounded-xl outline-none text-sm sm:text-base text-[#FBF9F4] placeholder:text-white/40 focus:border-[#C9A24B] focus:ring-1 focus:ring-[#C9A24B]/30 transition"
            />
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              <span className="h-2 w-2 rounded-full bg-[#C9A24B] shadow-[0_0_22px_rgba(201,162,75,0.55)]" />
            </div>
          </div>
        </div>

        {/* TABLE CARD */}
        <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl shadow-[0_20px_80px_rgba(0,0,0,0.55)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] border-collapse">
              <thead className="text-xs sm:text-sm uppercase tracking-wide">
                <tr className="bg-[#C9A24B]/15 text-[#C9A24B] border-b border-white/10">
                  <th className="p-3 sm:p-4 text-left whitespace-nowrap font-semibold">Course Code</th>
                  <th className="p-3 sm:p-4 text-left whitespace-nowrap font-semibold">Course Name</th>
                  <th className="p-3 sm:p-4 text-left whitespace-nowrap font-semibold">Subjects</th>
                  <th className="p-3 sm:p-4 text-left whitespace-nowrap font-semibold">Duration</th>
                  <th className="p-3 sm:p-4 text-left whitespace-nowrap font-semibold">Exam Fees</th>
                  <th className="p-3 sm:p-4 text-left whitespace-nowrap font-semibold">Course Fees</th>
                  <th className="p-3 sm:p-4 text-left whitespace-nowrap font-semibold">Minimum Fees</th>
                  <th className="p-3 sm:p-4 text-left whitespace-nowrap font-semibold">Status</th>
                  <th className="p-3 sm:p-4 text-left whitespace-nowrap font-semibold">Action</th>
                </tr>
              </thead>

              <tbody className="font-inter">
                {courses
                  .filter(course =>
                    course.courseCode
                      ?.toLowerCase()
                      .includes(search.toLowerCase())
                  )
                  .map(course => (
                    <tr
                      key={course.$id}
                      className="border-t border-white/10 hover:bg-white/5 transition"
                    >
                      <td className="p-3 sm:p-4 border-b border-white/10 whitespace-nowrap text-white/80">
                        {course.courseCode}
                      </td>

                      <td className="p-3 sm:p-4 border-b border-white/10 whitespace-nowrap">
                        <span className="font-semibold text-[#FBF9F4]">{course.courseName}</span>
                      </td>

                      <td className="p-3 sm:p-4 border-b border-white/10 min-w-[300px] max-w-[450px] break-words">
                        {course.subjects
                          ? course.subjects
                              .split(",")
                              .map((subject, index) => (
                                <div key={index} className="mb-1 last:mb-0 text-white/80">
                                  <span className="text-[#C9A24B] mr-2">{index + 1}.</span>
                                  {subject.trim()}
                                </div>
                              ))
                          : <span className="text-white/50">No Subjects</span>}
                      </td>

                      <td className="p-3 sm:p-4 border-b border-white/10 whitespace-nowrap text-white/80">
                        {course.duration}
                      </td>

                      <td className="p-3 sm:p-4 border-b border-white/10 whitespace-nowrap">
                        <span className="text-emerald-300/90 font-semibold">₹{course.examFees || 0}</span>
                      </td>

                      <td className="p-3 sm:p-4 border-b border-white/10 whitespace-nowrap">
                        <span className="text-[#FBF9F4] font-semibold">₹{course.courseFees || 0}</span>
                      </td>

                      <td className="p-3 sm:p-4 border-b border-white/10 whitespace-nowrap text-white/80">
                        {course.minimumFees}
                      </td>

                      <td className="p-3 sm:p-4 border-b border-white/10 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm bg-white/5 border border-white/10 text-green-300/90">
                          {course.status}
                        </span>
                      </td>

                      <td className="p-3 sm:p-4 border-b border-white/10">
                        <div className="flex flex-wrap gap-2 min-w-[180px]">
                          <button
                            onClick={() => openEdit(course)}
                            className="px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap border border-[#C9A24B]/40 bg-[#C9A24B]/10 text-[#FBF9F4] transition hover:border-[#C9A24B]/70 hover:bg-[#C9A24B]/20 hover:shadow-[0_0_0_1px_rgba(201,162,75,0.35),0_18px_55px_rgba(201,162,75,0.10)]"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => deleteCourse(course.$id)}
                            className="px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap border border-red-400/30 bg-red-500/10 text-red-100 transition hover:border-red-400/60 hover:bg-red-500/20"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* EDIT MODAL */}
        {editCourse && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur z-50 p-4">
            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl w-full max-w-md text-[#FBF9F4] shadow-[0_25px_90px_rgba(0,0,0,0.65)] p-4 sm:p-6">
              <h3 className="font-playfair text-xl font-bold tracking-wide">
                Edit Course Fees
              </h3>
              <p className="text-white/70 mt-1 text-sm">
                Update your selected course fees with premium precision.
              </p>

              <div className="mt-5">
                <label className="text-white/70 text-sm">Course Fees</label>
                <input
                  type="number"
                  value={courseFees}
                  onChange={(e) => setCourseFees(e.target.value)}
                  className="mt-2 border border-white/10 bg-[#0A1229]/50 text-[#FBF9F4] p-3 w-full rounded-xl outline-none focus:border-[#C9A24B]"
                  placeholder="Course Fee"
                />
              </div>

              <div className="mt-4">
                <label className="text-white/70 text-sm">Minimum Fees</label>
                <input
                  type="number"
                  value={minimumFees}
                  onChange={(e) => setMinimumFees(e.target.value)}
                  className="mt-2 border border-white/10 bg-[#0A1229]/50 text-[#FBF9F4] p-3 w-full rounded-xl outline-none focus:border-[#C9A24B]"
                  placeholder="Minimum Fee"
                />
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-2 mt-6">
                <button
                  onClick={() => setEditCourse(null)}
                  className="px-4 py-2 rounded-xl w-full sm:w-auto border border-white/10 bg-white/5 text-white/90 hover:bg-white/10 transition"
                >
                  Close
                </button>

                <button
                  onClick={updateFees}
                  className="px-4 py-2 rounded-xl w-full sm:w-auto border border-[#C9A24B]/40 bg-[#C9A24B]/10 text-[#FBF9F4] font-semibold transition hover:border-[#C9A24B]/70 hover:bg-[#C9A24B]/20"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
