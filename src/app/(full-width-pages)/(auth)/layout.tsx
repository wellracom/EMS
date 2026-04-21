import GridShape from "@/components/common/GridShape";
import ThemeTogglerTwo from "@/components/common/ThemeTogglerTwo";
import { ThemeProvider } from "@/context/ThemeContext";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <div className="min-h-screen flex bg-gradient-to-br from-gray-100 via-white to-gray-200 dark:from-gray-900 dark:via-gray-900 dark:to-black overflow-hidden">

        {/* LEFT SIDE - AUTH FORM */}
        <div className="relative z-20 flex flex-col justify-center w-full lg:w-1/2 px-6 sm:px-12 lg:px-20">
          <div className="max-w-md w-full mx-auto">

            {/* HEADER */}
            <div className="mb-8">
              <Link href="/signin" className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-brand-600 text-white shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12h4l3 8 4-16 3 8h4" />
                  </svg>
                </div>
                <span className="text-xl font-bold text-gray-800 dark:text-white">
                  EMS Monitor
                </span>
              </Link>

              <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                Smart Monitoring System for real-time tracking, alerts, and analytics.
              </p>
            </div>

            {/* FORM CARD */}
            <div className="bg-white dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/60 dark:border-gray-700 shadow-xl rounded-2xl p-6 sm:p-8">
              {children}
            </div>

            <p className="text-center text-xs text-gray-400 mt-6 dark:text-gray-500">
              © {new Date().getFullYear()} EMS Monitoring System
            </p>
          </div>
        </div>

        {/* RIGHT SIDE - VISUAL */}
        <div className="hidden lg:flex w-1/2 relative items-center justify-center overflow-hidden">

          {/* GRID */}
          <div className="absolute inset-0 pointer-events-none opacity-30">
            <GridShape />
          </div>

          {/* GLOW */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute w-[420px] h-[420px] bg-brand-500/20 blur-3xl rounded-full -top-20 -right-20 animate-pulse" />
            <div className="absolute w-[320px] h-[320px] bg-blue-500/20 blur-3xl rounded-full -bottom-20 -left-20 animate-pulse" />
          </div>

          {/* FLOATING DOTS */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/3 left-1/4 w-2 h-2 bg-white/40 rounded-full animate-bounce" />
            <div className="absolute top-1/2 right-1/3 w-2 h-2 bg-blue-300/40 rounded-full animate-ping" />
            <div className="absolute bottom-1/3 left-1/2 w-2 h-2 bg-brand-300/40 rounded-full animate-pulse" />
          </div>

          {/* CONTENT CARD */}
          <div className="relative z-10 max-w-md w-full px-10">

            <div className="bg-white/70 dark:bg-gray-800/60 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/40 p-8 text-center hover:scale-[1.02] transition duration-500">

              <Image
                src="/images/logo/Auth-Logo-AFJ.svg"
                alt="logo"
                width={180}
                height={60}
                className="mx-auto mb-6 opacity-90"
              />

              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Real-Time Monitoring
              </h2>

              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Live system Monitoring, Report, and alert management in one dashboard.
              </p>

              {/* STATUS */}
             

            </div>

          </div>
        </div>

        {/* THEME TOGGLER */}
        <div className="fixed bottom-6 right-6 z-50">
          <ThemeTogglerTwo />
        </div>

      </div>
    </ThemeProvider>
  );
}
