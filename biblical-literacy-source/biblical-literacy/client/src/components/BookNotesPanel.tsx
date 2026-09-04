import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useBookNotes,
  useCreateOrUpsertNote,
  useDeleteNote,
  useUpdateNote,
} from "@/hooks/useNotes";
import type { BibleNote } from "@shared/schema";
import type { BookEntry } from "@/data/books";
import { ChevronDown, NotebookPen, Trash2, Save, Pencil } from "lucide-react";

type Props = {
  book: BookEntry;
};

function formatWhen(ts: number) {
  const d = new Date(ts);
  return d.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function NoteRow({ note }: { note: BibleNote }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(note.body);
  const update = useUpdateNote();
  const del = useDeleteNote();

  const label = useMemo(() => {
    if (note.scope === "chapter") return `Chapter ${note.chapter}`;
    if (note.scope === "verse") return note.verseRef || "Verse note";
    return "Book note";
  }, [note]);

  return (
    <div
      className="rounded-md border border-border bg-card/60 p-3"
      data-testid={`note-${note.id}`}
    >
      <div className="flex items-center gap-2">
        <Badge
          variant={note.scope === "verse" ? "default" : "secondary"}
          className="text-[10px] font-normal"
        >
          {label}
        </Badge>
        <span className="text-[10px] text-muted-foreground tabular-nums">
          {formatWhen(note.updatedAt)}
        </span>
        <div className="ml-auto flex items-center gap-1">
          {!editing && (
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7"
              onClick={() => {
                setDraft(note.body);
                setEditing(true);
              }}
              data-testid={`button-edit-note-${note.id}`}
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
            data-testid={`button-delete-note-${note.id}`}
            aria-label="Delete note"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
      {editing ? (
        <div className="mt-2 space-y-2">
          <Textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={3}
            data-testid={`textarea-edit-${note.id}`}
          />
          <div className="flex justify-end gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setEditing(false)}
              data-testid={`button-cancel-edit-${note.id}`}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => {
                update.mutate(
                  { id: note.id, body: draft },
                  { onSuccess: () => setEditing(false) },
                );
              }}
              disabled={update.isPending || draft === note.body}
              data-testid={`button-save-edit-${note.id}`}
            >
              <Save className="mr-1 h-3.5 w-3.5" /> Save
            </Button>
          </div>
        </div>
      ) : (
        <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
          {note.body || <span className="italic text-muted-foreground">(empty)</span>}
        </p>
      )}
    </div>
  );
}

export function BookNotesPanel({ book }: Props) {
  const notesQ = useBookNotes(book.id);
  const create = useCreateOrUpsertNote();
  const notes = notesQ.data ?? [];

  const [open, setOpen] = useState(false);
  const [scope, setScope] = useState<"book" | "chapter" | "verse">("chapter");
  const [chapter, setChapter] = useState<number>(1);
  const [verseRef, setVerseRef] = useState<string>("");
  const [body, setBody] = useState<string>("");

  const chapterOptions = useMemo(
    () => Array.from({ length: book.chapters }, (_, i) => i + 1),
    [book.chapters],
  );

  const canSubmit =
    body.trim().length > 0 &&
    (scope !== "verse" || verseRef.trim().length > 0);

  const submit = () => {
    if (!canSubmit) return;
    const payload = {
      bookId: book.id,
      scope,
      chapter: scope === "book" ? null : chapter,
      verseRef: scope === "verse" ? verseRef.trim() : null,
      body: body.trim(),
    };
    create.mutate(payload, {
      onSuccess: () => {
        setBody("");
        if (scope === "verse") setVerseRef("");
      },
    });
  };

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="mt-4">
      <CollapsibleTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-between"
          data-testid={`button-toggle-notes-${book.id}`}
        >
          <span className="flex items-center gap-2">
            <NotebookPen className="h-3.5 w-3.5" />
            My notes
            {notes.length > 0 && (
              <span className="text-[10px] tabular-nums text-muted-foreground">
                ({notes.length})
              </span>
            )}
          </span>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-3 space-y-3">
        {/* Composer */}
        <div className="rounded-md border border-border bg-accent/30 p-3">
          <div className="flex flex-wrap items-center gap-2">
            <Select value={scope} onValueChange={(v) => setScope(v as typeof scope)}>
              <SelectTrigger
                className="h-8 w-[140px] text-xs"
                data-testid={`select-scope-${book.id}`}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="book">Whole book</SelectItem>
                <SelectItem value="chapter">Chapter</SelectItem>
                <SelectItem value="verse">Verse(s)</SelectItem>
              </SelectContent>
            </Select>
            {scope !== "book" && (
              <Select
                value={String(chapter)}
                onValueChange={(v) => setChapter(Number(v))}
              >
                <SelectTrigger
                  className="h-8 w-[110px] text-xs"
                  data-testid={`select-chapter-${book.id}`}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-[240px]">
                  {chapterOptions.map((c) => (
                    <SelectItem key={c} value={String(c)}>
                      Ch. {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {scope === "verse" && (
              <Input
                value={verseRef}
                onChange={(e) => setVerseRef(e.target.value)}
                placeholder='e.g. "1:26–27"'
                className="h-8 max-w-[180px] text-xs"
                data-testid={`input-verseref-${book.id}`}
              />
            )}
            <div className="ml-auto text-[10px] text-muted-foreground">
              {scope === "book" &&
                "One note per book. Saving overwrites the existing book note."}
              {scope === "chapter" &&
                "One note per chapter. Saving overwrites that chapter's note."}
              {scope === "verse" &&
                "Free-form verse reference. Each save adds a new entry."}
            </div>
          </div>
          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder={
              scope === "verse"
                ? "Your reaction to these verses…"
                : scope === "chapter"
                  ? `Notes on ${book.name} ${chapter}…`
                  : `Reactions to ${book.name} as a whole…`
            }
            className="mt-2 min-h-[80px] text-sm"
            data-testid={`textarea-new-${book.id}`}
          />
          <div className="mt-2 flex justify-end">
            <Button
              size="sm"
              onClick={submit}
              disabled={!canSubmit || create.isPending}
              data-testid={`button-save-note-${book.id}`}
            >
              <Save className="mr-1 h-3.5 w-3.5" />
              {create.isPending ? "Saving…" : "Save note"}
            </Button>
          </div>
        </div>

        {/* Existing notes */}
        {notes.length === 0 ? (
          <div className="rounded-md border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
            No notes yet for {book.name}. Add one above.
          </div>
        ) : (
          <div className="space-y-2">
            {notes.map((n) => (
              <NoteRow key={n.id} note={n} />
            ))}
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}
