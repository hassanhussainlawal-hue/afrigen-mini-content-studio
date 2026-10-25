# Afrigen Mini Content Studio

A small, professional content management application built as a practical software
engineering challenge by **Real Twins CoderX**. It combines a local content-draft
workspace with live data from the public [DummyJSON](https://dummyjson.com) Posts API,
demonstrating real API integration, clean component architecture, and complete
application state handling.

## Project Overview

The application has three main areas:

1. **Content Creation** — describe a topic, pick a content type (Blog Post, Social Media
   Caption, or Article), and generate a structured starting draft locally in the browser.
   The draft is fully editable and can be copied to the clipboard. Draft generation is
   template-based: it does **not** use an AI model or an external AI API.
2. **Posts Explorer** — fetches real posts from `https://dummyjson.com/posts` on page
   load, with search filtering, pagination via "Load More", and full loading / error /
   empty states.
3. **Publish Test Post** — sends a real `POST` request to `https://dummyjson.com/posts/add`
   to demonstrate create requests, validation, and error handling.

## Main Features

- Draft generation from a topic + content type, with validation, editing, and copy-to-clipboard
- Live posts list from the DummyJSON API (limit 10 per page, `skip`-based pagination)
- Client-side search that filters loaded posts by **title, body, or tag**
- "Load More" pagination that avoids duplicate posts across pages
- Count of loaded posts and the API's total
- Distinct UI states: loading, error (+ Retry), API-empty, search-empty, success,
  form validation, submission in progress, and successful POST response
- Honest disclosure that DummyJSON *simulates* post creation and does not permanently
  save the post, and that nothing is published to a real social network
- Responsive layout for mobile, tablet, and desktop with accessible form controls

## Technologies Used

- **React 19** + **TypeScript**
- **Vite** (via TanStack Start — a full-stack React framework built on Vite)
- **Tailwind CSS v4** for styling (semantic design tokens in `src/styles.css`)
- **TanStack Query** for the paginated posts fetching (loading/error/retry states)
- **Browser Fetch API** — all DummyJSON calls, no external SDKs, no API keys

## Folder Structure

```text
src/
  components/
    Header.tsx          # App name, subtitle, developer attribution, section nav
    ContentCreator.tsx  # Topic + content type + Generate Draft + copy
    PostsExplorer.tsx   # Fetches, filters, paginates and displays posts
    PostCard.tsx        # A single post card (title, body, tags, reactions)
    CreatePostForm.tsx  # "Publish Test Post" demo with validation + result
  services/
    postsApi.ts         # Types + all DummyJSON fetch calls, error handling
  utils/
    contentGenerator.ts # Local, template-based draft generation
    postFilters.ts      # Pure helpers: search filtering, duplicate removal
  routes/
    index.tsx           # The app page (composes the sections above)
    __root.tsx          # Root layout, fonts, error/404 components
  test/
    postFilters.test.ts # Unit tests for search filtering + deduplication
    app-routing.test.ts # Route smoke test
  styles.css            # Design system (colors, typography, spacing tokens)
```

> Note on structure: this project uses **TanStack Start**, so the page is composed in
> `src/routes/index.tsx` instead of a separate `App.tsx`/`main.tsx`. The responsibilities
> are the same — the framework provides the entry point.

## How to Install Dependencies

```bash
npm install
# or: bun install
```

## How to Run Locally

```bash
npm run dev
```

Then open the printed local URL (usually `http://localhost:8080`).

Other scripts:

```bash
npm run build   # production build
npm run test    # run unit tests once
npm run lint    # lint the source
```

## API Endpoints Used

| Endpoint | Method | Purpose |
| --- | --- | --- |
| `https://dummyjson.com/posts?limit=10&skip=0` | GET | Load posts page by page (`skip`/`limit` pagination) |
| `https://dummyjson.com/posts/add` | POST | Create a *test* post with `title`, `body`, `userId` (JSON body, `Content-Type: application/json`) |

All requests use the browser Fetch API with `async/await` and `try/catch`. Unsuccessful
HTTP responses and network failures are converted into a single `PostsApiError` with a
human-readable message.

## Explanation of the Simulated POST Behavior

`POST https://dummyjson.com/posts/add` returns a realistic response (including a new
post `id`) **but DummyJSON does not permanently save the post** — it is a fake, practice
API. Nothing is published to a real social network, and the post will not appear in the
Posts Explorer. The UI states this explicitly next to the form so nobody mistakes the
confirmation for a real publication.

## Testing Instructions

Automated tests:

```bash
npm run test
```

This runs the Vitest suite in `src/test/`, covering the search filter
(title/body/tag, case-insensitive, blank search matches all) and duplicate removal
(keeps the first occurrence by post id).

Manual test checklist:

1. **Draft validation** — click "Generate Draft" with an empty topic; a validation
   message appears.
2. **Draft generation** — enter a topic, generate for each content type, edit the
   draft, and use "Copy draft".
3. **Posts loading** — on page load the explorer shows real posts with titles, bodies,
   tags, and reactions; a loading indicator appears first.
4. **Search** — filter by a title, a body word, and a tag; a search with no matches
   shows the "No matching posts" state (not an API error).
5. **Load More** — click it and confirm the loaded count grows and no post id repeats.
6. **Error handling** — go offline and reload; the error state with a Retry button
   appears.
7. **Publish Test Post** — submit empty fields (validation), then a filled form; the
   returned post ID is displayed, the button is disabled while submitting, and the
   simulated-save note is visible.

## AI-Assisted Development Tools Used

This project was built with the help of **Lovable**, an AI-assisted development tool
(plus GitHub Copilot for code suggestions where used). All generated code was reviewed
and shaped by the Real Twins CoderX team.

## Contributions

This project was built as a joint challenge by the Real Twins CoderX team. Our
individual contributions are documented below.

### Hassan

<!-- Hassan: add your actual contributions here (features implemented, code
areas owned, reviews, testing, documentation). -->

### Hussain

<!-- Hussain: add your actual contributions here (features implemented, code
areas owned, reviews, testing, documentation). -->
