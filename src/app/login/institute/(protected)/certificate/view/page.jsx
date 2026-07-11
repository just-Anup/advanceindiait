"use client";

import { useEffect, useState } from "react";
import { databases, account } from "@/lib/appwrite";
import { Query } from "appwrite";
import QRCode from "qrcode";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;

const CERT_COLLECTION = "certificates";

const BUCKET_ID = "6986e8a4001925504f6b";

export default function FranchiseCertificateView() {

  const [certificates, setCertificates] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    getUser();
  }, []);

  // GET USER
  const getUser = async () => {

    try {

      const u = await account.get();

      setUser(u);

      loadCertificates(u.$id);

    } catch (err) {

      console.log(err);

    }
  };

  // LOAD CERTIFICATES
  const loadCertificates = async (userId) => {

    try {

      const res = await databases.listDocuments(
        DATABASE_ID,
        CERT_COLLECTION,
        [
          Query.equal("status", "approved"),
          Query.equal("createdById", userId),
          Query.limit(500)
        ]
      );

      setCertificates(res.documents);

    } catch (err) {

      console.log(err);

    }
  };

  // PRINT CERTIFICATE
  const printCertificate = async (cert) => {

    try {

      const studentData = await databases.getDocument(
        DATABASE_ID,
        "student_admissions",
        cert.studentId
      );

      // FRANCHISE
      const franchiseRes = await databases.listDocuments(
        DATABASE_ID,
        "franchise_approved",
        [Query.equal("email", studentData.franchiseEmail)]
      );

      const franchiseData =
        franchiseRes.documents[0];

      // QR
      const verifyUrl =
        `https://www.bnmiindia.org/beauty-verification/${cert.studentId}`;

      const qrCode =
        await QRCode.toDataURL(verifyUrl);

      // FINAL DATA
      const data = {

        readOnly: true,

        studentId: cert.studentId,

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

        relationType:
          studentData.relationType || "S/O",

        showFatherInCertificate:
          String(
            studentData.showFatherInCertificate
          ).toLowerCase() === "true",

        showMotherInCertificate:
          String(
            studentData.showMotherInCertificate
          ).toLowerCase() === "true",

        course:
          cert.course ||
          studentData.courseName ||
          "",

        duration:
          cert.duration || "N/A",

        grade:
          cert.grade || "",

        marks:
          cert.marks || "",

        instituteName:
          cert.instituteName ||
          studentData.instituteName ||
          "",

        photoId:
          studentData.photoId || "",

        signatureId:
          studentData.signatureId || "",

        franchiseSignature:
          cert.franchiseSignature ||
          franchiseData?.signature ||
          "",

        logo:
          franchiseData?.logo || "",

        ownerName:
          franchiseData?.ownerName ||
          franchiseData?.owner ||
          franchiseData?.name ||
          "",

        city:
          cert.city ||
          franchiseData?.city ||
          franchiseData?.address ||
          "",

        address:
          franchiseData?.address || "",

        qrCode,
        verifyUrl,

        certificateNo:
          cert.certificateNo ||
          `CERT-${Date.now()}`,

        issueDate:
          cert.issueDate || "",

        semesterNumber:
          studentData.courseType === "semester"
            ? cert.semesterNumber
            : null
      };

      // OPEN CERTIFICATE
      if (studentData.courseType === "beauty") {

        window.open(
          `/login/institute/certificate/beauty-certificate/${cert.$id}`,
          "_blank"
        );

      } else if (
        studentData.courseType === "semester"
      ) {

        window.open(
          `/login/institute/certificate/semester-certificate/${cert.$id}`,
          "_blank"
        );

      } else if (
        studentData.courseType === "multiple"
      ) {

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

      console.log(err);

      alert("Certificate error");

    }
  };

  // PRINT MARKSHEET
  const printMarksheet = async (cert) => {

    try {

      const studentData =
        await databases.getDocument(
          DATABASE_ID,
          "student_admissions",
          cert.studentId
        );

      // FRANCHISE
      const franchiseRes =
        await databases.listDocuments(
          DATABASE_ID,
          "franchise_approved",
          [
            Query.equal(
              "email",
              studentData.franchiseEmail
            )
          ]
        );

      const franchiseData =
        franchiseRes.documents[0];

      // SUBJECT MARKS
      let marksArray = [];

      try {

        const res =
          await databases.listDocuments(
            DATABASE_ID,
            "student_subject_results",
            [
              Query.equal(
                "studentId",
                cert.studentId
              )
            ]
          );

        marksArray = res.documents.map((m) => ({
          subject: m.subject,
          objective: Number(
            m.objective || 0
          ),
          practical: Number(
            m.practical || 0
          ),
          total: Number(m.total || 0),
        }));

      } catch (err) {

        console.log(
          "MARK FETCH ERROR:",
          err
        );

      }


      // ✅ SAVE NEW STUDENT DATA
const finalData = {

  ...studentData,
  ...cert,

  studentId: cert.studentId,

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

  instituteName:
    cert.instituteName ||
    studentData.instituteName ||
    "",

  duration:
    cert.duration || "",

  marks:
    cert.marks || "",

  grade:
    cert.grade || "",

  logo:
    franchiseData?.logo || "",

  ownerName:
    franchiseData?.ownerName ||
    franchiseData?.owner ||
    franchiseData?.name ||
    "",

  franchiseSignature:
    franchiseData?.signature || "",

  photoId:
    studentData.photoId || "",

  signatureId:
    studentData.signatureId || "",

  dob:
    studentData.dob || "",

  coursePeriod:
    cert.duration || "",

  courseType:
    studentData.courseType || "",

  marksheetNo:
    cert.certificateNo || "",

  marksArray
};

// ✅ REMOVE OLD DATA
localStorage.removeItem("marksheetStudent");

// ✅ SAVE NEW DATA
localStorage.setItem(
  "marksheetStudent",
  JSON.stringify(finalData)
);


   // OPEN MARKSHEET WITH ID
if (studentData.courseType === "beauty") {

  window.open(
    `/login/institute/certificate/beauty-marksheet/${cert.$id}`,
    "_blank"
  );

} else if (
  studentData.courseType === "semester"
) {

  window.open(
    `/login/institute/certificate/semester-marksheet/${cert.$id}`,
    "_blank"
  );

} else if (
  studentData.courseType === "multiple"
) {

  window.open(
    `/login/institute/certificate/multiple-marksheet/${cert.$id}`,
    "_blank"
  );

} else {

  window.open(
    `/login/institute/certificate/marksheet/${cert.$id}`,
    "_blank"
  );
}
    } catch (err) {

      console.log(err);

      alert("Marksheet error");

    }
  };

  // PHOTO
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
            <p className="text-sm text-white/80 font-[Inter]">Institute Certificate Vault</p>
          </div>

          <h1 className="mt-4 text-3xl font-bold tracking-wide font-[Playfair_Display]">
            Approved Certificates
          </h1>
          <p className="mt-2 max-w-2xl text-white/70 font-[Inter]">
            View and print certificates with a premium glass experience.
          </p>
        </header>

        {/* TABLE CARD */}
        <section className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_20px_80px_rgba(0,0,0,0.55)]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-separate border-spacing-0">
              <thead className="bg-[#0A1229]/60">
                <tr>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-white/70 border-b border-white/10">#</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-white/70 border-b border-white/10">Photo</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-white/70 border-b border-white/10">Student</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-white/70 border-b border-white/10">Course</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-white/70 border-b border-white/10">Marks</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-white/70 border-b border-white/10">Grade</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-white/70 border-b border-white/10">Action</th>
                </tr>
              </thead>

              <tbody>
                {certificates.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center p-10 text-white/60 font-[Inter]">
                      No approved certificates found
                    </td>
                  </tr>
                ) : (
                  certificates.map((c, i) => (
                    <tr
                      key={c.$id}
                      className="group transition-all duration-300 hover:bg-white/[0.04]"
                    >
                      {/* INDEX */}
                      <td className="px-4 py-4 border-b border-white/10 whitespace-nowrap font-medium text-white/85">
                        {i + 1}
                      </td>

                      {/* PHOTO */}
                      <td className="px-4 py-4 border-b border-white/10">
                        {getPhoto(c.photoId) ? (
                          <div className="group relative inline-flex h-14 w-14 items-center justify-center">
                            <img
                              src={getPhoto(c.photoId)}
                              alt={c.studentName || "student"}
                              className="h-14 w-14 rounded-2xl object-cover border border-white/10 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] transition-transform duration-300 group-hover:scale-110"
                            />
                            <div className="pointer-events-none absolute inset-0 rounded-2xl border border-[#C9A24B]/0 transition-colors duration-300 group-hover:border-[#C9A24B]/60" />
                          </div>
                        ) : (
                          <span className="text-white/50 font-[Inter]">N/A</span>
                        )}
                      </td>

                      {/* STUDENT */}
                      <td className="px-4 py-4 border-b border-white/10 min-w-[180px] break-words font-semibold text-[#FBF9F4]">
                        {c.studentName}
                      </td>

                      {/* COURSE */}
                      <td className="px-4 py-4 border-b border-white/10 min-w-[200px] break-words text-white/70">
                        {c.course}
                      </td>

                      {/* MARKS */}
                      <td className="px-4 py-4 border-b border-white/10 whitespace-nowrap font-medium text-white/85">
                        {c.marks}
                      </td>

                      {/* GRADE */}
                      <td className="px-4 py-4 border-b border-white/10 whitespace-nowrap">
                        <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold text-[#FBF9F4]">
                          {c.grade}
                        </span>
                      </td>

                      {/* ACTION */}
                      <td className="px-4 py-4 border-b border-white/10">
                        <div className="flex flex-col sm:flex-row gap-2 min-w-[180px]">
                          <button
                            onClick={() => printCertificate(c)}
                            className="relative inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs sm:text-sm font-semibold text-[#FBF9F4] backdrop-blur-xl transition-all duration-300 hover:border-[#C9A24B]/70 hover:shadow-[0_0_30px_rgba(201,162,75,0.25)] hover:-translate-y-[1px]"
                          >
                            <span className="absolute -inset-px rounded-xl bg-gradient-to-r from-[#C9A24B]/0 via-[#C9A24B]/10 to-[#C9A24B]/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                            <span className="relative">Certificate</span>
                          </button>

                          <button
                            onClick={() => printMarksheet(c)}
                            className="relative inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs sm:text-sm font-semibold text-[#FBF9F4] backdrop-blur-xl transition-all duration-300 hover:border-[#C9A24B]/70 hover:shadow-[0_0_30px_rgba(201,162,75,0.25)] hover:-translate-y-[1px]"
                          >
                            <span className="absolute -inset-px rounded-xl bg-gradient-to-r from-[#C9A24B]/0 via-[#C9A24B]/10 to-[#C9A24B]/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                            <span className="relative">Marksheet</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}