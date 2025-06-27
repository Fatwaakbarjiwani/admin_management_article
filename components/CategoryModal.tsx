import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";

const BASE_URL = "https://test-fe.mysellerpintar.com/api";

interface CategoryModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  mode?: "create" | "edit";
  initialName?: string;
  categoryId?: string;
}

export default function CategoryModal({
  open,
  onClose,
  onSuccess,
  mode = "create",
  initialName = "",
  categoryId,
}: CategoryModalProps) {
  const [name, setName] = useState(initialName);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) setName(initialName);
  }, [open, initialName]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      Swal.fire({
        title: "Error",
        text: "Category name is required!",
        icon: "error",
      });
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("tokenAdmin");
      if (mode === "edit" && categoryId) {
        await axios.put(
          `${BASE_URL}/categories/${categoryId}`,
          { name },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        Swal.fire({
          title: "Success",
          text: "Category updated!",
          icon: "success",
        });
      } else {
        await axios.post(
          `${BASE_URL}/categories`,
          { name },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        Swal.fire({
          title: "Success",
          text: "Category added!",
          icon: "success",
        });
      }
      setName("");
      onSuccess();
      onClose();
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: "Failed to save category",
        icon: "error",
      });
      return err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-sm animate-fadeIn">
        <h2 className="text-xl font-semibold mb-4">
          {mode === "edit" ? "Edit Category" : "Add Category"}
        </h2>
        <form onSubmit={handleSubmit}>
          <label className="block font-medium mb-2">Category</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-6"
            placeholder="Input Category"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="px-4 py-2 rounded border border-gray-300 text-gray-700 bg-white hover:bg-gray-100"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              disabled={loading}
            >
              {mode === "edit" ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
