'use client'

export const dynamic = "force-dynamic";

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { account, databases } from '@/lib/appwrite'
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import QRCode from "qrcode";
import { storage } from '@/lib/appwrite'
import { ID, Query } from 'appwrite'
import * as htmlToImage from "html-to-image";
import { useRef } from "react";


const BUCKET_ID = "6a44e849001ad5b7cc0b"

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID

export default function Dashboard() {

  const router = useRouter()

  const [pending, setPending] = useState([])
  const [approved, setApproved] = useState([])
  const [rejected, setRejected] = useState([])

  const [activeTab, setActiveTab] = useState('pending')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  // ✅ NEW STATES
  const [stats, setStats] = useState({})
  const [editing, setEditing] = useState(null)
  const [editData, setEditData] = useState({})


  const [selectedFranchise, setSelectedFranchise] = useState(null)
  const [showIdCard, setShowIdCard] = useState(false)
  const [showPrint, setShowPrint] = useState(false)

  const [logoFile, setLogoFile] = useState(null)
  const [photoFile, setPhotoFile] = useState(null)
  const [certificateLogoFile, setCertificateLogoFile] = useState(null)
  const [signatureFile, setSignatureFile] = useState(null)
  const [plans, setPlans] = useState([]);

  const printRef = useRef();
  /* ---------------- LOGIN CHECK ---------------- */

  useEffect(() => {
    const checkSession = async () => {
      try {
        const user = await account.get()
        if (user.email !== 'bnmiindia@gmail.com') {
          router.replace('/login')
        }
      } catch {
        router.replace('/login')
      }
    }
    checkSession()
  }, [])



  /* ---------------- FETCH DATA ---------------- */

const fetchAll = async () => {

  try {

    setLoading(true);

    const response = await fetch("/api/fetch-franchise-data");

    const data = await response.json();

    console.log("FETCH DATA:", data);

    if (data.success) {

      setPending(
        Array.isArray(data.pending)
          ? data.pending.reverse()
          : []
      );

      setApproved(
        Array.isArray(data.approved)
          ? data.approved.reverse()
          : []
      );

      setRejected(
        Array.isArray(data.rejected)
          ? data.rejected.reverse()
          : []
      );

    } else {

      console.log(data.error);

      setPending([]);
      setApproved([]);
      setRejected([]);

    }

  } catch (err) {

    console.error("FETCH ERROR:", err);

    setPending([]);
    setApproved([]);
    setRejected([]);

  } finally {

    setLoading(false);

  }

};


  const openIdCard = (req) => {
    setSelectedFranchise(req)
    setShowIdCard(true)
  }

  const openPrint = (req) => {
    setSelectedFranchise(req)
    setShowPrint(true)
  }



  /* ---------------- DELETE ---------------- */
  const deleteFranchise = async (req) => {
    try {

      const confirmDelete = confirm("Are you sure you want to delete this franchise?")

      if (!confirmDelete) return

      await databases.deleteDocument(
        DATABASE_ID,
        'franchise_approved',
        req.$id
      )

      alert("Franchise deleted successfully")

      fetchAll()

    } catch (error) {
      console.error(error)
      alert("Delete failed")
    }
  }

  /* ---------------- FETCH STATS ---------------- */

const fetchStats = async () => {

  try {

    // =========================
    // LOAD ALL TOGETHER
    // =========================

   const [
  admissions,
  enquiries,
  certificates
] = await Promise.all([

  databases.listDocuments(
    DATABASE_ID,
    "student_admissions",
    [
      Query.limit(5000)
    ]
  ),

  databases.listDocuments(
    DATABASE_ID,
    "student_enquiries",
    [
      Query.limit(5000)
    ]
  ),

  databases.listDocuments(
    DATABASE_ID,
    "certificates",
    [
      Query.limit(5000)
    ]
  )

]);

    const data = {};

    // =========================
    // ADMISSIONS COUNT
    // =========================

    admissions.documents.forEach((item) => {

      const email = item.franchiseEmail;

      if (!email) return;

      if (!data[email]) {

        data[email] = {
          admissions: 0,
          enquiries: 0,
          courier: 0
        };

      }

      data[email].admissions++;

    });

    // =========================
    // ENQUIRIES COUNT
    // =========================

    enquiries.documents.forEach((item) => {

      const email = item.franchiseEmail;

      if (!email) return;

      if (!data[email]) {

        data[email] = {
          admissions: 0,
          enquiries: 0,
          courier: 0
        };

      }

      data[email].enquiries++;

    });

    // =========================
    // COURIER WALLET
    // =========================

    certificates.documents.forEach((item) => {

      const email = item.franchiseEmail;

      if (!email) return;

      if (!data[email]) {

        data[email] = {
          admissions: 0,
          enquiries: 0,
          courier: 0
        };

      }

      // ₹50 per certificate
      data[email].courier += 50;

    });

    console.log("FINAL STATS:", data);

    setStats(data);

  } catch (err) {

    console.log("FETCH STATS ERROR:", err);

  }

};

  const fetchPlans = async () => {
    try {
      const res = await databases.listDocuments(
        DATABASE_ID,
        "franchise_plans"
      );

      setPlans(res.documents);
    } catch (err) {
      console.error("Plan fetch error:", err);
    }
  };

  useEffect(() => {
    fetchAll()
    fetchStats()
    fetchPlans();
  }, [])

  /* ---------------- APPROVE ---------------- */
  const fixQR = async (req) => {
    try {

     const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://www.bnmiindia.org";

const verifyUrl =
  `${BASE_URL}/verify/${req.$id}`;

      const qrCode = await QRCode.toDataURL(verifyUrl)

      await databases.updateDocument(
        DATABASE_ID,
        'franchise_approved',
        req.$id,
        { qrCode, verifyUrl }
      )

      alert("QR Updated")

    } catch (err) {
      console.error("FIX QR ERROR:", err)
      alert("QR fix failed")
    }
  }
const approveFranchise = async (req) => {

  try {

    const response = await fetch("/api/approve-franchise", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(req)
    });

    const data = await response.json();

    console.log("APPROVE RESPONSE:", data);

    // IMPORTANT
    // DO NOT THROW ERROR IF DOC ALREADY CREATED

    if (data.success) {

      alert("Franchise approved successfully");

      fetchAll();

    } else {

      alert(data.error || "Approval failed");

    }

  } catch (err) {

    console.error("APPROVE FRONTEND ERROR:", err);

    alert(err.message);

  }

};

  /* ---------------- REJECT ---------------- */

