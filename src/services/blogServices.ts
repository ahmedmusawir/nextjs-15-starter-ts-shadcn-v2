/**
 * blogServices.ts
 *
 * ## Description
 * This service file contains utility functions for fetching blog-related data from the backend API.
 * It provides a centralized approach to manage GraphQL queries and handle data fetching for blog posts.
 *
 * ## Functions
 * ### fetchBlogPosts
 * - Fetches a paginated list of blog posts using the `/api/get-all-posts` endpoint.
 * - Supports pagination through `first` (number of posts per page) and `after` (cursor for the next page).
 * - Returns blog posts along with pagination information (`hasNextPage` and `endCursor`).
 *
 * ## Parameters
 * - **first**: (default `6`) Number of posts to fetch per page.
 * - **after**: (default `null`) Cursor for fetching the next set of posts.
 *
 * ## Return Value
 * - Returns an object with:
 *   - **posts**: An array of blog posts (`BlogPost[]`).
 *   - **pageInfo**: An object with pagination details:
 *     - **hasNextPage**: `true` if there are more pages to load.
 *     - **endCursor**: Cursor for fetching the next page.
 *
 * ## Usage
 * - Import and call `fetchBlogPosts` in components or services where blog data is required.
 * - Example:
 *   ```typescript
 *   const { posts, pageInfo } = await fetchBlogPosts(6, null);
 *   console.log(posts, pageInfo);
 *   ```
 *
 * ## Errors
 * - Logs and throws an error if the API request fails or returns a non-200 status.
 * - Example error log: `Error fetching blog posts: Network Error`.
 */
import { BlogPost } from "@/types/blog";

// const rawURL =
//   "http://localhost:3000/api/get-all-posts?first=6&after=YXJyYXljb25uZWN0aW9uOjk2NTc=";

export const fetchBlogPosts = async (
  first: number = 6,
  after: string | null = null
): Promise<{
  items: BlogPost[];
  endCursor: string | null;
  hasNextPage: boolean;
}> => {
  const queryParams = new URLSearchParams();
  queryParams.append("first", first.toString());
  if (after) queryParams.append("after", after);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/get-all-posts?${queryParams}`
  );

  const result = await response.json();
  // console.log("Data [blogServices.ts]", result.data.posts.nodes);
  return {
    items: result.data.posts.nodes,
    endCursor: result.data.posts.pageInfo.endCursor,
    hasNextPage: result.data.posts.pageInfo.hasNextPage,
  };
};

// ----------------------------- END fetchBlogPosts -------------------------------

/**
 * Fetch Single Blog Post by Slug
 *
 * ## Purpose
 * - Invokes the Next.js API endpoint to fetch a single blog post by its slug.
 * - Utilizes `/api/get-post-by-slug` for server-side rendering or dynamic page generation.
 *
 * ## Parameters
 * - `slug`: The slug of the blog post (string).
 *
 * ## Returns
 * - A single blog post object containing:
 *   - `id`: Unique identifier of the post.
 *   - `databaseId`: WordPress numeric ID for the post.
 *   - `title`: Post title.
 *   - `slug`: Post slug (URL-safe string).
 *   - `date`: Publication date.
 *   - `content`: HTML content of the post.
 *   - `categories`: Categories associated with the post.
 *   - `featuredImage`: The featured image URL of the post.
 *   - `author`: Author information (name, description).
 *
 * ## Usage
 * - Example:
 *   ```typescript
 *   const post = await fetchSinglePostBySlug("example-slug");
 *   ```
 * - Use this function in components or pages to render single post content dynamically.
 */
export const fetchSinglePostBySlug = async (slug: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/get-post-by-slug?slug=${slug}`
  );

  if (!response.ok) {
    console.log("Error fetching single post by slug:", response.statusText);
    // throw new Error("Failed to fetch the post");
    return null;
  }

  const result = await response.json();
  if (!result || !result.id) {
    console.log("No post found for slug:", slug);
    return null; // Return null if no post is found in the response
  }
  return result;
};

// ----------------------------- END fetchSinglePostBySlug -------------------------------
