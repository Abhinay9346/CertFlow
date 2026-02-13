"use client";

import useSWR from "swr";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

interface User {
  userId: string;
  role: "student" | "hod" | "principal";
  email: string;
  name: string;
  regNo?: string;
}

const fetcher = async (url: string) => {
  const res = await fetch(url);
  const json = await res.json();
  if (!res.ok) return { user: null };
  return json;
};

export function useAuth() {
  const router = useRouter();
  const { data, isLoading, mutate } = useSWR<{ user: User | null }>(
    "/api/auth/session",
    fetcher,
    {
      revalidateOnFocus: true,
      dedupingInterval: 0,
    }
  );

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    mutate(undefined);
    router.push("/");
  }, [mutate, router]);

  return {
    user: data?.user ?? null,
    isLoading,
    isAuthenticated: !!data?.user,
    logout,
    mutate,
  };
}
