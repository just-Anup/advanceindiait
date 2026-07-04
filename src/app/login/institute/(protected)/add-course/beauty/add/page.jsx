'use client'

import { useEffect, useState } from 'react'
import { databases, ID, account } from '@/lib/appwrite'
import { Query } from 'appwrite'
import { useRouter } from 'next/navigation'

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID
const MASTER_COLLECTION = 'beauty_courses_master'
const BEAUTY_COLLECTION = 'beauty_courses_single'

export default function addBeautycourse() {

  const router = useRouter()

  const [examFee, setExamFee] = useState(0)
  const [courses, setCourses] = useState([])
  const [selectedCourses, setSelectedCourses] = useState({})
  const [search, setSearch] = useState('')

  // FETCH MASTER COURSES
const fetchCourses = async () => {
  try {
    console.log("DATABASE_ID:", DATABASE_ID)
    console.log("COLLECTION_ID:", MASTER_COLLECTION)

    const res = await databases.listDocuments(
      DATABASE_ID,
      MASTER_COLLECTION,
      [
        Query.limit(100) // Increase limit to 100
      ]
    )

    console.log("FULL RESPONSE:", res)
    console.log("DOCUMENTS:", res.documents)

    setCourses(res.documents)

  } catch (error) {
    console.error("FETCH ERROR:", error)
  }
}

  // FETCH PLAN
  useEffect(() => {

    const fetchPlan = async () => {

      const user = await account.get()

      const res = await databases.listDocuments(
        DATABASE_ID,
        "franchise_approved",
        [Query.equal("email", user.email)]
      )

      const plan = res.documents[0]?.plan

      const planRes = await databases.listDocuments(
        DATABASE_ID,
        "franchise_plans",
        [Query.equal("name", plan)]
      )

      const fee = planRes.documents[0]?.amount || 0

      setExamFee(fee)
    }

    fetchPlan()

  }, [])

  useEffect(() => {
    fetchCourses()
  }, [])

  // CHECKBOX SELECT
  const handleCheck = (course) => {

    setSelectedCourses(prev => {

      if (prev[course.$id]) {

        const updated = { ...prev }
        delete updated[course.$id]

        return updated
      }

      return {
        ...prev,
        [course.$id]: {
          ...course,
          courseFees: '',
          minimumFees: ''
        }
      }
    })
  }

  // INPUT HANDLING
  const handleInput = (id, field, value) => {

    setSelectedCourses(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value
      }
    }))
  }

  // ADD / UPDATE COURSE
  const addCourse = async () => {

    const selected = Object.values(selectedCourses)

    if (selected.length === 0) {
      alert("Please select a course")
      return
    }

    try {

      const user = await account.get()

      const res = await databases.listDocuments(
        DATABASE_ID,
        "franchise_approved",
        [Query.equal("email", user.email)]
      )

      const franchise = res.documents[0]

      const userPlan = franchise?.plan

      const finalExamFee = examFee

      for (const course of selected) {

        if (!course.courseFees || !course.minimumFees) {
          alert("Please enter Course Fee and Minimum Fee")
          return
        }

        // CHECK EXISTING COURSE
        const existing = await databases.listDocuments(
          DATABASE_ID,
          BEAUTY_COLLECTION,
          [
            Query.equal("courseId", course.$id),
            Query.equal("franchiseEmail", user.email)
          ]
        )

        if (existing.documents.length > 0) {

          // UPDATE
          await databases.updateDocument(
            DATABASE_ID,
            BEAUTY_COLLECTION,
            existing.documents[0].$id,
            {
              courseFees: Number(course.courseFees),
              minimumFees: Number(course.minimumFees),
              examFees: finalExamFee,
              status: "Active"
            }
          )

        } else {

          // CREATE
          await databases.createDocument(
            DATABASE_ID,
            BEAUTY_COLLECTION,
            ID.unique(),
            {
              courseId: course.$id,
              courseCode: course.courseCode,
              courseName: course.courseName,
              duration: course.duration,
              examFees: finalExamFee,
              courseFees: Number(course.courseFees),
              minimumFees: Number(course.minimumFees),
              status: "Active",
              franchiseEmail: user.email
            }
          )
        }
      }

      alert("Course Saved Successfully")

      setSelectedCourses({})

      router.push('/login/institute/add-course/beauty/list')

    } catch (error) {

      console.log("Add Course Error:", error)
      alert(error.message)
    }
  }

  return (

    <div className="min-h-screen bg-[#0A1229] text-[#FBF9F4] p-3 sm:p-5 lg:p-10 relative overflow-hidden">
      {/* Ambient glow + subtle grid */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(201,162,75,0.18),transparent_45%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-20 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:48px_48px]" />

      <div className="relative bg-white/5 backdrop-blur rounded-2xl p-3 sm:p-5 lg:p-6 shadow-[0_0_40px_rgba(201,162,75,0.12)] border border-white/10">


        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">

          <h2 className="text-lg sm:text-xl font-[Playfair_Display] tracking-wide leading-tight text-[#FBF9F4]">
            ADD COURSE WITH SINGLE SUBJECT
            <span className="block mt-2 h-[1px] w-24 bg-[#C9A24B]/60" />
          </h2>

          <button
            onClick={addCourse}
            className="bg-[#C9A24B] hover:shadow-[0_0_28px_rgba(201,162,75,0.45)] transition-all text-black font-semibold px-5 py-2 rounded-xl w-full sm:w-auto"
          >
            Add Course
          </button>


        </div>

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search Course..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-4 p-3 w-full bg-white/5 border border-white/10 rounded-xl outline-none focus:border-[#C9A24B] text-sm sm:text-base placeholder:text-white/50"
        />


        {/* TABLE */}
                  <div className="text-green-500 mb-4">
  Courses Found: {courses.length}
</div>

        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/5">

          <table className="w-full min-w-[900px] border-collapse text-xs sm:text-sm">

            <thead className="bg-white/5 text-[#C9A24B]">

    
                  <tr>

                <th className="border border-white/10 p-2"></th>

                <th className="border border-white/10 p-2 whitespace-nowrap font-semibold">
                  Course Code
                </th>

                <th className="border border-white/10 p-2 whitespace-nowrap font-semibold">
                  Course Name
                </th>

                <th className="border border-white/10 p-2 whitespace-nowrap font-semibold">
                  Course Duration
                </th>

                <th className="border border-white/10 p-2 whitespace-nowrap font-semibold">
                  Exam Fees
                </th>

                <th className="border border-white/10 p-2 whitespace-nowrap font-semibold">
                  Course Fee
                </th>

                <th className="border border-white/10 p-2 whitespace-nowrap font-semibold">
                  Minimum Fee
                </th>

              </tr>


            </thead>

            <tbody>

              {courses
              .filter(course =>
  (course.courseName || '')
    .toLowerCase()
    .includes(search.toLowerCase())
)
                .map(course => (

                  <tr
                    key={course.$id}
                    className="border border-white/10 hover:bg-white/5 transition-colors"
                  >


                    <td className="border border-white/10 p-2 text-center">


                      <input
                        type="checkbox"
                        checked={!!selectedCourses[course.$id]}
                        onChange={() => handleCheck(course)}
                        className="accent-[#C9A24B] w-4 h-4"
                      />


                    </td>

                    <td className="border border-gray-800 p-2 whitespace-nowrap">
                      {course.courseCode}
                    </td>

                    <td className="border border-gray-800 p-2 min-w-[220px]">
                      {course.courseName}
                    </td>

                    <td className="border border-gray-800 p-2 whitespace-nowrap">
                      {course.duration}
                    </td>

                    <td className="border border-gray-800 p-2 whitespace-nowrap">
                      ₹{examFee}
                    </td>

                    <td className="border border-gray-800 p-2">

                      <input
                        type="number"
                        placeholder="Course Fee"
                        className="border border-white bg-black text-white p-2 w-full min-w-[120px] rounded outline-none"
                        disabled={!selectedCourses[course.$id]}
                        onChange={(e) =>
                          handleInput(course.$id, 'courseFees', e.target.value)
                        }
                      />

                    </td>

                    <td className="border border-gray-800 p-2">

                      <input
                        type="number"
                        placeholder="Minimum Fee"
                        className="border border-white bg-black text-white p-2 w-full min-w-[120px] rounded outline-none"
                        disabled={!selectedCourses[course.$id]}
                        onChange={(e) =>
                          handleInput(course.$id, 'minimumFees', e.target.value)
                        }
                      />

                    </td>

                  </tr>

                ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  )
}