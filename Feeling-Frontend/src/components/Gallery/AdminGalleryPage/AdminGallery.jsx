import React, { useEffect, useState } from "react";
import Footer from "@/components/Footer/Footer.jsx";
import Aos from "aos";
import "aos/dist/aos.css";
import { axiosInstance } from "@/lib/axios.js";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";
import "@/index.css";

function AdminGallery() {
  const { authAdmin } = useAdminAuthStore();

  const [categories, setCategories] = useState([]);
  const [galleryItems, setGalleryItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");

  const [newCategory, setNewCategory] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedFile, setSelectedFile] = useState([]);
  const [uploadType, setUploadType] = useState("image");

  const [tags, setTags] = useState("");
  const [locationType, setLocationType] = useState("");
  const [shootType, setShootType] = useState("");
  const [description, setDescription] = useState("");
  const [altText, setAltText] = useState("");

  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [toast, setToast] = useState(null);

  const [deletingCategoryId, setDeletingCategoryId] = useState(null);

  useEffect(() => {
    Aos.init({ once: true, duration: 1000 });
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchCategories = async () => {
    try {
      const res = await axiosInstance.get("/admin/categories");
      setCategories(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchGallery = async () => {
    try {
      const res = await axiosInstance.get("/admin/gallery/all");
      setGalleryItems(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchGallery();
  }, []);

  const handleCreateCategory = async () => {
    if (!newCategory.trim()) {
      showToast("Category name cannot be empty", "error");
      return;
    }

    try {
      setIsProcessing(true);

      const res = await axiosInstance.post("/admin/category", {
        name: newCategory.trim(),
      });

      setNewCategory("");
      setSelectedCategoryId(res.data.data._id);
      fetchCategories();
      showToast("Category created");
    } catch (error) {
      showToast(
        error.response?.data?.message || "Failed to create category",
        "error",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this category? This will also delete all associated media.",
    );

    if (!confirmDelete) return;

    try {
      setDeletingCategoryId(id);

      await axiosInstance.delete(`/admin/category/${id}`);

      showToast("Category deleted successfully");
      fetchCategories();
      fetchGallery();
    } catch (error) {
      showToast("Failed to delete category", "error");
    } finally {
      setDeletingCategoryId(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedCategoryId) return showToast("Select a category", "error");
    if (!selectedFile.length)
      return showToast("Select at least one file", "error");

    const invalidFiles = Array.from(selectedFile).filter((file) => {
      if (uploadType === "image") return !file.type.startsWith("image/");
      if (uploadType === "video") return !file.type.startsWith("video/");
      return false;
    });

    if (invalidFiles.length > 0) {
      return showToast(`Only ${uploadType}s are allowed`, "error");
    }

    if (!description.trim())
      return showToast("Description is required", "error");
    if (!altText.trim()) return showToast("Alt text is required", "error");
    if (!locationType.trim()) return showToast("Location is required", "error");
    if (!shootType.trim()) return showToast("Shoot type is required", "error");
    if (!tags.trim()) return showToast("Tags are required", "error");

    const formattedTags = tags
      .split(",")
      .map((tag) => tag.trim().toLowerCase())
      .filter(Boolean);

    const formData = new FormData();

    Array.from(selectedFile).forEach((file) => formData.append("files", file));

    formData.append("categoryId", selectedCategoryId);
    formData.append("type", uploadType);
    formData.append("tags", JSON.stringify(formattedTags));
    formData.append("locationType", locationType);
    formData.append("shootType", shootType);
    formData.append("description", description);
    formData.append("altText", altText);

    try {
      setIsUploading(true);

      await axiosInstance.post("/admin/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      showToast("Upload successful");

      setSelectedFile([]);
      setSelectedCategoryId("");
      setTags("");
      setLocationType("");
      setShootType("");
      setDescription("");
      setAltText("");

      fetchGallery();
    } catch {
      showToast("Upload failed", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteMedia = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this media?",
    );
    if (!confirmDelete) return;

    try {
      setIsProcessing(true);

      await axiosInstance.delete(`/admin/gallery/item/${id}`);

      showToast("Media deleted successfully");
      fetchGallery();
    } catch (error) {
      showToast("Failed to delete media", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredItems =
    activeCategory === "All"
      ? galleryItems
      : galleryItems.filter((item) => item.category?.name === activeCategory);

  return (
    <div>
      {(isUploading || isProcessing) && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center gap-4 animate-fadeIn">
            <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="font-medium">
              {isUploading ? "Uploading media..." : "Please wait..."}
            </p>
          </div>
        </div>
      )}

     

      {toast && (
        <div
          className={`fixed top-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg text-white z-50 ${
            toast.type === "error" ? "bg-red-500" : "bg-green-600"
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="mt-[4rem] px-6">
        <h1 className="text-center text-2xl font-semibold mb-10">
          ADMIN GALLERY
        </h1>
      </div>

      {authAdmin && (
        <div className="p-6 border rounded-lg mx-6 bg-gray-50 shadow mb-10">
          <h2 className="text-lg font-bold mb-6">Admin Controls</h2>

          <div className="flex gap-3 mb-6">
            <input
              type="text"
              placeholder="New Category (e.g. Weddings, Portraits, Travel)"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="border p-2 rounded w-full outline-none"
            />
            <button
              onClick={handleCreateCategory}
              disabled={isProcessing}
              className={`px-4 rounded text-white ${
                isProcessing ? "bg-gray-400" : "bg-blue-600"
              }`}
            >
              Create
            </button>
          </div>

          {categories.length > 0 && (
            <>
              <div className="flex flex-wrap gap-3 mb-6">
                {categories.map((cat) => {
                  const isDeleting = deletingCategoryId === cat._id;

                  return (
                    <button
                      key={cat._id}
                      onClick={() => handleDeleteCategory(cat._id)}
                      disabled={isDeleting}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full border shadow-sm text-sm font-medium transition ${
                        isDeleting
                          ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                          : "bg-red-600 text-white hover:bg-red-700"
                      }`}
                    >
                      {isDeleting ? "Deleting..." : cat.name}
                      {!isDeleting && <span className="font-bold">×</span>}
                    </button>
                  );
                })}
              </div>

              {/* UPLOAD SECTION */}
              <div className="flex flex-col gap-4">
                <select
                  value={selectedCategoryId}
                  onChange={(e) => setSelectedCategoryId(e.target.value)}
                  className="border p-2 rounded outline-none"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>

                {/* Upload Type */}
                <select
                  value={uploadType}
                  onChange={(e) => setUploadType(e.target.value)}
                  className="border p-2 rounded outline-none"
                >
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                </select>

                {/* Tags */}
                <input
                  type="text"
                  placeholder="Tags (e.g. wedding, outdoor, sunset)"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="border p-2 rounded outline-none"
                />

                <p className="text-xs text-gray-500 mt-1">
                  Separate multiple tags using commas.
                </p>

                {/* Location */}
                <input
                  type="text"
                  placeholder="Location (e.g. Mumbai Beach, Delhi Studio, Assam Hills)"
                  value={locationType}
                  onChange={(e) => setLocationType(e.target.value)}
                  className="border p-2 rounded outline-none"
                />

                {/* Shoot Type */}
                <input
                  type="text"
                  placeholder="Shoot Type (e.g. Pre-Wedding, Concert, Birthday, Portrait)"
                  value={shootType}
                  onChange={(e) => setShootType(e.target.value)}
                  className="border p-2 rounded outline-none"
                />

                {/* Description */}
                <textarea
                  placeholder="Description (e.g. A romantic sunset pre-wedding shoot captured at the beach with natural lighting)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="border p-2 rounded outline-none resize-none"
                />

                {/* Alt Text */}
                <input
                  type="text"
                  placeholder="Alt Text (e.g. Bride and groom holding hands during sunset beach shoot)"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  className="border p-2 rounded outline-none"
                />

                {/* File Upload */}
                <input
                  type="file"
                  multiple
                  onChange={(e) => setSelectedFile(e.target.files)}
                  className="border p-2 rounded outline-none"
                />

                <button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className={`px-4 py-2 rounded text-white ${
                    isUploading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {isUploading ? "Uploading..." : "Upload"}
                </button>
              </div>
            </>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
        {filteredItems.map((item) => (
          <div key={item._id} className="relative group overflow-hidden rounded-lg">
            {item.type === "image" ? (
              <img
                src={item.url}
                alt={item.altText || item.description || "Gallery image"}
                className="w-full rounded-lg aspect-[4/5] lg:aspect-[3/4] object-cover"
              />
            ) : (
              <video src={item.url} controls className="w-full rounded-lg aspect-[4/5] lg:aspect-[3/4] object-cover" />
            )}

            {authAdmin && (
              <button
                onClick={() => handleDeleteMedia(item._id)}
                disabled={isProcessing}
                className={`absolute top-2 right-2 px-3 py-1 text-sm rounded text-white ${
                  isProcessing ? "bg-gray-400" : "bg-red-600"
                }`}
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </div>

      <Footer />
    </div>
  );
}

export default AdminGallery;
