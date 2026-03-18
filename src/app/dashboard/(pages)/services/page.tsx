"use client";

import { useState, useMemo, useEffect } from "react";
import { X, Copy, Printer, Wifi, Zap, Loader2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";
import axiosInstance from "../../component-dashboard/axios/axios"; // Adjust path to your axios instance

const cn = (...classes: (string | boolean | undefined)[]) =>
  classes.filter(Boolean).join(" ");

/**
 * 1. TYPES
 */
interface VoucherItem {
  username: string;
  status: string;
}

interface Batch {
  batch_id: number;
  batch_name: string;
  batch_description: string;
  vouchers: VoucherItem[];
}

interface GeneratedVoucher {
  code: string;
  plan: string;
  price: string;
  data: string;
  validity: string;
  generatedAt: string;
}

/**
 * 2. PLAN DEFINITIONS
 */
const serviceDefinitions = [
  {
    id: 1,
    name: "Basic Plan",
    matchDesc: "Basic Plan",
    price: "₱10",
    data: "1GB",
    validity: "1 Day",
    popular: false,
  },
  {
    id: 2,
    name: "Standard Plan",
    matchDesc: "Standard Plan",
    price: "₱20",
    data: "2GB",
    validity: "3 days",
    popular: true,
  },
  {
    id: 3,
    name: "Premium Plan",
    matchDesc: "Premium Plan",
    price: "₱50",
    data: "5GB",
    validity: "15 Days",
    popular: false,
  },
  {
    id: 4,
    name: "Giga Plan",
    matchDesc: "Giga Plan",
    price: "₱50",
    data: "10GB",
    validity: "30 Days",
    popular: false,
  },
];

export default function Services() {
  const [batchGroup, setBatchGroup] = useState<Batch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  const [generatedVouchers, setGeneratedVouchers] = useState<
    GeneratedVoucher[]
  >([]);
  const [showVouchers, setShowVouchers] = useState(false);

  /**
   * 3. FETCH DATA FROM API
   */
  useEffect(() => {
    const token = localStorage.getItem("Authorization");
    axiosInstance
      .get<Batch[]>("/api/vouchers/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setBatchGroup(response.data);
        console.log("API Data Loaded:", response.data);
      })
      .catch((error: unknown) => {
        if (error instanceof Error) {
          console.error("Error fetching batches:", error.message);
          toast.error("Failed to load plans from server.");
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  /**
   * 4. LOGIC: CALCULATE AVAILABILITY FROM API DATA
   */
  const processedServices = useMemo(() => {
    return serviceDefinitions.map((plan) => {
      // Use batchGroup (API Data) instead of static rawData
      const matchingBatches = batchGroup.filter(
        (b) => b.batch_description === plan.matchDesc,
      );

      const total = matchingBatches.reduce(
        (acc, b) => acc + (b.vouchers?.length || 0),
        0,
      );

      const unused = matchingBatches.reduce(
        (acc, b) =>
          acc + (b.vouchers?.filter((v) => v.status === "Unused").length || 0),
        0,
      );

      return { ...plan, unused, total };
    });
  }, [batchGroup]); // Re-calculate when API data updates

  const selectedPlan =
    processedServices.find((p) => p.id === selectedPlanId) || null;

  const handlePlanClick = (id: number) => {
    setSelectedPlanId(id);
    setShowConfirmation(true);
  };

  /**
   * 5. DISPENSE LOGIC
   */
  const handleGenerateVouchers = () => {
    if (!selectedPlan) return;

    // Search through API-fetched batches
    const matchingBatches = batchGroup.filter(
      (b) => b.batch_description === selectedPlan.matchDesc,
    );

    const availableVoucher = matchingBatches
      .flatMap((b) => b.vouchers || [])
      .find((v) => v.status === "Unused");

    if (availableVoucher) {
      const voucher: GeneratedVoucher = {
        code: availableVoucher.username,
        plan: selectedPlan.name,
        price: selectedPlan.price,
        data: selectedPlan.data,
        validity: selectedPlan.validity,
        generatedAt: new Date().toLocaleString(),
      };

      setGeneratedVouchers([voucher]);
      setShowConfirmation(false);
      setShowVouchers(true);
      toast.success(`Voucher dispensed successfully!`);
    } else {
      toast.error("No more vouchers left in this plan!");
      setShowConfirmation(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Loader2 className="w-10 h-10 text-teal-500 animate-spin" />
        <p className="text-slate-500 font-medium">Loading available plans...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-10  dark:bg-slate-900 min-h-screen">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
          Our Services
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Choose the best data plan and check real-time availability.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
        {processedServices.map((service) => (
          <div
            key={service.id}
            onClick={() => handlePlanClick(service.id)}
            className={cn(
              "relative rounded-2xl border shadow-sm flex flex-col cursor-pointer transition-all hover:shadow-xl hover:scale-[1.03] overflow-hidden bg-white dark:bg-slate-800",
              service.popular
                ? "border-teal-500 ring-2 ring-teal-400/60"
                : "border-slate-200 dark:border-slate-700",
            )}
          >
            <div
              className={cn(
                "h-1.5 w-full",
                service.popular
                  ? "bg-teal-500"
                  : "bg-slate-200 dark:bg-slate-700",
              )}
            />

            <div className="p-6 flex flex-col flex-1 gap-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-teal-500 mb-1">
                  Plan
                </p>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {service.name}
                </h3>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 text-sm font-semibold">
                  {service.data}
                </span>
                <span className="inline-flex items-center gap-1 text-slate-400 dark:text-slate-500 text-xs">
                  {service.validity}
                </span>
              </div>

              <div
                className={cn(
                  "rounded-xl p-4 flex flex-col gap-2",
                  service.popular
                    ? "bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800"
                    : "bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-700",
                )}
              >
                <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  <span>Availability</span>
                  <span
                    className={cn(
                      "font-bold text-base",
                      service.unused === 0
                        ? "text-red-500"
                        : "text-teal-600 dark:text-teal-400",
                    )}
                  >
                    {service.unused}
                    <span className="text-slate-400 dark:text-slate-500 font-normal text-xs">
                      /{service.total}
                    </span>
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-600 overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      service.unused / service.total < 0.2
                        ? "bg-red-500"
                        : "bg-teal-500",
                    )}
                    style={{
                      width:
                        service.total > 0
                          ? `${(service.unused / service.total) * 100}%`
                          : "0%",
                    }}
                  />
                </div>
              </div>

              <button
                className={cn(
                  "mt-auto w-full py-2.5 px-4 rounded-xl font-semibold text-sm transition-colors",
                  service.popular
                    ? "bg-teal-500 text-white shadow-md shadow-teal-500/30"
                    : "bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white",
                  service.unused === 0 && "opacity-50 cursor-not-allowed",
                )}
                disabled={service.unused === 0}
              >
                {service.unused > 0 ? "Generate QR Code" : "Out of Stock"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
              <h3 className="text-lg font-bold">Confirm Selection</h3>
              <button
                onClick={() => setShowConfirmation(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                <p className="text-sm text-slate-500 mb-1">You selected:</p>
                <p className="text-xl font-bold text-teal-600">
                  {selectedPlan.name}
                </p>
                <div className="flex gap-4 mt-2 text-sm text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <Zap className="w-4 h-4 text-teal-500" />{" "}
                    {selectedPlan.data}
                  </span>
                  <span className="flex items-center gap-1">
                    <Wifi className="w-4 h-4 text-teal-500" />{" "}
                    {selectedPlan.validity}
                  </span>
                </div>
              </div>
              <button
                onClick={handleGenerateVouchers}
                className="w-full py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-teal-500/25"
              >
                Confirm & Generate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Vouchers Modal */}
      {showVouchers && generatedVouchers.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95">
            <div className="p-6 bg-teal-500 text-white flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">Voucher Ready</h3>
                <p className="text-teal-100 text-sm">
                  Valid for {generatedVouchers[0].validity}
                </p>
              </div>
              <button
                onClick={() => setShowVouchers(false)}
                className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 flex flex-col items-center">
              <div className="bg-white p-4 rounded-2xl shadow-inner border border-slate-100 mb-6">
                <QRCodeSVG
                  value={`https://gigaportal.comclark.com/login.html?voucher=${generatedVouchers[0].code}`}
                  size={200}
                />
              </div>

              <div className="text-center space-y-2 mb-8">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Your Access Code
                </p>
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-mono font-black text-slate-800 dark:text-white tracking-wider">
                    {generatedVouchers[0].code}
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(generatedVouchers[0].code);
                      toast.success("Code copied!");
                    }}
                    className="p-2 text-teal-500 hover:bg-teal-50 rounded-lg transition-colors"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 w-full">
                <button
                  onClick={() => window.print()}
                  className="flex items-center justify-center gap-2 py-3 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-colors"
                >
                  <Printer className="w-4 h-4" /> Print
                </button>
                <button
                  onClick={() => setShowVouchers(false)}
                  className="py-3 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-xl font-semibold hover:opacity-90 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
