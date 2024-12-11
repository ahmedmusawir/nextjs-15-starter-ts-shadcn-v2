import { fetchBlogPostsDirect } from "@/services/buildServices";
import { BlogPost } from "@/types/blog";

const BlogPageContentTest = async () => {
  try {
    // Directly fetch blog posts from WordPress GraphQL API
    const { posts } = await fetchBlogPostsDirect(6, null); // Fetch the first 6 posts

    // Log the fetched posts
    console.log("Fetched Posts [Direct]:", posts);

    return (
      <div className="bg-white py-24 sm:py-32">
        <h1>Testing Direct WordPress Fetch</h1>
        <pre className="mt-6 bg-gray-100 p-4 rounded-lg">
          {posts ? JSON.stringify(posts, null, 2) : "No posts found."}
        </pre>
      </div>
    );
  } catch (error) {
    console.error("Error in BlogPageContentTest:", error);
    return (
      <div className="bg-white py-24 sm:py-32">
        <h1>Unexpected error occurred. Check console logs.</h1>
      </div>
    );
  }
};

export default BlogPageContentTest;
