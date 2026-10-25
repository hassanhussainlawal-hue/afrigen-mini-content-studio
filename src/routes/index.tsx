import { createFileRoute } from "@tanstack/react-router";

import ContentCreator from "@/components/ContentCreator";
import CreatePostForm from "@/components/CreatePostForm";
import Header from "@/components/Header";
import PostsExplorer from "@/components/PostsExplorer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "Afrigen Mini Content Studio | Real Twins CoderX",
      },
      {
        name: "description",
        content:
          "A content workspace that generates editable drafts locally and explores real posts from the DummyJSON Posts API.",
      },
      { property: "og:title", content: "Afrigen Mini Content Studio" },
      {
        property: "og:description",
        content:
          "Generate content drafts locally, explore real posts from DummyJSON, and try a simulated publish — a practical engineering project by Real Twins CoderX.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: StudioPage,
});

function StudioPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
        <div className="flex flex-col gap-6 lg:gap-8">
          <ContentCreator />
          <PostsExplorer />
          <CreatePostForm />
        </div>
      </main>
      <footer className="border-t border-border bg-card">
        <div className="mx-auto w-full max-w-6xl px-4 py-4 text-center text-xs text-muted-foreground sm:px-6">
          Afrigen Mini Content Studio · A practical software engineering challenge · Built by Real
          Twins CoderX
        </div>
      </footer>
    </div>
  );
}
