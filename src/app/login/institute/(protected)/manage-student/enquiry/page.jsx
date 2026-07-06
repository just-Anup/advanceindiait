"use client";

import { useEffect, useState } from "react";
import { databases, account } from "@/lib/appwrite";
import { Query } from "appwrite";
import { useRouter } from "next/navigation";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const COLLECTION_ID = "student_enquiries";

export default function ManageStudent() {
  const [enquiries, setEnquiries] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {

    const user = await account.get();

    const res = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_ID,
      [
        Query.equal("createdById", user.$id),
        Query.orderDesc("$createdAt")
      ]
    );

    setEnquiries(res.documents);

  };


  const deleteEnquiry = async (id) => {

    if (!confirm("Are you sure you want to delete this enquiry?")) return;

    try {

      await databases.deleteDocument(
        DATABASE_ID,
        COLLECTION_ID,
        id
      );

      alert("Enquiry deleted successfully");

      fetchEnquiries(); // reload list

    } catch (err) {

      console.log("Delete error:", err);
      alert("Error deleting enquiry");

    }

  };

  const editEnquiry = (id) => {
    router.push(`/login/institute/manage-student/enquiry/add?id=${id}`);
  };

  return (
    <div className="min-h-screen bg-[#0A1229] px-8 py-28">
      {/* Ambient glow + subtle grid texture */}
      <div className="pointer-events-none relative overflow-hidden rounded-3xl">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(201,162,75,0.18),_transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(201,162,75,0.08),_transparent_45%)]" />
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.35) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.35) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />

        <div className="relative mx-auto max-w-6xl">
          <div className="flex items-start justify-between gap-6 mb-8">
            <div>
              <h1 className="font-['Playfair_Display'] text-3xl md:text-4xl tracking-wide text-[#FBF9F4]">
                LIST STUDENT ENQUIRIES
              </h1>
              <p className="mt-2 text-sm md:text-base text-[#FBF9F4]/70">
                Premium dashboard view with luxury gold accents.
              </p>
            </div>

            <button
              onClick={() => router.push("/login/institute/manage-student/enquiry/add")}
              className="group inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-[#FBF9F4] shadow-[0_0_0_rgba(201,162,75,0)] backdrop-blur transition-all duration-300 hover:border-[#C9A24B]/70 hover:bg-[#C9A24B]/10 hover:shadow-[0_0_30px_rgba(201,162,75,0.18)]"
            >
              <span className="text-sm md:text-base font-medium">NEW STUDENT ENQUIRY</span>
              <span className="h-1.5 w-1.5 rounded-full bg-[#C9A24B] opacity-80 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>

          {/* Glass panel */}
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur px-4 md:px-6 py-6">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] border-separate border-spacing-0">
                <thead>
                  <tr>
                    <th className="text-left font-['Inter'] text-xs md:text-sm uppercase tracking-wider text-[#FBF9F4]/75 border-b border-white/10 pb-4">
                      S/N
                    </th>
                    <th className="text-left font-['Inter'] text-xs md:text-sm uppercase tracking-wider text-[#FBF9F4]/75 border-b border-white/10 pb-4">
                      Student Name
                    </th>
                    <th className="text-left font-['Inter'] text-xs md:text-sm uppercase tracking-wider text-[#FBF9F4]/75 border-b border-white/10 pb-4">
                      Course
                    </th>
                    <th className="text-left font-['Inter'] text-xs md:text-sm uppercase tracking-wider text-[#FBF9F4]/75 border-b border-white/10 pb-4">
                      Email
                    </th>
                    <th className="text-left font-['Inter'] text-xs md:text-sm uppercase tracking-wider text-[#FBF9F4]/75 border-b border-white/10 pb-4">
                      Mobile
                    </th>
                    <th className="text-left font-['Inter'] text-xs md:text-sm uppercase tracking-wider text-[#FBF9F4]/75 border-b border-white/10 pb-4">
                      Date
                    </th>
                    <th className="text-left font-['Inter'] text-xs md:text-sm uppercase tracking-wider text-[#FBF9F4]/75 border-b border-white/10 pb-4">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {enquiries.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-10 text-[#FBF9F4]/70">
                        No data available
                      </td>
                    </tr>
                  ) : (
                    enquiries.map((item, index) => (
                      <tr
                        key={item.$id}
                        className="group hover:bg-white/[0.03] transition-colors"
                      >
                        <td className="py-4 pr-4 border-b border-white/10 text-[#FBF9F4]/90">
                          {index + 1}
                        </td>
                        <td className="py-4 pr-4 border-b border-white/10 text-[#FBF9F4]/90">
                          {item.studentName}
                        </td>
                        <td className="py-4 pr-4 border-b border-white/10 text-[#FBF9F4]/80">
                          {item.courseInterested}
                        </td>
                        <td className="py-4 pr-4 border-b border-white/10 text-[#FBF9F4]/80">
                          {item.email}
                        </td>
                        <td className="py-4 pr-4 border-b border-white/10 text-[#FBF9F4]/80">
                          {item.mobile}
                        </td>
                        <td className="py-4 pr-4 border-b border-white/10 text-[#FBF9F4]/80">
                          {item.enquiryDate}
                        </td>
                        <td className="py-4 border-b border-white/10">
                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              onClick={() => editEnquiry(item.$id)}
                              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs md:text-sm text-[#FBF9F4] backdrop-blur transition-all duration-300 hover:border-[#C9A24B]/70 hover:bg-[#C9A24B]/10 hover:shadow-[0_0_25px_rgba(201,162,75,0.18)]"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() => deleteEnquiry(item.$id)}
                              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs md:text-sm text-[#FBF9F4] backdrop-blur transition-all duration-300 hover:border-red-500/60 hover:bg-red-500/10 hover:shadow-[0_0_25px_rgba(255,70,70,0.18)]"
                            >
                              Delete
                            </button>

                            <button
                              onClick={() =>
                                router.push(
                                  `/login/institute/manage-student/admission/add?id=${item.$id}`
                                )
                              }
                              className="rounded-lg border border-[#C9A24B]/50 bg-[#C9A24B]/10 px-3 py-2 text-xs md:text-sm text-[#FBF9F4] backdrop-blur transition-all duration-300 hover:border-[#C9A24B] hover:bg-[#C9A24B]/20 hover:shadow-[0_0_30px_rgba(201,162,75,0.24)]"
                            >
                              Register Now
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

}