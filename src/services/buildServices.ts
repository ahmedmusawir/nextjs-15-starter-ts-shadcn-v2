import { BlogPost } from "@/types/blog";
// import { fetch } from "next/server";

interface BlogPostsResponse {
  posts: BlogPost[];
  hasNextPage: boolean;
  endCursor: string | null;
}
export const fetchBlogPostsDirect = async (
  first: number,
  after: string | null
): Promise<BlogPostsResponse> => {
  const response = await fetch(process.env.NEXT_PUBLIC_WORDPRESS_API_URL!, {
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
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch blog posts: ${response.statusText}`);
  }

  const result = await response.json();

  return {
    posts: result?.data?.posts?.nodes || [],
    hasNextPage: result?.data?.posts?.pageInfo?.hasNextPage || false,
    endCursor: result?.data?.posts?.pageInfo?.endCursor || null,
  };
};
