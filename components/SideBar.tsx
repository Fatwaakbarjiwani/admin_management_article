"use client";
import Link from "next/link";
import { Newspaper, Tag, LogOut } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

export default function SideBar() {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/logins" || pathname === "/registers") {
    return null;
  }

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    const Swal = (await import("sweetalert2")).default;
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout!",
    });
    if (result.isConfirmed) {
      localStorage.removeItem("tokenAdmin");
      router.push("/logins");
    }
  };

  return (
    <aside className="bg-primary sticky top-0 text-white w-64 max-h-screen min-h-screen flex flex-col">
      <div className="flex items-center p-8">
        <img src="/iconLogo2.svg" alt="Logo" />
      </div>
      <nav className="flex-1 px-4">
        <ul className="space-y-2">
          <li>
            <Link
              href="/"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-400 transition ${
                pathname === "/" ? "bg-blue-400" : ""
              }`}
            >
              <Newspaper size={20} />
              <span>Articles</span>
            </Link>
          </li>
          <li>
            <Link
              href="/category"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-400 transition ${
                pathname === "/category" ? "bg-blue-400" : ""
              }`}
            >
              <Tag size={20} />
              <span>Category</span>
            </Link>
          </li>
          <li className="mt-8">
            <a
              href="#"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-400 transition"
              onClick={handleLogout}
            >
              <LogOut size={20} />
              <span>Logout</span>
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
