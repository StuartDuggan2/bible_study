import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { BibleNote } from "@shared/schema";

export function useAllNotes() {
  return useQuery<BibleNote[]>({
    queryKey: ["/api/notes"],
  });
}

export function useBookNotes(bookId: string | undefined) {
  return useQuery<BibleNote[]>({
    queryKey: ["/api/notes", { bookId }],
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/notes?bookId=${encodeURIComponent(bookId!)}`);
      return (await res.json()) as BibleNote[];
    },
    enabled: !!bookId,
  });
}

type CreateNoteInput = {
  bookId: string;
  scope: "book" | "chapter" | "verse";
  chapter?: number | null;
  verseRef?: string | null;
  body: string;
};

export function useCreateOrUpsertNote() {
  return useMutation({
    mutationFn: async (input: CreateNoteInput) => {
      const res = await apiRequest("POST", "/api/notes", input);
      return (await res.json()) as BibleNote;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notes"] });
    },
  });
}

export function useUpdateNote() {
  return useMutation({
    mutationFn: async ({ id, body }: { id: string; body: string }) => {
      const res = await apiRequest("PATCH", `/api/notes/${id}`, { body });
      return (await res.json()) as BibleNote;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notes"] });
    },
  });
}

export function useDeleteNote() {
  return useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/notes/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notes"] });
    },
  });
}
