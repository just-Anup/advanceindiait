"use client";

import { useEffect, useState } from "react";
import { databases, account } from "@/lib/appwrite";
import { Query, ID } from "appwrite";
import { useRouter } from "next/navigation";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const COLLECTION_ID = "student_admissions";

export default function ReAdmission() {

  const router = useRouter();

  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [allCourses, setAllCourses] = useState([]);

  const [installments, setInstallments] = useState([
    { name: "", amount: "", date: "" }
  ]);

  const [form, setForm] = useState({
    course: "",
    examType: "",
    courseFees: "",
    discountRate: "",
    discountAmount: "",
    totalFees: "",
    feesReceived: "",
    balance: "",
    remarks: "",
    batch: "",
    examFees: "",
    remainingSeats: "",
    admissionDate: ""
  });

  useEffect(() => {
    fetchStudents();
    fetchAllCourses();
  }, []);


  const fetchStudents = async () => {

    const user = await account.get();

    const res = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_ID,
      [Query.equal("createdById", user.$id)]
    );

    setStudents(res.documents);

  };


  const fetchAllCourses = async () => {
    try {
      const user = await account.get();

      const [singleRes, multipleRes, beautyRes, semesterRes] =
        await Promise.all([

        databases.listDocuments(
          DATABASE_ID,
          "courses_single",
          [Query.equal("franchiseEmail", user.email)]
        ),

        databases.listDocuments(
          DATABASE_ID,
          "courses_multiple",
          [Query.equal("franchiseEmail", user.email)]
        ),

        databases.listDocuments(
          DATABASE_ID,
          "beauty_courses_single",
          [Query.equal("franchiseEmail", user.email)]
        ),

        databases.listDocuments(
          DATABASE_ID,
          "franchise_semester_courses",
          [Query.equal("franchiseEmail", user.email)]
        )

      ]);

      const courses = [
        ...singleRes.documents,
        ...multipleRes.documents,
        ...beautyRes.documents,
        ...semesterRes.documents
      ];

      // remove duplicate course names
      const uniqueCourses = courses.filter(
        (course, index, self) =>
          index ===
          self.findIndex(c => c.courseName === course.courseName)
      );

      setAllCourses(uniqueCourses);
      setAllCourses(courses);

  } catch (error) {

    console.log(error);

  }

};


