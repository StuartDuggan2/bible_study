// Scripture text from wldeh/bible-api — static JSON on jsDelivr.
// No API key, no auth, no proxy, no rate limit: the browser fetches the CDN
// directly and jsDelivr's edge cache does the work.
//
// Your BOOKS ids already match this source's slugs ("genesis", "1samuel",
// "1chronicles"), so no mapping is needed for the protestant canon. The few
// exceptions live in SLUG_ALIASES below.

const CDN = "https://cdn.jsdelivr.net/gh/wldeh/bible-api/bibles";

export interface Version {
  id: string;
  slug: string;
  label: string;
  credit: string;
}

/** Public-domain / free-use English texts. */
export const VERSIONS: Version[] = [
  { id: "asv", slug: "en-asv", label: "ASV", credit: "American Standard Version · public domain" },
  { id: "kjv", slug: "en-kjv", label: "KJV", credit: "King James Version · public domain" },
  { id: "bsb", slug: "en-bsb", label: "BSB", credit: "Berean Standard Bible · free use" },
];

export const DEFAULT_VERSION = VERSIONS[0];

/** Where your book id differs from the CDN's folder name. */
const SLUG_ALIASES: Record<string, string> = {
  songofsongs: "songofsolomon",
  wisdom: "wisdomofsolomon",
  sirach: "ecclesiasticus",
};

export const cdnSlug = (bookId: string) => SLUG_ALIASES[bookId] ?? bookId;

export interface Verse {
  verse: number;
  text: string;
}

/**
 * One chapter of one translation.
 *
 * Returns [] when the book isn't in that translation — the Apocrypha is absent
 * from ASV, KJV and BSB. Treat an empty array as "not in this translation",
 * not as a failure.
 *
 * On encoding: `res.json()` decodes UTF-8 per spec, so curly quotes and dashes
 * come through intact. Don't pass this text through any re-encoding step.
 */
export async function fetchChapter(
  versionSlug: string,
  bookId: string,
  chapter: number,
): Promise<Verse[]> {
  const url = `${CDN}/${versionSlug}/books/${cdnSlug(bookId)}/chapters/${chapter}.json`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const json = await res.json();
  return (json?.data ?? [])
    .map((v: any) => ({ verse: Number(v.verse), text: String(v.text ?? "").trim() }))
    .filter((v: Verse) => v.text.length > 0)
    .sort((a: Verse, b: Verse) => a.verse - b.verse);
}

/**
 * Step a chapter, clamped to the book and rolling over book boundaries.
 *
 * The counter and the text source must agree on chapter counts — derive the
 * bound from BOOKS (one table) rather than incrementing blindly, or the nav
 * walks past the end and the lookup returns nothing.
 *
 * Returns null at the very start and end of the canon.
 */
export function stepChapter(
  books: { id: string; chapters: number }[],
  bookId: string,
  chapter: number,
  direction: 1 | -1,
): { bookId: string; chapter: number } | null {
  const i = books.findIndex((b) => b.id === bookId);
  if (i === -1) return null;

  const next = chapter + direction;
  if (next < 1) {
    if (i === 0) return null;
    const prev = books[i - 1];
    return { bookId: prev.id, chapter: prev.chapters };
  }
  if (next > books[i].chapters) {
    if (i === books.length - 1) return null;
    return { bookId: books[i + 1].id, chapter: 1 };
  }
  return { bookId, chapter: next };
}
