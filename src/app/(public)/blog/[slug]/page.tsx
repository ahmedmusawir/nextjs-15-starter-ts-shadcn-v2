import SinglePostContent from "./SinglePostContent";

const SinglePost = ({ params }: { params: { slug: string } }) => {
  return <SinglePostContent params={params} />;
};

export default SinglePost;
