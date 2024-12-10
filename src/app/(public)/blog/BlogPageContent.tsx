import BlogPostItems from "@/components/blog/BlogPostItems";
import LoadMoreButton from "@/components/common/LoadMoreButton";
import { fetchBlogPosts } from "@/services/blogServices";
import { usePaginationStore } from "@/store/usePaginationStore";
import Link from "next/link";

const BlogPageContent = async () => {
  const {
    items: initialPosts,
    endCursor,
    hasNextPage,
  } = await fetchBlogPosts(6); // Fetch first 6 posts

  // Initialize Zustand store with the first batch of posts
  usePaginationStore.setState({
    items: initialPosts,
    endCursor,
    hasNextPage,
  });

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
            From the blog
          </h2>
          <p className="mt-2 text-lg/8 text-gray-600">
            Learn how to grow your business with our expert advice.
          </p>
        </div>
        {/* Render the posts */}
        <BlogPostItems initialPosts={initialPosts} />
        {/* Pass props to LoadMoreButton */}
        {hasNextPage && (
          <LoadMoreButton
            endpoint="/api/get-all-posts"
            initialEndCursor={endCursor}
          />
        )}
      </div>
    </div>
  );
};

export default BlogPageContent;
