"use client";
import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import Swal from "sweetalert2";
import Link from "next/link";
import AuthCard from "@/components/AuthCard";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

const schema = z.object({
  username: z.string().min(1, "Please enter your username"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  role: z.string().min(1, "Please select a role"),
});

type FormData = z.infer<typeof schema>;

export default function Register() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword((prev) => !prev);

  const onSubmit = async (data: FormData) => {
    try {
      const response = await axios.post(`${BASE_URL}/auth/register`, data);
      if (response) {
        Swal.fire({
          title: "Register Successful",
          text: "You have successfully registered",
          icon: "success",
        }).finally(() => router.push("/logins"));
      }
    } catch (error) {
      let message = "Terjadi kesalahan";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || error.message;
      }
      Swal.fire({
        title: "Proses register gagal",
        text: message,
        icon: "error",
      });
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-white sm:bg-gray-100">
      <AuthCard
        bottomText={
          <>
            Already have an account?{" "}
            <Link href="/logins" className="text-blue-600 hover:underline">
              Login  
            </Link>
          </>
        }
      >
        <form
          className="w-full space-y-4"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium mb-1"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="Input username"
              className={`w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.username ? "border-red-500" : ""
              }`}
              {...register("username")}
            />
            {errors.username && (
              <p className="text-xs text-red-500 mt-1">
                {errors.username.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Input password"
                className={`w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10 ${
                  errors.password ? "border-red-500" : ""
                }`}
                {...register("password")}
              />
              <span
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                onClick={togglePassword}
                tabIndex={0}
                role="button"
                aria-label={
                  showPassword ? "Sembunyikan password" : "Tampilkan password"
                }
              >
                {showPassword ? (
                  <EyeOff size={20} aria-hidden="true" />
                ) : (
                  <Eye size={20} aria-hidden="true" />
                )}
              </span>
            </div>
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="role" className="block text-sm font-medium mb-1">
              Role
            </label>
            <select
              id="role"
              className={`w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.role ? "border-red-500" : ""
              }`}
              {...register("role")}
              defaultValue=""
            >
              <option value="" disabled>
                Pilih role
              </option>
              <option value="Admin">Admin</option>
              <option value="User">User</option>
            </select>
            {errors.role && (
              <p className="text-xs text-red-500 mt-1">{errors.role.message}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded px-3 py-2 font-medium transition-colors"
          >
            Register
          </button>
        </form>
      </AuthCard>
    </div>
  );
}
