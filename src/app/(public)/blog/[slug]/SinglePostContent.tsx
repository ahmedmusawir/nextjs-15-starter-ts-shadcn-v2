import React from "react";
import styles from "./Single.module.scss";
import Row from "@/components/common/Row";
import Page from "@/components/common/Page";
import Head from "next/head";
import { fetchSinglePostBySlug } from "@/services/blogServices";
import { notFound } from "next/navigation";
import NotFoundPage from "../not-found";

const SinglePostContent = async ({ params }: { params: { slug: string } }) => {
  console.log("Slug [SinglePostContent]:", params);
  const { slug } = params;

  // Fetch the single post by slug
  const post = await fetchSinglePostBySlug(slug);
  // console.log("Single Post [SinglePostContent]", post);

  // If no post is found, show a 404 page
  if (!post) {
    notFound();
  }

  return (
    <>
      <Head>
        <title>{post.title.rendered}</title>
        <meta name="description" content={`Post: ${post.title}`} />
      </Head>
      <Page className={""} FULL={false}>
        <Row className="prose max-w-3xl mx-auto bg-gray-200">
          <div
            className={styles["wp-content"]}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </Row>
      </Page>
    </>
  );
};

export default SinglePostContent;
