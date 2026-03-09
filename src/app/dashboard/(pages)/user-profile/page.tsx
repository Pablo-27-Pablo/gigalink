"use client";

import React, { useState, useEffect } from "react";
import { Mail, Phone, Lock, User, Edit3 } from "lucide-react";
import { cn } from "@/lib/utils";
import axiosInstance from "../../component-dashboard/axios/axios";
import { toast } from "react-hot-toast";

// Updated Interface to match your request
interface UserProfile {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  role: string;
  last_active?: string;
}

export default function ProfileSettings() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("Authorization");

    axiosInstance
      .get<UserProfile>("/api/user_profile/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setProfile(response.data);
      })
      .catch((error: unknown) => {
        if (error instanceof Error) {
          console.error("Error fetching profile:", error.message);
          toast.error("Failed to load profile.");
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  if (isLoading) return null; // Or a loading spinner

  return (
    <div className="min-h-full bg-transparent text-slate-900 dark:text-white font-sans">
      <main className="max-w-4xl mx-auto pt-4 px-4 pb-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-white">
            Profile Settings
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Manage your account information and preferences.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-700">
          <div className="h-24 bg-teal-500 dark:bg-teal-600 relative">
            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
              <div className="h-24 w-24 bg-white dark:bg-slate-700 rounded-full flex items-center justify-center border-4 border-white dark:border-slate-800 shadow-lg">
                <User className="h-12 w-12 text-slate-400 dark:text-slate-300" />
              </div>
            </div>
          </div>

          <div className="pt-16 pb-10 px-6 md:px-12 text-center">
            {/* Combined First Name and Last Name */}
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white">
              {profile ? `${profile.first_name} ${profile.last_name}` : "User"}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              {profile?.role || "Member"} &bull; Last active:{" "}
              {profile?.last_active || "Just now"}
            </p>

            <div className="mt-10 space-y-3 text-left max-w-lg mx-auto">
              {/* Email Row */}
              <div
                className={cn(
                  "flex items-center justify-between p-4 rounded-xl transition-all group border border-transparent hover:border-slate-200 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/30",
                )}
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-slate-100 dark:bg-slate-700 p-2.5 rounded-lg">
                    <Mail className="h-5 w-5 text-slate-500 dark:text-teal-400" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 font-bold">
                      Email Address
                    </p>
                    <p className="text-sm font-medium">{profile?.email}</p>
                  </div>
                </div>
                <button className="text-teal-600 dark:text-teal-400 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-teal-50 dark:hover:bg-teal-900/30 rounded-full">
                  <Edit3 className="h-4 w-4" />
                </button>
              </div>

              {/* Phone Row */}
              <div
                className={cn(
                  "flex items-center justify-between p-4 rounded-xl transition-all group border border-transparent hover:border-slate-200 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/30",
                )}
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-slate-100 dark:bg-slate-700 p-2.5 rounded-lg">
                    <Phone className="h-5 w-5 text-slate-500 dark:text-teal-400" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 font-bold">
                      Phone Number
                    </p>
                    <p className="text-sm font-medium">
                      {profile?.phone_number || "Not set"}
                    </p>
                  </div>
                </div>
                <button className="text-teal-600 dark:text-teal-400 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-teal-50 dark:hover:bg-teal-900/30 rounded-full">
                  <Edit3 className="h-4 w-4" />
                </button>
              </div>

              {/* Password Row */}
              <div
                className={cn(
                  "flex items-center justify-between p-4 rounded-xl transition-all group border border-transparent hover:border-slate-200 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/30",
                )}
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-slate-100 dark:bg-slate-700 p-2.5 rounded-lg">
                    <Lock className="h-5 w-5 text-slate-500 dark:text-teal-400" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 font-bold">
                      Password
                    </p>
                    <p className="text-sm tracking-widest font-medium">
                      ••••••••••
                    </p>
                  </div>
                </div>
                <button className="text-teal-600 dark:text-teal-400 text-sm font-bold hover:underline px-2">
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
