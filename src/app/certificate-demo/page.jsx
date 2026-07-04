'use client'

import { useEffect, useState } from 'react'
import { databases, storage } from '@/lib/appwrite'
import { ID } from 'appwrite'

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID
const COLLECTION_ID = 'upload_image'
const BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID

export default function ManageImagesPage() {
  const [docId, setDocId] = useState(null)
  const [images, setImages] = useState({})
  const [files, setFiles] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await databases.listDocuments(DATABASE_ID, COLLECTION_ID)

        if (res.documents.length > 0) {
          const doc = res.documents[0]
          setDocId(doc.$id)
          setImages(doc)
        } else {
          const newDoc = await databases.createDocument(
            DATABASE_ID,
            COLLECTION_ID,
            ID.unique(),
            {}
          )
          setDocId(newDoc.$id)
        }
      } catch (err) {
        console.error(err)
      }
    }

    fetchData()
  }, [])

  const handleFileChange = (e, key) => {
    setFiles(prev => ({ ...prev, [key]: e.target.files[0] }))
  }

  const uploadImage = async (key) => {
    if (!docId) return alert('Loading...')
    if (!files[key]) return alert('Select image')

    try {
      const upload = await storage.createFile(BUCKET_ID, ID.unique(), files[key])

      const fileUrl = `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${upload.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`

      await databases.updateDocument(DATABASE_ID, COLLECTION_ID, docId, {
        [key]: fileUrl
      })

      setImages(prev => ({ ...prev, [key]: fileUrl }))
    } catch (err) {
      console.error(err)
      alert('Upload failed')
    }
  }

  const sections = [
    { label: 'Certificate', key: 'certificateImage' },
    { label: 'Marksheet', key: 'marksheetImage' },
    { label: 'Admission Form', key: 'admissionImage' },
    { label: 'ID Card', key: 'idcardImage' },
    { label: 'Hall Ticket', key: 'hallticketImage' },
    { label: 'Fees Receipt', key: 'feesreceiptImage' },
    { label: 'ATC Certificate', key: 'atccertificateImage' },
    { label: 'Typing Marksheet', key: 'typingmarksheetImage' }
  ]

  return (
    <div className="p-6 bg-[#0A1229] min-h-screen relative overflow-hidden">

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap');
        
        .bnmi-font-display {
          font-family: 'Playfair Display', Georgia, serif;
        }
        
        .bnmi-font-body {
          font-family: 'Inter', system-ui, sans-serif;
        }
      `}</style>

      {/* BG GLOW */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[650px] h-[650px] rounded-full opacity-[0.08] blur-[170px] pointer-events-none"
        style={{
          background: "radial-gradient(circle,#C9A24B 0%,transparent 70%)"
        }}
      />

      {/* GRID */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#C9A24B 1px, transparent 1px),linear-gradient(90deg,#C9A24B 1px, transparent 1px)",
          backgroundSize: "70px 70px"
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">

        <h1 className="bnmi-font-display text-4xl font-bold mb-6 text-[#FBF9F4]">Manage Background Images</h1>

        <div className="grid md:grid-cols-2 gap-6">

          {sections.map(({ label, key }) => (
            <div key={key} className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/10 hover:border-[#C9A24B]/30 transition-all duration-300">

              <h2 className="bnmi-font-display text-lg font-semibold mb-4 text-[#FBF9F4]">{label}</h2>

              {images[key] ? (
                <div className="relative overflow-hidden rounded-lg mb-4 group">
                  <img
                    src={images[key]}
                    alt={label}
                    className="w-full h-40 object-contain border border-white/10 rounded-lg hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-[#C9A24B]/0 group-hover:bg-[#C9A24B]/10 transition duration-300 rounded-lg" />
                </div>
              ) : (
                <div className="w-full h-40 flex items-center justify-center border border-white/10 rounded-lg text-[#D5D8E3] mb-4 bg-white/5">
                  No Image
                </div>
              )}

              {/* <input
                type="file"
                onChange={(e) => handleFileChange(e, key)}
                className="mb-3 w-full text-sm border border-gray-300 rounded-lg p-2 file:mr-3 file:py-2 file:px-4 file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              /> */}

              <div className="flex gap-2">
                {/* <button
                  onClick={() => uploadImage(key)}
                  disabled={!docId}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  {docId ? 'Upload' : 'Loading...'}
                </button> */}

                {images[key] && (
                  <button
                    onClick={() => window.open(images[key], '_blank')}
                    className="flex-1 bnmi-font-body bg-[#C9A24B] text-[#0A1229] py-2 rounded-lg hover:bg-[#d4b05a] transition-all duration-300 font-medium shadow-[0_10px_30px_rgba(201,162,75,0.25)] hover:shadow-[0_15px_40px_rgba(201,162,75,0.35)]"
                  >
                    Preview
                  </button>
                )}
              </div>

            </div>
          ))}

        </div>
      </div>
    </div>
  )
}
