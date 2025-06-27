"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Search } from "lucide-react";
import CategoryModal from "@/components/CategoryModal";
import Swal from "sweetalert2";

const BASE_URL = "https://test-fe.mysellerpintar.com/api";

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
type Category = {
  name: string;
  createdAt: string;
  id: string;
};

export default function CategoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editModal, setEditModal] = useState<{
    open: boolean;
    id?: string;
    name?: string;
  }>({ open: false });

  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/categories?search=${search}&page=${page}&limit=10`
      );
      setCategories(res.data.data);
      setTotal(res.data.totalData);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      setCategories([]);
      setTotal(0);
      setTotalPages(1);
      return err;
    }
  };

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem("tokenAdmin");
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This category will be deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });
    if (confirm.isConfirmed) {
      try {
        await axios.delete(`${BASE_URL}/categories/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        Swal.fire({
          title: "Deleted!",
          text: "Category has been deleted.",
          icon: "success",
        });
        fetchCategories();
      } catch (err) {
        Swal.fire({
          title: "Error",
          text: "Failed to delete category",
          icon: "error",
        });
        return err;
      }
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [search, page]);

  return (
    <div className="bg-white rounded-xl shadow border border-blue-200">
      <div className="text-base p-4 border-b border-gray-200 font-semibold">
        Total Category : {total}
      </div>
      <div className="flex flex-col p-4 md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-col md:flex-row md:items-center gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search Category"
              className="border border-gray-300 rounded px-3 py-2 pl-9 text-sm bg-white min-w-[220px]"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400">
              <Search />
            </span>
          </div>
        </div>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium ml-auto md:ml-0 flex items-center"
          onClick={() => setShowModal(true)}
        >
          + Add Category
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border-y border-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="py-3 px-4 text-center font-semibold">Category</th>
              <th className="py-3 px-4 text-center font-semibold">
                Created at
              </th>
              <th className="py-3 px-4 text-center font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr
                key={cat.id}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                <td className="p-4 text-center">{cat.name}</td>
                <td className="p-4 text-center">{formatDate(cat.createdAt)}</td>
                <td className="p-4 text-center space-x-2">
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() =>
                      setEditModal({ open: true, id: cat.id, name: cat.name })
                    }
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-500 hover:underline"
                    onClick={() => handleDelete(cat.id)}
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
      <CategoryModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={fetchCategories}
        mode="create"
      />
      <CategoryModal
        open={editModal.open}
        onClose={() => setEditModal({ open: false })}
        onSuccess={fetchCategories}
        mode="edit"
        initialName={editModal.name || ""}
        categoryId={editModal.id}
      />
    </div>
  );
}
