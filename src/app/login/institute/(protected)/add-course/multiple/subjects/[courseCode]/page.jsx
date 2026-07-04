'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { databases, account, ID } from '@/lib/appwrite'
import { Query } from 'appwrite'

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID

export default function SubjectPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()

  const courseId = params.id

  const courseName = searchParams.get('name')
  const courseCode = searchParams.get('code')
  const duration = searchParams.get('duration')
  const examFee = searchParams.get('examFee') // ✅ ADD HERE

  const [subjects, setSubjects] = useState([])
  const [selectedSubjects, setSelectedSubjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchSubjects()
  }, [])

  const fetchSubjects = async () => {
    try {
      const res = await databases.listDocuments(
        DATABASE_ID,
        'subjects_master',
        [
          Query.equal('courseCode', courseCode),
          Query.limit(500)
        ]
      )

      setSubjects(res.documents)
    } catch (error) {
      console.log(error)
      alert('Failed to load subjects')
    } finally {
      setLoading(false)
    }
  }

  const handleSubjectChange = (subjectName) => {
    const exists = selectedSubjects.includes(subjectName)

    if (exists) {
      setSelectedSubjects(
        selectedSubjects.filter(item => item !== subjectName)
      )
      return
    }

    if (selectedSubjects.length >= 10) {
      alert('You can select maximum 10 subjects only')
      return
    }

    setSelectedSubjects([
      ...selectedSubjects,
      subjectName
    ])
  }

  const saveCourse = async () => {
    try {
      if (selectedSubjects.length === 0) {
        alert('Please select at least one subject')
        return
      }

      setSaving(true)

      const user = await account.get()

      // CHECK DUPLICATE COURSE
      const existing = await databases.listDocuments(
        DATABASE_ID,
        'franchise_multiple_courses',
        [
          Query.equal('franchiseEmail', user.email),
          Query.equal('courseCode', courseCode)
        ]
      )

      if (existing.documents.length > 0) {
        alert('Course already added')
        setSaving(false)
        return
      }

      await databases.createDocument(
        DATABASE_ID,
        'franchise_multiple_courses',
        ID.unique(),
        {
          franchiseEmail: user.email,
          courseId: courseId,
          courseCode: courseCode,
          courseName: courseName,
          duration: duration,
          subjects: selectedSubjects.join('||'),
          courseFees: 0,
          minimumFees: 0,
          examFees: Number(examFee || 0),
          status: 'Active'
        }
      )

      alert('Course Added Successfully')

      router.push('/login/institute/add-course/multiple/list')
    } catch (error) {
      console.log(error)
      alert(error.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-[#0A1229] text-[#FBF9F4] p-4 sm:p-6 lg:p-10 overflow-hidden">
      {/* Ambient glow + subtle grid */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(900px_300px_at_20%_0%,rgba(201,162,75,0.16),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(700px_280px_at_90%_30%,rgba(201,162,75,0.10),transparent)]" />
        <div className="absolute inset-0 opacity-[0.12] bg-[linear-gradient(to_right,rgba(255,255,255,0.25)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.25)_1px,transparent_1px)] bg-[size:48px_48px]" />
      </div>

      <div className="relative">
        {/* HEADER */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 sm:p-8 shadow-[0_25px_90px_rgba(0,0,0,0.55)]">
            <h1 className="font-playfair text-2xl sm:text-3xl font-bold tracking-wide leading-tight">
              Select Subjects
            </h1>

            <p className="text-white/70 mt-2 text-sm sm:text-base">
              Choose maximum 10 subjects for this course
            </p>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#0A1229]/40 border border-white/10 rounded-xl p-4">
                <p className="text-white/60 text-sm">Course Code</p>
                <p className="font-semibold text-[#C9A24B] text-lg sm:text-xl mt-1">
                  {courseCode}
                </p>
              </div>

              <div className="bg-[#0A1229]/40 border border-white/10 rounded-xl p-4">
                <p className="text-white/60 text-sm">Duration</p>
                <p className="font-semibold text-[#C9A24B] text-lg sm:text-xl mt-1">
                  {duration}
                </p>
              </div>

              <div className="bg-[#0A1229]/40 border border-white/10 rounded-xl p-4">
                <p className="text-white/60 text-sm">Selected Subjects</p>
                <p className="font-semibold text-[#C9A24B] text-lg sm:text-xl mt-1">
                  {selectedSubjects.length}/10
                </p>
              </div>
            </div>

            <div className="mt-5">
              <p className="text-white/80 font-semibold font-inter">
                {courseName}
              </p>
            </div>
          </div>

          {/* SUBJECT LIST */}
          <div className="mt-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl shadow-[0_25px_90px_rgba(0,0,0,0.45)] overflow-hidden">
            <div className="relative px-5 py-4">
              <div className="absolute inset-0 bg-gradient-to-r from-[#C9A24B]/20 via-transparent to-transparent" />
              <div className="relative flex items-center gap-3">
                <div className="h-2.5 w-2.5 rounded-full bg-[#C9A24B] shadow-[0_0_25px_rgba(201,162,75,0.45)]" />
                <div className="font-playfair font-bold text-lg sm:text-xl tracking-wide text-[#FBF9F4]">
                  Available Subjects
                </div>
              </div>
            </div>

            {loading ? (
              <div className="p-10 text-center text-white/60">
                Loading Subjects...
              </div>
            ) : subjects.length === 0 ? (
              <div className="p-10 text-center text-[#C9A24B]/90">
                No subjects found for this course
              </div>
            ) : (
              <div className="p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {subjects.map((subject) => {
                    const isSelected = selectedSubjects.includes(
                      subject.subjectName
                    )

                    return (
                      <label
                        key={subject.$id}
                        className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all duration-300 ${
                          isSelected
                            ? 'border-[#C9A24B]/60 bg-[#C9A24B]/10 shadow-[0_0_0_1px_rgba(201,162,75,0.20),0_22px_60px_rgba(201,162,75,0.10)]'
                            : 'border-white/10 bg-white/5 hover:border-[#C9A24B]/40 hover:bg-white/7'
                        } hover:-translate-y-px`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() =>
                            handleSubjectChange(subject.subjectName)
                          }
                          className="w-5 h-5 accent-[#C9A24B]"
                        />

                        <span className="text-sm sm:text-base text-white/90">
                          {subject.subjectName}
                        </span>
                      </label>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* SELECTED SUBJECTS */}
          <div className="mt-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-5">
            <h2 className="text-lg font-bold mb-4 text-[#C9A24B] font-playfair">
              Selected Subjects ({selectedSubjects.length})
            </h2>

            {selectedSubjects.length === 0 ? (
              <p className="text-white/60 font-inter">
                No subject selected
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {selectedSubjects.map((subject, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center bg-[#C9A24B]/10 border border-[#C9A24B]/40 text-[#FBF9F4] px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:border-[#C9A24B]/70 hover:shadow-[0_0_25px_rgba(201,162,75,0.18)]"
                  >
                    {subject}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* SAVE BUTTON */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={saveCourse}
              disabled={saving}
              className="btn-primary-dark disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Add Course'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}