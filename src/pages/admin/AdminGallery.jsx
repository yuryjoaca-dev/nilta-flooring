import React, { useEffect, useState } from "react";

import { API_BASE } from "../../config/api"; // ajustezi path-ul

fetch(`${API_BASE}/api/admin/gallery`)


function getToken() {
  return localStorage.getItem("adminToken");
}

const CATEGORIES = [
  "Whole House ",
  "Kitchen",
  "Bathroom",
  "Livig Room",
  "Basement",
  "Exterior",
  "Commercial",
];

export default function AdminGallery() {
  const [images, setImages] = useState([]);
  const [category, setCategory] = useState("Residential");
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function fetchImages(cat = category) {
    try {
      setLoading(true);
      const res = await fetch(
        `${API_BASE}/api/admin/gallery?category=${encodeURIComponent(cat)}`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setImages(data);
    } catch (e) {
      console.error(e);
      setError("Failed to load gallery images");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchImages();
  }, []);

  function onDrop(e) {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f && f.type.startsWith("image/")) {
      setFile(f);
    }
  }

  function onFileChange(e) {
    const f = e.target.files[0];
    if (f && f.type.startsWith("image/")) {
      setFile(f);
    }
  }

  async function handleUpload(e) {
    e.preventDefault();
    if (!file) {
      alert("Select or drop an image first.");
      return;
    }
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("image", file);
      fd.append("category", category);

      const res = await fetch(`${API_BASE}/api/admin/gallery`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        body: fd,
      });

      if (!res.ok) throw new Error("Upload failed");
      const img = await res.json();
      setImages((prev) => [img, ...prev]);
      setFile(null);
    } catch (e) {
      console.error(e);
      setError("Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this image?")) return;
    try {
      const res = await fetch(`${API_BASE}/api/admin/gallery/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      if (!res.ok) throw new Error("Failed");
      setImages((prev) => prev.filter((img) => img._id !== id));
    } catch (e) {
      console.error(e);
      alert("Could not delete image.");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Gallery – Add Photos</h1>
        <p className="text-sm text-neutral-400">
          Upload images for site galleries and organize them by category.
        </p>
      </div>

      <form onSubmit={handleUpload} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-[2fr,1fr]">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            className={`flex flex-col items-center justify-center h-44 rounded-2xl border-2 border-dashed text-sm cursor-pointer transition ${dragOver
              ? "border-amber-500 bg-amber-500/5"
              : "border-neutral-700 bg-neutral-900/60 hover:border-neutral-500"
              }`}
            onClick={() =>
              document.getElementById("gallery-file-input")?.click()
            }
          >
            <p className="font-medium mb-1">Drag &amp; drop images here</p>
            <p className="text-xs text-neutral-400">
              or click to browse from your computer
            </p>
            {file && (
              <p className="mt-2 text-xs text-amber-300">
                Selected: {file.name}
              </p>
            )}
          </div>

          <div className="bg-neutral-900/70 border border-neutral-800 rounded-2xl p-3 space-y-3 text-sm">
            <div>
              <label className="block text-xs mb-1 text-neutral-400">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  fetchImages(e.target.value);
                }}
                className="w-full rounded-lg bg-neutral-900 border border-neutral-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              disabled={uploading}
              className="w-full rounded-lg bg-amber-500 text-neutral-950 text-sm font-medium py-2 hover:bg-amber-400 disabled:opacity-60"
            >
              {uploading ? "Uploading..." : "Upload image"}
            </button>
            {error && <p className="text-xs text-red-400">{error}</p>}
          </div>
        </div>

        <input
          id="gallery-file-input"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onFileChange}
        />
      </form>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-neutral-200">
            Images in “{category}”
          </h2>
          {loading && (
            <p className="text-xs text-neutral-500">Loading images...</p>
          )}
        </div>
        {images.length === 0 ? (
          <p className="text-xs text-neutral-500">
            No images uploaded yet for this category.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {images.map((img) => (
              <div
                key={img._id}
                className="relative rounded-xl overflow-hidden border border-neutral-800 bg-neutral-900/70 group"
              >
                <img
                  src={API_BASE + img.url}
                  alt={img.category}
                  className="w-full h-32 object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleDelete(img._id)}
                  className="absolute top-2 right-2 text-xs px-2 py-1 rounded-full bg-black/70 text-red-300 border border-red-500/60 opacity-0 group-hover:opacity-100 transition"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
