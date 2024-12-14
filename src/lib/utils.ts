/**
 * Format a date string into a more readable format.
 *
 * ## Purpose
 * - Converts an ISO date string (e.g., "2024-10-21T07:11:23") into a human-readable format like "Dec 10, 2024".
 *
 * ## Features
 * - Handles valid ISO date strings.
 * - Formats the output as "MMM DD, YYYY" (e.g., "Dec 10, 2024").
 * - Uses `Intl.DateTimeFormat` for consistent and locale-sensitive formatting.
 *
 * ## Parameters
 * - `dateString: string`
 *   - The ISO date string to format.
 *
 * ## Return Value
 * - Returns the formatted date as a string in "MMM DD, YYYY" format.
 * - Example: "Dec 10, 2024".
 *
 * ## Example Usage
 * ```typescript
 * const formattedDate = formatDateString("2024-10-21T07:11:23");
 * console.log(formattedDate); // Output: "Oct 21, 2024"
 * ```
 *
 * ## Error Handling
 * - If an invalid date string is provided, it logs an error and returns "Invalid Date".
 *
 * ## Use Case
 * - Perfect for blog post dates, event dates, or any scenario where a readable date format is required.
 */
export function formatDateString(dateString: string): string {
  try {
    // Parse the date string into a Date object
    const date = new Date(dateString);

    // Check for an invalid date
    if (isNaN(date.getTime())) {
      console.error("Invalid date string provided:", dateString);
      return "Invalid Date";
    }

    // Format the date using Intl.DateTimeFormat
    return new Intl.DateTimeFormat("en-US", {
      month: "short", // Abbreviated month (e.g., "Dec")
      day: "2-digit", // Two-digit day (e.g., "10")
      year: "numeric", // Full year (e.g., "2024")
    }).format(date);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid Date";
  }
}

/**
 * Utility function `cn` for managing and merging class names dynamically.
 *
 * ## Purpose
 * - Simplifies dynamic class name management in React or similar frameworks.
 * - Resolves conflicts in Tailwind CSS class names (e.g., `p-4` vs. `p-8`) using `tailwind-merge`.
 * - Combines multiple conditional and static classes in a clean, readable format.
 *
 * ## Features
 * - **Dynamic Class Handling**:
 *   - Allows conditional inclusion of classes based on props, state, or other conditions.
 *   - Example: `isActive && "bg-blue-500"` will include `"bg-blue-500"` only if `isActive` is true.
 * - **Conflict Resolution**:
 *   - Automatically resolves conflicting Tailwind classes (e.g., `p-4` and `p-8`) by keeping the last one (`p-8`).
 * - **Enhanced Readability**:
 *   - Consolidates static and dynamic class names into a single, concise function call.
 *
 * ## Parameters
 * - `...inputs: ClassValue[]`
 *   - Spread operator to accept multiple class values (strings, arrays, objects).
 *   - `ClassValue` is typed from `clsx`, allowing strings, arrays, objects, and conditionals.
 *
 * ## Return Value
 * - A single merged string of class names with resolved conflicts and filtered falsy values.
 *
 * ## Dependencies
 * - **clsx**: Handles conditional class inclusion.
 *   - Filters out falsy values like `undefined`, `null`, `false`, etc.
 * - **tailwind-merge**: Resolves conflicting Tailwind class names.
 *
 * ## Example Usage
 * ```typescript
 * const classes = cn("p-4", "text-center", isActive && "bg-green-500");
 * // Output: "p-4 text-center bg-green-500" (if isActive is true)
 *
 * const resolvedClasses = cn("p-4", "p-8");
 * // Output: "p-8" (last class takes precedence)
 *
 * <div className={cn("flex", isLoading ? "opacity-50" : "opacity-100")}>...</div>
 * ```
 *
 * ## Error Handling
 * - Automatically ignores invalid or falsy class values (`null`, `undefined`, `false`).
 *
 * ## Use Case
 * - Perfect for dynamically managing class names in React components where class names are dependent on props, state, or conditions.
 */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
