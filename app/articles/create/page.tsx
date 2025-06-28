"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Swal from "sweetalert2";
import axios from "axios";
import dynamic from "next/dynamic";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

type Category = {
  id: string;
  name: string;
};

const Editor = dynamic(
  () => import("@tinymce/tinymce-react").then((mod) => mod.Editor),
  { ssr: false }
);

export default function CreateArticle() {
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [content, setContent] = useState("");
  const [createdArticleId, setCreatedArticleId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${BASE_URL}/categories`);
        const data = await res.json();
        setCategories(data.data);
      } catch {
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  const handleThumbnailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setThumbnail(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content || !category) {
      Swal.fire({
        title: "Error",
        text: "Title, content, and category are required!",
        icon: "error",
      });
      return;
    }
    const token = localStorage.getItem("tokenAdmin");
    let imageUrl = null;
    try {
      if (thumbnail) {
        const formData = new FormData();
        formData.append("image", thumbnail);
        const uploadRes = await axios.post(`${BASE_URL}/upload`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        imageUrl = uploadRes.data.imageUrl;
      }
      const res = await axios.post(
        `${BASE_URL}/articles`,
        {
          title,
          content,
          categoryId: category,
          imageUrl: imageUrl || undefined,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCreatedArticleId(res.data.data?.id || res.data.id);
      Swal.fire({
        title: "Success",
        text: "Article uploaded successfully!",
        icon: "success",
      });
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: (err as Error).message || "Failed to upload article",
        icon: "error",
      });
    }
  };

  const handleReset = () => {
    setTitle("");
    setContent("");
    setCategory("");
    setThumbnail(null);
    setPreview(null);
    setCreatedArticleId(null);
    localStorage.removeItem("draftArticle");
  };

  return (
    <div className="bg-white rounded-xl shadow border border-blue-100 p-6">
      <div className="flex items-center mb-6">
        <button
          onClick={() => router.back()}
          className="text-gray-500 hover:text-blue-600 mr-2"
        >
          <ArrowLeft />
        </button>
        <span className="font-semibold text-lg">Create Articles</span>
      </div>
      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Thumbnails */}
        <div>
          <label className="block font-medium mb-2">Thumbnails</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg w-56 h-40 flex flex-col items-center justify-center cursor-pointer text-center text-gray-400 text-sm relative">
            <input
              type="file"
              accept="image/*"
              className="absolute w-full h-full opacity-0 cursor-pointer"
              onChange={handleThumbnailChange}
            />
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <>
                <span className="text-2xl mb-2">📁</span>
                <span>
                  Click to select files
                  <br />
                  Suport File Type: jpg or png
                </span>
              </>
            )}
          </div>
        </div>

        <div>
          <label className="block font-medium mb-2">Title</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            placeholder="Input title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label className="block font-medium mb-2">Category</label>
          <select
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <div className="text-xs text-gray-500 mt-1">
            The existing category list can be seen in the{" "}
            <Link href="/category" className="text-blue-600 hover:underline">
              category
            </Link>{" "}
            menu
          </div>
        </div>

        <div>
          <label className="block font-medium mb-2">Content</label>
          <div className="rounded">
            <Editor
              apiKey="e3m2xvaijq07t0pv56vwlvxn41f4ro15a65t7kbjpt9packt"
              value={content}
              onEditorChange={setContent}
              init={{
                plugins:
                  "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount",
                toolbar:
                  "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat",
                height: 300,
                menubar: false,
                content_style:
                  "body { font-family:Archivo,sans-serif; font-size:14px }",
              }}
            />
            <div className="text-xs text-gray-400 px-3 pb-2 text-right">
              {
                content
                  .replace(/<[^>]+>/g, "")
                  .trim()
                  .split(/\s+/)
                  .filter(Boolean).length
              }{" "}
              Words
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            className="px-4 py-2 rounded border border-gray-300 text-gray-700 bg-white hover:bg-gray-100"
            onClick={handleReset}
          >
            Reset
          </button>
          {createdArticleId && (
            <button
              type="button"
              className="px-4 py-2 rounded border border-gray-300 text-gray-700 bg-white hover:bg-gray-100"
              onClick={() =>
                window.open(
                  `https://management-article-ubzd.vercel.app/detailArticles/${createdArticleId}`,
                  "_blank"
                )
              }
            >
              Preview
            </button>
          )}
          <button
            type="submit"
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Upload
          </button>
        </div>
      </form>
    </div>
  );
}
