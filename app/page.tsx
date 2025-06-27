"use client";
import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import axios from "axios";
import Link from "next/link";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

type Category = {
  id: string;
  name: string;
};

type Article = {
  title: string;
  category: Category;
  thumbnail: string;
  createdAt: string;
  imageUrl: string | null;
  id: string;
};

export default function Home() {
  const [search, setSearch] = useState<string>("");
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [articles, setArticles] = useState<Article[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const router = useRouter();

  const getArticle = async (
    page: number,
    category: string,
    title: string
  ): Promise<void> => {
    try {
      const response = await axios.get(`${BASE_URL}/articles`, {
        params: {
          category: category,
          page: page,
          title: title,
        },
      });
      if (response) {
        setArticles(response.data.data || []);
        setTotal(response.data.total || 0);
        setTotalPages(response.data.totalPages || 1);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem("tokenAdmin");
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This article will be deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });
    if (confirm.isConfirmed) {
      try {
        await axios.delete(`${BASE_URL}/articles/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        Swal.fire({
          title: "Deleted!",
          text: "Article has been deleted.",
          icon: "success",
        });
        getArticle(page, selectedCategory, search);
      } catch (err) {
        Swal.fire({
          title: "Error",
          text: (err as Error).message || "Failed to delete article",
          icon: "error",
        });
      }
    }
  };

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

  useEffect(() => {
    getArticle(page, selectedCategory, search);
  }, [page, selectedCategory, search]);

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  }

  return (
    <div className="bg-white rounded-xl shadow border border-blue-200">
      <div className="text-base p-4 border-b border-gray-200 font-semibold">
        Total Articles : {total}
      </div>
      <div className="flex flex-col p-4 md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-col md:flex-row md:items-center gap-2">
          <div className="relative">
            <select
              className="rounded-md w-full sm:w-auto px-4 py-2 bg-white text-gray-900 focus:outline-none sm:min-w-[170px] shadow-sm"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search by title"
              className="border border-gray-300 rounded px-3 py-2 pl-9 text-sm bg-white min-w-[220px]"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>
        </div>
        <Link
          href="/articles/create"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium ml-auto md:ml-0 flex items-center"
        >
          + Add Articles
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border-t border-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="py-3 px-4 text-center font-semibold">
                Thumbnails
              </th>
              <th className="py-3 px-4 text-center font-semibold">Title</th>
              <th className="py-3 px-4 text-center font-semibold">Category</th>
              <th className="py-3 px-4 text-center font-semibold">
                Created at
              </th>
              <th className="py-3 px-4 text-center font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {articles?.map((article, idx) => (
              <tr
                key={idx}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                <td className="py-2 px-4 text-center">
                  <img
                    src={article?.imageUrl || ""}
                    alt="thumb"
                    className="w-12 h-12 object-cover rounded"
                  />
                </td>
                <td className="py-2 px-4 text-center max-w-xs truncate">
                  {article?.title}
                </td>
                <td className="py-2 px-4 text-center">
                  {article?.category?.name}
                </td>
                <td className="py-2 px-4 text-center">
                  {formatDate(article.createdAt)}
                </td>
                <td className="py-2 px-4 text-center space-x-2">
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() =>
                      window.open(
                        `https://management-article-ubzd.vercel.app/detailArticles/${article.id}`,
                        "_blank"
                      )
                    }
                  >
                    Preview
                  </button>
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() => router.push(`/articles/edit/${article.id}`)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-500 hover:underline"
                    onClick={() => handleDelete(article.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center items-center my-6">
        <div className="flex items-center space-x-1">
          <button
            className={`px-3 py-1 rounded border border-gray-300 text-sm ${
              page !== 1
                ? "hover:bg-gray-100 text-gray-700"
                : "bg-gray-100 text-gray-300 cursor-not-allowed"
            }`}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            &lt; Previous
          </button>
          <button className="px-3 py-1 rounded border border-blue-500 bg-blue-100 text-blue-700 text-sm font-semibold">
            {page}
          </button>
          {page < totalPages && (
            <button
              className="px-3 py-1 rounded border border-gray-300 text-gray-700 text-sm hover:bg-gray-100"
              onClick={() => setPage((p) => p + 1)}
            >
              {page + 1}
            </button>
          )}
          <span className="px-2">...</span>
          <button
            className={`px-3 py-1 rounded border border-gray-300 text-sm ${
              page < totalPages
                ? "hover:bg-gray-100 text-gray-700"
                : "bg-gray-100 text-gray-300 cursor-not-allowed"
            }`}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
          >
            Next &gt;
          </button>
        </div>
      </div>
    </div>
  );
}
