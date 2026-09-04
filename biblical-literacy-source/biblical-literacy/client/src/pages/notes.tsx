import { useMemo, useState } from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useAllNotes,
  useUpdateNote,
  useDeleteNote,
} from "@/hooks/useNotes";
import type { BibleNote } from "@shared/schema";
import { BOOKS } from "@/data/books";
import { NotebookPen, Search, Trash2, Save, Pencil, ExternalLink } from "lucide-react";

const BOOK_BY_ID = new Map(BOOKS.map((b) => [b.id, b]));

function formatWhen(ts: number) {
  const d = new Date(ts);
  return d.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function scopeLabel(n: BibleNote) {
  if (n.scope === "chapter") return `Chapter ${n.chapter}`;
  if (n.scope === "verse") return n.verseRef || "Verse note";
  return "Book note";
}

function NoteCard({ note }: { note: BibleNote }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(note.body);
  const update = useUpdateNote();
  const del = useDeleteNote();
  const book = BOOK_BY_ID.get(note.bookId);

  return (
    <Card data-testid={`notes-card-${note.id}`}>
      <CardContent className="p-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-baseline gap-2">
            {book ? (
              <Link href={`/books#book-${book.id}`} data-testid={`link-book-${note.id}`}>
                <span className="cursor-pointer font-serif text-base font-semibold text-foreground hover:underline">
                  {book.name}
                </span>
              </Link>
            ) : (
              <span className="font-serif text-base font-semibold text-foreground">
                {note.bookId}
              </span>
            )}
            <Badge
              variant={note.scope === "verse" ? "default" : "secondary"}
              className="text-[10px] font-normal"
            >
              {scopeLabel(note)}
            </Badge>
          </div>
          <span className="text-[10px] tabular-nums text-muted-foreground">
            {formatWhen(note.updatedAt)}
          </span>
          <div className="ml-auto flex items-center gap-1">
            {book && (
              <Link href={`/books#book-${book.id}`} data-testid={`link-jump-${note.id}`}>
                <Button size="icon" variant="ghost" className="h-7 w-7" aria-label="Open in Books">
                  <ExternalLink className="h-3.5 w-3.5" />
                </Button>
              </Link>
            )}
            {!editing && (
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7"
                onClick={() => {
                  setDraft(note.body);
                  setEditing(true);
                }}
                data-testid={`button-edit-${note.id}`}
                aria-label="Edit note"
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
            )}
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 text-muted-foreground hover:text-destructive"
              onClick={() => del.mutate(note.id)}
              data-testid={`button-delete-${note.id}`}
              aria-label="Delete note"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {editing ? (
          <div className="mt-3 space-y-2">
            <Textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={4}
              data-testid={`textarea-edit-${note.id}`}
            />
            <div className="flex justify-end gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setEditing(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() =>
                  update.mutate(
                    { id: note.id, body: draft },
                    { onSuccess: () => setEditing(false) },
                  )
                }
                disabled={update.isPending || draft === note.body}
                data-testid={`button-save-${note.id}`}
              >
                <Save className="mr-1 h-3.5 w-3.5" /> Save
              </Button>
            </div>
          </div>
        ) : (
          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
            {note.body || (
              <span className="italic text-muted-foreground">(empty)</span>
            )}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export default function NotesPage() {
  const notesQ = useAllNotes();
  const notes = notesQ.data ?? [];

  const [q, setQ] = useState("");
  const [scope, setScope] = useState<string>("all");
  const [bookFilter, setBookFilter] = useState<string>("all");

  // Books that actually have notes (for the dropdown)
  const booksWithNotes = useMemo(() => {
    const ids = new Set(notes.map((n) => n.bookId));
    return BOOKS.filter((b) => ids.has(b.id));
  }, [notes]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return notes.filter((n) => {
      if (scope !== "all" && n.scope !== scope) return false;
      if (bookFilter !== "all" && n.bookId !== bookFilter) return false;
      if (!query) return true;
      const book = BOOK_BY_ID.get(n.bookId);
      const hay = `${n.body} ${scopeLabel(n)} ${book?.name ?? ""}`.toLowerCase();
      return hay.includes(query);
    });
  }, [notes, q, scope, bookFilter]);

  // Group by book, preserving updatedAt-desc order within each group.
  const groups = useMemo(() => {
    const byBook = new Map<string, BibleNote[]>();
    for (const n of filtered) {
      const arr = byBook.get(n.bookId) ?? [];
      arr.push(n);
      byBook.set(n.bookId, arr);
    }
    // Order groups by the most recent note in each
    const entries = Array.from(byBook.entries()).sort((a, b) => {
      const aTop = Math.max(...a[1].map((n) => n.updatedAt));
      const bTop = Math.max(...b[1].map((n) => n.updatedAt));
      return bTop - aTop;
    });
    return entries;
  }, [filtered]);

  const counts = useMemo(() => {
    return {
      total: notes.length,
      book: notes.filter((n) => n.scope === "book").length,
      chapter: notes.filter((n) => n.scope === "chapter").length,
      verse: notes.filter((n) => n.scope === "verse").length,
    };
  }, [notes]);

  return (
    <div className="space-y-6" data-testid="page-notes">
      <div>
        <div className="mb-1 text-xs font-medium uppercase tracking-widest text-primary">
          My notes
        </div>
        <h1 className="font-serif text-3xl font-semibold text-foreground">
          Your commonplace book.
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Every note you've written across books, chapters, and verses — search,
          filter, and jump back to the passage.
        </p>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Total", value: counts.total },
          { label: "Book-level", value: counts.book },
          { label: "Chapter-level", value: counts.chapter },
          { label: "Verse-level", value: counts.verse },
        ].map((k) => (
          <div
            key={k.label}
            className="rounded-md border border-border bg-card/70 px-3 py-2"
          >
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
              {k.label}
            </div>
            <div className="mt-0.5 font-serif text-2xl font-semibold tabular-nums text-foreground">
              {k.value}
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="sticky top-0 z-[5] -mx-2 flex flex-wrap items-center gap-3 rounded-md bg-background/85 px-2 py-2 backdrop-blur">
        <div className="relative min-w-[240px] flex-1">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search note content, book, verse…"
            className="pl-9"
            data-testid="input-search-notes"
          />
        </div>
        <Select value={scope} onValueChange={setScope}>
          <SelectTrigger className="w-[160px]" data-testid="select-scope">
            <SelectValue placeholder="Scope" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All scopes</SelectItem>
            <SelectItem value="book">Book</SelectItem>
            <SelectItem value="chapter">Chapter</SelectItem>
            <SelectItem value="verse">Verse</SelectItem>
          </SelectContent>
        </Select>
        <Select value={bookFilter} onValueChange={setBookFilter}>
          <SelectTrigger className="w-[220px]" data-testid="select-book">
            <SelectValue placeholder="Book" />
          </SelectTrigger>
          <SelectContent className="max-h-[280px]">
            <SelectItem value="all">All books</SelectItem>
            {booksWithNotes.map((b) => (
              <SelectItem key={b.id} value={b.id}>
                {b.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="ml-auto text-xs text-muted-foreground tabular-nums">
          {filtered.length} of {notes.length} notes
        </div>
      </div>

      {/* Empty state */}
      {notes.length === 0 && (
        <div className="rounded-md border border-dashed border-border p-10 text-center">
          <NotebookPen className="mx-auto mb-3 h-6 w-6 text-muted-foreground" />
          <div className="font-serif text-lg text-foreground">
            No notes yet.
          </div>
          <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
            Open any book and click "My notes" to add reactions at the book,
            chapter, or verse level.
          </p>
          <Link href="/books">
            <Button variant="outline" size="sm" className="mt-4" data-testid="button-go-to-books">
              Browse the library
            </Button>
          </Link>
        </div>
      )}

      {notes.length > 0 && filtered.length === 0 && (
        <div className="rounded-md border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          No notes match those filters.{" "}
          <Button
            variant="link"
            size="sm"
            onClick={() => {
              setQ("");
              setScope("all");
              setBookFilter("all");
            }}
          >
            Clear filters
          </Button>
        </div>
      )}

      {/* Grouped by book */}
      {groups.map(([bookId, list]) => {
        const b = BOOK_BY_ID.get(bookId);
        return (
          <section key={bookId}>
            <h2 className="mb-3 flex items-center gap-2 font-serif text-lg font-semibold text-foreground">
              {b?.name ?? bookId}
              <span className="text-xs font-normal text-muted-foreground tabular-nums">
                ({list.length})
              </span>
              {b && (
                <Link href={`/books#book-${b.id}`}>
                  <Button variant="ghost" size="sm" className="h-6 gap-1 text-xs">
                    Open <ExternalLink className="h-3 w-3" />
                  </Button>
                </Link>
              )}
            </h2>
            <div className="grid grid-cols-1 gap-3">
              {list.map((n) => (
                <NoteCard key={n.id} note={n} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
