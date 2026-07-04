'use client'

import { useEffect, useState } from 'react'
import { databases, ID, account } from '@/lib/appwrite'
import { Query } from 'appwrite'

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID
const COURSE_COLLECTION = 'courses_single'
const SUBJECT_COLLECTION = 'course_subjects'

export default function ListSingleCourses() {

  const [courses, setCourses] = useState([])
  const [editCourse, setEditCourse] = useState(null)
  const [selectedCourse, setSelectedCourse] = useState(null)

  const [courseFees, setCourseFees] = useState('')
  const [minimumFees, setMinimumFees] = useState('')
  const [subject, setSubject] = useState('')
  const [search, setSearch] = useState('')

  const fetchCourses = async () => {

    try {

      const user = await account.get()

      const res = await databases.listDocuments(
        DATABASE_ID,
        COURSE_COLLECTION,
        [
          Query.equal("franchiseEmail", user.email)
        ]
      )

      setCourses(res.documents)

    } catch (error) {
      console.log("Fetch Error:", error)
    }
  }

  useEffect(() => {
    fetchCourses()
  }, [])

  const deleteCourse = async (id) => {

    if (!id) return

    try {

      await databases.deleteDocument(
        DATABASE_ID,
        COURSE_COLLECTION,
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
        COURSE_COLLECTION,
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

  const saveSubject = async () => {

    if (!selectedCourse) return

    if (!subject.trim()) {
      alert("Enter subject name")
      return
    }

    try {

      const user = await account.get()

      const res = await databases.createDocument(
        DATABASE_ID,
        SUBJECT_COLLECTION,
        ID.unique(),
        {
          courseId: String(selectedCourse.$id),
          subjectName: String(subject).toUpperCase(),
          franchiseEmail: user.email
        }
      )

      console.log("Saved:", res)

      alert("Subject Saved Successfully")

      setSubject('')

      const textarea = document.querySelector('textarea')

      if (textarea) textarea.style.height = "auto"

      setSelectedCourse(null)

    } catch (error) {

      console.error("Appwrite Error:", error)
      alert(error.message)

    }
  }

  const handleInput = (e) => {

    setSubject(e.target.value)

    e.target.style.height = "auto"
    e.target.style.height = e.target.scrollHeight + "px"
  }

  return (

    <div className="min-h-screen text-[#FBF9F4] p-3 sm:p-5 lg:p-10 bg-[#0A1229] relative overflow-hidden">

      {/* Subtle grid texture + ambient glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(201,162,75,0.18),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(201,162,75,0.10),transparent_45%),radial-gradient(circle_at_50%_90%,rgba(201,162,75,0.08),transparent_35%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.06] bg-[linear-gradient(to_right,rgba(255,255,255,0.6)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.6)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl p-3 sm:p-5 lg:p-6 border border-white/10 shadow-[0_0_40px_rgba(201,162,75,0.06)]">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

          <h2 className="text-lg sm:text-xl font-bold">
            Course List
          </h2>

        </div>

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search Course..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-4 p-3 w-full bg-black border border-gray-700 rounded outline-none focus:border-orange-500 text-sm sm:text-base"
        />

        {/* TABLE */}
        <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/[0.03]">

          <table className="w-full min-w-[1000px] border-collapse text-xs sm:text-sm">

            <thead className="bg-white/5 text-[#FBF9F4]">


              <tr>
                <th className="border border-gray-800 p-2 whitespace-nowrap">Sr</th>
                <th className="border border-gray-800 p-2 whitespace-nowrap">Course Name</th>
                <th className="border border-gray-800 p-2 whitespace-nowrap">Exam Fees</th>
                <th className="border border-gray-800 p-2 whitespace-nowrap">Course Fees</th>
                <th className="border border-gray-800 p-2 whitespace-nowrap">Minimum Fees</th>
                <th className="border border-gray-800 p-2 whitespace-nowrap">Duration</th>
                <th className="border border-gray-800 p-2 whitespace-nowrap">Status</th>
                <th className="border border-gray-800 p-2 whitespace-nowrap">Action</th>
              </tr>

            </thead>

            <tbody>

              {courses
                .filter(course =>
                  course.courseName.toLowerCase().includes(search.toLowerCase())
                )
                .map((course, index) => (

                  <tr
                    key={course.$id}
                    className="hover:bg-[#1a1a1a]"
                  >

                    <td className="border border-gray-800 p-2">
                      {index + 1}
                    </td>

                    <td className="border border-gray-800 p-2 min-w-[220px]">
                      {course.courseName}
                    </td>

                    <td className="border border-gray-800 p-2 whitespace-nowrap">
                      {course.examFees}
                    </td>

                    <td className="border border-gray-800 p-2 whitespace-nowrap">
                      {course.courseFees}
                    </td>

                    <td className="border border-gray-800 p-2 whitespace-nowrap">
                      {course.minimumFees}
                    </td>

                    <td className="border border-gray-800 p-2 whitespace-nowrap">
                      {course.duration}
                    </td>

                    <td className="border border-gray-800 p-2 text-green-400 whitespace-nowrap">
                      {course.status}
                    </td>

                    <td className="border border-gray-800 p-2">

                      <div className="flex flex-wrap gap-2 min-w-[260px]">

                        <button
                          onClick={() => openEdit(course)}
                          className="group relative px-3 py-1 rounded text-xs sm:text-sm font-medium border border-white/10 bg-white/5 text-[#FBF9F4] transition-all duration-300 hover:border-[#C9A24B] hover:shadow-[0_0_24px_rgba(201,162,75,0.35)] hover:-translate-y-[1px]"
                        >
                          <span className="absolute inset-0 rounded opacity-0 group-hover:opacity-100 transition-opacity bg-[radial-gradient(circle_at_20%_0%,rgba(201,162,75,0.35),transparent_55%)]" />
                          <span className="relative">Edit</span>
                        </button>

                        <button
                          onClick={() => setSelectedCourse(course)}
                          className="group relative px-3 py-1 rounded text-xs sm:text-sm font-medium border border-white/10 bg-white/5 text-[#FBF9F4] transition-all duration-300 hover:border-[#C9A24B] hover:shadow-[0_0_24px_rgba(201,162,75,0.25)] hover:-translate-y-[1px]"
                        >
                          <span className="absolute inset-0 rounded opacity-0 group-hover:opacity-100 transition-opacity bg-[radial-gradient(circle_at_20%_0%,rgba(201,162,75,0.25),transparent_55%)]" />
                          <span className="relative">Add Subject</span>
                        </button>

                        <button
                          onClick={() => deleteCourse(course.$id)}
                          className="group relative px-3 py-1 rounded text-xs sm:text-sm font-medium border border-white/10 bg-white/5 text-[#FBF9F4] transition-all duration-300 hover:border-[#C9A24B] hover:shadow-[0_0_24px_rgba(201,162,75,0.20)] hover:-translate-y-[1px]"
                        >
                          <span className="absolute inset-0 rounded opacity-0 group-hover:opacity-100 transition-opacity bg-[radial-gradient(circle_at_20%_0%,rgba(201,162,75,0.25),transparent_55%)]" />
                          <span className="relative">Delete</span>
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

        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50 p-4">

          <div className="bg-[#121212] border border-gray-700 p-4 sm:p-6 rounded-xl w-full max-w-md text-white">

            <h3 className="text-lg font-bold mb-4">
              Edit Course Fees
            </h3>

            <input
              type="number"
              value={courseFees}
              onChange={(e) => setCourseFees(e.target.value)}
              className="border border-gray-700 bg-black text-white p-3 w-full mb-4 rounded outline-none"
              placeholder="Course Fee"
            />

            <input
              type="number"
              value={minimumFees}
              onChange={(e) => setMinimumFees(e.target.value)}
              className="border border-gray-700 bg-black text-white p-3 w-full mb-4 rounded outline-none"
              placeholder="Minimum Fee"
            />

            <div className="flex flex-col sm:flex-row justify-end gap-2">

              <button
                onClick={() => setEditCourse(null)}
                className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded w-full sm:w-auto"
              >
                Close
              </button>

              <button
                onClick={updateFees}
                className="bg-orange-500 hover:bg-orange-600 text-black px-4 py-2 rounded w-full sm:w-auto"
              >
                Save
              </button>

            </div>

          </div>

        </div>

      )}

      {/* SUBJECT MODAL */}
      {selectedCourse && (

        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50 p-4">

          <div className="bg-[#121212] border border-gray-700 p-4 sm:p-6 rounded-xl w-full max-w-md text-white">

            <h3 className="text-lg font-bold mb-4">
              Add Course Subject
            </h3>

            <div className="flex flex-col gap-4">

              <textarea
                value={subject}
                onChange={(e) => {
                  setSubject(e.target.value)

                  e.target.style.height = "auto"
                  e.target.style.height = e.target.scrollHeight + "px"
                }}
                placeholder="Enter subjects"
                rows={1}
                className="border border-gray-700 bg-black text-white p-3 w-full rounded resize-none overflow-hidden uppercase outline-none"
              />

              <div className="flex flex-col sm:flex-row justify-end gap-2">

                <button
                  onClick={() => setSelectedCourse(null)}
                  className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded w-full sm:w-auto"
                >
                  Close
                </button>

                <button
                  onClick={saveSubject}
                  className="bg-orange-500 hover:bg-orange-600 text-black px-4 py-2 rounded w-full sm:w-auto"
                >
                  Save
                </button>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  )
}