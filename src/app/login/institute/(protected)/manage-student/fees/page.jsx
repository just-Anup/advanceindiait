"use client";

import { useEffect, useState } from "react";
import { databases, account } from "@/lib/appwrite";
import { Query } from "appwrite";
import { useRouter } from "next/navigation";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const ADMISSION_COLLECTION = "student_admissions";
const PAYMENT_COLLECTION = "student_payments";

export default function PaymentList() {
  const router = useRouter();

  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState({
    totalFees: 0,
    paidFees: 0,
    balanceFees: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const user = await account.get();

      const admissions = await databases.listDocuments(
        DATABASE_ID,
        ADMISSION_COLLECTION,
        [Query.equal("createdById", user.$id)]
      );

      const payments = await databases.listDocuments(
        DATABASE_ID,
        PAYMENT_COLLECTION,
        [Query.equal("createdById", user.$id)]
      );

      /* Create payment map */
      const paymentMap = {};

      payments.documents.forEach((p) => {
        if (!paymentMap[p.admissionId]) {
          paymentMap[p.admissionId] = [];
        }
        paymentMap[p.admissionId].push(p);
      });

      /* Format records */
      const formatted = admissions.documents.map((adm) => {
        const studentPayments = paymentMap[adm.$id] || [];

        const paid = studentPayments.reduce(
          (sum, p) => sum + Number(p.paymentAmount || 0),
          0
        );

        const lastPayment = studentPayments[studentPayments.length - 1];

        const total = Number(adm.totalFees || 0);
        const balance = total - paid;

        return {
          ...adm,
          total,
          paid,
          balance,
          paymentId: lastPayment ? lastPayment.$id : null,
        };
      });

      /* Summary */
      const totalFees = formatted.reduce((s, r) => s + r.total, 0);
      const paidFees = formatted.reduce((s, r) => s + r.paid, 0);
      const balanceFees = formatted.reduce((s, r) => s + r.balance, 0);

      setRecords(formatted);

      setSummary({
        totalFees,
        paidFees,
        balanceFees,
      });
    } catch (error) {
      console.error("Payment List Error:", error);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0A1229] text-[#FBF9F4]">
      {/* Ambient glow + subtle grid texture */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(201,162,75,0.18),transparent_45%),radial-gradient(circle_at_80%_30%,rgba(201,162,75,0.12),transparent_45%),radial-gradient(circle_at_50%_90%,rgba(59,130,246,0.10),transparent_45%)] blur-2xl" />
        <div className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(to_right,rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,1)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-8 py-28">
        {/* HEADER */}
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-wide [font-family:Playfair_Display,serif]">
              List Students Payments
            </h2>
            <p className="mt-2 text-sm text-white/70 [font-family:Inter,sans-serif]">
              Premium overview of fee status with luxury glass design.
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() =>
                router.push(
                  "/login/institute/manage-student/fees/add"
                )
              }
              className="group relative inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 [font-family:Inter,sans-serif] text-[#FBF9F4] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#C9A24B] hover:shadow-[0_0_25px_rgba(201,162,75,0.35)]"
            >
              <span className="absolute inset-0 rounded-xl bg-[linear-gradient(120deg,rgba(201,162,75,0.25),transparent_55%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <span className="relative text-sm font-medium">
                Add New Payment
              </span>
            </button>

            <button className="group inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 [font-family:Inter,sans-serif] text-[#FBF9F4] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#C9A24B] hover:shadow-[0_0_25px_rgba(201,162,75,0.22)]">
              <span className="text-sm font-medium">Export</span>
            </button>
          </div>
        </div>

        {/* SUMMARY */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 transition-all duration-300 hover:border-[#C9A24B]/40 hover:shadow-[0_0_35px_rgba(201,162,75,0.10)]">
            <p className="text-sm text-white/70 [font-family:Inter,sans-serif]">
              Paid Fees
            </p>
            <p className="mt-3 text-2xl md:text-3xl font-semibold [font-family:Inter,sans-serif] text-[#C9A24B]">
              ₹ {summary.paidFees}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 transition-all duration-300 hover:border-[#C9A24B]/40 hover:shadow-[0_0_35px_rgba(201,162,75,0.10)]">
            <p className="text-sm text-white/70 [font-family:Inter,sans-serif]">
              Balance Fees
            </p>
            <p className="mt-3 text-2xl md:text-3xl font-semibold [font-family:Inter,sans-serif] text-[#FBF9F4]">
              ₹ {summary.balanceFees}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 transition-all duration-300 hover:border-[#C9A24B]/40 hover:shadow-[0_0_35px_rgba(201,162,75,0.10)]">
            <p className="text-sm text-white/70 [font-family:Inter,sans-serif]">
              Total Fees
            </p>
            <p className="mt-3 text-2xl md:text-3xl font-semibold [font-family:Inter,sans-serif] text-[#FBF9F4]">
              ₹ {summary.totalFees}
            </p>
          </div>
        </div>

        {/* TABLE */}
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr className="border-b border-white/10">
                <th className="p-4 text-left text-xs uppercase tracking-widest text-white/60 border-r border-white/10">
                  #
                </th>
                <th className="p-4 text-left text-xs uppercase tracking-widest text-white/60 border-r border-white/10">
                  Student Name
                </th>
                <th className="p-4 text-left text-xs uppercase tracking-widest text-white/60 border-r border-white/10">
                  Course Name
                </th>
                <th className="p-4 text-center text-xs uppercase tracking-widest text-white/60 border-r border-white/10">
                  Total Fees
                </th>
                <th className="p-4 text-center text-xs uppercase tracking-widest text-white/60 border-r border-white/10">
                  Fees Paid
                </th>
                <th className="p-4 text-center text-xs uppercase tracking-widest text-white/60 border-r border-white/10">
                  Balance
                </th>
                <th className="p-4 text-center text-xs uppercase tracking-widest text-white/60">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {records.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center p-10 text-white/60 font-medium"
                  >
                    No Data Available
                  </td>
                </tr>
              ) : (
                records.map((item, index) => (
                  <tr
                    key={item.$id}
                    className="group border-b border-white/5 transition-all duration-300 hover:bg-white/5"
                  >
                    <td className="p-4 border-r border-white/10 text-white/80 [font-family:Inter,sans-serif]">
                      {index + 1}
                    </td>

                    <td className="p-4 border-r border-white/10 font-medium [font-family:Inter,sans-serif] text-[#FBF9F4]">
                      {item.studentName}
                    </td>

                    <td className="p-4 border-r border-white/10 text-white/80 [font-family:Inter,sans-serif]">
                      {item.course}
                    </td>

                    <td className="p-4 border-r border-white/10 text-center [font-family:Inter,sans-serif] text-white/90">
                      ₹ {item.total}
                    </td>

                    <td className="p-4 border-r border-white/10 text-center [font-family:Inter,sans-serif] font-semibold text-[#C9A24B]">
                      ₹ {item.paid}
                    </td>

                    <td className="p-4 border-r border-white/10 text-center [font-family:Inter,sans-serif] font-semibold text-[#FBF9F4]">
                      ₹ {item.balance}
                    </td>

                    <td className="p-4 text-center [font-family:Inter,sans-serif]">
                      {item.paymentId ? (
                        <button
                          onClick={() =>
                            router.push(
                              `/login/institute/manage-student/fees/receipt/${item.paymentId}`
                            )
                          }
                          className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 hover:border-[#C9A24B] hover:shadow-[0_0_22px_rgba(201,162,75,0.28)]"
                        >
                          View
                        </button>
                      ) : (
                        <span className="text-white/40 text-sm">
                          No Receipt
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
