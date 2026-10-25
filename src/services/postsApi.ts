// Types and API access for the DummyJSON Posts API.
// Every network call in the app goes through this module so error handling
// stays in one place. All functions use async/await with try/catch.

const DUMMYJSON_BASE_URL = "https://dummyjson.com";
const POSTS_ENDPOINT = `${DUMMYJSON_BASE_URL}/posts`;
const ADD_POST_ENDPOINT = `${DUMMYJSON_BASE_URL}/posts/add`;

/** Shape of a single post returned by DummyJSON. */
export interface DummyJsonPost {
  id: number;
  title: string;
  body: string;
  tags: string[];
  reactions: {
    likes: number;
    dislikes: number;
  };
  views: number;
  userId: number;
}

/** Shape of a paginated posts response: GET /posts?limit=..&skip=.. */
export interface PostsPageResponse {
  posts: DummyJsonPost[];
  total: number;
  skip: number;
  limit: number;
}

/** Body we send to POST /posts/add. */
export interface CreatePostPayload {
  title: string;
  body: string;
  userId: number;
}

/** Shape of the response from POST /posts/add. */
export interface CreatePostResponse {
  id: number;
  title: string;
  body: string;
  userId: number;
}

/** One error type for both network failures and unsuccessful HTTP responses. */
export class PostsApiError extends Error {
  readonly status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "PostsApiError";
    this.status = status;
  }
}

/** Tries to read a helpful message out of an error response body. */
async function readApiErrorMessage(response: Response): Promise<string> {
  try {
    const data = await response.json();
    if (data && typeof data.message === "string") {
      return data.message;
    }
  } catch {
    // The error response had no JSON body — fall through to the generic text.
  }
  return `The posts service responded with status ${response.status}.`;
}

function toNetworkError(error: unknown): PostsApiError {
  if (error instanceof PostsApiError) {
    return error;
  }
  return new PostsApiError(
    "Could not reach the posts service. Check your internet connection and try again.",
  );
}

/**
 * Fetch one page of posts.
 * @param limit How many posts to request (page size).
 * @param skip  How many posts to skip (used for the "Load More" button).
 */
export async function fetchPostsPage(limit: number, skip: number): Promise<PostsPageResponse> {
  try {
    const response = await fetch(`${POSTS_ENDPOINT}?limit=${limit}&skip=${skip}`);
    if (!response.ok) {
      throw new PostsApiError(await readApiErrorMessage(response), response.status);
    }
    return (await response.json()) as PostsPageResponse;
  } catch (error) {
    throw toNetworkError(error);
  }
}

/**
 * Create a "test post" via POST /posts/add.
 * NOTE: DummyJSON simulates post creation — it does not permanently save the
 * post on its server. This function only returns the simulated response.
 */
export async function createTestPost(payload: CreatePostPayload): Promise<CreatePostResponse> {
  try {
    const response = await fetch(ADD_POST_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new PostsApiError(await readApiErrorMessage(response), response.status);
    }
    return (await response.json()) as CreatePostResponse;
  } catch (error) {
    throw toNetworkError(error);
  }
}
