import { useState, type FormEvent } from "react";

import { createTestPost } from "@/services/postsApi";
import type { CreatePostResponse } from "@/services/postsApi";

const inputClass =
  "mt-2 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground";

const submitButtonClass =
  "inline-flex min-h-10 items-center justify-center rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60";

function CreatePostForm() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [userId, setUserId] = useState("1");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [createdPost, setCreatedPost] = useState<CreatePostResponse | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedBody = body.trim();
    const parsedUserId = Number.parseInt(userId, 10);

    setCreatedPost(null);
    setRequestError(null);

    // Validation of required fields before anything is sent.
    if (!trimmedTitle) {
      setValidationError("A title is required.");
      return;
    }
    if (!trimmedBody) {
      setValidationError("The post body is required.");
      return;
    }
    if (!Number.isInteger(parsedUserId) || parsedUserId <= 0) {
      setValidationError("The user ID must be a positive whole number.");
      return;
    }

    setValidationError(null);
    setIsSubmitting(true);

    try {
      const result = await createTestPost({
        title: trimmedTitle,
        body: trimmedBody,
        userId: parsedUserId,
      });
      setCreatedPost(result);
      setBody("");
    } catch (error) {
      setRequestError(
        error instanceof Error ? error.message : "Something went wrong while creating the post.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section
      id="publish"
      aria-labelledby="publish-heading"
      className="scroll-mt-24 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6"
    >
      <h2 id="publish-heading" className="text-lg font-semibold">
        Publish Test Post
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Sends a real <code className="text-foreground">POST /posts/add</code> request to DummyJSON
        to demonstrate create requests and error handling.
      </p>

      <form onSubmit={handleSubmit} className="mt-4 grid gap-4" noValidate>
        <div>
          <label htmlFor="post-title" className="text-sm font-medium">
            Title
          </label>
          <input
            id="post-title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="My test post"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="post-body" className="text-sm font-medium">
            Body
          </label>
          <textarea
            id="post-body"
            value={body}
            onChange={(event) => setBody(event.target.value)}
            rows={3}
            placeholder="What should the test post say?"
            className={`${inputClass} resize-y leading-relaxed`}
          />
        </div>

        <div className="sm:max-w-48">
          <label htmlFor="post-user-id" className="text-sm font-medium">
            User ID
          </label>
          <input
            id="post-user-id"
            type="number"
            min={1}
            step={1}
            value={userId}
            onChange={(event) => setUserId(event.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <button type="submit" disabled={isSubmitting} className={submitButtonClass}>
            {isSubmitting ? "Publishing…" : "Publish Test Post"}
          </button>
        </div>

        {/* Form validation state */}
        {validationError && (
          <p role="status" className="text-sm font-medium text-destructive">
            {validationError}
          </p>
        )}

        {/* Error state: network failure or unsuccessful HTTP response */}
        {requestError && (
          <p role="status" className="text-sm font-medium text-destructive">
            {requestError}
          </p>
        )}

        {/* Successful POST response state */}
        {createdPost && (
          <div
            role="status"
            className="rounded-lg border border-success/30 bg-success/10 p-4 text-sm"
          >
            <p className="font-semibold text-success">
              Test post created successfully. DummyJSON returned post ID {createdPost.id}.
            </p>
            <p className="mt-1 text-muted-foreground">
              Returned title: “{createdPost.title}” · userId: {createdPost.userId}
            </p>
          </div>
        )}
      </form>

      {/* Honest explanation of the simulated POST behavior */}
      <div className="mt-6 rounded-lg border border-border bg-muted/60 p-4 text-sm">
        <p className="font-semibold text-foreground">About this demo</p>
        <p className="mt-1 text-muted-foreground">
          DummyJSON is a practice API. It <em>simulates</em> post creation: it does not permanently
          save your test post on its server, and nothing is published to a real social network. The
          response above is only a sample confirmation, which is exactly what makes this a safe way
          to practice create requests.
        </p>
      </div>
    </section>
  );
}

export default CreatePostForm;
