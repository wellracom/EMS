"use client";

import { useEffect, useState } from "react";

export function useEnvParam(key: string) {
  const [env, setValue] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!key) return;

    const fetchEnv = async () => {
      try {
        const res = await fetch(`/api_local/env?key=${key}`);
        const data = await res.json();

        setValue(data.value ?? null);
      } catch (err) {
        setValue(null);
      } finally {
        setLoading(false);
      }
    };

    fetchEnv();
  }, [key]);

  return { env, loading };
}