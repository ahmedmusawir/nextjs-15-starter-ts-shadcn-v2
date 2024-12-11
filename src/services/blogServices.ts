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

/**
 * Fetch All Post Slugs
 *
 * ## Purpose
 * - Fetches all blog post slugs from WordPress GraphQL API.
 * - Used primarily for generating static paths (SSG) dynamically.
 *
 * ## Details
 * - Queries `/api/get-all-post-slugs` for the list of all post slugs.
 *
 * ## Usage
 * - Can be invoked in `generateStaticParams` for dynamic page generation.
 * - Returns an array of slugs as strings.
 *
 * ## Returns
 * - `Promise<string[]>`: Array of post slugs.
 *
 * ## Example
 * ```typescript
 * const slugs = await fetchAllPostSlugs();
 * console.log(slugs); // ["post-slug-1", "post-slug-2", ...]
 * ```
 */
export const fetchAllPostSlugs = async (): Promise<string[]> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/get-all-post-slugs`
    );
    if (!response.ok) {
      console.error("Error fetching post slugs:", response.statusText);
      throw new Error("Failed to fetch post slugs");
    }

    const slugs: string[] = await response.json();
    return slugs;
  } catch (error) {
    console.error("API Error in fetchAllPostSlugs:", error);
    throw error;
  }
};

// ----------------------------- END fetchAllPostSlugs -------------------------------

/**
 * Fetch All Post Slugs Directly from WordPress GraphQL API
 *
 * ## Purpose
 * - Fetch all post slugs from the WordPress GraphQL API using pagination.
 * - Handles large datasets by iterating through pages of results.
 * - Returns a consolidated array of slugs for use in static site generation (SSG).
 *
 * ## Features
 * - **Dynamic Pagination**: Fetches slugs in batches to avoid API limitations.
 * - **Scalable**: Supports datasets of any size by iterating until all pages are retrieved.
 *
 * ## Parameters
 * - None
 *
 * ## Return Value
 * - A Promise that resolves to an array of strings, where each string is a post slug.
 *
 * ## Example Usage
 * ```typescript
 * const slugs = await fetchAllPostSlugsDirect();
 * console.log(slugs); // Output: ['post-slug-1', 'post-slug-2', ...]
 * ```
 *
 * ## Implementation Details
 * - **GraphQL Query**: Uses `posts(first: Int!, after: String)` to fetch paginated data.
 * - **Pagination Logic**:
 *   - `pageInfo.hasNextPage`: Determines if more data is available.
 *   - `pageInfo.endCursor`: Cursor for fetching the next page of data.
 * - **Performance**: Fetches 50 posts per request to balance between performance and API constraints.
 *
 * ## Dependencies
 * - Requires `NEXT_PUBLIC_WORDPRESS_API_URL` environment variable.
 *
 * ## Error Handling
 * - Logs and throws an error if the API request fails or returns errors.
 *
 * ## Use Case
 * - Ideal for generating static parameters in Next.js projects during build time.
 */
// Define the expected structure of the GraphQL response
interface PostSlugResponse {
  data: {
    posts: {
      nodes: { slug: string }[];
      pageInfo: {
        hasNextPage: boolean;
        endCursor: string | null;
      };
    };
  };
  errors?: Array<{ message: string }>;
}
// Service function to fetch all post slugs directly
export const fetchAllPostSlugsDirect = async (): Promise<string[]> => {
  const WORDPRESS_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL!;
  const slugs: string[] = [];
  let hasNextPage = true;
  let endCursor: string | null = null;

  while (hasNextPage) {
    const response: PostSlugResponse = await fetch(WORDPRESS_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          query GetAllPostSlugs($first: Int!, $after: String) {
            posts(first: $first, after: $after) {
              nodes {
                slug
              }
              pageInfo {
                hasNextPage
                endCursor
              }
            }
          }
        `,
        variables: {
          first: 100,
          after: endCursor,
        },
      }),
    }).then((res) => res.json());

    // Check for GraphQL errors
    if (response.errors) {
      console.error("GraphQL Errors:", response.errors);
      throw new Error("Failed to fetch post slugs");
    }

    const { nodes, pageInfo } = response.data.posts;

    // Add the current batch of slugs to the main array
    slugs.push(...nodes.map((node) => node.slug));

    // Update pagination info
    hasNextPage = pageInfo.hasNextPage;
    endCursor = pageInfo.endCursor;
  }

  return slugs;
};
