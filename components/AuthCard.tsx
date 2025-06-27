"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

interface AuthCardProps {
  children: React.ReactNode;
  bottomText?: React.ReactNode;
}

export default function AuthCard({ children, bottomText }: AuthCardProps) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("tokenAdmin");
    if (token) {
      router.replace("/");
    }
  }, [router]);

  return (
    <div className="bg-white sm:rounded-xl sm:shadow p-8 w-full max-w-sm flex flex-col items-center">
      <img src="/iconLogo.svg" alt="Logo" className="mx-auto my-4" />
      {children}
      {bottomText && (
        <div className="text-sm text-center my-4 text-gray-500">
          {bottomText}
        </div>
      )}
    </div>
  );
}
