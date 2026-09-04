import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "wouter";
import { GLOSSARY, type GlossaryCategory, type GlossaryEntry } from "@/data/glossary";
import { BOOKS } from "@/data/books";
import { Search, BookMarked } from "lucide-react";

const CATEGORIES = Array.from(new Set(GLOSSARY.map((g) => g.category))) as GlossaryCategory[];

function findBook(id: string) {
  return BOOKS.find((b) => b.id === id);
}
function findTerm(id: string) {
  return GLOSSARY.find((g) => g.id === id);
}

function EntryCard({ entry, onJump }: { entry: GlossaryEntry; onJump: (id: string) => void }) {
  return (
    <Card id={`term-${entry.id}`} className="scroll-mt-24" data-testid={`card-term-${entry.id}`}>
      <CardContent className="p-5">
        <div className="flex flex-wrap items-baseline gap-2">
          <h3 className="font-serif text-lg font-semibold text-foreground" data-testid={`text-term-${entry.id}`}>
            {entry.term}
          </h3>
          <Badge variant="secondary" className="text-[10px] font-normal">
            {entry.category}
          </Badge>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-foreground/90">{entry.definition}</p>

        {entry.crossReferences.length > 0 && (
          <div className="mt-3">
            <div className="mb-1 text-[10px] uppercase tracking-wider text-muted-foreground">
              Cross-references in the text
            </div>
            <ul className="space-y-1">
              {entry.crossReferences.map((ref, i) => {
                const book = findBook(ref.bookId);
                if (!book) return null;
                return (
                  <li key={i} className="flex items-baseline gap-2 text-sm">
                    <BookMarked className="h-3 w-3 shrink-0 text-primary" />
                    <span className="text-foreground/90">{ref.label}</span>
                    <Link href={`/books#book-${book.id}`} data-testid={`link-xref-${entry.id}-${i}`}>
                      <span className="cursor-pointer text-xs text-primary underline-offset-2 hover:underline">
                        {book.name}
                        {ref.passage ? ` — ${ref.passage}` : ""}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {entry.seeAlso && entry.seeAlso.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">See also</span>
            {entry.seeAlso.map((id) => {
              const t = findTerm(id);
              if (!t) return null;
              return (
                <button
                  key={id}
                  onClick={() => onJump(id)}
                  data-testid={`button-seealso-${entry.id}-${id}`}
                >
                  <Badge variant="outline" className="cursor-pointer text-[10px] font-normal hover-elevate">
                    {t.term}
                  </Badge>
                </button>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function GlossaryPage() {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [alpha, setAlpha] = useState<string>("all");

  const alphabet = useMemo(() => {
    const letters = Array.from(new Set(GLOSSARY.map((g) => g.term[0].toUpperCase()))).sort();
    return letters;
  }, []);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return GLOSSARY.filter((g) => {
      if (category !== "all" && g.category !== category) return false;
      if (alpha !== "all" && g.term[0].toUpperCase() !== alpha) return false;
      if (!query) return true;
      const hay = `${g.term} ${g.definition} ${g.category}`.toLowerCase();
      return hay.includes(query);
    }).sort((a, b) => a.term.localeCompare(b.term));
  }, [q, category, alpha]);

  const jumpTo = (id: string) => {
    setQ("");
    setCategory("all");
    setAlpha("all");
    setTimeout(() => {
      const el = document.getElementById(`term-${id}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
  };

  return (
    <div className="space-y-6" data-testid="page-glossary">
      <div>
        <div className="mb-1 text-xs font-medium uppercase tracking-widest text-primary">
          Scholarship glossary
        </div>
        <h1 className="font-serif text-3xl font-semibold text-foreground">
          The terms scholars use, defined.
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Documentary Hypothesis, Septuagint, hesed, parousia—every technical
          term in the NOAB introductions and essays, with clear definitions and
          jump links to the biblical books where they appear.
        </p>
      </div>

      {/* Filters */}
      <div className="sticky top-0 z-[5] -mx-2 flex flex-wrap items-center gap-3 rounded-md bg-background/85 px-2 py-2 backdrop-blur">
        <div className="relative min-w-[240px] flex-1">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search terms and definitions…"
            className="pl-9"
            data-testid="input-search-glossary"
          />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-[240px]" data-testid="select-category">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="ml-auto text-xs text-muted-foreground tabular-nums">
          {filtered.length} of {GLOSSARY.length} terms
        </div>
      </div>

      {/* Alphabet strip */}
      <div className="flex flex-wrap items-center gap-1 text-xs">
        <button
          onClick={() => setAlpha("all")}
          className={`rounded px-2 py-1 hover-elevate ${
            alpha === "all" ? "bg-accent text-foreground font-medium" : "text-muted-foreground"
          }`}
          data-testid="button-alpha-all"
        >
          All
        </button>
        {alphabet.map((l) => (
          <button
            key={l}
            onClick={() => setAlpha(l)}
            className={`rounded px-2 py-1 tabular-nums hover-elevate ${
              alpha === l ? "bg-accent text-foreground font-medium" : "text-muted-foreground"
            }`}
            data-testid={`button-alpha-${l}`}
          >
            {l}
          </button>
        ))}
      </div>

      {/* Entries */}
      {filtered.length === 0 && (
        <div className="rounded-md border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          No terms match those filters.{" "}
          <Button
            variant="link"
            size="sm"
            onClick={() => {
              setQ("");
              setCategory("all");
              setAlpha("all");
            }}
          >
            Clear filters
          </Button>
        </div>
      )}
      <div className="grid grid-cols-1 gap-4">
        {filtered.map((entry) => (
          <EntryCard key={entry.id} entry={entry} onJump={jumpTo} />
        ))}
      </div>
    </div>
  );
}
