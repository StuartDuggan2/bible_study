import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { TIMELINE, type Era } from "@/data/timeline";
import { BOOKS } from "@/data/books";
import { AlertTriangle } from "lucide-react";

const ERAS: Era[] = [
  "Primeval & Ancestral",
  "Exodus & Wilderness",
  "Settlement & Judges",
  "United Monarchy",
  "Divided Kingdom",
  "Exile",
  "Persian Period",
  "Hellenistic Period",
  "Roman Period",
  "Early Church",
];

// Era → HSL chart color number for a small colored dot on each card
const ERA_COLOR: Record<Era, string> = {
  "Primeval & Ancestral": "hsl(var(--chart-5))",
  "Exodus & Wilderness": "hsl(var(--chart-2))",
  "Settlement & Judges": "hsl(var(--chart-2))",
  "United Monarchy": "hsl(var(--chart-3))",
  "Divided Kingdom": "hsl(var(--chart-3))",
  Exile: "hsl(var(--chart-4))",
  "Persian Period": "hsl(var(--chart-4))",
  "Hellenistic Period": "hsl(var(--chart-1))",
  "Roman Period": "hsl(var(--chart-1))",
  "Early Church": "hsl(var(--chart-1))",
};

function findBook(id: string) {
  return BOOKS.find((b) => b.id === id);
}

function formatYear(year: number): string {
  if (year < 0) return `${Math.abs(year)} BCE`;
  return `${year} CE`;
}

export default function TimelinePage() {
  const [selectedEras, setSelectedEras] = useState<Set<Era>>(new Set(ERAS));

  const toggleEra = (e: Era) => {
    const next = new Set(selectedEras);
    if (next.has(e)) next.delete(e);
    else next.add(e);
    setSelectedEras(next);
  };

  const events = useMemo(() => {
    return TIMELINE.filter((e) => selectedEras.has(e.era)).sort((a, b) => a.year - b.year);
  }, [selectedEras]);

  return (
    <div className="space-y-6" data-testid="page-timeline">
      <div>
        <div className="mb-1 text-xs font-medium uppercase tracking-widest text-primary">
          Historical timeline
        </div>
        <h1 className="font-serif text-3xl font-semibold text-foreground">
          From Abraham's tents to Roman Asia.
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          The events shaping the world of the Bible. Dates prior to c. 1000 BCE
          are traditional; NOAB flags them as memory rather than history.
        </p>
      </div>

      {/* Era filter chips */}
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant="ghost"
          className="text-xs"
          onClick={() => setSelectedEras(new Set(ERAS))}
          data-testid="button-eras-all"
        >
          All eras
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="text-xs"
          onClick={() => setSelectedEras(new Set())}
          data-testid="button-eras-none"
        >
          Clear
        </Button>
        {ERAS.map((e) => {
          const active = selectedEras.has(e);
          return (
            <button
              key={e}
              onClick={() => toggleEra(e)}
              className={`rounded-full border px-3 py-1 text-xs transition-colors hover-elevate ${
                active
                  ? "border-primary/30 bg-primary/10 text-foreground"
                  : "border-border bg-transparent text-muted-foreground"
              }`}
              data-testid={`chip-era-${e.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
            >
              <span
                className="mr-1.5 inline-block h-2 w-2 rounded-full align-middle"
                style={{ background: ERA_COLOR[e] }}
              />
              {e}
            </button>
          );
        })}
      </div>

      {/* Timeline ribbon */}
      <div className="relative pl-6">
        {/* Vertical spine */}
        <div className="absolute left-2 top-2 h-[calc(100%-1rem)] w-px bg-border" />

        {events.length === 0 && (
          <div className="rounded-md border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            No eras selected.
          </div>
        )}

        <ul className="space-y-4">
          {events.map((ev) => (
            <li key={ev.id} className="relative">
              {/* Dot on spine */}
              <span
                className="absolute -left-[18px] top-4 h-3 w-3 rounded-full ring-2 ring-background"
                style={{ background: ERA_COLOR[ev.era] }}
              />
              <Card data-testid={`card-event-${ev.id}`}>
                <CardContent className="p-4">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <div className="font-serif text-lg font-semibold text-foreground">
                      {ev.title}
                    </div>
                    <div className="text-xs tabular-nums text-primary">{ev.displayDate}</div>
                    <Badge variant="secondary" className="text-[10px] font-normal">
                      {ev.era}
                    </Badge>
                    {ev.isLegendary && (
                      <Badge variant="outline" className="gap-1 text-[10px] font-normal text-muted-foreground">
                        <AlertTriangle className="h-3 w-3" /> Traditional dating
                      </Badge>
                    )}
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/90">
                    {ev.description}
                  </p>
                  {ev.relatedBooks.length > 0 && (
                    <div className="mt-3 flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        Related books
                      </span>
                      {ev.relatedBooks.map((bid) => {
                        const b = findBook(bid);
                        if (!b) return null;
                        return (
                          <Link
                            key={bid}
                            href={`/books#book-${bid}`}
                            data-testid={`link-event-book-${bid}`}
                          >
                            <Badge variant="outline" className="cursor-pointer text-[10px] font-normal hover-elevate">
                              {b.name}
                            </Badge>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      </div>

      <div className="pt-2 text-xs text-muted-foreground">
        Showing {events.length} of {TIMELINE.length} events · dates approximate,
        rounded per the NOAB chronological table.
      </div>
    </div>
  );
}

// Silence unused variable warning if not used
void formatYear;
