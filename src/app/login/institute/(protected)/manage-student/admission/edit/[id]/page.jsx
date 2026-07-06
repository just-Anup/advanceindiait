"use client";

import { useEffect, useState } from "react";
import { databases } from "@/lib/appwrite";
import { Storage, Client, ID, Query } from "appwrite";
import { useParams, useRouter } from "next/navigation";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const COLLECTION_ID = "student_admissions";
const BUCKET_ID = "6986e8a4001925504f6b";

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

const storage = new Storage(client);

export default function EditStudent() {

  const { id } = useParams();
  const router = useRouter();

  const [photo, setPhoto] = useState(null);
  const [signature, setSignature] = useState(null);

  const [photoPreview, setPhotoPreview] = useState("");
  const [signaturePreview, setSignaturePreview] = useState("");

  const [form, setForm] = useState({

    studentName: "",
    surname: "",

    relationType: "S/O",

    fatherName: "",
    motherName: "",

    showFatherInCertificate: false,
    showMotherInCertificate: false,

    mobile: "",
    altMobile: "",
    email: "",

    dob: "",
    gender: "",

    state: "",
    city: "",
    postcode: "",
    address: "",

    aadhar: "",
    qualification: "",
    occupation: "",

    courseName: "",
    subjects: "",

    courseFees: 0,
    discount: 0,
    totalFees: 0,
    feesReceived: 0,
    balance: 0,

    batch: "",
    admissionDate: "",
    remark: ""

  });

  useEffect(() => {
    fetchStudent();
  }, []);

  const fetchStudent = async () => {

    try {

      const res = await databases.getDocument(
        DATABASE_ID,
        COLLECTION_ID,
        id
      );

      setForm(res);

      // PHOTO PREVIEW
      if (res.photoId) {
        setPhotoPreview(
          `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${res.photoId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`
        );
      }

      // SIGNATURE PREVIEW
      if (res.signatureId) {
        setSignaturePreview(
          `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${res.signatureId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`
        );
      }

    } catch (err) {

      console.log(err);
      alert("Failed to load student");

    }
  };

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  };

  const calculateFees = (courseFees, discount) => {

    const fees = Number(courseFees) || 0;
    const disc = Number(discount) || 0;

    const total = fees - disc;
    const balance = total - (Number(form.feesReceived) || 0);

    setForm(prev => ({
      ...prev,
      courseFees: fees,
      discount: disc,
      totalFees: total,
      balance
    }));

  };

  const handleFeesReceived = (value) => {

    const received = Number(value) || 0;

    const balance =
      (Number(form.totalFees) || 0) - received;

    setForm(prev => ({
      ...prev,
      feesReceived: received,
      balance
    }));

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      let photoId = form.photoId;
      let signatureId = form.signatureId;

      // PHOTO UPDATE
      if (photo) {

        const uploadPhoto = await storage.createFile(
          BUCKET_ID,
          ID.unique(),
          photo
        );

        photoId = uploadPhoto.$id;
      }

      // SIGNATURE UPDATE
      if (signature) {

        const uploadSign = await storage.createFile(
          BUCKET_ID,
          ID.unique(),
          signature
        );

        signatureId = uploadSign.$id;
      }

      await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        id,
        {

          ...form,

          photoId,
          signatureId,

          courseFees: Number(form.courseFees) || 0,
          discount: Number(form.discount) || 0,
          totalFees: Number(form.totalFees) || 0,
          feesReceived: Number(form.feesReceived) || 0,
          balance: Number(form.balance) || 0

        }
      );

      // Update certificate also
