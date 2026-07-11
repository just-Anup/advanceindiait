"use client";

import { useEffect, useState } from "react";
import { databases, account } from "@/lib/appwrite";
import { Query } from "appwrite";
import { useRouter } from "next/navigation";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const ADMISSION_COLLECTION = "student_admissions";
const RESULT_COLLECTION = "exam_results";
const BUCKET_ID = "6986e8a4001925504f6b";

export default function OfflineExamList() {

  const router = useRouter();

  const [students, setStudents] = useState([]);
  const [results, setResults] = useState({});

  // ✅ EXAM MODE
  const [examMode, setExamMode] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {

    const user = await account.get();

    const admissions = await databases.listDocuments(
      DATABASE_ID,
      ADMISSION_COLLECTION,
      [Query.equal("createdById", user.$id),
        Query.limit(200)
      ]

    );

    const examResults = await databases.listDocuments(
      DATABASE_ID,
      RESULT_COLLECTION,
      [Query.equal("createdById", user.$id),
         Query.limit(200)
      ]
    );

    const resultMap = {};

    examResults.documents.forEach((r) => {
      resultMap[r.studentId] = r;
    });

    setStudents(admissions.documents);
    setResults(resultMap);

    // ✅ LOAD SAVED EXAM MODE
    const savedMode = {};

    admissions.documents.forEach((student) => {
      savedMode[student.$id] = student.examMode || "";
    });

    setExamMode(savedMode);
  };

  return (

    <div className="relative min-h-screen text-[#FBF9F4] overflow-hidden bg-[#0A1229] px-8 py-28">
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
        <header className="mb-8">
          <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-xl">
            <span className="h-2.5 w-2.5 rounded-full bg-[#C9A24B] shadow-[0_0_24px_rgba(201,162,75,0.35)]" />
            <p className="text-sm text-white/80 font-[Inter]">
              Institute Dashboard
            </p>
          </div>

          <h2 className="mt-4 text-3xl font-bold tracking-wide font-[Playfair_Display]">
            List Offline Exams Results
          </h2>
          <p className="mt-2 max-w-2xl text-white/70 font-[Inter]">
            Manage offline exam mode and update results with a premium, glassmorphic interface.
          </p>
        </header>

        <section className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_20px_80px_rgba(0,0,0,0.55)]">
          <table className="w-full border-separate border-spacing-0">
            <thead className="bg-[#0A1229]/60">
              <tr>
                <th className="px-4 py-4 text-left text-xs font-semibold text-white/70 border-b border-white/10">
                  #
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-white/70 border-b border-white/10">
                  Photo
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-white/70 border-b border-white/10">
                  Student
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-white/70 border-b border-white/10">
                  Course
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-white/70 border-b border-white/10">
                  Exam Mode
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-white/70 border-b border-white/10">
                  Exam Status
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-white/70 border-b border-white/10">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {students.map((student, index) => {
                const result = results[student.$id];

                const photoUrl = student.photoId
                  ? `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${student.photoId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`
                  : null;

                return (
                  <tr
                    key={student.$id}
                    className="group transition-all duration-300 hover:bg-white/[0.04]"
                  >
                    <td className="px-4 py-4 border-b border-white/10 text-white/85">
                      {index + 1}
                    </td>

                    <td className="px-4 py-4 border-b border-white/10">
                      {photoUrl ? (
                        <div className="group relative inline-flex h-14 w-14 items-center justify-center">
                          <img
                            src={photoUrl}
                            alt={student.studentName}
                            className="h-14 w-14 rounded-2xl object-cover border border-white/10 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] transition-transform duration-300 group-hover:scale-110"
                          />
                          <div className="pointer-events-none absolute inset-0 rounded-2xl border border-[#C9A24B]/0 transition-colors duration-300 group-hover:border-[#C9A24B]/50" />
                        </div>
                      ) : (
                        <span className="text-white/50 font-[Inter]">No Photo</span>
                      )}
                    </td>

                    <td className="px-4 py-4 border-b border-white/10 font-medium text-[#FBF9F4]">
                      <div className="font-[Inter]">{student.studentName}</div>
                    </td>

                    <td className="px-4 py-4 border-b border-white/10">
                      <span className="text-white/80 font-[Inter]">
                        {student.courseType === "semester" && student.courseName?.length > 20
                          ? "Semester Course"
                          : student.courseName}
                      </span>
                    </td>

                    {/* ✅ EXAM MODE */}
                    <td className="px-4 py-4 border-b border-white/10">
                      <div className="relative">
                        <select
                          value={examMode[student.$id] || ""}
                          onChange={async (e) => {
                            const value = e.target.value;

                            const updated = {
                              ...examMode,
                              [student.$id]: value,
                            };

                            setExamMode(updated);

                            try {
                              await databases.updateDocument(
                                DATABASE_ID,
                                ADMISSION_COLLECTION,
                                student.$id,
                                {
                                  examMode: value,
                                }
                              );
                            } catch (err) {
                              console.log(err);
                            }
                          }}
                          className="w-full bg-[#0A1229]/40 border border-white/10 text-[#FBF9F4] px-4 py-2.5 rounded-xl outline-none backdrop-blur-xl font-[Inter] transition-all duration-300 focus:border-[#C9A24B]/80 hover:border-[#C9A24B]/40"
                        >
                          <option value="">Select</option>
                          <option value="offline">Offline</option>
                          <option value="online">Online</option>
                        </select>
                        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#C9A24B] opacity-80">
                          ▾
                        </div>
                      </div>
                    </td>

                    {/* ✅ RESULT STATUS */}
                    <td className="px-4 py-4 border-b border-white/10">
                      {result ? (
                        <div>
                          <p className="inline-flex items-center gap-2 rounded-full border border-[#C9A24B]/40 bg-[#C9A24B]/10 px-3 py-1 text-xs font-semibold text-[#C9A24B]">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#C9A24B] shadow-[0_0_20px_rgba(201,162,75,0.35)]" />
                            Appeared
                          </p>

                          <table className="w-full mt-3 border border-white/10 rounded-2xl overflow-hidden bg-white/5">
                            <thead>
                              <tr className="bg-white/5">
                                <th className="px-3 py-2 text-left text-xs font-semibold text-white/70 border-b border-white/10">
                                  Marks
                                </th>
                                <th className="px-3 py-2 text-left text-xs font-semibold text-white/70 border-b border-white/10">
                                  Result
                                </th>
                                <th className="px-3 py-2 text-left text-xs font-semibold text-white/70 border-b border-white/10">
                                  Grade
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="px-3 py-2 text-sm text-[#FBF9F4] border-b border-white/10">
                                  {result.percentage}%
                                </td>
                                <td className="px-3 py-2 text-sm text-[#FBF9F4] border-b border-white/10">
                                  {result.percentage >= 40 ? "Passed" : "Failed"}
                                </td>
                                <td className="px-3 py-2 text-sm text-[#FBF9F4] border-b border-white/10">
                                  {result.grade}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/70 font-[Inter]">
                          Applied
                        </span>
                      )}
                    </td>

                    {/* ✅ ACTION BUTTON */}
                    <td className="px-4 py-4 border-b border-white/10">
                      {/* OFFLINE BUTTON */}
                      {examMode[student.$id] === "offline" && (
                        <button
                          onClick={() =>
                            router.push(
                              `/login/institute/student-exam/offline/${student.$id}`
                            )
                          }
                          className="rounded-xl border border-[#C9A24B]/50 bg-[#0A1229]/30 px-5 py-2.5 font-semibold text-[#FBF9F4] backdrop-blur-xl transition-all duration-300 shadow-[0_0_0_1px_rgba(201,162,75,0.08)] hover:border-[#C9A24B]/90 hover:shadow-[0_0_20px_rgba(201,162,75,0.25)]"
                        >
                          {result ? "Update Result" : "Add Result"}
                        </button>
                      )}

                      {/* ONLINE BUTTON */}
                      {examMode[student.$id] === "online" && (
                        <button
                          onClick={async () => {
                            try {
                              await databases.updateDocument(
                                DATABASE_ID,
                                ADMISSION_COLLECTION,
                                student.$id,
                                {
                                  onlineExamStarted: true,
                                }
                              );
                              alert("Online Exam Started Successfully");
                            } catch (err) {
                              console.log(err);
                              alert("Failed To Start Exam");
                            }
                          }}
                          className="ml-0 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 font-semibold text-[#FBF9F4] backdrop-blur-xl transition-all duration-300 hover:border-[#C9A24B]/70 hover:shadow-[0_0_18px_rgba(201,162,75,0.18)]"
                        >
                          Start Exam
                        </button>
                      )}

                      {/* NO SELECTION */}
                      {!examMode[student.$id] && (
                        <button
                          disabled
                          className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 font-semibold text-white/40 cursor-not-allowed backdrop-blur-xl"
                        >
                          Select Mode
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      </div>
    </div>

  );
}