const rejectFranchise = async (req) => {

  try {

    const res = await fetch("/api/reject-franchise", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(req)
    });

    const data = await res.json();

    if (!data.success) {
      throw new Error(data.error || "Reject failed");
    }

    alert("Franchise rejected successfully");

    fetchAll();

  } catch (err) {

    console.error(err);

    alert(err.message);

  }
};

  /* ---------------- LOGIN ---------------- */

  const loginAsFranchise = (req) => {
    router.push(`/login/institute?email=${req.email}&password=${req.password}`)
  }

  /* ---------------- EDIT ---------------- */

  const openEdit = (req) => {
    setEditing(req.$id)
    setEditData(req)
  }

  const uploadFile = async (file) => {

    if (!file) {
      alert("No file selected")
      return null
    }

    try {

      const res = await storage.createFile(
        BUCKET_ID,
        ID.unique(),
        file
      )

      console.log("UPLOAD SUCCESS:", res)

      return res.$id

    } catch (err) {
      console.log("FULL ERROR:", err)
      alert(err?.message || "Update failed")
    }
  }


  const saveEdit = async () => {

    try {

      let updatedData = { ...editData }

      // -------- LOGO --------
      if (logoFile) {
        const res = await storage.createFile(
          BUCKET_ID,
          ID.unique(),
          logoFile
        )

        updatedData.logo = `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${res.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`
      }


      // -------- CERTIFICATE LOGO --------
if (certificateLogoFile) {

  const res = await storage.createFile(
    BUCKET_ID,
    ID.unique(),
    certificateLogoFile
  )

  updatedData.certificateLogo =
    `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${res.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`
}


      // -------- OWNER PHOTO --------
      if (photoFile) {
        const res = await storage.createFile(
          BUCKET_ID,
          ID.unique(),
          photoFile
        )

        updatedData.ownerPhoto = `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${res.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`
      }

      // -------- SIGNATURE --------
      if (signatureFile) {
        const res = await storage.createFile(
          BUCKET_ID,
          ID.unique(),
          signatureFile
        )

        updatedData.signature = `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${res.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`
      }

      if (editData.newPlanName && editData.newPlanAmount) {

  // ✅ Save new plan
  await databases.createDocument(
    DATABASE_ID,
    "franchise_plans",
    ID.unique(),
    {
      name: editData.newPlanName,
      amount: Number(editData.newPlanAmount),
    }
  );

  // ✅ Use it immediately
  updatedData.plan = editData.newPlanName;
}
delete updatedData.newPlanName;
delete updatedData.newPlanAmount;
      // ✅ VERY IMPORTANT → REMOVE FILE OBJECTS
      delete updatedData.logoFile
      delete updatedData.certificateLogoFile

      delete updatedData.photoFile
      delete updatedData.signatureFile

      // -------- UPDATE DOCUMENT --------
      await databases.updateDocument(
        DATABASE_ID,
        "franchise_approved",
        editing, // make sure this is ID
        updatedData
      )
      
      // ✅ UPDATE AUTH EMAIL
if (editData.email && editData.userId) {

  await fetch("/api/change-email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      userId: editData.userId,
      email: editData.email
    })
  });

}

