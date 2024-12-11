/**
 * API Endpoint: Get All Post Slugs
 *
 * ## Purpose
 * - Fetches all slugs from WordPress using GraphQL.
 * - Designed for generating static paths dynamically (e.g., for SSG).
 *
 * ## Details
 * - Method: GET
 * - Route: `/api/get-all-post-slugs`
 * - Output: Array of post slugs for SSG or other needs.
 *
 * ## Usage Example
 * - Test via browser: `/api/get-all-post-slugs`
 * - Use in `generateStaticParams` to dynamically generate pages.
 *
 * ## Query Variables
 * - `first`: Number of slugs to fetch (default: 100).
 */
