import { describe, expect, it } from "vitest";

import type { DummyJsonPost } from "@/services/postsApi";
import { filterPostsBySearch, removeDuplicatePosts } from "@/utils/postFilters";

function makePost(id: number, overrides: Partial<DummyJsonPost> = {}): DummyJsonPost {
  return {
    id,
    title: `Post ${id}`,
    body: "Body text",
    tags: ["news"],
    reactions: { likes: 1, dislikes: 0 },
    views: 10,
    userId: 1,
    ...overrides,
  };
}

describe("filterPostsBySearch", () => {
  it("matches title, body, or tag case-insensitively", () => {
    const posts = [
      makePost(1, { title: "Morning Routines", body: "Start the day well.", tags: ["lifestyle"] }),
      makePost(2, { title: "Coffee Guide", body: "Everything about brewing.", tags: ["food"] }),
      makePost(3, { title: "Travel Diary", body: "Notes about brewing coffee abroad.", tags: [] }),
    ];

    const byTitle = filterPostsBySearch(posts, "ROUTINES");
    const byBody = filterPostsBySearch(posts, "brewing");
    const byTag = filterPostsBySearch(posts, "food");

    expect(byTitle.map((post) => post.id)).toEqual([1]);
    expect(byBody.map((post) => post.id)).toEqual([2, 3]);
    expect(byTag.map((post) => post.id)).toEqual([2]);
  });

  it("treats a blank search as matching every post", () => {
    const posts = [makePost(1), makePost(2)];
    expect(filterPostsBySearch(posts, "   ")).toHaveLength(2);
  });
});

describe("removeDuplicatePosts", () => {
  it("keeps the first occurrence of a duplicated id", () => {
    const posts = [makePost(1, { title: "First" }), makePost(1, { title: "Second" }), makePost(2)];

    const unique = removeDuplicatePosts(posts);

    expect(unique.map((post) => post.id)).toEqual([1, 2]);
    expect(unique[0].title).toBe("First");
  });

  it("leaves a list without duplicates unchanged", () => {
    const posts = [makePost(1), makePost(2), makePost(3)];
    expect(removeDuplicatePosts(posts)).toHaveLength(3);
  });
});
