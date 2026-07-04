"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { databases } from "@/lib/appwrite";
import { Query } from "appwrite";


const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const CERT_COLLECTION = "certificates";
const BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID;



export default function CertificateApprovalPage() {

  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  // ===============================
  // ✅ MARKSHEET PRINT
  // ===============================
const printMarksheet = async (cert) => {
  try {

    let studentData = null;
    let franchiseData = null;

    // ===============================
    // 🔹 FETCH STUDENT
    // ===============================
    if (cert.studentId) {
      studentData = await databases.getDocument(
        DATABASE_ID,
        "student_admissions",
        cert.studentId
      );
    } else {
      const res = await databases.listDocuments(
        DATABASE_ID,
        "student_admissions",
        [Query.equal("studentName", cert.studentName)]
      );

      if (!res.documents.length) {
        alert("Student not found");
        return;
      }

      studentData = res.documents[0];
    }

    // ===============================
    // 🔹 FETCH FRANCHISE
    // ===============================
    const franchiseRes = await databases.listDocuments(
      DATABASE_ID,
      "franchise_approved",
      [Query.equal("email", studentData.franchiseEmail)]
    );

    if (franchiseRes.documents.length > 0) {
      franchiseData = franchiseRes.documents[0];
    }

    // ===============================
    // 🔥 FETCH COURSE DURATION
    // ===============================
    let courseDuration = "";

    try {
      if (studentData.courseType === "beauty") {
        const res = await databases.listDocuments(
          DATABASE_ID,
          "beauty_courses_single",
          [
            Query.equal("courseName", studentData.courseName),
            Query.equal("franchiseEmail", studentData.franchiseEmail)
          ]
        );
        if (res.documents.length > 0) {
          courseDuration = res.documents[0].duration || "";
        }

      } else if (studentData.courseType === "single") {
        const res = await databases.listDocuments(
          DATABASE_ID,
          "courses_single",
          [
            Query.equal("courseName", studentData.courseName),
            Query.equal("franchiseEmail", studentData.franchiseEmail)
          ]
        );
        if (res.documents.length > 0) {
          courseDuration = res.documents[0].duration || "";
        }

      } else if (studentData.courseType === "multiple") {
        const res = await databases.listDocuments(
          DATABASE_ID,
          "course_master_multiple",
          [
            Query.equal("courseName", studentData.courseName)
          ]
        );
        if (res.documents.length > 0) {
          courseDuration = res.documents[0].duration || "";
        }
      }
    } catch (err) {
      console.log("COURSE DURATION ERROR:", err);
    }

    // ===============================
    // 🔥 SUBJECT LIST
    // ===============================
    let subjectList = [];

    if (
      studentData.courseType === "single" ||
      studentData.courseType === "beauty"
    ) {
      subjectList = [
        studentData.subjects
          ?.split(",")
          .map((s) => s.trim())
          .join(", "),
      ];
    } else {
      subjectList =
        studentData.subjects
          ?.split(",")
          .map((s) => s.trim()) || [];
    }

    // ===============================
    // 🔥 MARKS PARSE
    // ===============================
    let parsedMarks = [];

    try {
      if (typeof cert.marks === "string" && cert.marks.startsWith("[")) {
        parsedMarks = JSON.parse(cert.marks);
      } else if (!isNaN(cert.marks)) {
        parsedMarks = [
          {
            subject: subjectList[0] || "Subject",
            theory: Number(cert.marks),
            practical: 0,
          },
        ];
      } else if (Array.isArray(cert.marks)) {
        parsedMarks = cert.marks;
      }
    } catch (err) {
      console.log("MARK PARSE ERROR:", err);
    }

    // ===============================
    // 🔥 FORMAT MARKS
    // ===============================
    const formattedMarks = parsedMarks.map((m, index) => ({
      subject:
        subjectList[index] ||
        m.subject ||
        `Subject ${index + 1}`,

      objective: Number(m.theory || m.objective || 0),
      practical: Number(m.practical || 0),

      total:
        Number(m.theory || m.objective || 0) +
        Number(m.practical || 0),
    }));

    // ===============================
    // 🔥 FINAL MARKS LOGIC
    // ===============================
    let marksArray = [];

    if (studentData.courseType === "semester") {

      const sem = Number(cert.semesterNumber);

      if (!sem || isNaN(sem)) {
        alert("Semester number missing. Please re-apply certificate.");
        return;
      }

      const resultRes = await databases.listDocuments(
        DATABASE_ID,
        "exam_results",
        [
          Query.equal("studentId", cert.studentId),
          Query.equal("semesterNumber", sem)
        ]
      );

      if (!resultRes.documents.length) {
        alert("Result not found for this semester");
        return;
      }

      const result = resultRes.documents[0];

      marksArray =
        typeof result.marksArray === "string"
          ? JSON.parse(result.marksArray)
          : result.marksArray || [];

    } else {
      // ✅ SINGLE / BEAUTY / MULTIPLE
      marksArray = formattedMarks;
    }



// ✅ VERIFY URL
const verifyUrl =
  `https://www.bnmiindia.org/beauty-verification/${cert.studentId}`;



const data = {

  ...studentData,
  ...cert,

  studentName:
    cert.studentName ||
    studentData.studentName ||
    "",

  fatherName:
    cert.fatherName ||
    studentData.fatherName ||
    "",

  motherName:
    cert.motherName ||
    studentData.motherName ||
    "",

  course:
    cert.course ||
    studentData.courseName ||
    "",

  duration:
    cert.duration ||
    studentData.duration ||
    studentData.courseDuration ||
    "",

  marks:
    cert.marks || "",

  grade:
    cert.grade || "",

  instituteName:
    cert.instituteName ||
    studentData.instituteName ||
    "",

  city:
    cert.city ||
    franchiseData?.city ||
    franchiseData?.address ||
    "",

  certificateNo:
    cert.certificateNo || "",

  issueDate:
    cert.issueDate || "",

  logo:
    cert.logo ||
    franchiseData?.logo ||
    "",

  ownerName:
    cert.ownerName ||
    franchiseData?.ownerName ||
    franchiseData?.owner ||
    franchiseData?.name ||
    "Controller",

  franchiseSignature:
    cert.franchiseSignature ||
    franchiseData?.signature ||
    "",

  photoId:
    studentData.photoId || "",

  signatureId:
    studentData.signatureId || "",

  relationType:
    studentData.relationType ||
    "S/O",

  showFatherInCertificate:
    String(
      studentData.showFatherInCertificate
    ).toLowerCase() === "true",

  showMotherInCertificate:
    String(
      studentData.showMotherInCertificate
    ).toLowerCase() === "true",

    


  verifyUrl,



  studentId:
    cert.studentId,

  marksArray,

  courseType:
    studentData.courseType ||

    "",

  marksheetNo:
    cert.certificateNo ||

    "",

  dob:
    studentData.dob ||

    "",

  coursePeriod:
    cert.duration ||
    studentData.duration ||
    studentData.courseDuration ||
    ""
};
    // ===============================
    // ✅ SAVE + OPEN
    // ===============================
    localStorage.setItem("marksheetStudent", JSON.stringify(data));

    if (studentData.courseType === "beauty") {
      window.open("/login/institute/certificate/beauty-marksheet", "_blank");

    } else if (studentData.courseType === "semester") {
      window.open("/login/institute/certificate/semester-marksheet", "_blank");

    } else if (studentData.courseType === "multiple") {
      window.open("/login/institute/certificate/multiple-marksheet", "_blank");

    } else {
      window.open("/login/institute/certificate/marksheet", "_blank");
    }

  } catch (err) {
    console.error("MARKSHEET ERROR:", err);
    alert("Failed to generate marksheet");
  }
};
  // ===============================
  // ✅ CERTIFICATE PRINT
  // ===============================
const printCertificate = async (cert) => {

  try {

    let studentData = null;
    let franchiseData = null;

    // 🔹 FETCH STUDENT
    if (cert.studentId) {
      studentData = await databases.getDocument(
        DATABASE_ID,
        "student_admissions",
        cert.studentId
      );
    } else {
      const res = await databases.listDocuments(
        DATABASE_ID,
        "student_admissions",
        [Query.equal("studentName", cert.studentName)]
      );

      if (!res.documents.length) {
        alert("Student not found");
        return;
      }

      studentData = res.documents[0];
    }

    // 🔹 FETCH FRANCHISE
    const franchiseRes = await databases.listDocuments(
      DATABASE_ID,
      "franchise_approved",
      [Query.equal("email", studentData.franchiseEmail)]
    );

    if (franchiseRes.documents.length > 0) {
      franchiseData = franchiseRes.documents[0];
    }

    // ===============================
    // ✅ ONLY CHANGE — USE studentId
    // ===============================
    const verifyId = cert.studentId;

  const verifyUrl = `https://www.bnmiindia.org/beauty-verification/${cert.studentId}`;

 




let finalMarks = cert.marks;

if (studentData.courseType === "semester") {

  const allResults = await databases.listDocuments(
    DATABASE_ID,
    "exam_results",
    [Query.equal("studentId", cert.studentId)]
  );

  const total = allResults.documents.reduce(
    (sum, r) => sum + Number(r.percentage || 0),
    0
  );

  finalMarks =
    allResults.documents.length > 0
      ? Math.round(total / allResults.documents.length)
      : 0;
}


    // ===============================
    // 🔥 FINAL DATA (UNCHANGED)
    // ===============================
    const data = {
      studentName: studentData.studentName || "",
      marks: finalMarks,
      grade: cert.grade,
      course: studentData.courseName || "",
      duration: studentData.duration || "",
      signatureId: studentData.signatureId || "",
      franchiseSignature: franchiseData?.signature || "",
      fatherName: studentData.fatherName || "",
motherName: studentData.motherName || "",

showFatherInCertificate:
  String(studentData.showFatherInCertificate).toLowerCase() === "true",

showMotherInCertificate:
  String(studentData.showMotherInCertificate).toLowerCase() === "true", 



relationType: studentData.relationType || "",
      photoId: studentData.photoId || "",
      instituteName: studentData.instituteName || "",
      semesterNumber:
  studentData.courseType === "semester"
    ? cert.semesterNumber
    : null,
      city: franchiseData?.city || "",
      address: franchiseData?.address || "",
  certificateNo: cert.certificateNo || "",
issueDate: cert.issueDate || "",
      logo: franchiseData?.logo || "",
      ownerName:
        franchiseData?.ownerName ||
        franchiseData?.owner ||
        franchiseData?.name ||
        "",

      // ✅ KEEP SAME
      studentId: cert.studentId,

    
      verifyUrl
    };


    // 🔄 OPEN PAGE
 if (studentData.courseType === "beauty") {

  window.open(
    `/login/institute/certificate/beauty-certificate/${cert.$id}`,
    "_blank"
  );

} else if (studentData.courseType === "semester") {

  window.open(
    `/login/institute/certificate/semester-certificate/${cert.$id}`,
    "_blank"
  );

} else if (studentData.courseType === "multiple") {

  window.open(
    `/login/institute/certificate/multiple-certificate/${cert.$id}`,
    "_blank"
  );

} else {

  window.open(
    `/login/institute/certificate/print/${cert.$id}`,
    "_blank"
  );
}

  } catch (err) {
    console.error("CERT ERROR:", err);
    alert("Failed to open certificate");
  }
};
  // ===============================
  // 🔹 LOAD DATA
  // ===============================
  useEffect(() => {
    loadCertificates();
  }, []);

  const loadCertificates = async () => {
    try {
      const res = await databases.listDocuments(
  DATABASE_ID,
  CERT_COLLECTION,
  [
    Query.orderDesc("$createdAt")
  ]
);

setCertificates(res.documents || []);
      setCertificates(res.documents || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

const approveCertificate = async (id, cert) => {

  try {

    // ✅ FETCH STUDENT
    const studentData = await databases.getDocument(
      DATABASE_ID,
      "student_admissions",
      cert.studentId
    );

    // ✅ FETCH FRANCHISE
    const franchiseRes = await databases.listDocuments(
      DATABASE_ID,
      "franchise_approved",
      [Query.equal("email", studentData.franchiseEmail)]
    );

    const franchiseData =
      franchiseRes.documents[0];

    // ✅ CERTIFICATE NO
    const certificateNo =
      `CERT-${Date.now()}`;

    // ✅ ISSUE DATE
  const issueDate =
  new Date()
    .toLocaleDateString("en-GB")
    .replace(/\//g, "-");

    // ✅ VERIFY URL
    const verifyUrl =
      `https://www.bnmiindia.org/beauty-verification/${cert.studentId}`;

    
      


      // ✅ AUTO GENERATE COURSE DURATION
let finalDuration = "";

const rawDuration = String(
  studentData.duration ||
  studentData.courseDuration ||
  "1 year"
);

const today = new Date();

const end = new Date(today);

const start = new Date(today);

const text =
  String(rawDuration).toLowerCase();

// ✅ YEAR
if (text.includes("year")) {

  const years =
    parseInt(text) || 1;

  start.setFullYear(
    start.getFullYear() - years
  );
}

// ✅ MONTH
if (text.includes("month")) {

  const months =
    parseInt(text) || 1;

  start.setMonth(
    start.getMonth() - months
  );
}

// ✅ PERFECT RANGE
start.setDate(start.getDate() + 1);

const formatDate = (date) =>
  date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
finalDuration =
  `${formatDate(start)} To ${formatDate(end)}`.trim();



    // ✅ UPDATE DB
    await databases.updateDocument(
      DATABASE_ID,
      CERT_COLLECTION,
      id,
      {
        status: "approved",

       certificateNo,
issueDate,
verifyUrl,

        studentName:
          studentData.studentName || "",

        fatherName:
          studentData.fatherName || "",

        motherName:
          studentData.motherName || "",

        course:
          studentData.courseName || "",

          duration: finalDuration,

 

        instituteName:
          studentData.instituteName || "",

        photoId:
          studentData.photoId || "",

        signatureId:
          studentData.signatureId || "",

        franchiseSignature:
          franchiseData?.signature || "",

        logo:
          franchiseData?.logo || "",

        city:
          franchiseData?.city || "",

        ownerName:
          franchiseData?.ownerName ||
          franchiseData?.owner ||
          franchiseData?.name ||
          ""
      }
    );

    alert("Certificate Approved");

    loadCertificates();

  } catch (err) {

  console.log("FULL ERROR:", err);

  alert(
    err?.message ||
    JSON.stringify(err)
  );

}
};

  const rejectCertificate = async (id) => {
    await databases.updateDocument(DATABASE_ID, CERT_COLLECTION, id, {
      status: "rejected"
    });
    loadCertificates();
  };

  const getPhoto = (photoId) => {
    return `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${photoId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;
  };

  if (loading) return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0A1229] p-10 text-[#FBF9F4]">
      <div className="absolute inset-0 bg-[radial-gradient(#C9A24B_1px,transparent_1px)] bg-size-[70px_70px] opacity-[0.03]" />
      <div className="absolute h-96 w-96 rounded-full bg-[#C9A24B]/15 blur-[140px]" />
      <div className="relative rounded-4xl border border-white/10 bg-white/5 px-10 py-8 font-semibold backdrop-blur-2xl">
        Loading...
      </div>
    </div>
  );

 return (

<main className="relative min-h-screen overflow-hidden bg-[#0A1229] p-4 md:p-6 lg:p-8">

    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap');

      .bnmi-font-display {
        font-family: 'Playfair Display', Georgia, serif;
      }

      .bnmi-font-body {
        font-family: 'Inter', system-ui, sans-serif;
      }
    `}</style>

    <div className="absolute inset-0 bg-[radial-gradient(#C9A24B_1px,transparent_1px)] bg-size-[70px_70px] opacity-[0.03]" />
    <div className="absolute -top-28 left-1/2 h-162.5 w-162.5 -translate-x-1/2 rounded-full bg-[#C9A24B]/15 blur-[170px]" />
    <div className="absolute bottom-0 left-0 h-120 w-120 rounded-full bg-linear-to-r from-[#C9A24B]/20 to-transparent blur-[140px]" />
    <div className="absolute right-0 top-1/3 h-110 w-110 rounded-full bg-linear-to-l from-[#C9A24B]/15 to-transparent blur-[140px]" />

  <div className="relative z-10 mx-auto max-w-7xl">

    {/* HEADER */}
    <div className="mb-6">
      <div className="bnmi-font-body mb-4 inline-flex rounded-full border border-[#C9A24B]/30 bg-[#C9A24B]/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#C9A24B]">
        Admin Console
      </div>

      <h1 className="bnmi-font-display text-4xl font-black leading-tight text-[#FBF9F4] md:text-5xl">
        Certificate Approval Panel
      </h1>

      <p className="bnmi-font-body mt-3 max-w-2xl text-base leading-7 text-[#D5D8E3]">
        Manage and approve student certificates
      </p>
    </div>

    {/* LIST */}
    <div className="flex flex-col gap-5">

      {certificates.length === 0 && (
        <div className="rounded-4xl border border-white/10 bg-white/5 p-10 text-center text-[#D5D8E3] shadow-[0_18px_80px_rgba(201,162,75,0.08)] backdrop-blur-2xl">
          No certificates found
        </div>
      )}

      {certificates.map((c, index) => {

        const photoUrl = getPhoto(c.photoId)

        return (
          <div
            key={c.$id}
            className="group relative overflow-hidden rounded-4xl border border-white/10 bg-white/5 p-4 shadow-[0_18px_80px_rgba(201,162,75,0.08)] backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:border-[#C9A24B]/35 hover:shadow-[0_24px_100px_rgba(201,162,75,0.14)] md:p-6"
          >

            <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-white/10 via-transparent to-[#C9A24B]/10 opacity-60" />

            <div className="relative flex w-full flex-col justify-between gap-5 lg:flex-row">

            {/* LEFT */}
            <div className="min-w-62.5 flex-1">

              <div className="flex items-center gap-4 mb-3">
                <img
                  src={photoUrl}
                  className="h-14 w-14 rounded-2xl border border-white/10 object-cover shadow-[0_10px_30px_rgba(201,162,75,0.12)] transition duration-500 group-hover:scale-105 md:h-16 md:w-16"
                />

                <div>
                  <h3 className="bnmi-font-display text-2xl font-black text-[#FBF9F4]">
                    {c.studentName}
                  </h3>
                  <p className="bnmi-font-body text-sm text-[#D5D8E3]">
                    {c.course}
                  </p>
                </div>
              </div>

              {/* INFO */}
              <div className="bnmi-font-body grid grid-cols-2 gap-3 text-sm text-[#D5D8E3] md:grid-cols-3">

                <p><b className="text-[#C9A24B]">Marks:</b> {c.marks}</p>
                <p><b className="text-[#C9A24B]">Grade:</b> {c.grade}</p>

                <p>
                  <b className="text-[#C9A24B]">Status:</b>{" "}
                  {c.status === "pending" && (
                    <span className="font-semibold text-[#C9A24B]">
                      Pending
                    </span>
                  )}
                  {c.status === "approved" && (
                    <span className="font-semibold text-emerald-300">
                      Approved
                    </span>
                  )}
                  {c.status === "rejected" && (
                    <span className="font-semibold text-red-300">
                      Rejected
                    </span>
                  )}
                </p>

              </div>

            </div>

            {/* RIGHT */}
            <div className="flex flex-wrap items-center gap-3">

              {c.status === "pending" && (
                <>
                  <ActionBtn
                    label="Approve"
                    color="green"
                  onClick={() => approveCertificate(c.$id, c)}
                  />

                  <ActionBtn
                    label="Reject"
                    color="red"
                    onClick={() => rejectCertificate(c.$id)}
                  />
                </>
              )}

              {c.status === "approved" && (
                <>
                  <ActionBtn
                    label="Certificate"
                    color="blue"
                    onClick={() => printCertificate(c)}
                  />

                  <ActionBtn
                    label="Marksheet"
                    color="purple"
                    onClick={() => printMarksheet(c)}
                  />
                </>
              )}

            </div>

            </div>

          </div>
        )
      })}

    </div>

  </div>

  </main>
)
}

function ActionBtn({ label, color, onClick }) {

  const isDanger = color === "red"

  return (
    <button
      onClick={onClick}
      className={`rounded-2xl border px-4 py-2 text-sm font-semibold shadow transition-all duration-300 hover:-translate-y-0.5 ${
        isDanger
          ? "border-red-400/30 bg-red-500/10 text-red-200 hover:border-red-300/50"
          : "border-[#C9A24B]/30 bg-[#C9A24B]/10 text-[#C9A24B] hover:border-[#C9A24B]/60 hover:bg-[#C9A24B] hover:text-[#0A1229]"
      }`}
    >
      {label}
    </button>
  )
}