import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BOOKS, type BookEntry, type Testament } from "@/data/books";
import { useProgressMap, useUpsertProgress } from "@/hooks/useProgress";
import { BookNotesPanel } from "@/components/BookNotesPanel";
import { Minus, Plus, Search } from "lucide-react";

const TESTAMENT_ORDER: Testament[] = ["Hebrew Bible", "New Testament", "Apocrypha"];
const GENRES = Array.from(new Set(BOOKS.map((b) => b.genre)));

function BookCard({ book }: { book: BookEntry }) {
  const { map } = useProgressMap();
  const upsert = useUpsertProgress();
  const progress = map.get(book.id);
  const chaptersRead = progress?.chaptersRead ?? 0;
  const completed = progress?.completed ?? false;
  const pct = Math.round((chaptersRead / book.chapters) * 100);

  const updateChapters = (delta: number) => {
    const next = Math.max(0, Math.min(book.chapters, chaptersRead + delta));
    upsert.mutate({
      bookId: book.id,
      chaptersRead: next,
      completed: next >= book.chapters,
      notes: progress?.notes ?? "",
    });
  };

  const toggleComplete = (val: boolean) => {
    upsert.mutate({
      bookId: book.id,
      chaptersRead: val ? book.chapters : chaptersRead,
      completed: val,
      notes: progress?.notes ?? "",
    });
  };

  return (
    <Card id={`book-${book.id}`} className="scroll-mt-24" data-testid={`card-book-${book.id}`}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-serif text-xl font-semibold text-foreground" data-testid={`text-bookname-${book.id}`}>
                {book.name}
              </h3>
              <Badge variant="secondary" className="text-[10px] font-normal">{book.genre}</Badge>
              <Badge variant="outline" className="text-[10px] font-normal tabular-nums">
                {book.chapters} ch.
              </Badge>
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              <span className="font-medium text-foreground/80">Authorship.</span>{" "}
              {book.authorship}
            </div>
            <div className="mt-0.5 text-xs text-muted-foreground">
              <span className="font-medium text-foreground/80">Date.</span> {book.dateComposed}
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={completed}
                onCheckedChange={(v) => toggleComplete(Boolean(v))}
                id={`check-${book.id}`}
                data-testid={`checkbox-complete-${book.id}`}
              />
              <label htmlFor={`check-${book.id}`} className="text-xs text-muted-foreground">
                Finished
              </label>
            </div>
          </div>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-foreground/90">{book.summary}</p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {book.themes.map((t) => (
            <Badge key={t} variant="outline" className="text-[10px] font-normal">
              {t}
            </Badge>
          ))}
        </div>

        <div className="mt-4 rounded-md border-l-2 border-primary/70 bg-accent/40 px-3 py-2 text-xs text-foreground/90">
          <span className="font-medium">Reading tip.</span> {book.readingTip}
        </div>

        {/* Chapter tracker */}
        <div className="mt-4 flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline justify-between text-xs">
              <span className="text-muted-foreground">Chapters read</span>
              <span className="tabular-nums text-foreground/80" data-testid={`text-chapters-${book.id}`}>
                {chaptersRead} / {book.chapters} ({pct}%)
              </span>
            </div>
            <Progress value={pct} className="mt-2 h-1.5" />
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => updateChapters(-1)}
              disabled={chaptersRead === 0}
              data-testid={`button-dec-${book.id}`}
            >
              <Minus className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => updateChapters(+1)}
              disabled={chaptersRead >= book.chapters}
              data-testid={`button-inc-${book.id}`}
            >
              <Plus className="h-3.5 w-3.5" />
            </Button>
            <Button variant="outline" size="sm" asChild>
  <a href={`/#/read/${book.id}/1`}>Read</a>
</Button>
          </div>
        </div>

        <BookNotesPanel book={book} />
      </CardContent>
    </Card>
  );
}

export default function BooksPage() {
  const [q, setQ] = useState("");
  const [testament, setTestament] = useState<string>("all");
  const [genre, setGenre] = useState<string>("all");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return BOOKS.filter((b) => {
      if (testament !== "all" && b.testament !== testament) return false;
      if (genre !== "all" && b.genre !== genre) return false;
      if (!query) return true;
      const hay = `${b.name} ${b.summary} ${b.themes.join(" ")} ${b.authorship}`.toLowerCase();
      return hay.includes(query);
    });
  }, [q, testament, genre]);

  // Group by testament for display
  const groups = TESTAMENT_ORDER.map((t) => ({
    testament: t,
    books: filtered.filter((b) => b.testament === t),
  })).filter((g) => g.books.length > 0);

  // If URL contains #book-... on mount, scroll into view
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes("#book-")) {
      const id = hash.split("#book-")[1]?.split("?")[0];
      if (id) {
        const el = document.getElementById(`book-${id}`);
        if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
      }
    }
  }, []);

  return (
    <div className="space-y-6" data-testid="page-books">
      <div>
        <div className="mb-1 text-xs font-medium uppercase tracking-widest text-primary">
          Book-by-book summaries
        </div>
        <h1 className="font-serif text-3xl font-semibold text-foreground">The library, opened.</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Thematic summaries synthesized from the NOAB introductions, with
          authorship, dating, and a first-time reader's tip for each book.
        </p>
      </div>

      {/* Filters */}
      <div className="sticky top-0 z-[5] -mx-2 flex flex-wrap items-center gap-3 rounded-md bg-background/85 px-2 py-2 backdrop-blur">
        <div className="relative min-w-[240px] flex-1">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search books, themes, authorship…"
            className="pl-9"
            data-testid="input-search-books"
          />
        </div>
        <Select value={testament} onValueChange={setTestament}>
          <SelectTrigger className="w-[180px]" data-testid="select-testament">
            <SelectValue placeholder="Testament" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All sections</SelectItem>
            {TESTAMENT_ORDER.map((t) => (
              <SelectItem key={t} value={t}>{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={genre} onValueChange={setGenre}>
          <SelectTrigger className="w-[200px]" data-testid="select-genre">
            <SelectValue placeholder="Genre" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All genres</SelectItem>
            {GENRES.map((g) => (
              <SelectItem key={g} value={g}>{g}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="ml-auto text-xs text-muted-foreground tabular-nums">
          {filtered.length} of {BOOKS.length} books
        </div>
      </div>

      {/* Groups */}
      {groups.length === 0 && (
        <div className="rounded-md border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          No books match those filters.
        </div>
      )}
      {groups.map((g) => (
        <section key={g.testament}>
          <h2 className="mb-3 flex items-center gap-2 font-serif text-lg font-semibold text-foreground">
            {g.testament}
            <span className="text-xs font-normal text-muted-foreground tabular-nums">
              ({g.books.length})
            </span>
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {g.books.map((b) => (
              <BookCard key={b.id} book={b} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
