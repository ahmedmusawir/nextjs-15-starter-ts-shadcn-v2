import { notFound } from "next/navigation";
import SinglePostContent from "./SinglePostContent";
import {
  fetchAllPostSlugsDirect,
  fetchSinglePostBySlug,
} from "@/services/blogServices";

// Generate static params for SSG
// export async function generateStaticParams() {
//   const slugs = await fetchAllPostSlugsDirect();
//   return slugs.map((slug: string) => ({ slug }));
// }

// Single post page component
const SinglePost = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const post = await fetchSinglePostBySlug(slug);

  // Handle 404 with ISR
  if (!post) {
    notFound();
  }

  return <SinglePostContent post={post} />;
};

export default SinglePost;
