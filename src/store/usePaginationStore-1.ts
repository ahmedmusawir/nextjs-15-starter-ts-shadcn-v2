/**
 * Zustand Store for Pagination
 *
 * ## Purpose
 * - Centralizes the logic for managing paginated data such as blog posts, products, or other resources.
 * - Keeps track of the current `items`, `endCursor`, and `hasNextPage` for consistent pagination handling.
 *
 * ## State Variables
 * - `items`: Array of paginated items (e.g., posts or products).
 * - `endCursor`: Tracks the cursor for fetching the next page of items.
 * - `hasNextPage`: Boolean indicating whether more pages are available.
 * - `isLoading`: Boolean to indicate if data is being loaded.
 *
 * ## Actions
 * - `fetchNextPage`: Fetches the next page of items based on the `endCursor`.
 * - `resetPagination`: Resets the store to its initial state.
 *
 * ## Usage
 * - Import and use in any component requiring pagination.
 * - Example:
 *   - Fetch next page: `usePaginationStore.getState().fetchNextPage(fetchFunction);`
 *   - Reset pagination: `usePaginationStore.getState().resetPagination();`
 */

import { create } from "zustand";

interface PaginationStore<T> {
  items: T[]; // Array to store paginated items
  endCursor: string | null; // Cursor for the next page
  hasNextPage: boolean; // Indicator if more pages are available
  isLoading: boolean; // Loading state for UI feedback
  fetchNextPage: (
    fetchFunction: (
      cursor: string | null
    ) => Promise<{ items: T[]; endCursor: string | null; hasNextPage: boolean }>
  ) => Promise<void>;
  resetPagination: () => void; // Action to reset pagination state
}

export const usePaginationStore = create<PaginationStore<any>>((set) => ({
  items: [],
  endCursor: null,
  hasNextPage: true,
  isLoading: false,

  fetchNextPage: async (fetchFunction) => {
    set({ isLoading: true });

    try {
      // Call the fetch function with the current endCursor
      const { items, endCursor, hasNextPage } = await fetchFunction(
        usePaginationStore.getState().endCursor
      );

      set((state) => ({
        items: [...state.items, ...items], // Append new items to the existing list
        endCursor,
        hasNextPage,
        isLoading: false,
      }));
    } catch (error) {
      console.error("Error fetching next page:", error);
      set({ isLoading: false });
    }
  },

  resetPagination: () =>
    set({
      items: [],
      endCursor: null,
      hasNextPage: true,
      isLoading: false,
    }),
}));
