"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, HelpCircle, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface FAQ {
  id: number;
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    id: 1,
    question: "What is GigaLink?",
    answer:
      "GigaLink is a prepaid, QR-based WiFi system that lets you access the internet instantly—no apps or subscriptions required.",
  },
  {
    id: 2,
    question: "How does GigaLink work?",
    answer:
      "Connect to the GigaLink WiFi network, scan/type your QR voucher, and get online immediately.",
  },
  {
    id: 3,
    question: "What do I need to use GigaLink?",
    answer: "Any WiFi-enabled device. No app or registration is required.",
  },
  {
    id: 4,
    question: "Who provides GigaLink's internet?",
    answer:
      "Connectivity is delivered by ComClark using satellite broadband powered by Starlink.",
  },
  {
    id: 5,
    question: "Where does GigaLink work?",
    answer:
      "GigaLink works wherever Starlink satellites provide coverage, including remote and underserved areas.",
  },
  {
    id: 6,
    question: "How reliable is GigaLink's connection?",
    answer:
      "Starlink-powered connectivity ensures fast and stable internet suitable for public WiFi, events, and community access.",
  },
  {
    id: 7,
    question: "How long does GigaLink access last?",
    answer:
      "Access depends on your voucher plan and may be based on time, data usage, or both.",
  },
  {
    id: 8,
    question: "What if I can't connect to GigaLink?",
    answer:
      "Make sure you're connected to the correct WiFi network and try scanning again. If you still need help, our team is ready to assist.",
  },
];

export default function FAQs() {
  const [openId, setOpenId] = useState<number | null>(null);
  const router = useRouter();

  const toggleFAQ = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Back to Login
        <button
          onClick={() => router.push("/login")}
          className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Sign In
        </button> */}

        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 dark:bg-teal-900/30 rounded-full mb-4">
            <HelpCircle
              size={32}
              className="text-teal-600 dark:text-teal-400"
            />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            Find answers to common questions about GigaLink and how to get the
            most out of your service.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                "bg-white dark:bg-slate-800 rounded-xl border overflow-hidden transition-all",
                openId === faq.id
                  ? "border-teal-500 ring-2 ring-teal-400/30 shadow-lg"
                  : "border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md",
              )}
            >
              <button
                onClick={() => toggleFAQ(faq.id)}
                className="w-full px-6 py-4 flex items-center justify-between gap-4 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50"
              >
                <div className="flex items-start gap-4 flex-1">
                  <div
                    className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-full shrink-0 font-bold text-sm transition-colors",
                      openId === faq.id
                        ? "bg-teal-500 text-white"
                        : "bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400",
                    )}
                  >
                    {faq.id}
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white pt-1">
                    {faq.question}
                  </h3>
                </div>
                <motion.div
                  animate={{ rotate: openId === faq.id ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="shrink-0"
                >
                  <ChevronDown
                    size={20}
                    className={cn(
                      "transition-colors",
                      openId === faq.id
                        ? "text-teal-500"
                        : "text-slate-400 dark:text-slate-500",
                    )}
                  />
                </motion.div>
              </button>

              <AnimatePresence>
                {openId === faq.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 pl-[72px]">
                      <div className="pt-2 pb-1 border-t border-slate-200 dark:border-slate-700">
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Contact Support
        <div className="bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-900/10 rounded-2xl border-2 border-teal-200 dark:border-teal-800 p-8 text-center">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Still have questions?
          </h2>
          <p className="text-slate-600 dark:text-slate-300 mb-4">
            Our support team is here to help you get the most out of GigaLink.
          </p>
          <button className="px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-xl font-semibold transition-colors shadow-md shadow-teal-500/30">
            Contact Support
          </button>
        </div> */}
      </div>
    </div>
  );
}
