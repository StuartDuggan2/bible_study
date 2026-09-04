import { Switch, Route, Router } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import BooksPage from "@/pages/books";
import TimelinePage from "@/pages/timeline";
import GlossaryPage from "@/pages/glossary";
import NotesPage from "@/pages/notes";
import { AppShell } from "@/components/AppShell";

function AppRouter() {
  return (
    <AppShell>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/books" component={BooksPage} />
        <Route path="/timeline" component={TimelinePage} />
        <Route path="/glossary" component={GlossaryPage} />
        <Route path="/notes" component={NotesPage} />
        <Route component={NotFound} />
      </Switch>
    </AppShell>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router hook={useHashLocation}>
          <AppRouter />
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
