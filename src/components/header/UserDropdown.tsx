"use client";

import Image from "next/image";
import React, { useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { mutate } from "swr";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  const { user } = useAuth();
  const router = useRouter();

  // 🔤 ambil initial nama
  const getInitials = (name?: string) => {
    if (!name) return "U";

    const parts = name.split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();

    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  // 🎨 warna random berdasarkan nama
  const getColor = (name?: string) => {
    const colors = [
      "bg-red-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-purple-500",
    ];

    if (!name) return colors[0];

    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  function toggleDropdown(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  const handleLogout = async () => {
    await fetch("/api_local/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    // clear SWR cache
    mutate("/api_local/auth/me", null, false);

    router.replace("/signin");
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center text-gray-700 dark:text-gray-400"
      >
        {/* 🔥 AVATAR */}
        <span className="mr-3 h-11 w-11 rounded-full overflow-hidden flex items-center justify-center text-white font-semibold">
          {!imgError && user?.name ? (
             <span
              className={`flex items-center justify-center w-full h-full ${getColor(
                user?.username
              )}`}
            >
              {getInitials(user?.username)}
            </span>
          ) : (
            <span
              className={`flex items-center justify-center w-full h-full ${getColor(
                user?.username
              )}`}
            >
              {getInitials(user?.username)}
            </span>
          )}
        </span>

        <span className="block mr-1 font-medium text-theme-sm">
          {user?.username || "User"}
        </span>

        {/* ARROW */}
        <svg
          className={`stroke-gray-500 dark:stroke-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          width="18"
          height="20"
          viewBox="0 0 18 20"
          fill="none"
        >
          <path
            d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
      >
        {/* INFO USER */}
        <div>
          <span className="block font-medium text-gray-700 text-theme-sm dark:text-gray-400">
            User Name: {user?.username}
          </span>
          <span className="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
            Role: {user?.role}
          </span>
        </div>

        {/* MENU */}
        <ul className="flex flex-col gap-1 pt-4 pb-3 border-b border-gray-200 dark:border-gray-800">
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              href="/Profile"
              className="px-3 py-2"
            >
              Edit profile
            </DropdownItem>
          </li>
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              href="/AccountSettings"
              className="px-3 py-2"
            >
              Account settings
            </DropdownItem>
          </li>
         
        </ul>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="px-3 py-2 mt-3 text-left hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg"
        >
          Sign out
        </button>
      </Dropdown>
    </div>
  );
}