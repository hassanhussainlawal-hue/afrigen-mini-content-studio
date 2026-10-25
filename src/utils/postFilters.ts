// Pure helpers for filtering and de-duplicating posts.
// Kept out of the components so they are easy to read and to unit-test.

import type { DummyJsonPost } from "@/services/postsApi";

/**
 * Keep only posts whose title, body, or tags contain the search text
 * (case-insensitive). An empty search matches every post.
 */
export function filterPostsBySearch(posts: DummyJsonPost[], search: string): DummyJsonPost[] {
  const needle = search.trim().toLowerCase();
  if (!needle) {
    return posts;
  }
  return posts.filter(
    (post) =>
      post.title.toLowerCase().includes(needle) ||
      post.body.toLowerCase().includes(needle) ||
      post.tags.some((tag) => tag.toLowerCase().includes(needle)),
  );
}

/**
 * Remove posts that appear more than once (by id), keeping the first
 * occurrence. Used when loading additional pages so no post is shown twice.
 */
export function removeDuplicatePosts(posts: DummyJsonPost[]): DummyJsonPost[] {
  const seenIds = new Set<number>();
  return posts.filter((post) => {
    if (seenIds.has(post.id)) {
      return false;
    }
    seenIds.add(post.id);
    return true;
  });
}