const handleStudentSelect = async (id) => {

  const student = await databases.getDocument(
    DATABASE_ID,
    COLLECTION_ID,
    id
  );

  setSelectedStudent(student);

  setForm(prev => ({
    ...prev,
    batch: student.batch || ""
  }));

  const user = await account.get();

  // find all courses already taken by this student
  const oldAdmissions = await databases.listDocuments(
    DATABASE_ID,
    COLLECTION_ID,
    [
      Query.equal("studentName", student.studentName),
      Query.equal("mobile", student.mobile),
      Query.equal("createdById", user.$id)
    ]
  );

  const takenCourses = oldAdmissions.documents.map(
    item => item.course
  );

  setAllCourses(prev =>
    prev.filter(
      course =>
        !takenCourses.includes(course.courseName)
    )
  );
};


  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  };


  const handleInstallmentChange = (index, field, value) => {

    const updated = [...installments];

    updated[index][field] = value;

    setInstallments(updated);

  };


  const addInstallment = () => {

    setInstallments([
      ...installments,
      { name: "", amount: "", date: "" }
    ]);

  };
  
  const handleCourseSelect = (e) => {
    const selected = allCourses.find(
      c => c.$id === e.target.value
    );

    if (!selected) return;

    const total =
      Number(selected.courseFees || 0) +
      Number(selected.examFees || 0);

    setForm(prev => ({
      ...prev,

      course: selected.courseName,

      courseFees: selected.courseFees || 0,

      examFees: selected.examFees || 0,

      totalFees: total,

      balance: total
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = await account.get();

    await databases.createDocument(
      DATABASE_ID,
      COLLECTION_ID,
      ID.unique(),
      {

        studentName: selectedStudent.studentName,
        fatherName: selectedStudent.fatherName,
        mobile: selectedStudent.mobile,
        email: selectedStudent.email,
        photoId: selectedStudent.photoId,
        signatureId: selectedStudent.signatureId,
        motherName: selectedStudent.motherName || "",
        gender: selectedStudent.gender || "",
        dob: selectedStudent.dob || "",
        address: selectedStudent.address || "",
        city: selectedStudent.city || "",
        state: selectedStudent.state || "",
        qualification: selectedStudent.qualification || "",
        aadhaarNo: selectedStudent.aadhaarNo || "",

        readmission: true,
        oldAdmissionId: selectedStudent.$id,

        course: form.course,
        examType: form.examType,
        batch: form.batch,

        
        courseFees: Number(form.courseFees) || 0,
        discountRate: Number(form.discountRate) || 0,
        discountAmount: Number(form.discountAmount) || 0,
        totalFees: Number(form.totalFees) || 0,
        feesReceived: Number(form.feesReceived) || 0,
        balance: Number(form.balance) || 0,
        examFees: Number(form.examFees) || 0,
        remainingSeats: Number(form.remainingSeats) || 0,

        remarks: form.remarks,
        admissionDate: form.admissionDate,

        installments: JSON.stringify(installments),

        status: "Active",
        createdById: user.$id,
        createdByEmail: user.email,
        createdByName: user.name,
        createdAt: new Date().toISOString()

      }
    );
    alert("Re-Admission Successful");

    router.push("/login/institute/manage-student/admission");

  };


  return (
    <div className="min-h-screen bg-[#0A1229] text-[#FBF9F4] relative overflow-hidden">
      {/* subtle grid texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.06] bg-[linear-gradient(to_right,rgba(201,162,75,0.6)_1px,transparent_1px),linear-gradient(to_bottom,rgba(201,162,75,0.6)_1px,transparent_1px)] bg-[size:48px_48px]"
      />
      {/* ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[760px] -translate-x-1/2 rounded-full bg-[#C9A24B]/20 blur-3xl"
      />

      <form
        onSubmit={handleSubmit}
        className="relative mx-auto max-w-6xl px-8 py-28"
      >
        {/* Glass container */}
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_0_60px_rgba(201,162,75,0.10)] p-8 sm:p-10">
          <h2 className="font-[Playfair_Display] text-3xl sm:text-4xl tracking-wide font-bold mb-10 text-[#FBF9F4]">
            RE-ADMISSION STUDENT
          </h2>

          {/* STUDENT SELECT */}
          <div className="grid grid-cols-3 gap-6 mb-10">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Select Student</label>
              <select
                className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-[#FBF9F4] transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-[#C9A24B] focus:border-[#C9A24B]/60 hover:border-[#C9A24B]/40"
                onChange={(e) => handleStudentSelect(e.target.value)}
                required
              >
                <option value="" className="bg-[#0A1229]">--select--</option>
                {students.map((s) => (
                  <option key={s.$id} value={s.$id} className="bg-[#0A1229]">
                    {s.studentName} ({s.mobile})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Course of Interest *</label>
              <select
                onChange={handleCourseSelect}
                className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-[#FBF9F4] transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-[#C9A24B] focus:border-[#C9A24B]/60 hover:border-[#C9A24B]/40"
                required
              >
                <option value="" className="bg-[#0A1229]">Select Course</option>
                {allCourses.map((course) => (
                  <option key={course.$id} value={course.$id} className="bg-[#0A1229]">
                    {course.courseName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Select Exam Type *</label>
              <select
                name="examType"
                onChange={handleChange}
                className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-[#FBF9F4] transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-[#C9A24B] focus:border-[#C9A24B]/60 hover:border-[#C9A24B]/40"
                required
              >
                <option value="" className="bg-[#0A1229]">--select--</option>
                <option value="Online" className="bg-[#0A1229]">Online</option>
                <option value="Offline" className="bg-[#0A1229]">Offline</option>
              </select>
            </div>
          </div>

          {/* FEES SECTION */}
          <div className="grid grid-cols-7 gap-4 mb-10">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-white/70 mb-2">Course Fees</label>
              <input
                name="courseFees"
                value={form.courseFees}
                onChange={handleChange}
                className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-[#FBF9F4] transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-[#C9A24B] focus:border-[#C9A24B]/60 hover:border-[#C9A24B]/40"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-white/70 mb-2">Discount Rate</label>
              <input
                name="discountRate"
                onChange={handleChange}
                className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-[#FBF9F4] transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-[#C9A24B] focus:border-[#C9A24B]/60 hover:border-[#C9A24B]/40"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-white/70 mb-2">Discount Amount</label>
              <input
                name="discountAmount"
                onChange={handleChange}
                className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-[#FBF9F4] transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-[#C9A24B] focus:border-[#C9A24B]/60 hover:border-[#C9A24B]/40"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-white/70 mb-2">Total Fees</label>
              <input
                name="totalFees"
                value={form.totalFees}
                onChange={handleChange}
                className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-[#FBF9F4] transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-[#C9A24B] focus:border-[#C9A24B]/60 hover:border-[#C9A24B]/40"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-white/70 mb-2">Fees Received</label>
              <input
                name="feesReceived"
                onChange={handleChange}
                className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-[#FBF9F4] transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-[#C9A24B] focus:border-[#C9A24B]/60 hover:border-[#C9A24B]/40"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-white/70 mb-2">Balance</label>
              <input
                name="balance"
                value={form.balance}
                onChange={handleChange}
                className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-[#FBF9F4] transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-[#C9A24B] focus:border-[#C9A24B]/60 hover:border-[#C9A24B]/40"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-white/70 mb-2">Remarks</label>
              <input
                name="remarks"
                onChange={handleChange}
                className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-[#FBF9F4] transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-[#C9A24B] focus:border-[#C9A24B]/60 hover:border-[#C9A24B]/40"
              />
            </div>
          </div>

          {/* INSTALLMENTS */}
          <h3 className="font-[Playfair_Display] text-xl sm:text-2xl font-semibold mb-4 text-[#FBF9F4]">
            Installment Details
          </h3>

          {installments.map((item, index) => (
            <div key={index} className="grid grid-cols-4 gap-4 mb-4 p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-white/70 mb-2">Installment Name</label>
                <input
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-[#FBF9F4] transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-[#C9A24B] focus:border-[#C9A24B]/60 hover:border-[#C9A24B]/40"
                  onChange={(e) => handleInstallmentChange(index, "name", e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-white/70 mb-2">Amount</label>
                <input
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-[#FBF9F4] transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-[#C9A24B] focus:border-[#C9A24B]/60 hover:border-[#C9A24B]/40"
                  onChange={(e) => handleInstallmentChange(index, "amount", e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-white/70 mb-2">Date</label>
                <input
                  type="date"
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-[#FBF9F4] transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-[#C9A24B] focus:border-[#C9A24B]/60 hover:border-[#C9A24B]/40"
                  onChange={(e) => handleInstallmentChange(index, "date", e.target.value)}
                />
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={addInstallment}
                  className="w-full rounded-xl border border-[#C9A24B]/50 bg-[#C9A24B]/10 px-4 py-2.5 text-[#FBF9F4] font-medium transition-all duration-300 hover:bg-[#C9A24B]/20 hover:border-[#C9A24B] hover:shadow-[0_0_22px_rgba(201,162,75,0.25)]"
                >
                  + Add More
                </button>
              </div>
            </div>
          ))}

          {/* BATCH SECTION */}
          <div className="grid grid-cols-3 gap-6 mb-10">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Exam Fees</label>
              <input
                name="examFees"
                value={form.examFees}
                onChange={handleChange}
                className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-[#FBF9F4] transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-[#C9A24B] focus:border-[#C9A24B]/60 hover:border-[#C9A24B]/40"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Select Batch For Student *</label>
              <input
                name="batch"
                value={form.batch}
                onChange={handleChange}
                className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-[#FBF9F4] transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-[#C9A24B] focus:border-[#C9A24B]/60 hover:border-[#C9A24B]/40"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Remaining Seats For This Batch *</label>
              <input
                name="remainingSeats"
                onChange={handleChange}
                className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-[#FBF9F4] transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-[#C9A24B] focus:border-[#C9A24B]/60 hover:border-[#C9A24B]/40"
              />
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-medium text-white/70 mb-2">Admission Date</label>
            <input
              type="date"
              name="admissionDate"
              onChange={handleChange}
              className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-[#FBF9F4] transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-[#C9A24B] focus:border-[#C9A24B]/60 hover:border-[#C9A24B]/40"
            />
          </div>

          <div className="flex gap-4 flex-col sm:flex-row">
            <button
              className="flex-1 rounded-xl border border-[#C9A24B]/60 bg-[#C9A24B]/15 px-6 py-2.5 text-[#FBF9F4] font-semibold transition-all duration-300 hover:bg-[#C9A24B]/25 hover:border-[#C9A24B] hover:shadow-[0_0_30px_rgba(201,162,75,0.22)]"
            >
              Submit
            </button>

            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 rounded-xl border border-white/10 bg-white/5 px-6 py-2.5 text-[#FBF9F4] font-semibold transition-all duration-300 hover:border-red-400/40 hover:bg-red-400/10 hover:shadow-[0_0_30px_rgba(239,68,68,0.10)]"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );

}