import { Card, CardContent } from "@/components/ui/card";

/**
 * Biblical Connections — cross-reference map, embedded.
 *
 * The embed currently loads unscoped, so it can't open on a specific passage.
 * If biblicalconnections.org ever supports a query parameter (e.g. ?ref=John+3:16),
 * thread the current passage through here and the map lands in context.
 */
export default function ConnectionsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-primary">
        biblicalconnections.org
      </div>
      <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-foreground">
        Cross-references
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        Every citation, allusion and quotation between books, drawn as a single map.
        Follow a thread to see how a passage is picked up and reused elsewhere in
        the canon.
      </p>

      <Card className="mt-6 overflow-hidden">
        <CardContent className="p-0">
          <iframe
            src="https://biblicalconnections.org/embed/"
            className="block h-[600px] w-full border-0"
            title="Biblical Connections — Bible cross-reference map"
            loading="lazy"
            data-testid="iframe-connections"
          />
        </CardContent>
      </Card>

      <p className="mt-3 text-[11px] text-muted-foreground">
        Embedded from biblicalconnections.org.
      </p>
    </div>
  );
}
