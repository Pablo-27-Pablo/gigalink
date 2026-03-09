"use client";

import { useState, useEffect, useMemo } from "react";
//import { PieChart, Pie, Cell, Tooltip } from "recharts";
import {
  Users,
  Wifi,
  Ticket,
  Database,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
} from "lucide-react";
//import { cn } from "@/lib/utils";
//import { motion } from "motion/react";
import axiosInstance from "../../component-dashboard/axios/axios";

// --- Interfaces ---
interface Voucher {
  code: string;
  password: string;
  servicePlan: string;
  dateIssued: string;
  expiryDate: string;
  dataLeft: number;
  status: string;
  batch_id: number;
}

interface Batch {
  batch_id: number;
  batch_name: string;
  batch_description: string;
  creationdate: string;
  owner: string;
  vouchers: {
    username: string;
    password: string;
    batch_id: number;
    status: string;
  }[];
}

// Helper to format plan names based on description
const getPlanDisplayName = (desc: string) => {
  if (desc.includes("1GB")) return "Basic Plan";
  if (desc.includes("2GB")) return "Medium Plan";
  return "Standard Plan";
};

export default function Dashboard() {
  const [showAll, setShowAll] = useState(false);
  const [filterPlan, setFilterPlan] = useState<string>("all");
  const [batchGroup, setBatchGroup] = useState<Batch[]>([]);
  // CHANGED: Default filter status updated to "online"
  const [filterStatus, setFilterStatus] = useState<string>("online");

  // Fetch data from API with Auto-Update Polling
  useEffect(() => {
    const fetchData = () => {
      const token = localStorage.getItem("Authorization");
      axiosInstance
        .get<Batch[]>("/api/vouchers/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setBatchGroup(response.data);
          console.log("Dashboard Data Refreshed");
        })
        .catch((error: unknown) => {
          if (error instanceof Error) {
            console.log("Error fetching batches:", error.message);
          }
        });
    };

    // Initial fetch
    fetchData();

    // Poll every 5 seconds to catch new activations or stock changes
    const interval = setInterval(fetchData, 5000);

    // Clean up on unmount
    return () => clearInterval(interval);
  }, []);

  // Transformation logic: Converts Batch API structure to flat Voucher list
  const vouchersData = useMemo(() => {
    return batchGroup.flatMap((batch) =>
      batch.vouchers.map((v) => ({
        code: v.username,
        password: v.password,
        servicePlan: getPlanDisplayName(batch.batch_description),
        dateIssued: new Date(batch.creationdate).toLocaleDateString(),
        expiryDate: batch.batch_description.split("for ")[1] || "N/A",
        dataLeft: parseFloat(batch.batch_description.split("GB")[0]) || 0,
        status: v.status,
        batch_id: v.batch_id,
      })),
    );
  }, [batchGroup]);

  // Filtered list for the UI
  const filteredVouchers = useMemo(() => {
    return vouchersData.filter((voucher) => {
      // Logic for status filtering - CHANGED to "online"
      if (
        filterStatus === "online" &&
        voucher.status.toLowerCase() !== "online"
      )
        return false;

      if (
        filterPlan !== "all" &&
        voucher.servicePlan.toLowerCase() !== filterPlan.toLowerCase()
      )
        return false;

      return true;
    });
  }, [vouchersData, filterPlan, filterStatus]);

  // Dynamic counts for Stats Cards
  const stats = {
    total: vouchersData.length,
    // CHANGED: Filter logic updated to count "online"
    online: vouchersData.filter((v) => v.status.toLowerCase() === "online")
      .length,
    unused: vouchersData.filter((v) => v.status.toLowerCase() === "unused")
      .length,
  };

  const formatData = (gb: number) => {
    return gb >= 1 ? `${gb.toFixed(1)} GB` : `${(gb * 1024).toFixed(0)} MB`;
  };

  return (
    <div className="space-y-8 p-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Dashboard Overview
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Welcome back, Agent.
          </p>
        </div>
        <span className="px-3 py-1 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-full text-sm font-medium">
          System Status: Online
        </span>
      </div>

      {/* Dynamic Stat Cards */}
      <div className="p-2 bg-slate-900 rounded-2xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-slate-700/50 bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden shadow-2xl">
          {/* Total Vouchers */}
          <div className="p-4 hover:bg-slate-700/30 transition-colors group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400 group-hover:scale-110 transition-transform">
                <Wifi size={24} />
              </div>
              <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">
                Global
              </span>
            </div>
            <p className="text-slate-400 text-sm font-medium">Total Vouchers</p>
            <h3 className="text-3xl font-bold text-white mt-1">
              {stats.total}
            </h3>
          </div>

          {/* Online Vouchers */}
          <div className="p-4 hover:bg-slate-700/30 transition-colors group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-teal-500/10 rounded-lg text-teal-400 group-hover:scale-110 transition-transform">
                <Users size={24} />
              </div>
              <span className="text-xs font-bold text-teal-500 uppercase tracking-widest">
                Live
              </span>
            </div>
            <p className="text-slate-400 text-sm font-medium">
              Online Vouchers
            </p>
            <h3 className="text-3xl font-bold text-white mt-1">
              {stats.online}
            </h3>
          </div>

          {/* Unused Vouchers */}
          <div className="p-4 hover:bg-slate-700/30 transition-colors group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-slate-500/10 rounded-lg text-slate-400 group-hover:scale-110 transition-transform">
                <Ticket size={24} />
              </div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                Stock
              </span>
            </div>
            <p className="text-slate-400 text-sm font-medium">
              Available vouchers
            </p>
            <h3 className="text-3xl font-bold text-white mt-1">
              {stats.unused}
            </h3>
          </div>
        </div>
      </div>

      <h1
        id="ActiveSession"
        className="font-bold text-slate-800 dark:text-white"
      >
        Online Sessions Only ({filteredVouchers.length})
      </h1>

      {/* Table Head */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 px-2">
        <div className="flex items-center gap-4 flex-1">
          <p className="text-sm text-slate-500">Plan / User</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 flex-1 lg:px-4">
          <p className="text-xs text-slate-500">Created</p>
          <p className="text-xs text-slate-500">Duration</p>
          <p className="text-xs text-slate-500">Limit</p>
        </div>
        <div className="flex items-center gap-3 lg:justify-end pr-10 text-xs text-slate-500">
          <span>Status</span>
        </div>
      </div>

      {/* Vouchers Grid */}
      <div className="grid gap-4">
        {filteredVouchers.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl border border-slate-200">
            <p className="text-slate-500">No vouchers currently online.</p>
          </div>
        ) : (
          <>
            {filteredVouchers
              .slice(0, showAll ? undefined : 4)
              .map((voucher, index) => (
                <div
                  key={index}
                  className="flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg bg-teal-100 dark:bg-teal-900/30 text-teal-600">
                      <Ticket />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-slate-700 dark:text-white">
                        {voucher.servicePlan}
                      </h3>
                      <p className="text-sm text-slate-500">
                        <span>Voucher code: </span> {voucher.code.slice(0, 4)}
                        ••••
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 flex-1 lg:px-4">
                    <p className="text-sm font-medium">{voucher.dateIssued}</p>
                    <p className="text-sm font-medium">{voucher.expiryDate}</p>
                    <p className="text-sm font-medium text-orange-600">
                      {formatData(voucher.dataLeft)}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 lg:justify-end pr-5">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-700 border border-teal-200">
                      {voucher.status}
                    </span>
                  </div>
                </div>
              ))}

            {filteredVouchers.length > 4 && (
              <div className="flex justify-center mt-4">
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="px-6 py-2 text-sm font-medium text-teal-600 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors border border-teal-200"
                >
                  {showAll ? "Show Less" : "See All Online Vouchers"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
