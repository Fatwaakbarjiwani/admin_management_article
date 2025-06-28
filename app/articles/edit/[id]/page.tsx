"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import dynamic from "next/dynamic";
import Swal from "sweetalert2";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const Editor = dynamic(
  () => import("@tinymce/tinymce-react").then((mod) => mod.Editor),
  { ssr: false }
);

type Category = {
  id: string;
  name: string;
};

export default function EditArticle() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("tokenAdmin");
        const catRes = await fetch(`${BASE_URL}/categories`);
        const catData = await catRes.json();
        setCategories(catData.data);

        const articleRes = await axios.get(`${BASE_URL}/articles/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const article = articleRes.data;
        if (!article) {
          Swal.fire({
            title: "Error",
            text: "Article not found or response invalid!",
            icon: "error",
          });
          setLoading(false);
          return;
        }
        setTitle(article.title);
        setContent(article.content);
        setCategory(article.categoryId);
        setImageUrl(article.imageUrl);
        setPreview(article.imageUrl);
      } catch (err) {
        console.error("Fetch article error:", err);
        Swal.fire({
          title: "Error",
          text:
            err instanceof Error ? err.message : "Failed to fetch article data",
          icon: "error",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleThumbnailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setThumbnail(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(imageUrl);
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
    let newImageUrl = imageUrl;
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
        newImageUrl = uploadRes.data.imageUrl;
      }

      await axios.put(
        `${BASE_URL}/articles/${id}`,
        {
          title,
          content,
          categoryId: category,
          imageUrl: newImageUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      Swal.fire({
        title: "Success",
        text: "Article updated successfully!",
        icon: "success",
      }).then(() => router.push("/"));
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: (err as Error).message || "Failed to update article",
        icon: "error",
      });
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="bg-white rounded-xl shadow border border-blue-100 p-6">
      <div className="flex items-center mb-6">
        <button
          onClick={() => router.back()}
          className="text-gray-500 hover:text-blue-600 mr-2"
        >
          <ArrowLeft />
        </button>
        <span className="font-semibold text-lg">Edit Article</span>
      </div>
      <form className="space-y-6" onSubmit={handleSubmit}>
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
                height: 300,
                menubar: false,
                plugins:
                  "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount",
                toolbar:
                  "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat",
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
            onClick={() => router.back()}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
}
