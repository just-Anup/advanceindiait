"use client";

import { useEffect, useState } from "react";
import { databases, account } from "@/lib/appwrite";
import { ID, Query } from "appwrite";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const COLLECTION_ID = "batches";

export default function BatchPage() {
  const [batches, setBatches] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    batchName: "",
    timing: "",
    totalStudents: "",
  });

  useEffect(() => {
    loadBatches();
  }, []);

  const loadBatches = async () => {
    try {
      const user = await account.get();

      const res = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID,
        [Query.equal("franchiseEmail", user.email)]
      );

      setBatches(res.documents);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const user = await account.get();

      await databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        batchName: form.batchName,
        timing: form.timing,
        totalStudents: Number(form.totalStudents || 0),
        franchiseEmail: user.email,
        createdAt: new Date().toISOString(),
      });

      alert("Batch Added Successfully ✅");

      setForm({
        batchName: "",
        timing: "",
        totalStudents: "",
      });

      setShowForm(false);
      loadBatches();
    } catch (err) {
      console.log(err);
      alert(err.message);
    }
  };

  const deleteBatch = async (id) => {
    if (!confirm("Delete this batch?")) return;

    try {
      await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, id);
      loadBatches();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A1229] text-[#FBF9F4] relative overflow-hidden">
      {/* Ambient glow + subtle grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(700px 320px at 18% 10%, rgba(201,162,75,0.18), transparent 60%), radial-gradient(620px 280px at 78% 18%, rgba(201,162,75,0.12), transparent 55%), linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "auto, auto, 48px 48px, 48px 48px",
          backgroundPosition: "center, center, center, center",
        }}
      />

      <div className="relative px-8 py-28">
        <div className="max-w-5xl mx-auto mb-8">
          <h1 className="font-[Playfair_Display,serif] text-4xl sm:text-5xl font-semibold tracking-wide">
            Manage Batches
          </h1>
          <p className="mt-3 text-white/70 max-w-2xl">
            Premium view to create and manage your class batches.
          </p>
        </div>

        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div className="text-sm tracking-widest uppercase text-white/60">
              List Batches
            </div>

            <button
              onClick={() => setShowForm((v) => !v)}
              className="btn-primary-dark"
              type="button"
            >
              {showForm ? "CLOSE" : "NEW BATCH"}
            </button>
          </div>

          {showForm && (
            <section
              className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-7 shadow-[0_0_60px_rgba(201,162,75,0.10)]"
            >
              <div className="flex items-center justify-between gap-4 mb-5">
                <h2 className="font-[Playfair_Display,serif] text-2xl font-semibold">
                  Add New Batch
                </h2>
                <div className="text-xs text-white/55 border border-white/10 rounded-full px-3 py-1">
                  Luxury glass form
                </div>
              </div>

              <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-white/70 mb-2">Batch Name</label>
                  <input
                    name="batchName"
                    value={form.batchName}
                    onChange={handleChange}
                    className="input-clean-dark"
                    required
                    placeholder="e.g., Batch 2026"
                  />
                </div>

                <div>
                  <label className="block text-sm text-white/70 mb-2">Batch Timing</label>
                  <input
                    name="timing"
                    value={form.timing}
                    onChange={handleChange}
                    className="input-clean-dark"
                    placeholder="e.g., 9:00 AM - 11:00 AM"
                  />
                </div>

                <div>
                  <label className="block text-sm text-white/70 mb-2">Number Of Students</label>
                  <input
                    type="number"
                    name="totalStudents"
                    value={form.totalStudents}
                    onChange={handleChange}
                    className="input-clean-dark"
                    placeholder="e.g., 25"
                  />
                </div>

                <div className="flex items-end gap-3 sm:justify-end">
                  <button className="btn-primary-dark" type="submit">
                    Submit
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="btn-secondary-dark"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </section>
          )}

          <section
            className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-7 shadow-[0_0_60px_rgba(201,162,75,0.06)]"
          >
            <div className="flex items-center justify-between gap-4 mb-5">
              <h2 className="font-[Playfair_Display,serif] text-2xl font-semibold">Batches</h2>
              <div className="text-xs text-white/55 border border-white/10 rounded-full px-3 py-1">
                {batches.length} record{batches.length === 1 ? "" : "s"}
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-white/10">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr className="text-left">
                    <th className="px-4 py-3 text-xs font-semibold tracking-widest uppercase text-white/60">
                      S/N
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold tracking-widest uppercase text-white/60">
                      Batch Name
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold tracking-widest uppercase text-white/60">
                      Timing
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold tracking-widest uppercase text-white/60">
                      Number Of Students
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold tracking-widest uppercase text-white/60">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {batches.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-12">
                        <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-10 text-center text-white/60">
                          No batches found
                        </div>
                      </td>
                    </tr>
                  ) : (
                    batches.map((batch, index) => (
                      <tr
                        key={batch.$id}
                        className="group transition-all duration-300 hover:bg-white/5"
                      >
                        <td className="px-4 py-3 border-t border-white/10 text-white/75">
                          {index + 1}
                        </td>
                        <td className="px-4 py-3 border-t border-white/10">
                          <div className="font-medium text-white/90 group-hover:text-white">
                            {batch.batchName}
                          </div>
                        </td>
                        <td className="px-4 py-3 border-t border-white/10 text-white/75">
                          {batch.timing}
                        </td>
                        <td className="px-4 py-3 border-t border-white/10 text-white/75">
                          {batch.totalStudents}
                        </td>
                        <td className="px-4 py-3 border-t border-white/10">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              className="rounded-lg border border-white/10 bg-white/5 p-2 transition-all duration-300 hover:border-[#C9A24B]/70 hover:shadow-[0_0_18px_rgba(201,162,75,0.20)]"
                              aria-label="Edit"
                              onClick={() => {
                                // UI only (edit action not implemented in original code)
                                alert("Edit UI not implemented for batches yet.");
                              }}
                            >
                              <span className="text-[#C9A24B]">✏️</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => deleteBatch(batch.$id)}
                              className="rounded-lg border border-white/10 bg-white/5 p-2 transition-all duration-300 hover:border-[#C9A24B]/70 hover:shadow-[0_0_18px_rgba(201,162,75,0.16)]"
                              aria-label="Delete"
                            >
                              <span className="text-white/80 group-hover:text-[#C9A24B]">🗑</span>
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
    </div>
  );
}

