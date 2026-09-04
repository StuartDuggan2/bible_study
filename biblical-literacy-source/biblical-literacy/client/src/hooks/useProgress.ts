import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { ReadingProgress, InsertReadingProgress } from "@shared/schema";

export function useAllProgress() {
  return useQuery<ReadingProgress[]>({
    queryKey: ["/api/progress"],
  });
}

export function useProgressMap() {
  const q = useAllProgress();
  const map = new Map<string, ReadingProgress>();
  (q.data ?? []).forEach((row) => map.set(row.bookId, row));
  return { map, isLoading: q.isLoading, isError: q.isError };
}

export function useUpsertProgress() {
  return useMutation({
    mutationFn: async (row: InsertReadingProgress) => {
      const res = await apiRequest("POST", "/api/progress", row);
      return (await res.json()) as ReadingProgress;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/progress"] });
    },
  });
}

export function useResetProgress() {
  return useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/progress/reset", {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/progress"] });
      queryClient.invalidateQueries({ queryKey: ["/api/notes"] });
    },
  });
}
