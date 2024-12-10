"use client";

import { usePaginationStore } from "@/store/usePaginationStore";
import { BlogPost } from "@/types/blog";
import Link from "next/link";
import React, { useEffect } from "react";

interface Props {
  initialPosts: BlogPost[];
}

const BlogPostItems = ({ initialPosts }: Props) => {
  // Hydrate Zustand store on client
  useEffect(() => {
    if (initialPosts.length > 0) {
      usePaginationStore.setState({
        items: initialPosts,
        endCursor: null, // Keep null if it's not part of the initial load
        hasNextPage: true, // Or false, based on initial data
      });
    }
  }, [initialPosts]);

  // Fetch items from Zustand store
  const items = usePaginationStore((state) => state.items);

  return (
    <div className="mx-auto mt-16 grid max-w-2xl auto-rows-fr grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
      {items.map((post: BlogPost) => (
        <article
          key={post.id}
          className="relative isolate flex flex-col justify-end overflow-hidden rounded-2xl bg-gray-900 px-8 pb-8 pt-80 sm:pt-48 lg:pt-80"
        >
          <img
            alt=""
            src={post?.featuredImage.node.sourceUrl}
            className="absolute inset-0 -z-10 size-full object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-gray-900 via-gray-900/40" />
          <div className="absolute inset-0 -z-10 rounded-2xl ring-1 ring-inset ring-gray-900/10" />

          <div className="flex flex-wrap items-center gap-y-1 overflow-hidden text-sm/6 text-gray-300">
            <time dateTime={post.date} className="mr-8">
              {post.date}
            </time>
            <div className="-ml-4 flex items-center gap-x-4">
              <svg
                viewBox="0 0 2 2"
                className="-ml-0.5 size-0.5 flex-none fill-white/50"
              >
                <circle r={1} cx={1} cy={1} />
              </svg>
              <div className="flex gap-x-2.5">{post.author.node.name}</div>
            </div>
          </div>
          <h3 className="mt-3 text-lg/6 font-semibold text-white">
            <Link href={`/blog/${post.slug}`}>
              <span className="absolute inset-0" />
              {post.title}
            </Link>
          </h3>
        </article>
      ))}
    </div>
  );
};

export default BlogPostItems;
