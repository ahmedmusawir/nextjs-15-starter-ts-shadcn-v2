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
  posts: BlogPost[];
  pageInfo: { hasNextPage: boolean; endCursor: string | null };
}> => {
  try {
    const queryParams = new URLSearchParams({ first: String(first) });
    if (after) queryParams.append("after", after);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/get-all-posts?${queryParams}`
    );
    console.log(
      `URL: ${process.env.NEXT_PUBLIC_APP_URL}/api/get-all-posts?${queryParams}`
    );
    // const response = await fetch(`${rawURL}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch blog posts: ${response.statusText}`);
    }

    const result = await response.json();
    console.log("Data [blogServices.ts]", result.data.posts.pageInfo);
    return {
      posts: result.data.posts.nodes,
      pageInfo: result.data.posts.pageInfo,
    };
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    throw error;
  }
};
