"use client";

import React, { useState, useMemo, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  QrCode,
  X,
  Download,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Search,
  ChevronDown,
} from "lucide-react";

// --- Types & Data ---
interface SessionRow {
  user: string;
  id: string;
  plan: string;
  data: string;
  status: "ACTIVE" | "UNUSED" | "EXPIRED";
  statusColor: string;
  progress: string;
  progressColor: string;
  remaining: string;
  expiration: string;
}

const sessionData: SessionRow[] = [
  {
    user: "user_gl001",
    id: "3DAJHFkT",
    plan: "Gigalink Lite",
    data: "500MB",
    status: "ACTIVE",
    statusColor: "bg-emerald-500/10 text-emerald-500",
    progress: "10%",
    progressColor: "bg-[#00cba9]",
    remaining: "450 MB",
    expiration: "2026-03-03",
  },
  {
    user: "user_gb002",
    id: "dxkeV4e3",
    plan: "Gigalink Boost",
    data: "2GB",
    status: "ACTIVE",
    statusColor: "bg-emerald-500/10 text-emerald-500",
    progress: "15%",
    progressColor: "bg-[#00cba9]",
    remaining: "1.8 GB",
    expiration: "2026-03-05",
  },
  {
    user: "user_gf003",
    id: "EiyaVmzi",
    plan: "Gigalink Flex",
    data: "5GB",
    status: "UNUSED",
    statusColor: "bg-orange-500/10 text-orange-500",
    progress: "0%",
    progressColor: "bg-gray-600",
    remaining: "5 GB",
    expiration: "2026-03-12",
  },
  {
    user: "user_sz221",
    id: "gEp2uW4S",
    plan: "Basic 10GB",
    data: "2GB",
    status: "EXPIRED",
    statusColor: "bg-red-500/10 text-red-500",
    progress: "100%",
    progressColor: "bg-red-500",
    remaining: "0 GB",
    expiration: "2023-11-25",
  },
  {
    user: "user_gh_332",
    id: "h9h6G5b7",
    plan: "Hybrid Tier",
    data: "15GB",
    status: "ACTIVE",
    statusColor: "bg-emerald-500/10 text-emerald-500",
    progress: "33%",
    progressColor: "bg-[#00cba9]",
    remaining: "10 GB",
    expiration: "2026-04-12",
  },
  {
    user: "user_vip_07",
    id: "rnD6uGE2",
    plan: "VIP Platinum",
    data: "500GB",
    status: "ACTIVE",
    statusColor: "bg-emerald-500/10 text-emerald-500",
    progress: "5%",
    progressColor: "bg-[#00cba9]",
    remaining: "475 GB",
    expiration: "2027-03-01",
  },
  {
    user: "user_night_1",
    id: "W94TPqZ6",
    plan: "Midnight Owl",
    data: "100GB",
    status: "ACTIVE",
    statusColor: "bg-emerald-500/10 text-emerald-500",
    progress: "2%",
    progressColor: "bg-[#00cba9]",
    remaining: "98 GB",
    expiration: "2026-04-10",
  },
  {
    user: "user_sz221",
    id: "zabrqcgA",
    plan: "Basic 10GB",
    data: "2GB",
    status: "EXPIRED",
    statusColor: "bg-red-500/10 text-red-500",
    progress: "100%",
    progressColor: "bg-red-500",
    remaining: "0 GB",
    expiration: "2023-11-25",
  },
  {
    user: "user_gh_332",
    id: "GH-4412",
    plan: "Hybrid Tier",
    data: "15GB",
    status: "ACTIVE",
    statusColor: "bg-emerald-500/10 text-emerald-500",
    progress: "33%",
    progressColor: "bg-[#00cba9]",
    remaining: "10 GB",
    expiration: "2026-04-12",
  },
  {
    user: "user_vip_07",
    id: "VP-0007",
    plan: "VIP Platinum",
    data: "500GB",
    status: "ACTIVE",
    statusColor: "bg-emerald-500/10 text-emerald-500",
    progress: "5%",
    progressColor: "bg-[#00cba9]",
    remaining: "475 GB",
    expiration: "2027-03-01",
  },
  {
    user: "user_night_1",
    id: "NI-0092",
    plan: "Midnight Owl",
    data: "100GB",
    status: "ACTIVE",
    statusColor: "bg-emerald-500/10 text-emerald-500",
    progress: "2%",
    progressColor: "bg-[#00cba9]",
    remaining: "98 GB",
    expiration: "2026-04-10",
  },
];

