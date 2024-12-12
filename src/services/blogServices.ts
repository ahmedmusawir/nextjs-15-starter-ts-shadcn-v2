import { NextResponse } from "next/server";

const WORDPRESS_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL!;

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
export const fetchAllPostSlugs = async (): Promise<string[]> => {
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

// ---------------- end of fetchAllPostSlugs ----------------------------------

import { BlogPost } from "@/types/blog";
// import { fetch } from "next/server";

interface BlogPostsResponse {
  items: BlogPost[];
  hasNextPage: boolean;
  endCursor: string | null;
}
export const fetchBlogPosts = async (
  first: number,
  after: string | null
): Promise<BlogPostsResponse> => {
  const response = await fetch(WORDPRESS_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
        query GetBlogPosts($first: Int!, $after: String) {
          posts(first: $first, after: $after) {
            nodes {
              id
              title
              slug
              date
              excerpt
              featuredImage {
                node {
                  sourceUrl
                }
              }
              categories {
                nodes {
                  name
                }
              }
              author {
                node {
                  name
                }
              }
            }
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }
      `,
      variables: { first, after },
    }),
    next: {
      revalidate: 60, // Revalidate the cached data every 60 seconds
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch blog posts: ${response.statusText}`);
  }

  const result = await response.json();

  return {
    items: result?.data?.posts?.nodes || [],
    hasNextPage: result?.data?.posts?.pageInfo?.hasNextPage || false,
    endCursor: result?.data?.posts?.pageInfo?.endCursor || null,
  };
};

// --------------------------- end of fetchBlogPosts ----------------------------

const GRAPHQL_QUERY_GET_SINGLE_POST_BY_SLUG = `
          query GetSinglePostBySlug($slug: ID!) {
            post(id: $slug, idType: SLUG) {
              id
              databaseId
              title
              slug
              date
              content
              categories {
                nodes {
                  name
                }
              }
              featuredImage {
                node {
                  sourceUrl
                }
              }
              author {
                node {
                  name
                }
              }
            }
          }
        `;

interface SinglePostRespone {
  post: BlogPost;
}

export const fetchSinglePostBySlug = async (
  slug: string | null
): Promise<SinglePostRespone> => {
  const response = await fetch(WORDPRESS_API_URL || "", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: GRAPHQL_QUERY_GET_SINGLE_POST_BY_SLUG,
      variables: { slug },
    }),
    next: {
      revalidate: 60, // Revalidate the cached data every 60 seconds
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch single post by slug: ${response.statusText}`
    );
  }

  const result = await response.json();

  return {
    post: result?.data?.post || null,
  };
};
