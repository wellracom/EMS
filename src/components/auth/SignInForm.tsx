"use client";

import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { mutate } from "swr";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    const res = await fetch("/api_local/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
        remember: isChecked,
      }),
    });

    if (!res.ok) {
      throw new Error("Invalid username or password");
    }

    // 🔥 refresh auth state
   await mutate("/api_local/auth/me");

setTimeout(() => {
  router.push("/");
}, 100);

  } catch (err: any) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="flex flex-col w-full">

      {/* TITLE */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
          Sign In
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Access your monitoring system
        </p>
      </div>

      {/* FORM */}
      <form onSubmit={handleLogin} className="space-y-5">

        {/* ERROR */}
        {error && (
          <div className="text-sm text-red-500 bg-red-50 dark:bg-red-500/10 p-2 rounded">
            {error}
          </div>
        )}

        {/* Username */}
        <div>
          <Label>Username</Label>
          <Input
            type="text"
            placeholder="Enter username"
            className="mt-1"
            value={username}
            onChange={(e: any) => setUsername(e.target.value)}
          />
        </div>

        {/* Password */}
        <div>
          <Label>Password</Label>
          <div className="relative mt-1">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={password}
              onChange={(e: any) => setPassword(e.target.value)}
            />

            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
            >
              {showPassword ? <EyeIcon /> : <EyeCloseIcon />}
            </span>
          </div>
        </div>

        {/* Remember me */}
        <div className="flex items-center gap-2 text-sm">
          <Checkbox checked={isChecked} onChange={setIsChecked} />
          <span className="text-gray-600 dark:text-gray-400">
            Remember me
          </span>
        </div>

        {/* BUTTON */}
        <Button
          className="w-full h-11"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign In"}
        </Button>

      </form>
    </div>
  );
}