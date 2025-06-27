"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthCard from "@/components/AuthCard";

const schema = z.object({
  username: z.string().min(1, "Please enter your username"),
  password: z.string().min(1, "Please enter your password"),
});

type FormData = z.infer<typeof schema>;

export default function Logins() {
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
      const response = await axios.post(`${BASE_URL}/auth/login`, {
        username: data.username,
        password: data.password,
      });
      if (response) {
        if (response.data.role === "Admin") {
          localStorage.setItem("tokenAdmin", response.data.token);
          Swal.fire({
            title: "Login Successful",
            text: "You have successfully logged in",
            icon: "success",
          }).finally(() => router.push("/"));
        } else {
          Swal.fire({
            title: "Login Failed",
            text: "You are not authorized to access this page",
            icon: "error",
          });
        }
      }
    } catch (error: unknown) {
      let errorMsg = "Terjadi kesalahan";
      if (axios.isAxiosError(error)) {
        errorMsg =
          error.response?.data?.error ||
          error.response?.data?.message ||
          "Terjadi kesalahan";
      }
      Swal.fire({
        title: "Proses login gagal",
        text: errorMsg,
        icon: "error",
      });
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-white sm:bg-gray-100">
      <AuthCard
        bottomText={
          <>
            Don&apos;t have an account?{" "}
            <Link href="/registers" className="text-blue-600 hover:underline">
              Register
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
              className={`w-full border rounded px-3 py-2 border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
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
                className={`w-full border rounded px-3 py-2 border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10 ${
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
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded px-3 py-2 font-medium transition-colors"
          >
            Login
          </button>
        </form>
      </AuthCard>
    </div>
  );
}
