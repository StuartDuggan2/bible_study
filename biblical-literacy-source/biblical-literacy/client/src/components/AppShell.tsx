import { ReactNode, useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { LayoutDashboard, BookOpen, Landmark, GraduationCap, NotebookPen, ScrollText, Network } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const NAV = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/books", label: "Books", icon: BookOpen },
  { href: "/read/genesis/1", label: "Read", icon: ScrollText },
  { href: "/connections", label: "Connections", icon: Network },
  { href: "/timeline", label: "Timeline", icon: Landmark },
  { href: "/glossary", label: "Glossary", icon: GraduationCap },
  { href: "/notes", label: "Notes", icon: NotebookPen },
];

function useDarkMode() {
  const [isDark, setIsDark] = useState<boolean>(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
      : false
  );
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [isDark]);
  return { isDark, toggle: () => setIsDark((v) => !v) };
}

function Logo({ className }: { className?: string }) {
  // Minimal geometric mark: an open codex / open scroll suggesting a page turn.
  return (
    <svg
      aria-label="Biblical Literacy"
      viewBox="0 0 32 32"
      fill="none"
      className={className}
    >
      <path
        d="M4 7 C 4 6, 5 5, 6 5 L 15 5 L 15 27 L 6 27 C 5 27, 4 26, 4 25 Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M28 7 C 28 6, 27 5, 26 5 L 17 5 L 17 27 L 26 27 C 27 27, 28 26, 28 25 Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M16 5 L 16 27" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="16" cy="16" r="1.6" fill="currentColor" />
    </svg>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { isDark, toggle } = useDarkMode();

  return (
    <div
      className="grid h-[100dvh] w-full overflow-hidden bg-background text-foreground"
      style={{ gridTemplateColumns: "auto 1fr", gridTemplateRows: "auto 1fr" }}
    >
      {/* Sidebar */}
      <aside
        className="row-span-2 flex w-64 flex-col border-r border-sidebar-border bg-sidebar"
        style={{ overflowY: "auto", overscrollBehavior: "contain" }}
      >
        <div className="flex items-center gap-3 border-b border-sidebar-border px-5 py-5 text-sidebar-primary">
          <Logo className="h-7 w-7" />
          <div className="leading-tight">
            <div className="font-serif text-base font-semibold text-sidebar-foreground">
              Biblical Literacy
            </div>
            <div className="text-xs text-muted-foreground">NOAB reading companion</div>
          </div>
        </div>

        <nav className="flex flex-col gap-1 p-3">
          {NAV.map((item) => {
            const active = location === item.href || (item.href !== "/" && location.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                data-testid={`link-nav-${item.label.toLowerCase()}`}
                className={cn(
                  "hover-elevate flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/80"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-sidebar-border p-4">
          <div className="rounded-md bg-background/60 p-3 text-xs leading-relaxed text-muted-foreground">
            <div className="mb-1 font-medium text-foreground">Sources</div>
            Summaries and terms distilled from{" "}
            <em>The New Oxford Annotated Bible</em> (5th ed., OUP 2018) and
            standard biblical-studies references.
          </div>
        </div>
      </aside>

      {/* Header */}
      <header className="sticky top-0 z-10 col-start-2 flex items-center justify-between border-b border-border bg-background/85 px-6 py-3 backdrop-blur">
        <div className="text-sm text-muted-foreground">
          A first-time reader's guide, book by book.
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggle}
            aria-label="Toggle theme"
            data-testid="button-toggle-theme"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>
      </header>

      {/* Main scroll region */}
      <main
        className="col-start-2 min-w-0 bg-background"
        style={{ overflowY: "auto", overscrollBehavior: "contain" }}
      >
        <div className="mx-auto max-w-6xl px-6 py-8">{children}</div>
      </main>
    </div>
  );
}
