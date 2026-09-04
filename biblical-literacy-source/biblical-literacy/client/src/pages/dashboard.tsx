import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { BOOKS, type Testament } from "@/data/books";
import { useProgressMap, useResetProgress } from "@/hooks/useProgress";
import { Link } from "wouter";
import { ArrowRight, RotateCcw, BookOpen, ScrollText, Landmark, NotebookPen } from "lucide-react";

const TESTAMENTS: Testament[] = ["Hebrew Bible", "New Testament", "Apocrypha"];

function testamentStats(testament: Testament, map: Map<string, { chaptersRead: number; completed: boolean }>) {
  const books = BOOKS.filter((b) => b.testament === testament);
  const totalChapters = books.reduce((a, b) => a + b.chapters, 0);
  const chaptersRead = books.reduce((a, b) => a + (map.get(b.id)?.chaptersRead ?? 0), 0);
  const booksCompleted = books.filter((b) => map.get(b.id)?.completed).length;
  return {
    books: books.length,
    booksCompleted,
    totalChapters,
    chaptersRead,
    pct: totalChapters === 0 ? 0 : Math.round((chaptersRead / totalChapters) * 100),
  };
}

export default function Dashboard() {
  const { map, isLoading } = useProgressMap();
  const reset = useResetProgress();

  const totalChapters = BOOKS.reduce((a, b) => a + b.chapters, 0);
  const chaptersRead = BOOKS.reduce((a, b) => a + (map.get(b.id)?.chaptersRead ?? 0), 0);
  const booksCompleted = BOOKS.filter((b) => map.get(b.id)?.completed).length;
  const overallPct = totalChapters === 0 ? 0 : Math.round((chaptersRead / totalChapters) * 100);

  // Suggested next book: first not-yet-completed in canonical order
  const nextBook = BOOKS.find((b) => !map.get(b.id)?.completed && (map.get(b.id)?.chaptersRead ?? 0) < b.chapters);

  // Currently reading = has some but not all chapters read
  const inProgress = BOOKS.filter((b) => {
    const p = map.get(b.id);
    if (!p) return false;
    return p.chaptersRead > 0 && !p.completed;
  }).slice(0, 5);

  return (
    <div className="space-y-8" data-testid="page-dashboard">
      {/* Hero */}
      <section>
        <div className="mb-1 text-xs font-medium uppercase tracking-widest text-primary">
          Reading tracker
        </div>
        <h1 className="font-serif text-3xl font-semibold leading-tight text-foreground md:text-4xl">
          Your first read through the annotated Bible.
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Track chapters as you go, follow the historical arc, and keep a
          scholarly glossary within reach. Progress is saved to this workspace.
        </p>
      </section>

      {/* Overall KPIs */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Overall progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="font-serif text-3xl font-semibold tabular-nums text-foreground" data-testid="text-overall-pct">
                {overallPct}%
              </div>
              <div className="text-xs text-muted-foreground tabular-nums">
                {chaptersRead} / {totalChapters} ch.
              </div>
            </div>
            <Progress value={overallPct} className="mt-3 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Books finished
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="font-serif text-3xl font-semibold tabular-nums text-foreground" data-testid="text-books-completed">
                {booksCompleted}
              </div>
              <div className="text-xs text-muted-foreground tabular-nums">of {BOOKS.length}</div>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {TESTAMENTS.map((t) => {
                const s = testamentStats(t, map);
                return (
                  <Badge key={t} variant="secondary" className="text-[10px] font-normal">
                    {t.split(" ")[0]}: {s.booksCompleted}/{s.books}
                  </Badge>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Currently reading
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-serif text-3xl font-semibold tabular-nums text-foreground">
              {inProgress.length}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              {inProgress.length === 0 ? "Nothing in flight" : "Books in flight"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Suggested next
            </CardTitle>
          </CardHeader>
          <CardContent>
            {nextBook ? (
              <>
                <div className="truncate font-serif text-xl font-semibold text-foreground" data-testid="text-next-book">
                  {nextBook.name}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">{nextBook.genre}</div>
                <Link href={`/books#book-${nextBook.id}`}>
                  <Button size="sm" variant="secondary" className="mt-3 gap-1" data-testid="button-open-next">
                    Open <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </>
            ) : (
              <div className="text-sm text-muted-foreground">You've read everything. Extraordinary.</div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Testament breakdown */}
      <section>
        <h2 className="mb-3 font-serif text-xl font-semibold text-foreground">Progress by section</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {TESTAMENTS.map((t) => {
            const s = testamentStats(t, map);
            return (
              <Card key={t} data-testid={`card-testament-${t.toLowerCase().replace(/ /g, "-")}`}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-foreground">{t}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline justify-between">
                    <div className="tabular-nums text-2xl font-serif font-semibold text-foreground">
                      {s.pct}%
                    </div>
                    <div className="text-xs text-muted-foreground tabular-nums">
                      {s.chaptersRead} / {s.totalChapters} ch. · {s.booksCompleted}/{s.books} books
                    </div>
                  </div>
                  <Progress value={s.pct} className="mt-3 h-2" />
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* In-progress list */}
      {inProgress.length > 0 && (
        <section>
          <h2 className="mb-3 font-serif text-xl font-semibold text-foreground">In progress</h2>
          <div className="rounded-lg border border-border">
            {inProgress.map((b, i) => {
              const p = map.get(b.id);
              const pct = Math.round(((p?.chaptersRead ?? 0) / b.chapters) * 100);
              return (
                <Link
                  key={b.id}
                  href={`/books#book-${b.id}`}
                  className={`flex items-center justify-between gap-4 p-4 hover-elevate ${i > 0 ? "border-t border-border" : ""}`}
                  data-testid={`row-inprogress-${b.id}`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-foreground">{b.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {b.testament} · {b.genre}
                    </div>
                  </div>
                  <div className="w-40">
                    <Progress value={pct} className="h-1.5" />
                    <div className="mt-1 text-right text-[10px] text-muted-foreground tabular-nums">
                      {p?.chaptersRead ?? 0}/{b.chapters}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Modules */}
      <section>
        <h2 className="mb-3 font-serif text-xl font-semibold text-foreground">Explore the dashboard</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Link href="/books">
            <Card className="hover-elevate h-full cursor-pointer">
              <CardContent className="flex flex-col gap-3 p-5">
                <BookOpen className="h-5 w-5 text-primary" />
                <div className="font-serif text-lg font-semibold">Book summaries</div>
                <div className="text-xs leading-relaxed text-muted-foreground">
                  Every book of the canon plus the Apocrypha, with authorship,
                  date, themes, and a NOAB-flavored reading tip.
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/timeline">
            <Card className="hover-elevate h-full cursor-pointer">
              <CardContent className="flex flex-col gap-3 p-5">
                <Landmark className="h-5 w-5 text-primary" />
                <div className="font-serif text-lg font-semibold">Historical timeline</div>
                <div className="text-xs leading-relaxed text-muted-foreground">
                  From the ancestral traditions to Rome, filterable by era and
                  linked back to the relevant biblical books.
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/glossary">
            <Card className="hover-elevate h-full cursor-pointer">
              <CardContent className="flex flex-col gap-3 p-5">
                <ScrollText className="h-5 w-5 text-primary" />
                <div className="font-serif text-lg font-semibold">Scholarship glossary</div>
                <div className="text-xs leading-relaxed text-muted-foreground">
                  Documentary Hypothesis, Septuagint, hesed, parousia... search
                  and jump to their usage across the text.
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/notes">
            <Card className="hover-elevate h-full cursor-pointer">
              <CardContent className="flex flex-col gap-3 p-5">
                <NotebookPen className="h-5 w-5 text-primary" />
                <div className="font-serif text-lg font-semibold">My notes</div>
                <div className="text-xs leading-relaxed text-muted-foreground">
                  A commonplace book of your reactions at book, chapter, and
                  verse level — searchable and jumpable back to the text.
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>

      {/* Reset */}
      <section className="flex justify-end pt-4">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground" data-testid="button-reset-progress">
              <RotateCcw className="mr-1 h-3 w-3" />
              Reset all progress
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reset your reading progress?</AlertDialogTitle>
              <AlertDialogDescription>
                This clears every chapter count and completion mark. Book
                summaries, timeline, and glossary content stay the same.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => reset.mutate()}
                data-testid="button-confirm-reset"
              >
                Reset progress
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        {isLoading && <span className="ml-3 self-center text-xs text-muted-foreground">Loading…</span>}
      </section>
    </div>
  );
}
