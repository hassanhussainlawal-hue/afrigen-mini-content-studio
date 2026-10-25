import { useState } from "react";

import type { DummyJsonPost } from "@/services/postsApi";

const tagChipClass =
  "rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground";

function PostCard({ post }: { post: DummyJsonPost }) {
  return (
    <article className="flex min-w-0 flex-col gap-3 rounded-xl border border-border bg-card p-4">
      <h3 className="break-words text-sm font-semibold leading-snug">{post.title}</h3>
      <p className="break-words text-sm leading-relaxed text-muted-foreground">{post.body}</p>

      {post.tags.length > 0 && (
        <ul aria-label="Post tags" className="flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <li key={tag} className={tagChipClass}>
              {tag}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-auto flex flex-wrap gap-x-4 gap-y-1 border-t border-border pt-3 text-xs text-muted-foreground">
        <span>
          <span className="font-semibold text-foreground">{post.reactions.likes}</span> likes
        </span>
        <span>
          <span className="font-semibold text-foreground">{post.reactions.dislikes}</span> dislikes
        </span>
        <span>
          <span className="font-semibold text-foreground">{post.views}</span> views
        </span>
        <span className="ml-auto">Post #{post.id}</span>
      </div>
    </article>
  );
}

export default PostCard;
