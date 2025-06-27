"use client";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<{ username?: string; role?: string }>({});
  useEffect(() => {
    if (user) {
      getMe();
    }
  }, [user]);
  const getMe = async () => {
    const token = localStorage.getItem("tokenAdmin");
    try {
      const response = await axios.get(`${BASE_URL}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.role === "Admin") {
        setUser(response.data);
      }
    } catch (err) {
      router.push("/logins");
      return err;
    }
  };
  if (pathname === "/logins" || pathname === "/registers") {
    return null;
  }
  return (
    <header className="flex items-center z-40 sticky top-0 justify-between bg-white border-b border-gray-200 shadow px-8 py-4 h-20">
      <h1 className="text-xl font-semibold">Articles</h1>
      <div className="flex items-center space-x-3">
        <div className="p-2 rounded-full text-2xl border border-blue-200 flex items-center justify-center w-8 h-8 bg-blue-200 cursor-pointer">
          <p className="text-blue-900">
            {user?.username?.charAt(0)?.toUpperCase() || ""}
          </p>
        </div>
        <p
          className={`text-slate-500 underline underline-offset-3 text-base hidden sm:block cursor-pointer`}
        >
          {user?.username}
        </p>
      </div>
    </header>
  );
}