try {
  const cert = await databases.listDocuments(
    DATABASE_ID,
    "certificates",
    [
      Query.equal("studentId", id)
    ]
  );

  if (cert.documents.length > 0) {
    await databases.updateDocument(
      DATABASE_ID,
      "certificates",
      cert.documents[0].$id,
      {
        relationType: form.relationType,
        fatherName: form.fatherName,
        motherName: form.motherName,
        showFatherInCertificate: form.showFatherInCertificate,
        showMotherInCertificate: form.showMotherInCertificate
      }
    );
  }
} catch (err) {
  console.log("Certificate update failed", err);
}

      alert("Student Updated Successfully");

      router.push("/login/institute/manage-student/admission");

    } catch (err) {

      console.log(err);
      alert(err?.message || "Update failed");

    }

  };

  return (
    <form
      onSubmit={handleSubmit}
      className="min-h-screen bg-[#0A1229] py-28 px-8 relative overflow-hidden"
    >
      {/* Subtle grid + ambient glow background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-[420px] w-[820px] rounded-full bg-[#C9A24B]/10 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.18] [background-image:linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:56px_56px]" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl">
        <h1 className="font-[Playfair_Display] text-[#FBF9F4] text-4xl md:text-5xl font-semibold mb-8 tracking-wide">
          Edit Student Admission
        </h1>

        {/* Main glass card */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 md:p-10 shadow-[0_0_80px_rgba(201,162,75,0.10)] hover:shadow-[0_0_110px_rgba(201,162,75,0.16)] transition-shadow duration-300">
          {/* PHOTO + SIGNATURE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <label className="block font-[Inter] text-white/90 font-medium mb-3">
                Student Photo
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  setPhoto(file);
                  if (file) setPhotoPreview(URL.createObjectURL(file));
                }}
                className="w-full file:rounded-xl file:border file:border-white/10 file:bg-[#0A1229] file:text-[#FBF9F4] file:px-4 file:py-2 file:hover:border-[#C9A24B] file:hover:text-[#FBF9F4] bg-transparent text-[#FBF9F4] px-1"
              />

              {photoPreview && (
                <div className="mt-4 relative group overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#C9A24B]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <img
                    src={photoPreview}
                    alt="Student Photo Preview"
                    className="w-32 h-32 object-cover rounded-2xl transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <label className="block font-[Inter] text-white/90 font-medium mb-3">
                Signature
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  setSignature(file);
                  if (file) setSignaturePreview(URL.createObjectURL(file));
                }}
                className="w-full file:rounded-xl file:border file:border-white/10 file:bg-[#0A1229] file:text-[#FBF9F4] file:px-4 file:py-2 file:hover:border-[#C9A24B] file:hover:text-[#FBF9F4] bg-transparent text-[#FBF9F4] px-1"
              />

              {signaturePreview && (
                <div className="mt-4 relative group overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#C9A24B]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <img
                    src={signaturePreview}
                    alt="Signature Preview"
                    className="w-32 h-24 object-contain rounded-2xl transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              )}
            </div>
          </div>

          {/* FORM */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            <input
              name="studentName"
              value={form.studentName || ""}
              placeholder="Student Name"
              onChange={handleChange}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-[#FBF9F4] placeholder:text-white/35 outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-[#C9A24B]/20 transition-colors"
            />

            <input
              name="surname"
              value={form.surname || ""}
              placeholder="Surname"
              onChange={handleChange}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-[#FBF9F4] placeholder:text-white/35 outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-[#C9A24B]/20 transition-colors"
            />

            <select
              name="relationType"
              value={form.relationType || "S/O"}
              onChange={handleChange}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-[#FBF9F4] outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-[#C9A24B]/20 transition-colors"
            >
              <option className="bg-[#0A1229]">S/O</option>
              <option className="bg-[#0A1229]">D/O</option>
              <option className="bg-[#0A1229]">W/O</option>
            </select>

            {/* FATHER */}
            <div className="md:col-span-1">
              <input
                name="fatherName"
                value={form.fatherName || ""}
                placeholder="Father Name"
                onChange={handleChange}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 w-full text-[#FBF9F4] placeholder:text-white/35 outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-[#C9A24B]/20 transition-colors"
              />

              <div className="flex items-center gap-2 mt-3">
                <input
                  type="checkbox"
                  className="accent-[#C9A24B]"
                  checked={form.showFatherInCertificate || false}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      showFatherInCertificate: e.target.checked,
                    })
                  }
                />

                <label className="text-sm text-white/80 font-[Inter]">
                  Show in Certificate
                </label>
              </div>
            </div>

            {/* MOTHER */}
            <div className="md:col-span-1">
              <input
                name="motherName"
                value={form.motherName || ""}
                placeholder="Mother Name"
                onChange={handleChange}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 w-full text-[#FBF9F4] placeholder:text-white/35 outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-[#C9A24B]/20 transition-colors"
              />
            </div>

            <input
              name="mobile"
              value={form.mobile || ""}
              placeholder="Mobile"
              onChange={handleChange}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-[#FBF9F4] placeholder:text-white/35 outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-[#C9A24B]/20 transition-colors"
            />

            <input
              name="altMobile"
              value={form.altMobile || ""}
              placeholder="Alternate Mobile"
              onChange={handleChange}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-[#FBF9F4] placeholder:text-white/35 outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-[#C9A24B]/20 transition-colors"
            />

            <input
              name="email"
              value={form.email || ""}
              placeholder="Email"
              onChange={handleChange}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-[#FBF9F4] placeholder:text-white/35 outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-[#C9A24B]/20 transition-colors"
            />

            <input
              type="date"
              name="dob"
              value={form.dob || ""}
              onChange={handleChange}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-[#FBF9F4] outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-[#C9A24B]/20 transition-colors"
            />

            <select
              name="gender"
              value={form.gender || ""}
              onChange={handleChange}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-[#FBF9F4] outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-[#C9A24B]/20 transition-colors"
            >
              <option value="" className="bg-[#0A1229]">
                Select Gender
              </option>
              <option className="bg-[#0A1229]">Male</option>
              <option className="bg-[#0A1229]">Female</option>
            </select>

            <input
              name="aadhar"
              value={form.aadhar || ""}
              placeholder="Aadhar"
              onChange={handleChange}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-[#FBF9F4] placeholder:text-white/35 outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-[#C9A24B]/20 transition-colors"
            />

            <input
              name="qualification"
              value={form.qualification || ""}
              placeholder="Qualification"
              onChange={handleChange}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-[#FBF9F4] placeholder:text-white/35 outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-[#C9A24B]/20 transition-colors"
            />

            <input
              name="occupation"
              value={form.occupation || ""}
              placeholder="Occupation"
              onChange={handleChange}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-[#FBF9F4] placeholder:text-white/35 outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-[#C9A24B]/20 transition-colors"
            />

            <textarea
              name="address"
              value={form.address || ""}
              placeholder="Address"
              onChange={handleChange}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-[#FBF9F4] placeholder:text-white/35 col-span-1 md:col-span-3 outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-[#C9A24B]/20 transition-colors"
            />

            <input
              name="courseName"
              value={form.courseName || ""}
              placeholder="Course Name"
              onChange={handleChange}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-[#FBF9F4] placeholder:text-white/35 outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-[#C9A24B]/20 transition-colors"
            />

            <input
              name="subjects"
              value={form.subjects || ""}
              placeholder="Subjects"
              onChange={handleChange}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-[#FBF9F4] placeholder:text-white/35 outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-[#C9A24B]/20 transition-colors"
            />

            <input
              name="batch"
              value={form.batch || ""}
              placeholder="Batch"
              onChange={handleChange}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-[#FBF9F4] placeholder:text-white/35 outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-[#C9A24B]/20 transition-colors"
            />

            {/* FEES */}
            <input
              type="number"
              value={form.courseFees || 0}
              placeholder="Course Fees"
              onChange={(e) => calculateFees(e.target.value, form.discount)}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-[#FBF9F4] placeholder:text-white/35 outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-[#C9A24B]/20 transition-colors"
            />

            <input
              type="number"
              value={form.discount || 0}
              placeholder="Discount"
              onChange={(e) => calculateFees(form.courseFees, e.target.value)}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-[#FBF9F4] placeholder:text-white/35 outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-[#C9A24B]/20 transition-colors"
            />

            <input
              value={form.totalFees || 0}
              readOnly
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-[#FBF9F4] opacity-90 cursor-not-allowed"
            />

            <input
              type="number"
              value={form.feesReceived || 0}
              placeholder="Fees Received"
              onChange={(e) => handleFeesReceived(e.target.value)}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-[#FBF9F4] placeholder:text-white/35 outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-[#C9A24B]/20 transition-colors"
            />

            <input
              value={form.balance || 0}
              readOnly
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-[#FBF9F4] opacity-90 cursor-not-allowed"
            />

            <input
              type="date"
              name="admissionDate"
              value={form.admissionDate || ""}
              onChange={handleChange}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-[#FBF9F4] outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-[#C9A24B]/20 transition-colors"
            />

            <textarea
              name="remark"
              value={form.remark || ""}
              placeholder="Remark"
              onChange={handleChange}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-[#FBF9F4] placeholder:text-white/35 col-span-1 md:col-span-3 outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-[#C9A24B]/20 transition-colors"
            />
          </div>

          <div className="mt-10 flex justify-center">
            <button
              type="submit"
              className="relative overflow-hidden rounded-xl border border-white/10 px-10 py-3 font-[Inter] text-[#FBF9F4] transition-all duration-300 hover:border-[#C9A24B] hover:shadow-[0_0_40px_rgba(201,162,75,0.25)] bg-white/5 hover:bg-white/7"
            >
              <span className="relative z-10 font-semibold">
                Update Student
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-[#C9A24B]/25 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
