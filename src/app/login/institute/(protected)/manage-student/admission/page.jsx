"use client";

import { useEffect, useState } from "react";
import { databases, account } from "@/lib/appwrite";
import { Query } from "appwrite";
import { useRouter } from "next/navigation";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const COLLECTION_ID = "student_admissions";
const BUCKET_ID = "6986e8a4001925504f6b";

export default function AdmissionList() {

  const [students, setStudents] = useState([]);
  const router = useRouter();


  useEffect(() => {

    fetchStudents();

  }, []);

  const fetchStudents = async () => {

    const user = await account.get();

    const res = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_ID,
      [
        Query.equal("createdById", user.$id),
        Query.orderDesc("createdAt"),
        Query.limit(500)

      ]
    );

    setStudents(res.documents);



  };

  return (
    <div className="min-h-screen bg-[#0A1229] py-28 px-8 relative overflow-hidden">
      {/* Subtle grid + ambient glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-[420px] w-[820px] rounded-full bg-[#C9A24B]/10 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.18] [background-image:linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:56px_56px]" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
          <h1 className="font-[Playfair_Display] text-[#FBF9F4] text-4xl md:text-5xl font-semibold tracking-wide">
            LIST STUDENT ADMISSION
          </h1>

          <button
            onClick={() => router.push("/login/institute/manage-student/admission/add")}
            className="relative overflow-hidden rounded-xl border border-white/10 px-8 py-3 font-[Inter] text-[#FBF9F4] transition-all duration-300 hover:border-[#C9A24B] hover:shadow-[0_0_40px_rgba(201,162,75,0.25)] bg-white/5 hover:bg-white/7"
          >
            <span className="relative z-10 font-semibold">ADD NEW STUDENT</span>
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-[#C9A24B]/25 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
          </button>
        </div>

        {/* Premium glass table card */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 shadow-[0_0_80px_rgba(201,162,75,0.08)]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px]">
              <thead>
                <tr className="text-left">
                  <th className="border-b border-white/10 pb-3 pr-3 font-[Inter] text-white/85 text-sm font-semibold">
                    S/N
                  </th>
                  <th className="border-b border-white/10 pb-3 pr-3 font-[Inter] text-white/85 text-sm font-semibold">
                    Status
                  </th>
                  <th className="border-b border-white/10 pb-3 pr-3 font-[Inter] text-white/85 text-sm font-semibold">
                    Photo
                  </th>
                  <th className="border-b border-white/10 pb-3 pr-3 font-[Inter] text-white/85 text-sm font-semibold">
                    Batch
                  </th>
                  <th className="border-b border-white/10 pb-3 pr-3 font-[Inter] text-white/85 text-sm font-semibold">
                    Student Name
                  </th>
                  <th className="border-b border-white/10 pb-3 pr-3 font-[Inter] text-white/85 text-sm font-semibold">
                    Course
                  </th>
                  <th className="border-b border-white/10 pb-3 pr-3 font-[Inter] text-white/85 text-sm font-semibold">
                    Mobile
                  </th>
                  <th className="border-b border-white/10 pb-3 pr-3 font-[Inter] text-white/85 text-sm font-semibold">
                    Username
                  </th>
                  <th className="border-b border-white/10 pb-3 pr-3 font-[Inter] text-white/85 text-sm font-semibold">
                    Password
                  </th>
                  <th className="border-b border-white/10 pb-3 pr-3 font-[Inter] text-white/85 text-sm font-semibold">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/10">
                {students.length === 0 ? (
                  <tr>
                    <td
                      colSpan="10"
                      className="text-center py-8 text-white/70 font-[Inter]"
                    >
                      No Data Found
                    </td>
                  </tr>
                ) : (
                  students.map((item, index) => (
                    <tr
                      key={item.$id}
                      className="transition-all duration-300 hover:bg-white/5"
                    >
                      <td className="py-3 pr-3 text-[#FBF9F4] border-b border-white/10/0 font-[Inter]">
                        {index + 1}
                      </td>

                      <td className="py-3 pr-3 text-[#FBF9F4] border-b border-white/10/0 font-[Inter]">
                        {item.status}
                      </td>

                      <td className="py-3 pr-3 border-b border-white/10/0">
                        {item.photoId ? (
                          <div className="relative group w-fit overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#C9A24B]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <img
                              src={`${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${item.photoId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`}
                              width="56"
                              height="56"
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                              alt="Student"
                            />
                          </div>
                        ) : (
                          <span className="text-white/60 font-[Inter]">No Photo</span>
                        )}
                      </td>

                      <td className="py-3 pr-3 text-[#FBF9F4] border-b border-white/10/0 font-[Inter]">
                        {item.batch}
                      </td>

                      <td className="py-3 pr-3 text-[#FBF9F4] border-b border-white/10/0 font-[Inter]">
                        {item.studentName}
                      </td>

                      <td className="py-3 pr-3 text-[#FBF9F4] border-b border-white/10/0 font-[Inter]">
                        {item.courseName}
                      </td>

                      <td className="py-3 pr-3 text-[#FBF9F4] border-b border-white/10/0 font-[Inter]">
                        {item.mobile}
                      </td>

                      <td className="py-3 pr-3 text-[#FBF9F4] border-b border-white/10/0 font-[Inter]">
                        {item.username || "-"}
                      </td>

                      <td className="py-3 pr-3 text-[#FBF9F4] border-b border-white/10/0 font-[Inter]">
                        {item.password || "-"}
                      </td>

                      <td className="py-3 border-b border-white/10/0">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() =>
                              router.push(
                                `/login/institute/manage-student/admission/edit/${item.$id}`
                              )
                            }
                            className="relative overflow-hidden rounded-xl border border-white/10 px-3 py-2 font-[Inter] text-[#FBF9F4] transition-all duration-300 hover:border-[#C9A24B] hover:shadow-[0_0_28px_rgba(201,162,75,0.18)] bg-white/5 hover:bg-white/7"
                          >
                            <span className="relative z-10 font-semibold">Edit</span>
                            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-[#C9A24B]/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                          </button>

                          <button
                            onClick={() =>
                              router.push(
                                `/login/institute/manage-student/admission/form/${item.$id}`
                              )
                            }
                            className="relative overflow-hidden rounded-xl border border-white/10 px-3 py-2 font-[Inter] text-[#FBF9F4] transition-all duration-300 hover:border-[#C9A24B] hover:shadow-[0_0_28px_rgba(201,162,75,0.18)] bg-white/5 hover:bg-white/7"
                          >
                            <span className="relative z-10 font-semibold">
                              Admission Form
                            </span>
                            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-[#C9A24B]/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                          </button>

                          <button
                            onClick={() =>
                              router.push(
                                `/login/institute/manage-student/admission/idcard/${item.$id}`
                              )
                            }
                            className="relative overflow-hidden rounded-xl border border-white/10 px-3 py-2 font-[Inter] text-[#FBF9F4] transition-all duration-300 hover:border-[#C9A24B] hover:shadow-[0_0_28px_rgba(201,162,75,0.18)] bg-white/5 hover:bg-white/7"
                          >
                            <span className="relative z-10 font-semibold">ID Card</span>
                            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-[#C9A24B]/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
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
  );

}