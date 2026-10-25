// Local draft generation.
//
// This builds a useful, structured starting draft from the user's topic and
// the selected content type. It is template-based logic running in the
// browser — it does NOT use an AI model or an external AI API, and the UI
// never claims otherwise.

export type ContentType = "blog" | "social" | "article";

/** Options shown in the content-type selector. */
export const CONTENT_TYPE_OPTIONS: { value: ContentType; label: string }[] = [
  { value: "blog", label: "Blog Post" },
  { value: "social", label: "Social Media Caption" },
  { value: "article", label: "Article" },
];

export interface GeneratedDraft {
  contentType: ContentType;
  body: string;
}

/** "remote team rituals" -> "Remote Team Rituals" */
function toDisplayTopic(topic: string): string {
  return topic
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/** "remote team rituals" -> "#RemoteTeamRituals" */
function toHashtag(topic: string): string {
  const words = topic.split(/\s+/).filter(Boolean);
  if (words.length === 0) {
    return "#AfrigenStudio";
  }
  return `#${words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join("")}`;
}

function buildBlogDraft(topic: string, displayTopic: string): string {
  return [
    `Title: ${displayTopic}: A Practical Guide`,
    ``,
    `Introduction`,
    `${displayTopic} is easier to understand when it is broken into small, practical parts. In this post we look at what it is, why it matters, and how to get started with it today.`,
    ``,
    `What it is`,
    `- A short definition of ${topic} in plain language.`,
    `- The problem it solves and the people it helps most.`,
    `- One everyday example readers will recognize.`,
    ``,
    `Why it matters`,
    `- It saves time by giving a repeatable approach instead of guesswork.`,
    `- It lowers the cost of getting started, so progress does not depend on special tools.`,
    `- It builds confidence: small wins with ${topic} make the next step obvious.`,
    ``,
    `How to get started`,
    `1. Write down one specific goal related to ${topic}.`,
    `2. Choose the smallest first step that moves you toward that goal.`,
    `3. Try it once this week and note what worked.`,
    `4. Repeat, adjust, and share what you learn.`,
    ``,
    `Conclusion`,
    `${displayTopic} rewards steady, practical effort. Start small, stay consistent, and let the results guide your next step.`,
  ].join("\n");
}

function buildSocialDraft(topic: string, displayTopic: string): string {
  return [
    `${displayTopic}, explained simply:`,
    ``,
    `- Why it matters: it turns a vague idea into something you can act on today.`,
    `- What to do first: pick one small step and finish it.`,
    `- What changes: momentum. Small wins stack up fast.`,
    ``,
    `Save this post and share it with someone working on ${topic}.`,
    ``,
    `${toHashtag(topic)} #ContentTips #AfrigenMiniStudio`,
  ].join("\n");
}

function buildArticleDraft(topic: string, displayTopic: string): string {
  return [
    `Understanding ${displayTopic}`,
    ``,
    `Summary`,
    `This article explains ${topic} in clear terms: what it is, why it matters, how it is used in practice, and where its limits are.`,
    ``,
    `1. Background`,
    `Set the scene: what people usually mean by ${topic}, and how interest in it developed.`,
    ``,
    `2. Key concepts`,
    `- Concept 1: the core idea behind ${topic}, defined simply.`,
    `- Concept 2: the main parts or players involved.`,
    `- Concept 3: how success is measured.`,
    ``,
    `3. Practical applications`,
    `Describe two or three realistic situations where ${topic} is used, and what result each one aims for.`,
    ``,
    `4. Limitations and open questions`,
    `Note what ${topic} cannot do on its own, and what still depends on context, judgment, or further evidence.`,
    ``,
    `Conclusion`,
    `Summarize the key takeaways and suggest one action the reader can take this week.`,
    ``,
    `References`,
    `List your sources here before publishing.`,
  ].join("\n");
}

/**
 * Generate a draft for the given topic and content type.
 * Assumes the topic has been validated as non-empty by the caller.
 */
export function generateDraft(topic: string, contentType: ContentType): GeneratedDraft {
  const cleanTopic = topic.trim().replace(/\s+/g, " ");
  const displayTopic = toDisplayTopic(cleanTopic);

  if (contentType === "blog") {
    return { contentType, body: buildBlogDraft(cleanTopic, displayTopic) };
  }
  if (contentType === "social") {
    return { contentType, body: buildSocialDraft(cleanTopic, displayTopic) };
  }
  return { contentType, body: buildArticleDraft(cleanTopic, displayTopic) };
}
