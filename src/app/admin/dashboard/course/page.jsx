"use client"

import { useEffect, useState } from "react"
import { databases, storage } from "@/lib/appwrite"
import { ID, Query } from "appwrite"

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID

const CATEGORY_COLLECTION = "course_categories"
const COURSE_COLLECTION = "website_courses"

const BUCKET_ID = "6a44e849001ad5b7cc0b"

export default function CourseCMS() {

  const [categories, setCategories] = useState([])
  const [courses, setCourses] = useState([])

  const [catImage, setCatImage] = useState(null)
  const [courseImage, setCourseImage] = useState(null)

  const [editingCourseId, setEditingCourseId] = useState(null)
  const [editingCategoryId, setEditingCategoryId] = useState(null)

  const [categoryForm, setCategoryForm] = useState({
    name: "",
    slug: "",
    subtitle: ""
  })

  const [courseForm, setCourseForm] = useState({
    title: "",
    description: "",
    category: "",
    duration: "",
    fees: ""
  })

  useEffect(() => {
    loadCategories()
    loadCourses()
  }, [])

  /* =========================
      LOAD CATEGORIES
  ========================= */

  const loadCategories = async () => {

    try {

      const res = await databases.listDocuments(
        DATABASE_ID,
        CATEGORY_COLLECTION,
        [Query.orderAsc("$createdAt")]
      )

      setCategories(res.documents)

    } catch (err) {

      console.log(err)

    }

  }

  /* =========================
      LOAD COURSES
  ========================= */

  const loadCourses = async () => {

    try {

      const res = await databases.listDocuments(
        DATABASE_ID,
        COURSE_COLLECTION,
        [Query.orderAsc("$createdAt")]
      )

      setCourses(res.documents)

    } catch (err) {

      console.log(err)

    }

  }

  /* =========================
      CATEGORY CHANGE
  ========================= */

  const handleCategoryChange = (e) => {

    const { name, value } = e.target

    if (name === "name") {

      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9 ]/g, "")
        .replace(/\s+/g, "-")

      setCategoryForm({
        ...categoryForm,
        name: value,
        slug
      })

    } else {

      setCategoryForm({
        ...categoryForm,
        [name]: value
      })

    }

  }

  /* =========================
      COURSE CHANGE
  ========================= */

  const handleCourseChange = (e) => {

    setCourseForm({
      ...courseForm,
      [e.target.name]: e.target.value
    })

  }

  /* =========================
      ADD CATEGORY
  ========================= */

  const addCategory = async () => {

  try {

    let payload = {
      name: categoryForm.name,
      slug: categoryForm.slug,
      subtitle: categoryForm.subtitle
    }

    /* =========================
        IMAGE UPDATE
    ========================= */

    if (catImage) {

      const upload = await storage.createFile(
        BUCKET_ID,
        ID.unique(),
        catImage
      )

      payload.imageId = upload.$id

    }

    /* =========================
        UPDATE CATEGORY
    ========================= */

    if (editingCategoryId) {

      await databases.updateDocument(
        DATABASE_ID,
        CATEGORY_COLLECTION,
        editingCategoryId,
        payload
      )

      alert("Category Updated")

    }

    /* =========================
        ADD CATEGORY
    ========================= */

    else {

      payload.createdAt = new Date().toISOString()

      await databases.createDocument(
        DATABASE_ID,
        CATEGORY_COLLECTION,
        ID.unique(),
        payload
      )

      alert("Category Added")

    }

    /* =========================
        RESET
    ========================= */

    setCategoryForm({
      name: "",
      slug: "",
      subtitle: ""
    })

    setCatImage(null)
    setEditingCategoryId(null)

    loadCategories()

  } catch (err) {
  console.error("Category Error:", err)
  alert(err.message || JSON.stringify(err))
}

}

  /* =========================
      SAVE COURSE
  ========================= */

  const saveCourse = async () => {

    if (!courseForm.category) {
      alert("Please select a category")
      return
    }

    try {

      let imageId = ""

      if (courseImage) {

        const upload = await storage.createFile(
          BUCKET_ID,
          ID.unique(),
          courseImage
        )

        imageId = upload.$id

      }

      const slug = courseForm.title
        .toLowerCase()
        .replace(/[^a-z0-9 ]/g, "")
        .replace(/\s+/g, "-")

      const payload = {
        title: courseForm.title,
        slug,
        description: courseForm.description,
        category: courseForm.category.trim(),
        duration: courseForm.duration,
        fees: Number(courseForm.fees),
        createdAt: new Date().toISOString()
      }

      if (imageId) {
        payload.imageId = imageId
      }

      if (editingCourseId) {

        await databases.updateDocument(
          DATABASE_ID,
          COURSE_COLLECTION,
          editingCourseId,
          payload
        )

        alert("Course Updated")

      } else {

        await databases.createDocument(
          DATABASE_ID,
          COURSE_COLLECTION,
          ID.unique(),
          payload
        )

        alert("Course Added")

      }

      setCourseForm({
        title: "",
        description: "",
        category: "",
        duration: "",
        fees: ""
      })

      setCourseImage(null)
      setEditingCourseId(null)

      loadCourses()

    } catch (err) {

      console.error(err)
      alert(err.message)

    }

  }

  /* =========================
      EDIT COURSE
  ========================= */

  const editCourse = (course) => {

    setEditingCourseId(course.$id)

    setCourseForm({
      title: course.title || "",
      description: course.description || "",
      category: course.category || "",
      duration: course.duration || "",
      fees: course.fees?.toString() || ""
    })

    window.scrollTo({
      top: 600,
      behavior: "smooth"
    })

  }

  /* =========================
      DELETE COURSE
  ========================= */

  const deleteCourse = async (id) => {

    try {

      await databases.deleteDocument(
        DATABASE_ID,
        COURSE_COLLECTION,
        id
      )

      alert("Course Deleted")

      loadCourses()

    } catch (err) {

      console.log(err)
      alert("Delete failed")

    }

  }

  const editCategory = (cat) => {

  setEditingCategoryId(cat.$id)

  setCategoryForm({
    name: cat.name || "",
    slug: cat.slug || "",
    subtitle: cat.subtitle || ""
  })

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  })

}

  /* =========================
      DELETE CATEGORY
  ========================= */

  const deleteCategory = async (id) => {

    try {

      await databases.deleteDocument(
        DATABASE_ID,
        CATEGORY_COLLECTION,
        id
      )

      alert("Category Deleted")

      loadCategories()

    } catch (err) {

      console.log(err)
      alert("Delete failed")

    }

  }

  /* =========================
      CANCEL EDIT
  ========================= */

  const cancelEdit = () => {

    setEditingCourseId(null)

    setCourseForm({
      title: "",
      description: "",
      category: "",
      duration: "",
      fees: ""
    })

    setCourseImage(null)

  }

  /* =========================
      GET IMAGE
  ========================= */

  const getImage = (imageId) => {

    return `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${imageId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`

  }

  return (
    <div className="min-h-screen bg-[#0A1229] text-[#FBF9F4] p-4 md:p-8 relative overflow-hidden">
      {/* ambient glow + subtle grid */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,162,75,0.18),transparent_55%)]" />
        <div className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(to_right,rgba(255,255,255,0.7)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.7)_1px,transparent_1px)] [background-size:42px_42px]" />
      </div>

      <div className="relative">
        {/* HEADER */}
        <div className="mb-6 py-5 px-8 rounded-3xl">
          <div className="space-y-3">
            <h1 className="font-[Playfair_Display] text-2xl md:text-3xl font-semibold tracking-wide">
              Course CMS Panel
            </h1>
            <p className="font-[Inter] text-white/70 text-sm">
              Manage categories and courses easily
            </p>
          </div>
        </div>

        {/* =========================
            ADD CATEGORY
        ========================= */}
        <Panel>
          <h2 className="font-[Playfair_Display] text-lg font-semibold mb-4 tracking-wide">
            Add Category
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="name"
              value={categoryForm.name || ""}
              onChange={handleCategoryChange}
              placeholder="Category Name"
              className="input-clean-dark"
            />

            <input
              name="slug"
              value={categoryForm.slug || ""}
              disabled
              placeholder="Slug auto-generated"
              className="input-clean-dark bg-white/5 cursor-not-allowed"
            />

            <input
              name="subtitle"
              value={categoryForm.subtitle || ""}
              onChange={handleCategoryChange}
              placeholder="Subtitle"
              className="input-clean-dark"
            />

            <input
              type="file"
              onChange={(e) => setCatImage(e.target.files[0])}
              className="input-clean-dark file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border file:border-white/10 file:bg-white/5 file:text-[#FBF9F4] hover:file:border-[#C9A24B]/60 file:transition-all file:cursor-pointer"
            />

            <button
              onClick={addCategory}
              className="btn-primary-dark col-span-full"
            >
              Add Category
            </button>
          </div>
        </Panel>

        {/* =========================
            MANAGE CATEGORIES
        ========================= */}
        <Panel>
          <h2 className="font-[Playfair_Display] text-lg font-semibold mb-4 tracking-wide">
            Manage Categories
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {categories.map((cat) => (
              <div
                key={cat.$id}
                className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 hover:border-[#C9A24B]/60 transition-all duration-300 group relative overflow-hidden"
              >
                <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{
                  background:
                    'radial-gradient(ellipse at top, rgba(201,162,75,0.22), transparent 55%), radial-gradient(ellipse at bottom, rgba(201,162,75,0.14), transparent 60%)'
                }} />

                {cat.imageId && (
                  <div className="mb-3 overflow-hidden rounded-xl border border-white/10">
                    <img
                      src={getImage(cat.imageId)}
                      className="h-36 w-full object-cover rounded-xl transform transition-transform duration-500 group-hover:scale-105"
                      alt={cat.name}
                    />
                  </div>
                )}

                <h3 className="font-[Inter] font-semibold text-white/90 text-lg">
                  {cat.name}
                </h3>

                <p className="text-sm text-[#C9A24B] mt-1 font-[Inter]">
                  Slug: {cat.slug}
                </p>

                <p className="text-sm text-white/70 mt-2 font-[Inter]">
                  {cat.subtitle}
                </p>

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => editCategory(cat)}
                    className="btn-primary-dark flex-1"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteCategory(cat.$id)}
                    className="btn-danger-dark flex-1"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        {/* =========================
            ADD COURSE
        ========================= */}
        <Panel>
          <h2 className="font-[Playfair_Display] text-lg font-semibold mb-4 tracking-wide">
            {editingCourseId ? "Edit Course" : "Add Course"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="title"
              value={courseForm.title || ""}
              onChange={handleCourseChange}
              placeholder="Course Title"
              className="input-clean-dark"
            />

            <input
              value={
                (courseForm.title || "")
                  .toLowerCase()
                  .replace(/[^a-z0-9 ]/g, "")
                  .replace(/\s+/g, "-")
              }
              disabled
              placeholder="Course Slug"
              className="input-clean-dark bg-white/5 cursor-not-allowed"
            />

            <select
              name="category"
              value={courseForm.category || ""}
              onChange={handleCourseChange}
              className="input-clean-dark"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.$id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>

            <input
              name="duration"
              value={courseForm.duration || ""}
              onChange={handleCourseChange}
              placeholder="Course Duration"
              className="input-clean-dark"
            />

            <input
              name="fees"
              value={courseForm.fees || ""}
              onChange={handleCourseChange}
              placeholder="Course Rating (out of 5)"
              className="input-clean-dark"
            />

            <input
              type="file"
              onChange={(e) => setCourseImage(e.target.files[0])}
              className="input-clean-dark file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border file:border-white/10 file:bg-white/5 file:text-[#FBF9F4] hover:file:border-[#C9A24B]/60 file:transition-all file:cursor-pointer"
            />

            <textarea
              name="description"
              value={courseForm.description || ""}
              onChange={handleCourseChange}
              placeholder="Course Description"
              className="input-clean-dark col-span-full h-28"
            />

            <button onClick={saveCourse} className="btn-primary-dark col-span-full">
              {editingCourseId ? "Update Course" : "Add Course"}
            </button>

            {editingCourseId && (
              <button
                onClick={cancelEdit}
                className="btn-secondary-dark col-span-full"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </Panel>

        {/* =========================
            ALL COURSES
        ========================= */}
        <Panel>
          <h2 className="font-[Playfair_Display] text-lg font-semibold mb-4 tracking-wide">
            All Courses
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {courses.map((course) => (
              <div
                key={course.$id}
                className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 hover:border-[#C9A24B]/60 transition-all duration-300 group relative overflow-hidden"
              >
                <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{
                  background:
                    'radial-gradient(ellipse at top, rgba(201,162,75,0.22), transparent 55%), radial-gradient(ellipse at bottom, rgba(201,162,75,0.14), transparent 60%)'
                }} />

                {course.imageId && (
                  <div className="mb-3 overflow-hidden rounded-xl border border-white/10">
                    <img
                      src={getImage(course.imageId)}
                      className="h-36 w-full object-cover rounded-xl transform transition-transform duration-500 group-hover:scale-105"
                      alt={course.title}
                    />
                  </div>
                )}

                <h3 className="font-[Inter] font-semibold text-white/90">
                  {course.title}
                </h3>

                <p className="text-sm text-[#C9A24B] mt-1 font-[Inter]">
                  Slug: {course.slug}
                </p>

                <p className="text-sm text-white/70 font-[Inter]">
                  Category: {course.category}
                </p>

                <p className="text-sm mt-2 text-white/80 line-clamp-2 font-[Inter]">
                  {course.description}
                </p>

                <div className="flex justify-between mt-3 text-sm font-[Inter]">
                  <span className="text-white/75">⏱ {course.duration}</span>
                  <span className="text-[#C9A24B] font-semibold">⭐ {course.fees}</span>
                </div>

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => editCourse(course)}
                    className="btn-primary-dark flex-1"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteCourse(course.$id)}
                    className="btn-danger-dark flex-1"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );

}

function Panel({ children }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 md:p-6 hover:border-[#C9A24B]/60 transition-all duration-300">
      {children}
    </div>
  );
}

