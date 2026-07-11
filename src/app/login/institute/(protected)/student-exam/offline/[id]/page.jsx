"use client";

import { useEffect, useState } from "react";
import { databases, account } from "@/lib/appwrite";
import { useParams, useRouter } from "next/navigation";
import { ID } from "appwrite";
import { Query } from "appwrite";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const ADMISSION_COLLECTION = "student_admissions";
const RESULT_COLLECTION = "exam_results";
const BUCKET_ID = "6986e8a4001925504f6b";

export default function ResultPage() {
  const { id } = useParams();
  const router = useRouter();

  const [student, setStudent] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [marks, setMarks] = useState([]);
  const [selectedSem, setSelectedSem] = useState(1);
  const [totalSem, setTotalSem] = useState(1);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) loadStudent();
  }, [id]);

  useEffect(() => {
    if (
      student?.courseType === "semester" &&
      student?.courseCode &&
      selectedSem
    ) {
      loadSemesterSubjects(student.courseCode, selectedSem);
    }
  }, [selectedSem, student]);

  const loadStudent = async () => {
    try {
      const res = await databases.getDocument(
        DATABASE_ID,
        ADMISSION_COLLECTION,
        id
      );

      setStudent(res);

      // ✅ SEMESTER SUPPORT (NEW)
      if (res.courseType === "semester") {
        let courseCode = res.courseCode;

        // 🔥 fallback if missing
        if (!courseCode) {
          const courseRes = await databases.listDocuments(
            DATABASE_ID,
            "semester_courses",
            [Query.equal("courseName", res.courseName)]
          );

          if (courseRes.documents.length > 0) {
            courseCode = courseRes.documents[0].courseCode;
          }
        }

        if (!courseCode) {
          alert("Course code not found");
          return;
        }

        // ✅ FETCH COURSE DETAILS (THIS IS THE KEY FIX)
        const courseRes = await databases.listDocuments(
          DATABASE_ID,
          "franchise_semester_courses",
          [Query.equal("courseCode", courseCode)]
        );

        if (courseRes.documents.length > 0) {
          const courseData = courseRes.documents[0];
          setTotalSem(courseData.totalSemesters || 1);
        }

        // ✅ STORE COURSE CODE
        setStudent((prev) => ({
          ...prev,
          courseCode,
        }));

        // ✅ LOAD FIRST SEMESTER
        await loadSemesterSubjects(courseCode, 1);
        return;
      }

      // ✅ OLD LOGIC (UNCHANGED)
      let subjectList = [];

      if (res.subjects) {
        // ✅ SINGLE / BEAUTY
        if (res.courseType === "single" || res.courseType === "beauty") {
          subjectList = [
            res.subjects
              .split(",")
              .map((s) => s.trim())
              .join(", "),
          ];
        } else if (res.courseType === "multiple") {
          if (res.subjects.includes("||")) {
            subjectList = res.subjects
              .split("||")
              .map((s) => s.trim())
              .filter(Boolean);
          } else {
            subjectList = res.subjects
              .split(/,\s*(?![^()]*\))/)
              .map((s) => s.trim())
              .filter(Boolean);
          }
        } else {
          subjectList = [res.subjects];
        }
      }

      setSubjects(subjectList);

      const initialMarks = subjectList.map((sub) => ({
        subject: sub,
        theory: "",
        practical: "",
        total: 0,
      }));

      setMarks(initialMarks);
    } catch (err) {
      console.log(err);
    }
  };

  const loadSemesterSubjects = async (courseCode, semester) => {
    try {
      const semNumber = Number(semester);

      const res = await databases.listDocuments(
        DATABASE_ID,
        "franchise_semester_course_subjects",
        [
          Query.equal("courseCode", courseCode),
          Query.equal("semesterNumber", semNumber),
          Query.equal("franchiseEmail", student.franchiseEmail),
        ]
      );

      const subjectList = res.documents.map((s) => s.subjectName);

      const initialMarks = subjectList.map((sub) => ({
        subject: sub,
        theory: "",
        practical: "",
        total: 0,
      }));

      setSubjects(subjectList);
      setMarks(initialMarks);
    } catch (err) {
      console.log("SEM SUBJECT ERROR:", err);
    }
  };

  const updateMarks = (index, field, value) => {
    let val = Number(value) || 0;

    // 🚫 LIMIT TO 50
    if (val > 50) {
      alert("Maximum marks allowed is 50");
      val = 50;
    }

    if (val < 0) val = 0;

    const updated = [...marks];
    updated[index][field] = val;

    updated[index].total =
      Number(updated[index].theory || 0) +
      Number(updated[index].practical || 0);

    setMarks(updated);
  };

  const calculateTotal = () => {
    return marks.reduce((sum, m) => sum + m.total, 0);
  };

  const calculatePercentage = () => {
    const total = calculateTotal();

    const maxMarks =
      student?.courseType === "single" || student?.courseType === "beauty"
        ? 100
        : subjects.length * 100;

    if (maxMarks === 0) return 0;
    return Math.round((total / maxMarks) * 100);
  };

  const calculateGrade = () => {
    const percentage = calculatePercentage();

    if (percentage >= 80) return "A";
    if (percentage >= 60) return "B";
    if (percentage >= 40) return "C";

    return "F";
  };

  const saveResult = async () => {
    if (saving) return;
    setSaving(true);

    if (!student) {
      alert("Student not loaded");
      setSaving(false);
      return;
    }

    if (marks.length === 0) {
      alert("No subjects available");
      setSaving(false);
      return;
    }

    try {
      const user = await account.get();

      const totalMarks = calculateTotal();
      const percentage = calculatePercentage();
      const grade = calculateGrade();

      // CHECK WHETHER RESULT ALREADY EXISTS
      const existingResult = await databases.listDocuments(
        DATABASE_ID,
        RESULT_COLLECTION,
        [
          Query.equal("studentId", id),
          Query.limit(1),
        ]
      );

      let resultId;

      const resultData = {
        studentId: id,
        studentName: student.studentName || "",
        course: student.courseName || "",
        photoId: student.photoId || "",

        subjects: subjects.join(", "),

        semesterNumber: Number(selectedSem),
        courseCode: student.courseCode,
        courseType: student.courseType,

        marksArray: JSON.stringify(
          marks.map((m) => ({
            subject: m.subject,
            objective: Number(m.theory || 0),
            practical: Number(m.practical || 0),
            total: Number(m.theory || 0) + Number(m.practical || 0),
          }))
        ),

        totalMarks: Number(totalMarks),
        percentage: Number(percentage),
        grade,

        franchiseId: student.franchiseId || "",
        instituteName: student.instituteName || "",

        createdById: user.$id,
        createdAt: new Date().toISOString(),
      };

      if (existingResult.documents.length > 0) {
        resultId = existingResult.documents[0].$id;

        await databases.updateDocument(
          DATABASE_ID,
          RESULT_COLLECTION,
          resultId,
          resultData
        );
      } else {
        const newResult = await databases.createDocument(
          DATABASE_ID,
          RESULT_COLLECTION,
          ID.unique(),
          resultData
        );

        resultId = newResult.$id;
      }

      const oldSubjects = await databases.listDocuments(
        DATABASE_ID,
        "student_subject_results",
        [
          Query.equal("studentId", id),
          Query.limit(500),
        ]
      );

      for (const doc of oldSubjects.documents) {
        await databases.deleteDocument(
          DATABASE_ID,
          "student_subject_results",
          doc.$id
        );
      }

      // ===============================
      // ✅ FINAL CORRECT SAVE LOGIC
      // ===============================
      if (student.courseType === "multiple") {
        for (const m of marks) {
          await databases.createDocument(
            DATABASE_ID,
            "student_subject_results",
            ID.unique(),
            {
              studentId: id,
              subject: m.subject,
              objective: Number(m.theory || 0),
              practical: Number(m.practical || 0),
              total: Number(m.theory || 0) + Number(m.practical || 0),
              courseType: student.courseType,
              createdAt: new Date().toISOString(),
            }
          );
        }
      } else {
        for (const m of marks) {
          await databases.createDocument(
            DATABASE_ID,
            "student_subject_results",
            ID.unique(),
            {
              studentId: id,
              subject: m.subject || "Course",
              objective: Number(m.theory || 0),
              practical: Number(m.practical || 0),
              total: Number(m.theory || 0) + Number(m.practical || 0),
              courseType: student.courseType,
              createdAt: new Date().toISOString(),
            }
          );
        }
      }

      alert("Result Saved Successfully");
      router.push("/login/institute/student-exam/offline");
    } catch (err) {
      console.error("SAVE ERROR:", err);
      alert(err?.message || "Error saving result");
      setSaving(false);
    }
  };

  const photoUrl = student?.photoId
    ? `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${student.photoId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`
    : null;

  if (!student) {
    return (
      <div className="relative p-10 text-[#FBF9F4] bg-[#0A1229] min-h-screen overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(to_right,rgba(251,249,244,0.35)_1px,transparent_1px),linear-gradient(to_bottom,rgba(251,249,244,0.35)_1px,transparent_1px)] [background-size:56px_56px]" />
        Loading student data...
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#0A1229] px-8 py-28 text-[#FBF9F4] overflow-hidden">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-[#C9A24B]/10 blur-3xl" />
        <div className="absolute top-1/3 -left-24 h-[420px] w-[420px] rounded-full bg-[#C9A24B]/5 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[360px] w-[520px] rounded-full bg-[#C9A24B]/10 blur-3xl" />
      </div>

      {/* Subtle grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:linear-gradient(to_right,rgba(251,249,244,0.35)_1px,transparent_1px),linear-gradient(to_bottom,rgba(251,249,244,0.35)_1px,transparent_1px)] [background-size:56px_56px]"
      />

      <div className="relative mx-auto max-w-6xl">
        <header className="mb-10">
          <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-xl">
            <span className="h-2.5 w-2.5 rounded-full bg-[#C9A24B] shadow-[0_0_24px_rgba(201,162,75,0.35)]" />
            <p className="text-sm text-white/80 font-[Inter]">Offline Exam Result</p>
          </div>

          <h2 className="mt-4 text-3xl font-bold tracking-wide font-[Playfair_Display]">
            Update Practical Exam Result
          </h2>

          <p className="mt-2 max-w-2xl text-white/70 font-[Inter]">
            Premium, glassmorphic interface for marking and saving exam outcomes.
          </p>
        </header>

        {/* Student Info */}
        <div className="bg-white/5 border border-white/10 p-6 md:p-8 rounded-3xl shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_20px_80px_rgba(0,0,0,0.55)] backdrop-blur-xl mb-6">
          <div className="flex items-center gap-6">
            {photoUrl ? (
              <div className="group relative inline-flex h-24 w-24 items-center justify-center rounded-2xl">
                <img
                  src={photoUrl}
                  alt={student.studentName}
                  className="h-24 w-24 rounded-2xl object-cover border border-white/10 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] transition-transform duration-300 group-hover:scale-110"
                />
                <div className="pointer-events-none absolute inset-0 rounded-2xl border border-[#C9A24B]/0 transition-colors duration-300 group-hover:border-[#C9A24B]/70" />
              </div>
            ) : (
              <div className="h-24 w-24 rounded-2xl border border-white/10 bg-[#0A1229]/40 flex items-center justify-center">
                <span className="text-white/50 font-[Inter] text-sm">No Photo</span>
              </div>
            )}

            <div className="flex-1 min-w-0">
              <p className="text-lg font-semibold font-[Inter] text-white/90">
                Student Name:{" "}
                <span className="text-[#FBF9F4]">{student.studentName}</span>
              </p>
              <p className="mt-1 text-white/70 font-[Inter]">
                Course:{" "}
                <span className="text-white/90">{student.courseName}</span>
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center rounded-full border border-white/10 bg-[#0A1229]/30 px-3 py-1 text-xs font-semibold text-white/80">
                  <span className="mr-2 h-1.5 w-1.5 rounded-full bg-[#C9A24B] shadow-[0_0_20px_rgba(201,162,75,0.35)]" />
                  Offline
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Marks Table */}
        <div className="bg-white/5 border border-white/10 p-6 md:p-8 rounded-3xl shadow-[0_0_0_1px_rgba(255,255,255,0.03)] backdrop-blur-xl">
          {student.courseType === "semester" && (
            <div className="mb-6 flex items-center gap-3">
              <label className="font-[Inter] font-semibold text-white/80">
                Select Semester:
              </label>
              <select
                value={selectedSem}
                onChange={(e) => setSelectedSem(Number(e.target.value))}
                className="flex-1 max-w-xs border border-white/10 bg-[#0A1229]/40 text-[#FBF9F4] px-4 py-2.5 rounded-xl outline-none font-[Inter] transition-all duration-300 hover:border-[#C9A24B]/40 focus:border-[#C9A24B]/80"
              >
                {[...Array(totalSem)].map((_, i) => (
                  <option key={i} value={i + 1}>
                    Semester {i + 1}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="rounded-2xl border border-white/10 overflow-hidden">
            <table className="w-full border-separate border-spacing-0">
              <thead className="bg-[#0A1229]/60">
                <tr>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-white/70 border-b border-white/10">
                    Subject
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-white/70 border-b border-white/10">
                    Max Marks
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-white/70 border-b border-white/10">
                    Theory
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-white/70 border-b border-white/10">
                    Practical
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-white/70 border-b border-white/10">
                    Total
                  </th>
                </tr>
              </thead>

              <tbody key={selectedSem}>
                {subjects.map((sub, index) => {
                  const total = marks[index]?.total || 0;

                  return (
                    <tr
                      key={index}
                      className="group transition-colors duration-300 hover:bg-white/[0.04]"
                    >
                      <td className="px-4 py-3 border-b border-white/10 text-white/85">
                        {sub}
                      </td>
                      <td className="px-4 py-3 border-b border-white/10 text-white/85">
                        100
                      </td>
                      <td className="px-4 py-3 border-b border-white/10">
                        <input
                          type="number"
                          max={50}
                          min={0}
                          value={marks[index]?.theory ?? ""}
                          onChange={(e) =>
                            updateMarks(index, "theory", e.target.value)
                          }
                          className="w-24 border border-white/10 bg-[#0A1229]/40 text-[#FBF9F4] px-3 py-2 rounded-xl outline-none transition-all duration-300 hover:border-[#C9A24B]/40 focus:border-[#C9A24B]/80"
                        />
                      </td>
                      <td className="px-4 py-3 border-b border-white/10">
                        <input
                          type="number"
                          max={50}
                          min={0}
                          value={marks[index]?.practical ?? ""}
                          onChange={(e) =>
                            updateMarks(index, "practical", e.target.value)
                          }
                          className="w-24 border border-white/10 bg-[#0A1229]/40 text-[#FBF9F4] px-3 py-2 rounded-xl outline-none transition-all duration-300 hover:border-[#C9A24B]/40 focus:border-[#C9A24B]/80"
                        />
                      </td>
                      <td className="px-4 py-3 border-b border-white/10 font-bold text-[#FBF9F4]">
                        {total}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-300 hover:border-[#C9A24B]/40">
              <p className="text-white/70 font-[Inter]">Total Marks</p>
              <p className="mt-1 text-2xl font-bold font-[Inter]">
                {calculateTotal()}
              </p>
              <div className="mt-3 h-[1px] w-16 bg-[#C9A24B]/50" />
            </div>

            <div className="p-5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-300 hover:border-[#C9A24B]/40">
              <p className="text-white/70 font-[Inter]">Percentage</p>
              <p className="mt-1 text-2xl font-bold font-[Inter]">
                {calculatePercentage()}%
              </p>
              <div className="mt-3 h-[1px] w-16 bg-[#C9A24B]/50" />
            </div>

            <div className="p-5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-300 hover:border-[#C9A24B]/40">
              <p className="text-white/70 font-[Inter]">Grade</p>
              <p className="mt-1 text-2xl font-bold font-[Inter] text-[#C9A24B]">
                {calculateGrade()}
              </p>
              <div className="mt-3 h-[1px] w-16 bg-[#C9A24B]/50" />
            </div>
          </div>

          <button
            onClick={saveResult}
            disabled={saving}
            className={`mt-8 w-full sm:w-auto px-8 py-3 rounded-2xl border backdrop-blur-xl transition-all duration-300 font-semibold font-[Inter] shadow-[0_0_0_1px_rgba(201,162,75,0.06)]
              ${
                saving
                  ? "bg-white/5 border-white/10 text-white/50 cursor-not-allowed"
                  : "bg-[#0A1229]/30 border-[#C9A24B]/50 text-[#FBF9F4] hover:border-[#C9A24B]/90 hover:shadow-[0_0_30px_rgba(201,162,75,0.28)]"
              }`}
          >
            {saving ? "Saving...please wait" : "Save Result"}
          </button>
        </div>
      </div>
    </div>
  );
}

