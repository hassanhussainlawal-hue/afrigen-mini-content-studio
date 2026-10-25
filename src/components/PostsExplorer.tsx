import { useMemo, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";

import { fetchPostsPage } from "@/services/postsApi";
import type { DummyJsonPost } from "@/services/postsApi";
import { filterPostsBySearch, removeDuplicatePosts } from "@/utils/postFilters";
import PostCard from "./PostCard";

const POSTS_PER_PAGE = 10;

const primaryButtonClass =
  "inline-flex min-h-9 items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60";

const searchInputClass =
  "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground";

function LoadingIndicator({ label }: { label: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex items-center justify-center gap-3 py-10 text-sm text-muted-foreground"
    >
      <span
        aria-hidden="true"
        className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent"
      />
      {label}
    </div>
  );
}

function PostsExplorer() {
  const [search, setSearch] = useState("");

  // Paginated fetch from the real DummyJSON API. Each page uses
  // skip = pageIndex * POSTS_PER_PAGE so "Load More" always asks for the
  // next slice of results.
  const postsQuery = useInfiniteQuery({
    queryKey: ["dummyjson-posts"],
    queryFn: ({ pageParam }) => fetchPostsPage(POSTS_PER_PAGE, pageParam * POSTS_PER_PAGE),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const loadedCount = allPages.reduce((sum, page) => sum + page.posts.length, 0);
      return loadedCount < lastPage.total ? allPages.length : undefined;
    },
  });

  // Flatten all loaded pages and drop duplicates by id, so a post that shows
  // up on two pages (e.g. while the API list shifts) is only displayed once.
  const allPosts = useMemo(() => {
    const flattened = (postsQuery.data?.pages ?? []).flatMap((page) => page.posts);
    return removeDuplicatePosts(flattened);
  }, [postsQuery.data]);

  const totalAvailable = postsQuery.data?.pages[0]?.total ?? 0;
  const visiblePosts = useMemo(
    () => filterPostsBySearch(allPosts, search),
    [allPosts, search],
  );

  const { isLoading, isError, error, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
    postsQuery;

  function getErrorMessage(): string {
    return error instanceof Error ? error.message : "Something went wrong while loading posts.";
  }

  const searchIsEmpty = search.trim().length > 0 && visiblePosts.length === 0;

  return (
    <section
      id="posts"
      aria-labelledby="posts-heading"
      className="scroll-mt-24 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 id="posts-heading" className="text-lg font-semibold">
            Posts Explorer
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Real posts loaded live from the DummyJSON Posts API.
          </p>
        </div>
        <div className="w-full sm:w-72">
          <label htmlFor="post-search" className="text-sm font-medium">
            Search loaded posts
          </label>
          <input
            id="post-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Filter by title, body, or tag"
            className={`mt-2 ${searchInputClass}`}
          />
        </div>
      </div>

      {/* Initial loading state */}
      {isLoading && <LoadingIndicator label="Loading posts…" />}

      {/* Error state (no data at all): show message + Retry */}
      {isError && allPosts.length === 0 && (
        <div className="mt-6 rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
          <h3 className="font-semibold text-destructive">Could not load posts</h3>
          <p className="mt-1 text-sm text-muted-foreground">{getErrorMessage()}</p>
          <button type="button" onClick={() => refetch()} className={`mt-4 ${primaryButtonClass}`}>
            Retry
          </button>
        </div>
      )}

      {/* Error while loading MORE pages: keep the list, show a retry banner */}
      {isError && allPosts.length > 0 && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4">
          <p className="text-sm text-destructive">{getErrorMessage()}</p>
          <button type="button" onClick={() => refetch()} className={primaryButtonClass}>
            Retry
          </button>
        </div>
      )}

      {/* Empty API state: the request worked but there are no posts */}
      {!isLoading && !isError && totalAvailable === 0 && (
        <div className="mt-6 rounded-xl border border-border bg-muted/50 p-8 text-center">
          <h3 className="font-semibold">No posts available</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            The posts service responded successfully, but it has no posts to show right now.
          </p>
        </div>
      )}

      {/* Successful data state */}
      {!isLoading && !isError && totalAvailable > 0 && (
        <>
          {searchIsEmpty ? (
            /* Search-results-empty state: not an API failure */
            <div className="mt-6 rounded-xl border border-border bg-muted/50 p-8 text-center">
              <h3 className="font-semibold">No matching posts</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                None of the {allPosts.length} loaded posts match “{search.trim()}”. The posts
                loaded fine — this is only the search filter finding nothing.
              </p>
              <button
                type="button"
                onClick={() => setSearch("")}
                className={`mt-4 ${primaryButtonClass}`}
              >
                Clear search
              </button>
            </div>
          ) : (
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {visiblePosts.map((post: DummyJsonPost) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
            <p aria-live="polite" className="text-sm text-muted-foreground">
              Showing {visiblePosts.length === allPosts.length
                ? `${allPosts.length} of ${totalAvailable}`
                : `${visiblePosts.length} matching of ${allPosts.length} loaded (${totalAvailable} available)`}
            </p>
            {hasNextPage ? (
              <button
                type="button"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className={primaryButtonClass}
              >
                {isFetchingNextPage ? "Loading…" : "Load More"}
              </button>
            ) : (
              <p className="text-sm text-muted-foreground">You’ve reached the end of the posts.</p>
            )}
          </div>
        </>
      )}
    </section>
  );
}

export default PostsExplorer;
