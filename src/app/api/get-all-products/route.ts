/**
 * @file /src/app/api/get-all-products/route.ts
 * @description API route to fetch all WooCommerce products with pagination using GraphQL.
 *              Returns a list of products including their ID, name, slug, SKU, price, categories,
 *              and featured image URL. Supports cursor-based pagination via the `first` and `after` query parameters.
 *
 * ## Features
 * - Fetches WooCommerce products with details like price, categories, and images.
 * - Supports both simple and variable product types.
 * - Includes cursor-based pagination for seamless loading of additional products.
 *
 * ## Query Parameters
 * - `first` (required): Number of products to fetch per page (e.g., ?first=8).
 * - `after` (optional): Cursor for pagination, fetched from the previous query's `endCursor` value (e.g., ?after=YXJyYXljb25uZWN0aW9uOjEw).
 *
 * ## Usage
 * - Testable via browser or API tools:
 *   https://my-app.com/api/get-all-products?first=8&after=YXJyYXljb25uZWN0aW9uOjEw //after value is the endCursor
 *
 * ## Notes
 * - Ensure the `NEXT_PUBLIC_WORDPRESS_API_URL` environment variable points to your WooCommerce GraphQL endpoint.
 * - Set up error handling for unexpected cases (e.g., missing environment variables, invalid query parameters).
 */

import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // Extract query parameters
  const first = parseInt(searchParams.get("first") || "0", 10);
  const after = searchParams.get("after") || null;

  if (!first || first <= 0) {
    return NextResponse.json(
      { error: 'Invalid "first" parameter. Must be a positive integer.' },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_WORDPRESS_API_URL || "",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
          query GetProductsWithPagination($first: Int!, $after: String) {
            products(first: $first, after: $after) {
              pageInfo {
                hasNextPage
                endCursor
              }
              nodes {
                id
                name
                slug
                sku
                ... on SimpleProduct {
                  price
                  productCategories {
                    nodes {
                      name
                    }
                  }
                  image {
                    sourceUrl
                  }
                }
                ... on VariableProduct {
                  price
                  productCategories {
                    nodes {
                      name
                    }
                  }
                  image {
                    sourceUrl
                  }
                }
              }
            }
          }
        `,
          variables: { first, after },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok || data.errors) {
      console.error("GraphQL Error:", data.errors || response.statusText);
      return NextResponse.json(
        {
          error: "Failed to fetch products.",
          details: data.errors || response.statusText,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(data.data.products);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
