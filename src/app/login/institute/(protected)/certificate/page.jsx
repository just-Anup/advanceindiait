"use client";

import { useEffect, useState } from "react";
import { databases, account } from "@/lib/appwrite";
import { Query, ID } from "appwrite";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const RESULT_COLLECTION = "exam_results";
const CERT_COLLECTION = "certificates";
const BUCKET_ID = "6986e8a4001925504f6b";

export default function CertificatePage() {

  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {

    try {

      setLoading(true);

      const user = await account.get();

      // ✅ LOAD RESULTS
    const res = await databases.listDocuments(
  DATABASE_ID,
  RESULT_COLLECTION,
  [
    Query.orderDesc("$createdAt"),
    Query.limit(500),
  ]
);

      // ✅ LOAD CERTIFICATES
     const certRes = await databases.listDocuments(
  DATABASE_ID,
  CERT_COLLECTION,
  [
    Query.limit(500)
  ]
);

      // ✅ CREATE APPLIED ARRAY
     const appliedStudents = certRes.documents.map(
  (cert) => String(cert.studentId)
);

      // ✅ FILTER RESULTS
 // Only passed students of this institute
const passed = res.documents.filter(
  (r) =>
    r.grade !== "F" &&
    r.createdById === user.$id
);

// Remove duplicate studentIds (keep latest result)
const uniqueMap = new Map();

passed.forEach((r) => {

  if (!uniqueMap.has(r.studentId)) {

    const isApplied = certRes.documents.some(
      cert => cert.studentId === r.studentId
    );

    uniqueMap.set(r.studentId, {
      ...r,
      alreadyApplied: isApplied,
    });

  }

});

const passedStudents = [...uniqueMap.values()];

      setResults(passedStudents);

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);

    }

  };

 const toggleSelect = (id) => {

  const student = results.find(r => r.$id === id);

  if (student?.alreadyApplied) return;

  if (selected.includes(id)) {
    setSelected(selected.filter(s => s !== id));
  } else {
    setSelected([...selected, id]);
  }
};
  const applyCertificate = async () => {

    if (selected.length === 0) {
      alert("Please select at least one student");
      return;
    }

    try {

      for (const id of selected) {

        const student = results.find(r => r.$id === id);

        if (!student) continue;

        // ✅ PREVENT DUPLICATE
        const existing = await databases.listDocuments(
          DATABASE_ID,
          CERT_COLLECTION,
          [
            Query.equal("studentId", student.studentId)
          ]
        );

        if (existing.documents.length > 0) {
          continue;
        }

        await databases.createDocument(
          DATABASE_ID,
          CERT_COLLECTION,
          ID.unique(),
          {
            studentId: student.studentId,
            studentName: student.studentName,
            course: student.course,
            instituteName: student.instituteName,
            franchiseId: student.franchiseId,
            photoId: student.photoId,
            marks: student.totalMarks,
            grade: student.grade,
            examMode: student.examMode || "OFFLINE",
            examDate: student.examDate || "",
            certificateNo: "BNMI-" + Date.now(),
            status: "pending",
            createdById: student.createdById,
            createdAt: new Date().toISOString()
          }
        );

        try {
  const updated = await databases.updateDocument(
    DATABASE_ID,
    RESULT_COLLECTION,
    student.$id,
    {
      certificateApplied: true,
    }
  );

  console.log("UPDATED SUCCESS:", updated);
} catch (error) {
  console.log("UPDATE ERROR:", error);
}

      }



      alert("Certificate request sent to admin");

      setSelected([]);

      setResults(prev =>
  prev.map(item =>
    selected.includes(item.$id)
      ? { ...item, alreadyApplied: true }
      : item
  )
);

setSelected([]); 


      // ✅ RELOAD FOR DISABLE CHECKBOX
      loadResults();

    } catch (err) {

      console.log(err);
      alert("Error applying certificate");

    }

  };

  const getPhoto = (photoId) => {

    if (!photoId) return null;

    return `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${photoId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;

  };

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
        {/* HEADER */}
        <header className="mb-10">
          <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-xl">
            <span className="h-2.5 w-2.5 rounded-full bg-[#C9A24B] shadow-[0_0_24px_rgba(201,162,75,0.35)]" />
            <p className="text-sm text-white/80 font-[Inter]">Institute Certificate Requests</p>
          </div>

          <h2 className="mt-4 text-3xl font-bold tracking-wide font-[Playfair_Display]">All Exam Results</h2>
          <p className="mt-2 max-w-2xl text-white/70 font-[Inter]">Apply certificates for passed students using a premium glass interface.</p>

          <button
            onClick={applyCertificate}
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl border border-[#C9A24B]/50 bg-[#0A1229]/30 px-8 py-3 font-semibold text-[#FBF9F4] backdrop-blur-xl transition-all duration-300 shadow-[0_0_0_1px_rgba(201,162,75,0.06)] hover:border-[#C9A24B]/90 hover:shadow-[0_0_30px_rgba(201,162,75,0.28)]"
          >
            <span>Apply For Certificate</span>
            <span className="text-[#C9A24B]">→</span>
          </button>
        </header>

        {/* TABLE CARD */}
        <section className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_20px_80px_rgba(0,0,0,0.55)]">
          <div className="overflow-x-auto">
            <table className="w-full border-separate border-spacing-0">
              <thead className="bg-[#0A1229]/60">
                <tr>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-white/70 border-b border-white/10"> </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-white/70 border-b border-white/10">#</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-white/70 border-b border-white/10">Photo</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-white/70 border-b border-white/10">Student</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-white/70 border-b border-white/10">Course</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-white/70 border-b border-white/10">Exam Mode</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-white/70 border-b border-white/10">Objective</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-white/70 border-b border-white/10">Practical</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-white/70 border-b border-white/10">Percentage</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-white/70 border-b border-white/10">Grade</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-white/70 border-b border-white/10">Result</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-white/70 border-b border-white/10">Exam Date</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="12" className="text-center p-10 text-white/60 font-[Inter]">Loading...</td>
                  </tr>
                ) : results.length === 0 ? (
                  <tr>
                    <td colSpan="12" className="text-center p-10 text-white/60 font-[Inter]">No Passed Students Found</td>
                  </tr>
                ) : (
                  results.map((r, index) => {
                    const photoUrl = getPhoto(r.photoId);

                    let objective = 0;
                    let practical = 0;

                    try {
                      const marks = JSON.parse(r.marks);
                      marks.forEach((m) => {
                        objective += Number(m.theory || 0);
                        practical += Number(m.practical || 0);
                      });
                    } catch {}

                    return (
                      <tr
                        key={r.$id}
                        className="group transition-all duration-300 hover:bg-white/[0.04]"
                      >
                        {/* CHECKBOX */}
                        <td className="px-4 py-4 border-b border-white/10">
                          {r.alreadyApplied ? (
                            <span className="inline-flex items-center rounded-full border border-[#C9A24B]/40 bg-[#C9A24B]/10 px-3 py-1 text-[11px] font-semibold text-[#C9A24B]">
                              Applied
                            </span>
                          ) : (
                            <input
                              type="checkbox"
                              checked={selected.includes(r.$id)}
                              onChange={() => toggleSelect(r.$id)}
                              className="w-5 h-5 accent-[#C9A24B] cursor-pointer"
                            />
                          )}
                        </td>

                        <td className="px-4 py-4 border-b border-white/10 font-medium text-white/85">{index + 1}</td>

                        {/* PHOTO */}
                        <td className="px-4 py-4 border-b border-white/10">
                          {photoUrl ? (
                            <div className="group relative inline-flex h-14 w-14 items-center justify-center">
                              <img
                                src={photoUrl}
                                alt={r.studentName}
                                className="h-14 w-14 rounded-2xl object-cover border border-white/10 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] transition-transform duration-300 group-hover:scale-110"
                              />
                              <div className="pointer-events-none absolute inset-0 rounded-2xl border border-[#C9A24B]/0 transition-colors duration-300 group-hover:border-[#C9A24B]/60" />
                            </div>
                          ) : (
                            <span className="text-white/50 font-[Inter]">N/A</span>
                          )}
                        </td>

                        {/* NAME */}
                        <td className="px-4 py-4 border-b border-white/10 font-semibold text-[#FBF9F4]">
                          {r.studentName}
                        </td>

                        {/* COURSE */}
                        <td className="px-4 py-4 border-b border-white/10 text-white/70">{r.course}</td>

                        {/* EXAM MODE */}
                        <td className="px-4 py-4 border-b border-white/10">
                          <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold text-white/80">
                            OFFLINE
                          </span>
                        </td>

                        {/* OBJECTIVE */}
                        <td className="px-4 py-4 border-b border-white/10 font-medium text-white/85">{objective}</td>

                        {/* PRACTICAL */}
                        <td className="px-4 py-4 border-b border-white/10 font-medium text-white/85">{practical}</td>

                        {/* PERCENTAGE */}
                        <td className="px-4 py-4 border-b border-white/10 font-bold text-[#C9A24B]">{r.percentage}%</td>

                        {/* GRADE */}
                        <td className="px-4 py-4 border-b border-white/10">
                          <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold text-[#FBF9F4]">
                            {r.grade}
                          </span>
                        </td>

                        {/* RESULT */}
                        <td className="px-4 py-4 border-b border-white/10">
                          <span className="inline-flex items-center rounded-full border border-[#C9A24B]/40 bg-[#C9A24B]/10 px-3 py-1 text-[11px] font-semibold text-[#C9A24B]">
                            Passed
                          </span>
                        </td>

                        {/* DATE */}
                        <td className="px-4 py-4 border-b border-white/10 text-white/70">{r.examDate || "-"}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>


  );

}