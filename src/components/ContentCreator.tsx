import { useState } from "react";

import { CONTENT_TYPE_OPTIONS, generateDraft, type ContentType, type GeneratedDraft } from "@/utils/contentGenerator";

type StatusKind = "success" | "error";
interface StatusMessage {
  kind: StatusKind;
  text: string;
}

const STATUS_COLORS: Record<StatusKind, string> = {
  success: "text-success",
  error: "text-destructive",
};

const generateButtonClass =
  "inline-flex min-h-10 items-center justify-center rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90";

const copyButtonClass =
  "inline-flex min-h-9 items-center rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent";

const inputClass =
  "mt-2 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground";

function ContentCreator() {
  const [topic, setTopic] = useState("");
  const [contentType, setContentType] = useState<ContentType>("blog");
  const [draft, setDraft] = useState<GeneratedDraft | null>(null);
  const [status, setStatus] = useState<StatusMessage | null>(null);
  const [hasCopied, setHasCopied] = useState(false);

  function handleGenerate() {
    const trimmedTopic = topic.trim();

    // Validation: the topic must not be empty.
    if (!trimmedTopic) {
      setStatus({
        kind: "error",
        text: "Please describe what you would like to create before generating a draft.",
      });
      return;
    }

    const nextDraft = generateDraft(trimmedTopic, contentType);
    setDraft(nextDraft);
    setHasCopied(false);
    const selectedLabel =
      CONTENT_TYPE_OPTIONS.find((option) => option.value === contentType)?.label ?? "content";
    setStatus({
      kind: "success",
      text: `Your ${selectedLabel.toLowerCase()} draft is ready below. Edit it freely, then copy it.`,
    });
  }

  async function handleCopy() {
    if (!draft) {
      return;
    }
    try {
      await navigator.clipboard.writeText(draft.body);
      setHasCopied(true);
      setStatus({ kind: "success", text: "Draft copied to the clipboard." });
    } catch {
      setStatus({
        kind: "error",
        text: "Copying failed in this browser. Select the draft text and copy it manually.",
      });
    }
  }

  return (
    <section
      id="create"
      aria-labelledby="create-heading"
      className="scroll-mt-24 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6"
    >
      <h2 id="create-heading" className="text-lg font-semibold">
        Content Creation
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Describe your idea and get a structured starting draft you can edit and copy. Drafts are
        built locally in your browser — no AI model is involved.
      </p>

      <div className="mt-4 grid gap-4">
        <div>
          <label htmlFor="create-topic" className="text-sm font-medium">
            What would you like to create?
          </label>
          <textarea
            id="create-topic"
            value={topic}
            onChange={(event) => setTopic(event.target.value)}
            rows={4}
            placeholder="e.g. Tips for first-year computer science students"
            className={`${inputClass} resize-y leading-relaxed`}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <label htmlFor="create-type" className="text-sm font-medium">
              Content type
            </label>
            <select
              id="create-type"
              value={contentType}
              onChange={(event) => setContentType(event.target.value as ContentType)}
              className={inputClass}
            >
              {CONTENT_TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <button type="button" onClick={handleGenerate} className={generateButtonClass}>
            Generate Draft
          </button>
        </div>

        {status && (
          <p role="status" className={`text-sm font-medium ${STATUS_COLORS[status.kind]}`}>
            {status.text}
          </p>
        )}

        {draft && (
          <div className="grid gap-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-sm font-medium">Your draft (editable)</h3>
              <button type="button" onClick={handleCopy} className={copyButtonClass}>
                {hasCopied ? "Copied" : "Copy draft"}
              </button>
            </div>
            <textarea
              aria-label="Generated draft, editable"
              value={draft.body}
              onChange={(event) => setDraft({ ...draft, body: event.target.value })}
              rows={16}
              className="w-full rounded-lg border border-input bg-background p-3 text-sm leading-relaxed"
            />
          </div>
        )}
      </div>
    </section>
  );
}

export default ContentCreator;