// ✅ UPDATE AUTH PASSWORD
if (editData.password && editData.userId) {

  await fetch("/api/change-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      userId: editData.userId,
      newPassword: editData.password
    })
  });

}
      alert("Updated successfully")

      setEditing(null)
      fetchAll()

    } catch (err) {

      console.error("UPDATE ERROR:", err)

      alert(err?.message || "Update failed")

    }
  }

const fixUser = async (req) => {
  try {
    // ✅ 1. Create / Get user
    const res = await fetch("/api/create-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: req.email,
        password: req.password
      })
    });

    const data = await res.json();

    if (!data.userId) {
      throw new Error(data.error || "User creation failed");
    }

    const userId = data.userId;

    // ✅ 2. FORCE UPDATE PASSWORD IN AUTH (IMPORTANT)
    await fetch("/api/change-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId,
        newPassword: req.password
      })
    });

    // ✅ 3. Save userId in DB
    await databases.updateDocument(
      DATABASE_ID,
      "franchise_approved",
      req.$id,
      { userId }
    );

    alert("User fixed successfully ✅");

    fetchAll();

  } catch (err) {
    console.error(err);
    alert("Fix failed: " + err.message);
  }
};
  /* ---------------- FILTER ---------------- */

 const getCurrentData = () => {

  let data = [];

  // =========================
  // PENDING
  // =========================

  if (activeTab === "pending") {

    // REMOVE ALREADY APPROVED REQUESTS
    data = pending.filter((item) => {

      if (!item) return false;

      const alreadyApproved = approved.some(
        (a) => a.requestId === item.$id
      );

      return !alreadyApproved;
    });

  }

  // =========================
  // APPROVED
  // =========================

  if (activeTab === "approved") {
    data = approved;
  }

  // =========================
  // REJECTED
  // =========================

  if (activeTab === "rejected") {
    data = rejected;
  }

  // =========================
  // SEARCH FILTER
  // =========================

  return data.filter((item) => {

    if (!item) return false;

    const searchText = search.toLowerCase();

    return (
      (item.name || "").toLowerCase().includes(searchText) ||
      (item.email || "").toLowerCase().includes(searchText) ||
      (item.instituteName || "").toLowerCase().includes(searchText)
    );

  });

};

  

  const toBase64 = async (url) => {
  const res = await fetch(url);
  const blob = await res.blob();

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
};

  const handleDownload = async () => {
  try {
    const node = document.getElementById("print-area");

    if (!node) {
      alert("ID Card not found");
      return;
    }

    const rect = node.getBoundingClientRect();

    await new Promise(resolve => setTimeout(resolve, 500));

    // ✅ FIX IMAGE ISSUE
    const images = node.querySelectorAll("img");
    for (let img of images) {
      if (!img.src.startsWith("data:")) {
        try {
          const res = await fetch(img.src);
          const blob = await res.blob();

          const base64 = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
          });

          img.src = base64;
        } catch (e) {
          console.log("IMG ERROR:", e);
        }
      }
    }

    const dataUrl = await htmlToImage.toPng(node, {
      quality: 1,
      pixelRatio: 3,
      cacheBust: true,
      width: rect.width,
      height: rect.height,
      style: {
        width: rect.width + "px",
        height: rect.height + "px"
      }
    });

    const link = document.createElement("a");
    link.download = `${selectedFranchise?.name || "id-card"}.png`;
    link.href = dataUrl;
    link.click();

  } catch (err) {
    console.log("DOWNLOAD ERROR:", err);
  }
};


