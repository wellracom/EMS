"use client";

import useSWR from "swr";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const fetcher = async (url: string) => {
  const res = await fetch(url, {
    credentials: "include",
  });

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

  const user = data?.user;

  useEffect(() => {
    if (!redirectIfUnauthenticated) return;
    if (redirected.current) return;
    if (isLoading) return;
    if (!data) return;
    if (user) return;

    redirected.current = true;
    router.replace("/signin");
  }, [user, isLoading, data]);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    isReady: !isLoading && data !== undefined,
    mutate,
  };
}