import "./style.css";

import { ExternalLink, Link2, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { fetch } from "void/client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type LinkRow = {
  id: number;
  title: string;
  url: string | null;
  note: string | null;
  createdAt: string;
};

export default function LinksBoardPage() {
  const [links, setLinks] = useState<LinkRow[]>([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadLinks = useCallback(async () => {
    const data = await fetch("/api/links");
    setLinks(data.links);
  }, []);

  useEffect(() => {
    void loadLinks().catch((err: unknown) => {
      setError(err instanceof Error ? err.message : "Failed to load links");
    });
  }, [loadLinks]);

  async function handleAdd(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await fetch("/api/links", {
        method: "POST",
        body: { title, url: url || undefined, note: note || undefined },
      });
      setTitle("");
      setUrl("");
      setNote("");
      await loadLinks();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to add link");
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(id: number) {
    setError(null);
    setBusy(true);
    try {
      await fetch(`/api/links/${id}`, { method: "DELETE" });
      await loadLinks();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to delete");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <div className="mx-auto flex max-w-2xl flex-col gap-8 px-4 py-10">
        <header className="space-y-2">
          <div className="flex items-center gap-2 text-primary">
            <Link2 className="size-6" aria-hidden />
            <p className="text-sm font-medium tracking-wide uppercase">
              Void demo
            </p>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">Links board</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Typed Hono API routes, D1/SQLite via{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">void/db</code>
            , and a React page calling them with{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">
              void/client
            </code>
            .
          </p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Add link or note</CardTitle>
            <CardDescription>
              POST /api/links — title required; URL and note optional.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="flex flex-col gap-3" onSubmit={handleAdd}>
              <Input
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                maxLength={200}
                disabled={busy}
              />
              <Input
                placeholder="https://… (optional)"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={busy}
              />
              <Textarea
                placeholder="Note (optional)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                disabled={busy}
              />
              <Button type="submit" disabled={busy || !title.trim()}>
                Save
              </Button>
            </form>
          </CardContent>
        </Card>

        {error ? (
          <p className="text-destructive text-sm" role="alert">
            {error}
          </p>
        ) : null}

        <section className="space-y-3" aria-labelledby="links-heading">
          <h2 id="links-heading" className="text-lg font-medium">
            Saved ({links.length})
          </h2>
          {links.length === 0 ? (
            <p className="text-muted-foreground text-sm">Nothing here yet.</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {links.map((item) => (
                <li key={item.id}>
                  <Card>
                    <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 pb-2">
                      <div className="min-w-0 space-y-1">
                        <CardTitle className="truncate text-base">
                          {item.title}
                        </CardTitle>
                        <CardDescription className="text-xs">
                          {item.createdAt}
                        </CardDescription>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        aria-label={`Delete ${item.title}`}
                        disabled={busy}
                        onClick={() => void handleDelete(item.id)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      {item.url ? (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary inline-flex items-center gap-1 hover:underline"
                        >
                          {item.url}
                          <ExternalLink className="size-3.5" aria-hidden />
                        </a>
                      ) : null}
                      {item.note ? (
                        <p className="text-muted-foreground whitespace-pre-wrap">
                          {item.note}
                        </p>
                      ) : null}
                    </CardContent>
                  </Card>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
