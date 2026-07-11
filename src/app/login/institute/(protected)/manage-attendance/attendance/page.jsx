"use client";

import { useEffect, useState } from "react";
import { databases, account } from "@/lib/appwrite";
import { Query, ID } from "appwrite";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const STUDENT_COLLECTION = "student_admissions";
const ATTENDANCE_COLLECTION = "attendance"; // create this in Appwrite

export default function AttendancePage() {
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState("");
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  // 🔥 LOAD BATCHES (from admissions)
  useEffect(() => {
    loadBatches();
  }, []);

  const loadBatches = async () => {
    try {
      const user = await account.get();

      const res = await databases.listDocuments(
        DATABASE_ID,
        STUDENT_COLLECTION,
        [Query.equal("franchiseEmail", user.email)]
      );

      // Extract unique batches
      const uniqueBatches = [
        ...new Set(res.documents.map((doc) => doc.batch).filter(Boolean)),
      ];

      setBatches(uniqueBatches);
    } catch (err) {
      console.log(err);
    }
  };

  // 🔥 LOAD STUDENTS BY BATCH
  const loadStudents = async () => {
    if (!selectedBatch) {
      alert("Please select batch");
      return;
    }

    try {
      const user = await account.get();

      const res = await databases.listDocuments(
        DATABASE_ID,
        STUDENT_COLLECTION,
        [
          Query.equal("franchiseEmail", user.email),
          Query.equal("batch", selectedBatch),
        ]
      );

      setStudents(res.documents);

      // Initialize attendance (default present)
      const initialAttendance = {};
      res.documents.forEach((student) => {
        initialAttendance[student.$id] = "Present";
      });

      setAttendance(initialAttendance);
    } catch (err) {
      console.log(err);
    }
  };

 
  // 🔥 HANDLE ATTENDANCE CHANGE
  const handleAttendanceChange = (studentId, status) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  // 🔥 SAVE ATTENDANCE
const saveAttendance = async () => {
  try {
    const user = await account.get();

    if (students.length === 0) {
      alert("No students found");
      return;
    }

    for (const student of students) {
        const existing = await databases.listDocuments(
  DATABASE_ID,
  ATTENDANCE_COLLECTION,
  [
    Query.equal("studentId", student.$id),
    Query.equal("date", date),
  ]
);

if (existing.documents.length > 0) {
  continue; // skip duplicate
}
      await databases.createDocument(
        DATABASE_ID,
        ATTENDANCE_COLLECTION,
        ID.unique(),
        {
          studentId: student.$id,
          studentName: student.studentName || "",
          batch: selectedBatch || "",
          status: attendance[student.$id] || "Present",
          date: date || new Date().toISOString(),
          franchiseEmail: user.email || "",
        }
      );
    }

    alert("Attendance Saved Successfully ✅");

  } catch (err) {
    console.error("ERROR SAVING:", err);
    alert(err.message || "Failed to save attendance");
  }
};
  return (
    <div className="min-h-screen bg-[#0A1229] px-8 py-28 text-[#FBF9F4] relative">
      {/* subtle grid texture + ambient glow */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_10%,rgba(201,162,75,0.25),transparent_50%),radial-gradient(circle_at_80%_30%,rgba(201,162,75,0.18),transparent_55%),radial-gradient(circle_at_50%_90%,rgba(201,162,75,0.12),transparent_50%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:56px_56px] opacity-60"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-6xl">
        <h1 className="mb-10 font-[PlayfairDisplay] text-4xl tracking-wide">
          ATTENDANCE SECTION
        </h1>

        {/* TOP SECTION */}
        <div className="mb-6 rounded-3xl border border-white/10 bg-white/[0.04] px-6 py-6 shadow-[0_0_40px_rgba(201,162,75,0.10)] backdrop-blur-xl grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Batch Select */}
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <label className="mb-2 block font-[Inter] text-sm text-[#FBF9F4]/90">
              Select Batch
            </label>
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#0A1229]/40 px-3 py-2 font-[Inter] text-[#FBF9F4] outline-none transition-all duration-300 hover:border-[#C9A24B]/60 focus:border-[#C9A24B]"
            >
              <option value="" className="bg-[#0A1229]">
                --select--
              </option>
              {batches.map((batch, index) => (
                <option key={index} value={batch} className="bg-[#0A1229]">
                  {batch}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <label className="mb-2 block font-[Inter] text-sm text-[#FBF9F4]/90">
              Select Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#0A1229]/40 px-3 py-2 font-[Inter] text-[#FBF9F4] outline-none transition-all duration-300 hover:border-[#C9A24B]/60 focus:border-[#C9A24B]"
            />
          </div>

          {/* Load Button */}
          <div className="flex items-end">
            <button
              onClick={loadStudents}
              className="w-full rounded-2xl border border-white/10 bg-[#C9A24B]/10 px-6 py-3 font-[Inter] font-semibold text-[#FBF9F4] shadow-[0_0_30px_rgba(201,162,75,0.12)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#C9A24B]/70 hover:bg-[#C9A24B]/15"
            >
              Load
            </button>
          </div>

          {/* Refresh */}
          <div className="flex items-end">
            <button
              onClick={loadBatches}
              className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-6 py-3 font-[Inter] font-semibold text-[#FBF9F4] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#C9A24B]/70 hover:bg-white/[0.08]"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* BATCH INFO */}
        {selectedBatch && (
          <div className="mb-10 rounded-3xl border border-white/10 bg-white/[0.04] px-6 py-5 backdrop-blur-xl shadow-[0_0_40px_rgba(201,162,75,0.08)]">
            <div className="flex flex-col gap-1 font-[Inter] text-sm text-[#FBF9F4]/90 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="text-[#C9A24B]">Batch:</span> {selectedBatch}
              </div>
              <div>
                <span className="text-[#C9A24B]">Total Students:</span> {students.length}
              </div>
            </div>
          </div>
        )}

        {/* STUDENT LIST */}
        {students.length > 0 && (
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] px-4 py-6 shadow-[0_0_50px_rgba(201,162,75,0.10)] backdrop-blur-xl">
            <div className="overflow-hidden rounded-2xl border border-white/10">
              <table className="w-full">
                <thead className="bg-black/20">
                  <tr className="border-b border-white/10">
                    <th className="px-4 py-3 text-left font-[Inter] text-xs font-semibold tracking-wider text-[#FBF9F4]/80">
                      #
                    </th>
                    <th className="px-4 py-3 text-left font-[Inter] text-xs font-semibold tracking-wider text-[#FBF9F4]/80">
                      Student Name
                    </th>
                    <th className="px-4 py-3 text-left font-[Inter] text-xs font-semibold tracking-wider text-[#FBF9F4]/80">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student, index) => (
                    <tr
                      key={student.$id}
                      className="border-b border-white/10 transition-colors duration-300 hover:bg-white/[0.03]"
                    >
                      <td className="px-4 py-3 font-[Inter] text-sm text-[#FBF9F4]/85">
                        {index + 1}
                      </td>
                      <td className="px-4 py-3 font-[Inter] text-sm">
                        {student.studentName}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={attendance[student.$id]}
                          onChange={(e) =>
                            handleAttendanceChange(student.$id, e.target.value)
                          }
                          className="w-full rounded-xl border border-white/10 bg-[#0A1229]/40 px-3 py-2 font-[Inter] text-[#FBF9F4] outline-none transition-all duration-300 hover:border-[#C9A24B]/60 focus:border-[#C9A24B]"
                        >
                          <option value="Present" className="bg-[#0A1229]">
                            Present
                          </option>
                          <option value="Absent" className="bg-[#0A1229]">
                            Absent
                          </option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              onClick={saveAttendance}
              className="mt-6 w-full rounded-2xl border border-white/10 bg-[#C9A24B]/15 px-6 py-3 font-[Inter] font-semibold text-[#FBF9F4] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#C9A24B]/70 hover:bg-[#C9A24B]/20"
            >
              Save Attendance
            </button>
          </div>
        )}
      </div>
    </div>
  );
}