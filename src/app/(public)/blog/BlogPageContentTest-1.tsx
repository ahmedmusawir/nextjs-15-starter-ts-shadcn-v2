const BlogPageContentTest = async () => {
  try {
    // Fetch data from WordPress GraphQL API
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
          query GetAllPostSlugs {
            posts(first: 100) {
              nodes {
                slug
              }
            }
          }
        `,
        }),
      }
    );

    // Parse the JSON response
    if (!response.ok) {
      console.error("Error fetching data:", response.statusText);
      return (
        <div className="bg-white py-24 sm:py-32">
          <h1>Error fetching API data. Check console logs.</h1>
        </div>
      );
    }

    const data = await response.json();
    const slugs = data?.data?.posts?.nodes?.map(
      (node: { slug: string }) => node.slug
    );

    console.log("WP Data Slugs:", slugs);

    return (
      <div className="bg-white py-24 sm:py-32">
        <h1>Testing API</h1>
        <pre className="mt-6 bg-gray-100 p-4 rounded-lg">
          {slugs ? JSON.stringify(slugs, null, 2) : "No slugs found."}
        </pre>
      </div>
    );
  } catch (error) {
    console.error("Error in BlogPageContent:", error);
    return (
      <div className="bg-white py-24 sm:py-32">
        <h1>Unexpected error occurred. Check console logs.</h1>
      </div>
    );
  }
};

export default BlogPageContentTest;
