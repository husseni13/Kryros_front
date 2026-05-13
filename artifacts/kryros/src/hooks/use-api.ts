import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const API_BASE = (import.meta.env.VITE_API_URL || "/backend") + "/api";

export function useApi() {
  const queryClient = useQueryClient();

  const fetcher = async (path: string, options?: RequestInit) => {
    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: "An error occurred" }));
      throw new Error(error.message || "An error occurred");
    }
    return res.json();
  };

  const useGet = (key: any[], path: string, options?: any) => {
    return useQuery({
      queryKey: key,
      queryFn: () => fetcher(path),
      ...options,
    });
  };

  const usePost = (path: string, options?: any) => {
    return useMutation({
      mutationFn: (data: any) => fetcher(path, {
        method: "POST",
        body: JSON.stringify(data),
      }),
      ...options,
    });
  };

  return { fetcher, useGet, usePost };
}
