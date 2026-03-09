"use client";

import React from "react";
import { Mail, Phone, Lock, User, Edit3, Menu } from "lucide-react";

export default function ProfileSettings() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 bg-[#111827] border-b border-gray-800 md:flex hidden">
        <Menu className="h-6 w-6 text-gray-400 cursor-pointer hover:text-white" />
        <div className="text-[#00cba9] font-bold text-2xl tracking-tighter">
          GIGALINK
        </div>
        <div className="w-6" /> {/* Spacer for centering logo */}
      </nav>

      <main className="max-w-4xl mx-auto mt-12 px-4 pb-6">
        {/* Header Text */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-semibold">Profile Settings</h2>
          <p className="text-gray-400 mt-2">
            Manage your account information and preferences.
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-[#1e293b] rounded-3xl overflow-hidden shadow-2xl">
          {/* Green Banner Area */}
          <div className="h-20 bg-[#00cba9] relative">
            {/* Avatar */}
            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
              <div className="h-24 w-24 bg-white rounded-full flex items-center justify-center border-4 border-[#1e293b]">
                <User className="h-12 w-12 text-[#1e293b]" />
              </div>
            </div>
          </div>

          {/* User Info Section */}
          <div className="pt-16 pb-7 px-8 text-center">
            <h3 className="text-2xl font-bold">Agent Smith</h3>
            <p className="text-gray-400 text-sm mt-1">
              Admin - Last active: Just now
            </p>

            {/* Settings Fields */}
            <div className="mt-10 space-y-2 text-left max-w-lg mx-auto">
              {/* Email Row */}
              <div className="flex items-center justify-between p-4 border-b border-gray-700/50 hover:bg-white/5 transition-colors rounded-lg group">
                <div className="flex items-center space-x-4">
                  <div className="bg-[#2d3748] p-2 rounded-lg">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">
                      Email Address
                    </p>
                    <p className="text-sm">agent.smith@example.com</p>
                  </div>
                </div>
                <button className="text-[#00cba9] opacity-0 group-hover:opacity-100 transition-opacity">
                  <Edit3 className="h-4 w-4" />
                </button>
              </div>

              {/* Phone Row */}
              <div className="flex items-center justify-between p-4 border-b border-gray-700/50 hover:bg-white/5 transition-colors rounded-lg group">
                <div className="flex items-center space-x-4">
                  <div className="bg-[#2d3748] p-2 rounded-lg">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">
                      Phone Number
                    </p>
                    <p className="text-sm">+1 (555) 123-4567</p>
                  </div>
                </div>
                <button className="text-[#00cba9] opacity-0 group-hover:opacity-100 transition-opacity">
                  <Edit3 className="h-4 w-4" />
                </button>
              </div>

              {/* Password Row */}
              <div className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="bg-[#2d3748] p-2 rounded-lg">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">
                      Password
                    </p>
                    <p className="text-sm tracking-widest">••••••••••</p>
                  </div>
                </div>
                <button className="text-[#00cba9] text-sm font-semibold hover:underline">
                  Change
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