export default function GigalinkDashboard() {
  const [selectedUser, setSelectedUser] = useState<SessionRow | null>(null);
  const [copied, setCopied] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter States
  const [dataFilter, setDataFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [isDataDropdownOpen, setIsDataDropdownOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  const qrRef = useRef<HTMLDivElement>(null);
  const ITEMS_PER_PAGE = 6;

  // --- Stats Calculation ---
  const stats = useMemo(() => {
    return {
      online: sessionData.filter((s) => s.status === "ACTIVE").length,
      unused: sessionData.filter((s) => s.status === "UNUSED").length,
      expired: sessionData.filter((s) => s.status === "EXPIRED").length,
    };
  }, []);

  // --- Filtering Logic ---
  const filteredData = useMemo(() => {
    return sessionData.filter((item) => {
      const matchesSearch =
        item.data.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.plan.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesData = dataFilter ? item.data === dataFilter : true;
      const matchesStatus = statusFilter ? item.status === statusFilter : true;

      return matchesSearch && matchesData && matchesStatus;
    });
  }, [searchQuery, dataFilter, statusFilter]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(firstPageIndex, firstPageIndex + ITEMS_PER_PAGE);
  }, [currentPage, filteredData]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQR = () => {
    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `${selectedUser?.id}-QR.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <div className="min-h-screen bg-[#111825] text-white font-sans p-6">
      <main className="max-w-7xl mx-auto space-y-8">
        {/* --- Status Overview Cards --- */}
        <h1 className="text-xl font-bold">STATUS</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#111827] border border-emerald-500/20 rounded-2xl p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-emerald-500/5 opacity-0 hover:opacity-100 transition-opacity" />
            <h2 className="text-5xl font-bold mb-2 tracking-tighter">
              {stats.online}
            </h2>
            <p className="text-gray-400 font-medium">Online</p>
          </div>
          <div className="bg-[#111827] border border-orange-500/20 rounded-2xl p-8 relative overflow-hidden ">
            <div className="absolute inset-0 bg-orange-500/5 opacity-0 hover:opacity-100 transition-opacity" />
            <h2 className="text-5xl font-bold mb-2 tracking-tighter">
              {stats.unused}
            </h2>
            <p className="text-gray-400 font-medium">Unused</p>
          </div>
          <div className="bg-[#111827] border border-red-500/20 rounded-2xl p-8 relative overflow-hidden ">
            <div className="absolute inset-0 bg-red-500/5 opacity-0 hover:opacity-100 transition-opacity" />
            <h2 className="text-5xl font-bold mb-2 tracking-tighter">
              {stats.expired}
            </h2>
            <p className="text-gray-400 font-medium">Expired/Used</p>
          </div>
        </div>

        {/* --- Table Header Controls --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold text-[#00cba9] tracking-tight">
            Active Sessions
          </h1>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search Plan or Data..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-[#111827] border border-gray-800 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#00cba9] transition-all"
              />
            </div>

            <div className="relative">
              <button
                onClick={() => setIsDataDropdownOpen(!isDataDropdownOpen)}
                className={`flex items-center space-x-2 bg-[#111827] border ${dataFilter ? "border-[#00cba9]" : "border-gray-800"} rounded-xl px-4 py-2.5 text-sm hover:bg-gray-800 transition-all`}
              >
                <span
                  className={dataFilter ? "text-[#00cba9]" : "text-gray-300"}
                >
                  {dataFilter || "Data"}
                </span>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </button>

              {isDataDropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-[#1e293b] border border-gray-700 rounded-xl shadow-2xl py-2 z-50">
                  {["500MB", "2GB", "5GB", "10GB"].map((size) => (
                    <button
                      key={size}
                      onClick={() => {
                        setDataFilter(size);
                        setIsDataDropdownOpen(false);
                        setCurrentPage(1);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                    >
                      {size}
                    </button>
                  ))}
                  <div className="h-px bg-gray-700 my-1" />
                  <button
                    onClick={() => {
                      setDataFilter(null);
                      setIsDataDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-400/10"
                  >
                    Clear Filter
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* --- Main Table --- */}
        <div className="bg-[#111827] rounded-2xl border border-gray-800 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#0b0f1a] text-gray-500 uppercase text-[10px] font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-5">Voucher Code</th>
                  <th className="px-6 py-5">Data Plan</th>
                  <th className="px-6 py-5">Data</th>
                  {/* Status Column with Clickable Filter */}
                  <th className="px-6 py-5 relative">
                    <button
                      onClick={() =>
                        setIsStatusDropdownOpen(!isStatusDropdownOpen)
                      }
                      className="flex items-center space-x-1 hover:text-white transition-colors"
                    >
                      <span>Status</span>
                      <ChevronDown className="h-3 w-3" />
                    </button>
                    {isStatusDropdownOpen && (
                      <div className="absolute left-6 mt-2 w-32 bg-[#1e293b] border border-gray-700 rounded-lg shadow-xl py-1 z-50 normal-case">
                        {["ACTIVE", "UNUSED", "EXPIRED"].map((status) => (
                          <button
                            key={status}
                            onClick={() => {
                              setStatusFilter(status);
                              setIsStatusDropdownOpen(false);
                              setCurrentPage(1);
                            }}
                            className="w-full text-left px-4 py-2 text-[11px] font-bold text-gray-300 hover:bg-gray-700"
                          >
                            {status}
                          </button>
                        ))}
                        <button
                          onClick={() => {
                            setStatusFilter(null);
                            setIsStatusDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-[11px] font-bold text-red-400 border-t border-gray-700"
                        >
                          ALL
                        </button>
                      </div>
                    )}
                  </th>
                  <th className="px-6 py-5">Remaining</th>
                  <th className="px-6 py-5">Expiration</th>
                  <th className="px-6 py-5 text-center">QR Code</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {currentTableData.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-200">{row.id}</div>
                      {/* <div className="text-[10px] text-gray-500 font-medium">
                        {row.id}
                      </div> */}
                    </td>
                    <td className="px-6 py-4 text-gray-400 font-medium">
                      {row.plan}
                    </td>
                    <td className="px-6 py-4 font-black text-gray-100">
                      {row.data}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded text-[10px] font-black tracking-widest ${row.statusColor}`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3 min-w-[140px]">
                        <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-500 ${row.progressColor}`}
                            style={{ width: row.progress }}
                          />
                        </div>
                        <span className="text-xs text-gray-400 font-medium">
                          {row.remaining}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-xs font-medium">
                      {row.expiration}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => setSelectedUser(row)}
                        className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#00cba9] text-[#0f172a] text-[10px] font-black uppercase hover:bg-[#00e0ba] hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#00cba9]/10"
                      >
                        <QrCode className="h-3.5 w-3.5" />
                        <span>Generate QR</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-5 bg-[#0b0f1a]/50 border-t border-gray-800 flex items-center justify-between">
            <p className="text-xs text-gray-500">
              Showing{" "}
              <span className="text-gray-300 font-bold">
                {currentTableData.length}
              </span>{" "}
              of {filteredData.length} results
            </p>
            <div className="flex items-center space-x-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="p-2 rounded-lg border border-gray-800 hover:bg-gray-800 disabled:opacity-20 transition-all"
              >
                <ChevronLeft className="h-4 w-4 text-gray-400" />
              </button>
              <div className="px-4 py-2 rounded-lg bg-gray-800 text-xs font-bold text-gray-300">
                {currentPage} / {totalPages || 1}
              </div>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="p-2 rounded-lg border border-gray-800 hover:bg-gray-800 disabled:opacity-20 transition-all"
              >
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* QR Modal (Retained) */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div className="bg-[#0f172a] w-full max-w-sm rounded-[2.5rem] border border-[#00cba9]/20 p-8 flex flex-col items-center relative animate-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              onClick={() => setSelectedUser(null)}
              className="absolute top-6 right-6 p-2 bg-gray-800/50 hover:bg-gray-700 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-gray-400" />
            </button>

            {/* QR Code Section */}
            <div
              className="bg-white p-6 rounded-[2rem] mb-6 shadow-2xl shadow-[#00cba9]/10"
              ref={qrRef}
            >
              <QRCodeSVG
                value={`https://gigalink.comclark.com/camera.html?voucher=${selectedUser.id}`}
                size={180}
                level="H"
              />
            </div>

            {/* Manual Voucher Code Tile */}
            <div
              onClick={() => copyToClipboard(selectedUser.id)}
              className="group cursor-pointer bg-[#1e293b]/50 border border-gray-800 rounded-2xl px-6 py-4 mb-4 flex items-center space-x-4 hover:border-[#00cba9]/50 transition-all w-full"
            >
              <div className="flex-1">
                <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">
                  Voucher Code
                </p>
                <p className="text-xl font-mono font-bold text-white group-hover:text-[#00cba9] transition-colors">
                  {selectedUser.id}
                </p>
              </div>
              {copied ? (
                <Check className="h-5 w-5 text-emerald-500" />
              ) : (
                <Copy className="h-5 w-5 text-gray-600 group-hover:text-gray-400" />
              )}
            </div>

            {/* Data Grid Tiles */}
            <div className="w-full grid grid-cols-2 gap-3 mb-4">
              <div className="bg-[#1e293b]/50 border border-gray-800 p-4 rounded-2xl">
                <p className="text-[10px] text-gray-500 uppercase font-bold">
                  Plan
                </p>
                <p className="text-sm font-bold text-white">
                  {selectedUser.plan}
                </p>
              </div>
              <div className="bg-[#1e293b]/50 border border-gray-800 p-4 rounded-2xl">
                <p className="text-[10px] text-gray-500 uppercase font-bold">
                  Price
                </p>
                <p className="text-sm font-bold text-[#00cba9]">${"29.99"}</p>
              </div>
              <div className="bg-[#1e293b]/50 border border-gray-800 p-4 rounded-2xl">
                <p className="text-[10px] text-gray-500 uppercase font-bold">
                  Data
                </p>
                <p className="text-sm font-bold text-white">
                  {selectedUser.data || "50GB"}
                </p>
              </div>
              <div className="bg-[#1e293b]/50 border border-gray-800 p-4 rounded-2xl">
                <p className="text-[10px] text-gray-500 uppercase font-bold">
                  Validity
                </p>
                <p className="text-sm font-bold text-white">{"60 Days"}</p>
              </div>
            </div>

            {/* Timestamp */}
            <p className="text-[10px] text-gray-600 mb-6">
              Generated: {new Date().toLocaleString()}
            </p>

            {/* Action Buttons */}
            <div className="w-full grid grid-cols-2 gap-3">
              <button
                onClick={() => copyToClipboard(selectedUser.id)}
                className="flex items-center justify-center space-x-2 bg-gray-800/50 hover:bg-gray-700 text-white py-4 rounded-2xl font-bold transition-all border border-gray-700"
              >
                <Copy className="h-4 w-4" />
                <span>Copy</span>
              </button>
              <button
                onClick={downloadQR}
                className="flex items-center justify-center space-x-2 bg-[#00cba9] hover:bg-[#00e0ba] text-[#0f172a] py-4 rounded-2xl font-bold transition-all"
              >
                <Download className="h-4 w-4" />
                <span>QR</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
