"use client";

import { useEffect, useState } from "react";
import { databases, account } from "@/lib/appwrite";
import { Query, ID } from "appwrite";
import { useRouter } from "next/navigation";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const ADMISSION_COLLECTION = "student_admissions";
const PAYMENT_COLLECTION = "student_payments";

export default function AddPayment() {

  const router = useRouter();

  const [admissions, setAdmissions] = useState([]);
  const [selectedAdmission, setSelectedAdmission] = useState(null);
  const [totalPaid, setTotalPaid] = useState(0);

  const [form, setForm] = useState({
    paymentAmount: "",
    paymentMode: "",
    notes: ""
  });

  useEffect(() => {
    fetchAdmissions();
  }, []);

  const fetchAdmissions = async () => {

    const user = await account.get();

    const response = await databases.listDocuments(
      DATABASE_ID,
      ADMISSION_COLLECTION,
      [Query.equal("createdById", user.$id)]
    );

    setAdmissions(response.documents);

  };

  const handleAdmissionSelect = async (admissionId) => {

    const admission = await databases.getDocument(
      DATABASE_ID,
      ADMISSION_COLLECTION,
      admissionId
    );

    setSelectedAdmission(admission);

    const payments = await databases.listDocuments(
      DATABASE_ID,
      PAYMENT_COLLECTION,
      [Query.equal("admissionId", admissionId)]
    );

    const paid = payments.documents.reduce(
      (sum, item) => sum + Number(item.paymentAmount),
      0
    );

    setTotalPaid(paid);

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    const user = await account.get();

    await databases.createDocument(
      DATABASE_ID,
      PAYMENT_COLLECTION,
      ID.unique(),
      {
        createdById: user.$id,

        studentId: selectedAdmission.$id,
        admissionId: selectedAdmission.$id,
        studentName: selectedAdmission.studentName,
        course: selectedAdmission.course,

        paymentAmount: Number(form.paymentAmount),
        paymentMode: form.paymentMode,
        notes: form.notes,

        paymentDate: new Date().toISOString(),
        createdAt: new Date().toISOString()
      }
    );

    alert("Payment Added Successfully");

    router.push("/login/institute/manage-student/fees");

  };

  const balance = selectedAdmission
    ? Number(selectedAdmission.totalFees) -
    totalPaid -
    Number(form.paymentAmount || 0)
    : 0;

  return (

    <div className="min-h-screen bg-[#0A1229] text-[#FBF9F4] relative overflow-hidden">
      {/* Subtle grid texture + ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          opacity: 0.22,
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-96 w-[900px] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle at center, rgba(201,162,75,0.25), rgba(201,162,75,0.06) 45%, rgba(201,162,75,0) 70%)",
        }}
      />

      <div className="relative max-w-4xl mx-auto py-28 px-8">
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_0_0_1px_rgba(255,255,255,0.03)] overflow-hidden">
          {/* Gold highlight edge */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#C9A24B] to-transparent opacity-60"
          />
          <div className="p-8 sm:p-10 relative">
            <h2 className="font-[Playfair_Display] text-3xl font-medium tracking-wide mb-8 pb-4 border-b border-white/10">
              Student Payment Details
            </h2>

            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
              {/* Student */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold mb-2 text-white/90">
                  Select Student &amp; Course
                </label>

                <select
                  onChange={(e) => handleAdmissionSelect(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[#FBF9F4] placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-[#C9A24B]/70 transition-all duration-200"
                  required
                >
                  <option value="">Select Student</option>

                  {admissions.map((item) => (
                    <option key={item.$id} value={item.$id}>
                      {item.studentName} - {item.course}
                    </option>
                  ))}
                </select>
              </div>

              {/* Amount */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold mb-2 text-white/90">
                  Payment Amount
                </label>

                <input
                  type="number"
                  onChange={(e) =>
                    setForm({ ...form, paymentAmount: e.target.value })
                  }
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[#FBF9F4] placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-[#C9A24B]/70 transition-all duration-200"
                  required
                />
              </div>

              {/* Mode */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold mb-2 text-white/90">
                  Payment Mode
                </label>

                <select
                  onChange={(e) =>
                    setForm({ ...form, paymentMode: e.target.value })
                  }
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[#FBF9F4] placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-[#C9A24B]/70 transition-all duration-200"
                  required
                >
                  <option value="">Select Mode</option>
                  <option>Cash</option>
                  <option>UPI</option>
                  <option>Bank Transfer</option>
                </select>
              </div>

              {/* Notes */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold mb-2 text-white/90">
                  Notes
                </label>

                <input
                  type="text"
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[#FBF9F4] placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-[#C9A24B]/70 transition-all duration-200"
                />
              </div>
            </form>

            {/* Summary */}
            {selectedAdmission && (
              <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5">
                <div className="flex flex-col gap-2">
                  <p className="text-white/90">
                    <span className="font-semibold text-[#FBF9F4]">Total Course Fees :</span>{" "}
                    ₹ {selectedAdmission.totalFees}
                  </p>

                  <p className="text-white/90">
                    <span className="font-semibold text-[#FBF9F4]">Already Paid :</span>{" "}
                    ₹ {totalPaid}
                  </p>

                  <p className="pt-1 text-[#C9A24B] font-semibold">
                    Remaining Balance : ₹ {balance}
                  </p>
                </div>

                {/* subtle divider glow */}
                <div
                  aria-hidden="true"
                  className="mt-4 h-[1px] bg-gradient-to-r from-transparent via-[#C9A24B]/40 to-transparent"
                />
              </div>
            )}

            <div className="flex gap-4 mt-8 flex-wrap">
              <button
                onClick={handleSubmit}
                className="group inline-flex items-center justify-center gap-2 rounded-2xl px-7 py-3 border border-[#C9A24B] bg-[#C9A24B]/10 text-[#FBF9F4] transition-all duration-200 hover:-translate-y-[1px] hover:bg-[#C9A24B] hover:text-[#0A1229] hover:shadow-[0_0_26px_rgba(201,162,75,0.35)] focus:outline-none focus:ring-2 focus:ring-[#C9A24B]/60"
              >
                <span className="font-semibold">Add Payment</span>
              </button>

              <button
                type="button"
                onClick={() => router.back()}
                className="inline-flex items-center justify-center rounded-2xl px-7 py-3 border border-white/10 bg-white/5 text-[#FBF9F4] transition-all duration-200 hover:-translate-y-[1px] hover:border-[#C9A24B] hover:shadow-[0_0_20px_rgba(201,162,75,0.18)] focus:outline-none focus:ring-2 focus:ring-[#C9A24B]/40"
              >
                <span className="font-semibold">Cancel</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

  );

}