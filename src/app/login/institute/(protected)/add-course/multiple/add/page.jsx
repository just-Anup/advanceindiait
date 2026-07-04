"use client";

import { useEffect, useState } from "react";
import { databases, account } from "@/lib/appwrite";
import { Query } from "appwrite";
import Link from "next/link";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;

export default function AddMultipleCourse() {

  const [courses, setCourses] = useState([]);

  const [filteredCourses, setFilteredCourses] = useState([]);
  const [examFee, setExamFee] = useState(0);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [addedCourses, setAddedCourses] = useState([]);

  const LIMIT = 20;

  useEffect(() => {
    fetchCourses();
    fetchPlan();
    fetchAddedCourses();
  }, []);

  // FETCH MASTER COURSES
// FETCH MASTER COURSES
const fetchCourses = async () => {

  let allCourses = [];
  let offset = 0;
  const LIMIT = 100;

  while (true) {

    const res = await databases.listDocuments(
      DATABASE_ID,
      "courses_master_multiple",
      [
        Query.limit(LIMIT),
        Query.offset(offset),
      ]
    );

    if (res.documents.length === 0) break;

    allCourses = [...allCourses, ...res.documents];

    offset += LIMIT;
  }

  // NATURAL SORTING
  const sorted = allCourses.sort((a, b) => {

    const numA = parseInt(a.courseCode.replace(/\D/g, "")) || 0;
    const numB = parseInt(b.courseCode.replace(/\D/g, "")) || 0;

    return numA - numB;
  });

  setCourses(sorted);
  setFilteredCourses(sorted);
};
  // FETCH USER PLAN
const fetchPlan = async () => {
  const user = await account.get();

  const res = await databases.listDocuments(
    DATABASE_ID,
    "franchise_approved",
    [
      Query.equal("email", user.email)
    ]
  );

  if (res.documents.length === 0) {
    console.error("No franchise found for:", user.email);
    return;
  }

  const plan = res.documents[0].plan;

  if (!plan) {
    console.error("Plan is missing.");
    return;
  }

  const planRes = await databases.listDocuments(
    DATABASE_ID,
    "franchise_plans",
    [
      Query.equal("name", plan)
    ]
  );

  const fee = planRes.documents[0]?.amount || 0;

  setExamFee(fee);
};
  // FETCH ADDED COURSES
  const fetchAddedCourses = async () => {

    const user = await account.get();

    const res = await databases.listDocuments(
      DATABASE_ID,
      "franchise_multiple_courses",
      [Query.equal("franchiseEmail", user.email)]
    );

    const ids = res.documents.map(c => c.courseId);

    setAddedCourses(ids);
  };

  // SEARCH
  useEffect(() => {

    const filtered = courses.filter(course =>
      course.courseName.toLowerCase().includes(search.toLowerCase()) ||
      course.courseCode.toLowerCase().includes(search.toLowerCase())
    );

    setFilteredCourses(filtered);

  }, [search, courses]);

  
  return (

    <div className="relative min-h-screen bg-[#0A1229] text-[#FBF9F4] p-3 sm:p-5 lg:p-10 overflow-hidden">
      {/* Ambient glow + subtle grid */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(900px_300px_at_20%_0%,rgba(201,162,75,0.16),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(700px_280px_at_90%_30%,rgba(201,162,75,0.10),transparent)]" />
        <div className="absolute inset-0 opacity-[0.12] bg-[linear-gradient(to_right,rgba(255,255,255,0.25)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.25)_1px,transparent_1px)] bg-[size:48px_48px]" />
      </div>

      <div className="relative">
        {/* HEADER */}
        <div className="mb-6 sm:mb-8 pt-2">
          <h1 className="font-playfair text-2xl sm:text-3xl font-bold tracking-wide leading-tight">
            Multiple Course Selection
          </h1>
          <p className="text-white/70 mt-2 text-sm sm:text-base">
            Select a course and assign subjects easily
          </p>
        </div>

        {/* SEARCH */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by course name or code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-3 sm:p-4 bg-white/5 backdrop-blur border border-white/10 rounded-xl outline-none text-sm sm:text-base text-[#FBF9F4] placeholder:text-white/40 focus:border-[#C9A24B] focus:ring-1 focus:ring-[#C9A24B]/30 transition"
            />
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              <span className="h-2 w-2 rounded-full bg-[#C9A24B] shadow-[0_0_22px_rgba(201,162,75,0.55)]" />
            </div>
          </div>
        </div>

        {/* TABLE CARD */}
        <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl shadow-[0_20px_80px_rgba(0,0,0,0.55)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="text-xs sm:text-sm uppercase tracking-wide">
                <tr className="bg-[#C9A24B]/15 text-[#C9A24B] border-b border-white/10">
                  <th className="p-3 sm:p-4 text-left whitespace-nowrap font-semibold">Code</th>
                  <th className="p-3 sm:p-4 text-left whitespace-nowrap font-semibold">Course Name</th>
                  <th className="p-3 sm:p-4 text-left whitespace-nowrap font-semibold">Duration</th>
                  <th className="p-3 sm:p-4 text-left whitespace-nowrap font-semibold">Exam Fee</th>
                  <th className="p-3 sm:p-4 text-left whitespace-nowrap font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="font-inter">
                {filteredCourses.map((course) => {
                  const isAdded = addedCourses.includes(course.$id);
                  return (
                    <tr
                      key={course.$id}
                      className="border-t border-white/10 hover:bg-white/5 transition"
                    >
                      <td className="p-3 sm:p-4 font-mono text-white/70 whitespace-nowrap">
                        {course.courseCode}
                      </td>
                      <td className="p-3 sm:p-4 text-white min-w-[220px]">
                        <span className="font-semibold">{course.courseName}</span>
                      </td>
                      <td className="p-3 sm:p-4 text-white/60 whitespace-nowrap">
                        {course.duration}
                      </td>
                      <td className="p-3 sm:p-4 text-emerald-300/90 font-semibold whitespace-nowrap">
                        ₹{examFee}
                      </td>
                      <td className="p-3 sm:p-4">
                        {isAdded ? (
                          <span className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm whitespace-nowrap bg-white/5 border border-white/10 text-white/70">
                            <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
                            Already Added
                          </span>
                        ) : (
                          <Link
                            href={`/login/institute/add-course/multiple/subjects/${course.$id}?name=${course.courseName}&code=${course.courseCode}&duration=${course.duration}&examFee=${examFee}`}
                            className="inline-flex items-center justify-center px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap border border-[#C9A24B]/40 bg-[#C9A24B]/10 text-[#FBF9F4] transition hover:border-[#C9A24B] hover:bg-[#C9A24B]/20 hover:shadow-[0_0_0_1px_rgba(201,162,75,0.35),0_18px_55px_rgba(201,162,75,0.10)]"
                          >
                            Add Subjects
                          </Link>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}