"use client";

import useSWR from "swr";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const fetcher = async (url: string) => {
  const res = await fetch(url, {
    credentials: "include",
  });

  if (!res.ok) return null; // 🔥 penting
  return res.json();
};

export function useAuth(redirectIfUnauthenticated = false) {
  const router = useRouter();
  const redirected = useRef(false);

  const { data, isLoading, mutate } = useSWR(
    "/api_local/auth/me",
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  const user = data?.user ?? null;

  useEffect(() => {
    if (!redirectIfUnauthenticated) return;
    if (redirected.current) return;
    if (isLoading) return;

    // 🔥 langsung cek user saja
    if (!user) {
      redirected.current = true;
      router.replace("/signin");
    }
  }, [user, isLoading]);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    isReady: !isLoading,
    mutate,
  };
}