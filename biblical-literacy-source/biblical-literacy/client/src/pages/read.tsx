import { useEffect, useMemo, useState } from "react";
import { useParams, useLocation, Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BOOKS } from "@/data/books";
import { VERSIONS, DEFAULT_VERSION, stepChapter } from "@/lib/scripture";
import { useChapter } from "@/hooks/useChapter";
import { useProgressMap, useUpsertProgress } from "@/hooks/useProgress";
import { useCreateOrUpsertNote } from "@/hooks/useNotes";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, ChevronRight, Check, X, Network } from "lucide-react";

const STORAGE_KEY = "bl:reader:version";

export default function ReadPage() {
  const params = useParams<{ bookId?: string; chapter?: string }>();
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const bookId = params.bookId ?? "genesis";
  const chapter = Math.max(1, Number(params.chapter ?? 1) || 1);
  const book = useMemo(() => BOOKS.find((b) => b.id === bookId), [bookId]);

  const [versionId, setVersionId] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) ?? DEFAULT_VERSION.id;
  });
  const version = VERSIONS.find((v) => v.id === versionId) ?? DEFAULT_VERSION;
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, versionId);
  }, [versionId]);

  const [selected, setSelected] = useState<number[]>([]);
  const [draft, setDraft] = useState("");

  // Clear the selection whenever the passage changes.
  useEffect(() => {
    setSelected([]);
    setDraft("");
  }, [bookId, chapter, versionId]);

  const { data: verses, isLoading, isError } = useChapter(version.slug, bookId, chapter);
  const { map } = useProgressMap();
  const upsertProgress = useUpsertProgress();
  const createNote = useCreateOrUpsertNote();

  const progress = book ? map.get(book.id) : undefined;
  const chaptersRead = progress?.chaptersRead ?? 0;
  const isRead = chaptersRead >= chapter;

  const go = (direction: 1 | -1) => {
    const next = stepChapter(BOOKS, bookId, chapter, direction);
    if (!next) return;
    navigate(`/read/${next.bookId}/${next.chapter}`);
  };

  const toggleVerse = (n: number) =>
    setSelected((prev) =>
      prev.includes(n) ? prev.filter((v) => v !== n) : [...prev, n].sort((a, b) => a - b),
    );

  const selectionLabel = () => {
    if (!book || selected.length === 0) return "";
    const range =
      selected.length > 1 ? `${selected[0]}-${selected[selected.length - 1]}` : `${selected[0]}`;
    return `${book.name} ${chapter}:${range}`;
  };

  const markRead = () => {
    if (!book) return;
    upsertProgress.mutate({
      bookId: book.id,
      chaptersRead: Math.max(chaptersRead, chapter),
      completed: Math.max(chaptersRead, chapter) >= book.chapters,
      notes: progress?.notes ?? "",
    });
  };

  const saveNote = () => {
    if (!book || !draft.trim()) return;
    createNote.mutate(
      {
        bookId: book.id,
        scope: "verse",
        chapter: null,
        verseRef: selectionLabel(),
        body: draft.trim(),
      },
      {
        onSuccess: () => {
          toast({ title: "Note saved", description: selectionLabel() });
          setSelected([]);
          setDraft("");
        },
      },
    );
  };

  if (!book) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <p className="text-sm text-muted-foreground">
          Unknown book. <Link href="/books" className="underline">Back to books</Link>
        </p>
      </div>
    );
  }

  const notInVersion = !isLoading && !isError && (verses?.length ?? 0) === 0;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-primary">
            {book.testament} · {book.genre}
          </div>
          <h1
            className="mt-2 font-serif text-3xl font-semibold tracking-tight text-foreground"
            data-testid="text-passage-title"
          >
            {book.name} {chapter}
          </h1>
          <div className="mt-1 text-xs tabular-nums text-muted-foreground">
            Chapter {chapter} of {book.chapters}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Select value={versionId} onValueChange={setVersionId}>
            <SelectTrigger className="h-9 w-[110px]" data-testid="select-version">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {VERSIONS.map((v) => (
                <SelectItem key={v.id} value={v.id}>
                  {v.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9"
            onClick={() => go(-1)}
            data-testid="button-prev-chapter"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9"
            onClick={() => go(1)}
            data-testid="button-next-chapter"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Passage */}
      <Card className="mt-6">
        <CardContent className="p-6">
          {isLoading && (
            <div className="space-y-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-5 w-full" />
              ))}
            </div>
          )}

          {isError && (
            <p className="text-sm text-muted-foreground">
              Couldn't reach the text source. Check your connection and try again.
            </p>
          )}

          {notInVersion && (
            <div className="rounded-md border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
              {book.name} isn't included in {version.label}.
              {book.testament === "Apocrypha" && (
                <span className="mt-1 block text-xs">
                  The Apocrypha is absent from these public-domain translations.
                </span>
              )}
            </div>
          )}

          {!isLoading && !notInVersion && (
            <div className="space-y-0.5">
              {verses?.map((v) => {
                const on = selected.includes(v.verse);
                return (
                  <button
                    key={v.verse}
                    onClick={() => toggleVerse(v.verse)}
                    className={`flex w-full gap-3 rounded-md px-2 py-1.5 text-left transition-colors ${
                      on ? "bg-accent ring-1 ring-primary/40" : "hover:bg-accent/50"
                    }`}
                    data-testid={`verse-${v.verse}`}
                  >
                    <span
                      className={`w-6 shrink-0 pt-1 text-right text-[11px] font-medium tabular-nums ${
                        on ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      {v.verse}
                    </span>
                    <span className="font-serif text-[17px] leading-relaxed text-foreground">
                      {v.text}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          <p className="mt-6 border-t border-border pt-4 text-[11px] text-muted-foreground">
            {version.credit} · via wldeh/bible-api
          </p>
        </CardContent>
      </Card>

      {/* Selection → note */}
      {selected.length > 0 && (
        <Card className="mt-4 border-primary/40">
          <CardContent className="p-5">
            <div className="flex items-center justify-between gap-3">
              <Badge variant="secondary" className="font-normal tabular-nums">
                {selectionLabel()}
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => setSelected([])}
                data-testid="button-clear-selection"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
            <Textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="What do you notice?"
              className="mt-3 min-h-[100px]"
              data-testid="input-verse-note"
            />
            <div className="mt-3 flex items-center gap-2">
              <Button
                size="sm"
                onClick={saveNote}
                disabled={!draft.trim() || createNote.isPending}
                data-testid="button-save-verse-note"
              >
                Save note
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a
                  href="/#/connections"
                  data-testid="link-connections-from-selection"
                >
                  <Network className="mr-1.5 h-3.5 w-3.5" />
                  Cross-references
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Footer actions */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <Button
          variant={isRead ? "secondary" : "default"}
          size="sm"
          onClick={markRead}
          disabled={isRead || upsertProgress.isPending}
          data-testid="button-mark-chapter-read"
        >
          <Check className="mr-1.5 h-3.5 w-3.5" />
          {isRead ? "Chapter recorded" : "Mark chapter read"}
        </Button>
        <div className="text-xs tabular-nums text-muted-foreground">
          {chaptersRead} / {book.chapters} chapters read
        </div>
      </div>
    </div>
  );
}
