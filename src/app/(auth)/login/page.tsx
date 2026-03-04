"use client";

import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function LoginForm() {
  // 1. Create a state to track visibility
  const [showPassword, setShowPassword] = useState(false);

  // 2. Function to flip the state
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a121e] p-4">
      <div className="w-full max-w-[400px] overflow-hidden rounded-2xl bg-[#1e293b] shadow-2xl">
        {/* Header Section */}
        <div className="bg-[#009689] py-8 text-center text-white">
          <h1 className="text-3xl font-bold">Agent View</h1>
          <p className="mt-1 text-sm opacity-90">
            Sign in to manage your dashboard
          </p>
        </div>

        {/* Form Section */}
        <div className="p-8">
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="w-full rounded-lg bg-[#2d3748] py-3 pl-10 pr-4 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  // 3. Change type based on state
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full rounded-lg bg-[#2d3748] py-3 pl-10 pr-10 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                />
                {/* 4. Use a button for the toggle for better accessibility */}
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 focus:outline-none"
                >
                  {showPassword ? (
                    <Eye className="h-5 w-5 text-gray-500 hover:text-gray-300" />
                  ) : (
                    <EyeOff className="h-5 w-5 text-gray-500 hover:text-gray-300" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2 text-gray-400 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded border-gray-600 bg-transparent text-emerald-500 focus:ring-emerald-500"
                />
                <span>Remember me</span>
              </label>
              <a href="#" className="text-emerald-500 hover:underline">
                Forgot Password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full rounded-lg bg-[#009689] py-3 font-bold text-white shadow-[0_0_20px_rgba(0,150,137,0.4)] transition-all hover:bg-[#007a6f] active:scale-[0.98]"
            >
              Sign In
            </button>
          </form>

          {/* Footer */}
          <p className="mt-8 text-center text-sm text-gray-400">
            Don't have an account?{" "}
            <a
              href="#"
              className="text-emerald-500 font-medium hover:underline"
            >
              Create Account
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