const formatDate = (date) => {
  if (!date) return "N/A"

  const d = new Date(date)

  if (isNaN(d.getTime())) return "N/A"

  return d.toLocaleDateString("en-GB") // DD/MM/YYYY
}


const getIssueDate = () => {
  return selectedFranchise?.issueDate || selectedFranchise?.$createdAt;
};

const getExpiryDate = () => {
  const base = new Date(getIssueDate());
  if (isNaN(base)) return null;

  base.setFullYear(base.getFullYear() + 1);
  return base;
};

  const fieldClass =
    "w-full rounded-2xl border border-white/10 bg-white/5 p-3 text-[#FBF9F4] outline-none transition-all duration-300 placeholder-[#D5D8E3]/50 [color-scheme:dark] hover:border-[#C9A24B]/35 focus:border-[#C9A24B] focus:ring-2 focus:ring-[#C9A24B]/30";

  const labelClass = "mb-2 block text-sm font-medium text-[#D5D8E3]";

  if (loading) return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0A1229] p-10 text-[#FBF9F4]">
      <div className="absolute inset-0 bg-[radial-gradient(#C9A24B_1px,transparent_1px)] bg-size-[70px_70px] opacity-[0.03]" />
      <div className="absolute h-96 w-96 rounded-full bg-[#C9A24B]/15 blur-[140px]" />
      <div className="relative rounded-4xl border border-white/10 bg-white/5 px-10 py-8 font-semibold backdrop-blur-2xl">
        Loading...
      </div>
    </div>
  )

  return (
    <>
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

        {/* Header */}
        <div className="mb-8">
          <div className="bnmi-font-body mb-4 inline-flex rounded-full border border-[#C9A24B]/30 bg-[#C9A24B]/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#C9A24B]">
            Admin Console
          </div>

          <h1 className="bnmi-font-display text-4xl font-black leading-tight text-[#FBF9F4] md:text-5xl">
            Franchise Dashboard
          </h1>

          <p className="bnmi-font-body mt-3 max-w-2xl text-base leading-7 text-[#D5D8E3]">
            Review franchise requests, approvals, wallets, certificates, and institute access from one premium control panel.
          </p>
        </div>

        {/* Tabs */}
   <div className="mb-6 flex flex-wrap gap-3">
         <Tab
  label={`Pending (${
    pending.filter((item) => {

      if (!item) return false;

      const alreadyApproved = approved.some(
        (a) => a.requestId === item.$id
      );

      return !alreadyApproved;

    }).length
  })`}
  active={activeTab === 'pending'}
  onClick={() => setActiveTab('pending')}
/>
          <Tab label={`Approved (${approved.length})`} active={activeTab === 'approved'} onClick={() => setActiveTab('approved')} />
          <Tab label={`Rejected (${rejected.length})`} active={activeTab === 'rejected'} onClick={() => setActiveTab('rejected')} />
        </div>

        {/* Search */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search by name, email, institute..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bnmi-font-body w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-[#FBF9F4] shadow-[0_10px_60px_rgba(201,162,75,0.08)] outline-none backdrop-blur-2xl transition-all duration-300 placeholder-[#D5D8E3]/50 hover:border-[#C9A24B]/35 focus:border-[#C9A24B] focus:ring-2 focus:ring-[#C9A24B]/30"
          />
        </div>

        {/* List */}
        <div className="grid gap-6">

          {getCurrentData().length === 0 && (
            <div className="rounded-4xl border border-white/10 bg-white/5 py-12 text-center text-[#D5D8E3] backdrop-blur-2xl">
              No records found
            </div>
          )}

       {getCurrentData().map((req) => (
            <div
              key={req.$id}
            className="group relative overflow-hidden rounded-4xl border border-white/10 bg-white/5 p-4 shadow-[0_18px_80px_rgba(201,162,75,0.08)] backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:border-[#C9A24B]/35 hover:shadow-[0_24px_100px_rgba(201,162,75,0.14)] md:p-6"
            >

              <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-white/10 via-transparent to-[#C9A24B]/10 opacity-60" />

              <div className="relative flex flex-col justify-between gap-4 md:gap-6 lg:flex-row">

              {/* LEFT */}
             <div className="min-w-62.5 flex-1 space-y-1 text-sm text-[#D5D8E3]">

                <h3 className="bnmi-font-display text-2xl font-black text-[#FBF9F4]">
                  
                   Institute: {req?.instituteName}
                </h3>

              <div className="bnmi-font-body mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
  <p><b className="text-[#C9A24B]">Name:</b> {req.name}</p>
  <p><b className="text-[#C9A24B]">Email:</b> {req.email}</p>
  <p><b className="text-[#C9A24B]">Password:</b> {req.password}</p>
  <p><b className="text-[#C9A24B]">Mobile:</b> {req.mobile}</p>
  <p><b className="text-[#C9A24B]">State:</b> {req.state}</p>
  <p><b className="text-[#C9A24B]">City:</b> {req.city}</p>
  <p><b className="text-[#C9A24B]">Pincode:</b> {req.pincode}</p>
  <p><b className="text-[#C9A24B]">ATC Code:</b> {req.atcCode}</p>
  <p><b className="text-[#C9A24B]">Address:</b> {req.address}</p>
  <p><b className="text-[#C9A24B]">Amc Code:</b> {req.amcCode}</p>
</div>
                {/* Stats */}
               
               <div className="flex flex-wrap gap-4 mt-4">

  <span className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-base font-bold text-[#FBF9F4] shadow-sm">
    Admissions: {stats[req.email]?.admissions || 0}
  </span>

  <span className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-base font-bold text-[#FBF9F4] shadow-sm">
    Enquiries: {stats[req.email]?.enquiries || 0}
  </span>

  <span className="rounded-2xl border border-[#C9A24B]/30 bg-[#C9A24B]/10 px-5 py-3 text-base font-bold text-[#C9A24B] shadow-sm">
    Wallet: ₹{req.wallet || "0.00"}
  </span>

  <span className="rounded-2xl border border-[#C9A24B]/30 bg-[#C9A24B]/10 px-5 py-3 text-base font-bold text-[#C9A24B] shadow-sm">
    Courier: ₹{stats[req.email]?.courier || 0}
  </span>

</div>
              </div>
                      {/* RIGHT */}
            <div className="w-full lg:w-auto flex flex-wrap items-center gap-3 justify-start lg:justify-end">

                {/* Pending */}
                {activeTab === 'pending' && (
                <div className="flex flex-wrap gap-2 md:gap-3">
                 
                    <ActionBtn label="Approve" color="green" onClick={() => approveFranchise(req)} />
                    <ActionBtn label="Reject" color="red" onClick={() => rejectFranchise(req)} />
                  </div>
                )}

                {/* Approved */}
                {activeTab === 'approved' && (
                  <div className="flex flex-wrap gap-3 items-center">

                    {req.logo && (
                      <img
                        src={req.logo}
                      className="h-12 w-12 rounded-2xl border border-white/10 object-cover md:h-14 md:w-14"
                      />
                    )}

                    <ActionBtn label="Fix QR" color="purple" onClick={() => fixQR(req)} />
                      <ActionBtn label="Fix User" color="purple" onClick={() => fixUser(req)} />
                    <ActionBtn label="Login" color="blue" onClick={() => loginAsFranchise(req)} />
                    <ActionBtn label="Edit" color="yellow" onClick={() => openEdit(req)} />
                    <ActionBtn
  label="ATC"
  color="indigo"
  onClick={() => req && openIdCard(req)}
/>
                    <ActionBtn
  label="Print"
  color="dark"
  onClick={() => req && openPrint(req)}
/>
                    <ActionBtn label="Delete" color="red" onClick={() => deleteFranchise(req)} />
                  </div>
                )}

              </div>

              </div>

            </div>
          ))}

        </div>
        </div>
      </main>

      {/* ✅ EDIT MODAL */}

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A1229]/80 p-4 backdrop-blur-sm">

          <div className="w-full max-w-2xl space-y-6 overflow-y-auto rounded-4xl border border-white/10 bg-[#0A1229]/95 p-4 text-[#FBF9F4] shadow-[0_30px_120px_rgba(201,162,75,0.18)] backdrop-blur-2xl md:p-6 max-h-[90vh]">

            <h2 className="bnmi-font-display border-b border-white/10 pb-3 text-center text-3xl font-black text-[#FBF9F4]">
              Edit Franchise Details
            </h2>

            {/* -------- BASIC DETAILS -------- */}

   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div>
                <label className={labelClass}>Name</label>
                <input
                  type="text"
                  value={editData.name || ""}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  className={fieldClass}
                />
              </div>

              <div>
                <label className={labelClass}>Email</label>
                <input
                  type="text"
                  value={editData.email || ""}
                  onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                  className={fieldClass}
                />
              </div>

              <div>
                <label className={labelClass}>Password</label>
                <input
                  type="text"
                  value={editData.password || ""}
                  onChange={(e) => setEditData({ ...editData, password: e.target.value })}
                  className={fieldClass}
                />
              </div>

              <div>
                <label className={labelClass}>Mobile</label>
                <input
                  type="text"
                  value={editData.mobile || ""}
                  onChange={(e) => setEditData({ ...editData, mobile: e.target.value })}
                  className={fieldClass}
                />
              </div>
              <div>
                <label className={labelClass}>Select Plan</label>
                <select
                  value={editData.plan || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, plan: e.target.value })
                  }
                  className={fieldClass}
                >
                  <option value="" className="bg-[#0A1229] text-[#FBF9F4]">--Select Plan--</option>

                  {plans.map((plan) => (
                    <option key={plan.$id} value={plan.name} className="bg-[#0A1229] text-[#FBF9F4]">
                      {plan.name} (₹{plan.amount})
                    </option>
                  ))}
                </select>
              </div>
              <input
  type="text"
  placeholder="Custom Plan Name"
  value={editData.newPlanName || ""}
  onChange={(e) =>
    setEditData({ ...editData, newPlanName: e.target.value })
  }
  className={fieldClass}
/>

<input
  type="number"
  placeholder="Custom Plan Amount"
  value={editData.newPlanAmount || ""}
  onChange={(e) =>
    setEditData({ ...editData, newPlanAmount: e.target.value })
  }
  className={`${fieldClass} mt-2`}
/>

              <div>
                <label className={labelClass}>State</label>
                <input
                  type="text"
                  value={editData.state || ""}
                  onChange={(e) => setEditData({ ...editData, state: e.target.value })}
                  className={fieldClass}
                />
              </div>

              <div>
                <label className={labelClass}>City</label>
                <input
                  type="text"
                  value={editData.city || ""}
                  onChange={(e) => setEditData({ ...editData, city: e.target.value })}
                  className={fieldClass}
                />
              </div>

              <div>
                <label className={labelClass}>Pincode</label>
                <input
                  type="text"
                  value={editData.pincode || ""}
                  onChange={(e) => setEditData({ ...editData, pincode: e.target.value })}
                  className={fieldClass}
                />
              </div>

              <div>
                <label className={labelClass}>Institute</label>
                <input
                  type="text"
                  value={editData.instituteName || ""}
                  onChange={(e) => setEditData({ ...editData, instituteName: e.target.value })}
                  className={fieldClass}
                />
              </div>

              <div>
                <label className={labelClass}>ATC Code</label>
                <input
                  type="text"
                  value={editData.atcCode || ""}
                  onChange={(e) => setEditData({ ...editData, atcCode: e.target.value })}
                  className={fieldClass}
                />
              </div>

              <div className="col-span-2">
                <label className={labelClass}>Address</label>
                <textarea
                  value={editData.address || ""}
                  onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                  className={fieldClass}
                  rows={3}
                />
              </div>

            </div>

            {/* -------- FILE UPLOAD SECTION -------- */}

            <div className="space-y-3 border-t border-white/10 pt-4">

              <h3 className="font-semibold text-[#C9A24B]">
                Upload Documents
              </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                <div>
                  <label className={labelClass}>Owner Photo</label>
                  <input
                    type="file"
                    accept="image/*"
                  onChange={(e) => setPhotoFile(e.target.files[0])}

                    className={fieldClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Logo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setLogoFile(e.target.files[0])}
                    className={fieldClass}
                  />
                </div>             

                <div>
  <label className={labelClass}>Certificate Logo</label>

  <input
    type="file"
    accept="image/*"
    onChange={(e) =>
      setCertificateLogoFile(e.target.files[0])
    }
    className={fieldClass}
  />
</div>                    
              
                <div>
                  <label className={labelClass}>Signature</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSignatureFile(e.target.files[0])}
                    className={fieldClass}
                  />
                </div>

              </div>

            </div>

            {/* -------- DATE SECTION -------- */}

            <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4">

              <div>
                <label className={labelClass}>Verification Date</label>
                <input
                  type="date"
                  value={editData.verificationDate || ""}
                  onChange={(e) => setEditData({ ...editData, verificationDate: e.target.value })}
                  className={fieldClass}
                />
              </div>

              <div>
                <label className={labelClass}>Expire Date</label>
                <input
                  type="date"
                  value={editData.expireDate || ""}
                  onChange={(e) => setEditData({ ...editData, expireDate: e.target.value })}
                  className={fieldClass}
                />
              </div>

            </div>

            {/* -------- ACTION BUTTONS -------- */}

            <div className="flex justify-end gap-4 border-t border-white/10 pt-4">

              <button
                onClick={() => setEditing(null)}
                className="rounded-2xl border border-white/10 px-5 py-2 text-[#D5D8E3] transition hover:border-[#C9A24B]/35 hover:text-[#C9A24B]"
              >
                Cancel
              </button>

              <button
                onClick={saveEdit}
                className="rounded-2xl bg-[#C9A24B] px-5 py-2 font-semibold text-[#0A1229] shadow-[0_14px_40px_rgba(201,162,75,0.25)] transition hover:-translate-y-0.5 hover:bg-[#d4b05a]"
              >
                Save Changes
              </button>

            </div>

          </div>

        </div>
      )}


      {showIdCard && selectedFranchise && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[#0A1229]/85 p-6 backdrop-blur-sm">

          <div className="relative max-w-full overflow-auto rounded-[28px] border border-white/10 bg-white p-4 shadow-[0_30px_120px_rgba(201,162,75,0.18)] md:p-6">

            <button
              onClick={() => setShowIdCard(false)}
              className="absolute right-3 top-2 z-10 text-xl text-[#0A1229] transition hover:text-[#C9A24B]"

            >
              ✖
            </button>

            {/* PRINT AREA */}
            <div id="print-area" style={{ width: "800px", position: "relative" }}>

              {/* Background Image */}
              <img
                src="/ATC.png"
                alt="certificate"
                className="w-full"
              />
              <img
                src={selectedFranchise?.qrCode}
                className="absolute top-138.75 left-31.25 w-25"
              />
              {/* ----------- DYNAMIC TEXT ----------- */}

              {/* Institute Name (RED CENTER) */}
             {/* Institute Name (RED CENTER) */}
<div className="absolute top-117.5 left-0 flex w-full justify-center px-20">
  <h1 className="max-w-162.5 wrap-break-word text-center text-2xl font-bold leading-tight text-red-600">
    {selectedFranchise?.instituteName}
  </h1>
</div>

              {/* ATC Code */}
              <div className="absolute top-147.5 left-76 font-bold">
                ATC Code: {selectedFranchise?.atcCode}
              </div>

              {/* Owner Name */}
              <div className="absolute top-141 w-full text-center font-semibold">
                Applicant Name :  {selectedFranchise?.name}
              </div>

              {/* Address */}
              <div className="absolute top-130 w-full px-10 text-center text-sm">
                {selectedFranchise?.address}{selectedFranchise?.city}, {selectedFranchise?.state} - {selectedFranchise?.pincode}
              </div>

                <div className="absolute bottom-22.5 left-55 font-bold">
                ATC Code: {selectedFranchise?.atcCode}
              </div>

              {/* Issue Date */}
<div className="absolute bottom-17.5 left-55 font-semibold">
  Issue Date: {formatDate(getIssueDate())}
</div>

{/* Expiry Date */}
<div className="absolute bottom-12.5 left-55 font-semibold">
Expiry Date: {formatDate(getExpiryDate())}
</div>

            </div>

            {/* PRINT BUTTON */}
           <button
  onClick={handleDownload}
  className="mb-6 ml-4 rounded-2xl bg-[#C9A24B] px-6 py-3 font-semibold text-[#0A1229] shadow-[0_14px_40px_rgba(201,162,75,0.25)] transition hover:bg-[#d4b05a]"
>
  Download Certificate
</button>

          </div>

        </div>
      )}

      {showPrint && selectedFranchise && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A1229]/85 p-4 backdrop-blur-sm">

          <div className="relative w-full max-w-150 rounded-4xl border border-white/10 bg-white/5 p-6 text-[#FBF9F4] shadow-[0_30px_120px_rgba(201,162,75,0.18)] backdrop-blur-2xl">

            <button
              onClick={() => setShowPrint(false)}
              className="absolute right-3 top-2 text-xl text-[#D5D8E3] transition hover:text-[#C9A24B]"
            >
              ✖
            </button>

            <div className="space-y-2">

              <p><strong>To,</strong></p>

              <p><strong>ATC Code:</strong> {selectedFranchise?.atcCode}</p>

              <h2 className="font-bold text-lg">
                {selectedFranchise?.instituteName}
              </h2>
              <p>{selectedFranchise?.name}</p>


              <p>{selectedFranchise?.address}</p>

              <p>Mobile: {selectedFranchise?.mobile}</p>


              <p>
                {selectedFranchise?.city}, {selectedFranchise?.state} - {selectedFranchise?.pincode}
              </p>

            </div>

            <button
              onClick={() => window.print()}
              className="mt-4 rounded-2xl bg-[#C9A24B] px-5 py-2 font-semibold text-[#0A1229] shadow-[0_14px_40px_rgba(201,162,75,0.25)] transition hover:bg-[#d4b05a]"
            >
              Print
            </button>

          </div>

        </div>
      )}


    </>

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
function Tab({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-5 py-2 text-sm font-semibold transition-all duration-300
        ${active
          ? 'border-[#C9A24B] bg-[#C9A24B] text-[#0A1229] shadow-[0_14px_40px_rgba(201,162,75,0.25)]'
          : 'border-white/10 bg-white/5 text-[#D5D8E3] hover:border-[#C9A24B]/35 hover:text-[#C9A24B]'}
      `}
    >
      {label}
    </button>
  )
}