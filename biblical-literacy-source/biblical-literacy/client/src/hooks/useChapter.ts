import { useQuery } from "@tanstack/react-query";
import { fetchChapter, type Verse } from "@/lib/scripture";

/**
 * Scripture text for one chapter.
 *
 * Note the explicit queryFn: the app's default queryFn joins the queryKey into
 * an /api/… URL, which is wrong here — this data comes from a CDN, not our
 * backend. staleTime Infinity is inherited from queryClient and is exactly
 * right, since scripture text never changes.
 */
export function useChapter(versionSlug: string, bookId: string | undefined, chapter: number) {
  return useQuery<Verse[]>({
    queryKey: ["scripture", versionSlug, bookId, chapter],
    queryFn: () => fetchChapter(versionSlug, bookId!, chapter),
    enabled: !!bookId && chapter > 0,
  });
}
