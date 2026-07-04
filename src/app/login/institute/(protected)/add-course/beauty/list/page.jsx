'use client'

import { useEffect, useState } from 'react'
import { databases, account } from '@/lib/appwrite'
import { Query } from 'appwrite'

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID
const COURSE_COLLECTION = 'beauty_courses_single'
const SUBJECT_COLLECTION = 'beauty_courses_subjects'

export default function ListBeautyCourses() {

  const [courses, setCourses] = useState([])
  const [editCourse, setEditCourse] = useState(null)
  const [selectedCourse, setSelectedCourse] = useState(null)

  const [courseFees, setCourseFees] = useState('')
  const [minimumFees, setMinimumFees] = useState('')
  const [subject, setSubject] = useState('')
  const [search, setSearch] = useState('')

  // FETCH COURSES
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

  // DELETE
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

  // EDIT OPEN
  const openEdit = (course) => {

    setEditCourse(course)
    setCourseFees(course.courseFees)
    setMinimumFees(course.minimumFees)
  }

  // UPDATE
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

  // ADD SUBJECT
  const saveSubject = async () => {

    if (!selectedCourse) return

    if (!subject.trim()) {
      alert("Enter subject name")
      return
    }

    try {

      const user = await account.get()

      await databases.createDocument(
        DATABASE_ID,
        SUBJECT_COLLECTION,
        'unique()',
        {
          courseId: String(selectedCourse.$id),
          subjectName: String(subject),
          franchiseEmail: user.email
        }
      )

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

      <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl p-4 sm:p-6 lg:p-8 shadow-[0_0_60px_rgba(201,162,75,0.10)] border border-white/10">


        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

          <h2 className="text-lg sm:text-xl font-bold">
            Course List
          </h2>

        </div>

        {/* SEARCH */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search Course..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-[#C9A24B]/70 text-sm sm:text-base text-[#FBF9F4] placeholder:text-white/40 backdrop-blur-xl transition-all"
          />
        </div>


        {/* TABLE */}
        <div className="overflow-x-auto rounded-lg border border-gray-800">

          <table className="w-full min-w-[1000px] border-collapse text-xs sm:text-sm">

            <thead className="bg-white/5 text-[#FBF9F4]">


              <tr>

                <th className="border border-gray-800 p-2 whitespace-nowrap">
                  Sr
                </th>

                <th className="border border-gray-800 p-2 whitespace-nowrap">
                  Course Name
                </th>

                <th className="border border-gray-800 p-2 whitespace-nowrap">
                  Exam Fees
                </th>

                <th className="border border-gray-800 p-2 whitespace-nowrap">
                  Course Fees
                </th>

                <th className="border border-gray-800 p-2 whitespace-nowrap">
                  Minimum Fees
                </th>

                <th className="border border-gray-800 p-2 whitespace-nowrap">
                  Duration
                </th>

                <th className="border border-gray-800 p-2 whitespace-nowrap">
                  Status
                </th>

                <th className="border border-gray-800 p-2 whitespace-nowrap">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {courses
                .filter(course =>
                  course.courseName
                    .toLowerCase()
                    .includes(search.toLowerCase())
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
                          className="bg-orange-500 hover:bg-orange-600 text-black px-3 py-1 rounded text-xs sm:text-sm font-medium"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => setSelectedCourse(course)}
                          className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-xs sm:text-sm font-medium"
                        >
                          Add Subject
                        </button>

                        <button
                          onClick={() => deleteCourse(course.$id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs sm:text-sm font-medium"
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