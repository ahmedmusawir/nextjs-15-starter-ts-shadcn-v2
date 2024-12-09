import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { products } from "@/demo-data/data";
import { CartDetail, CartItem } from "@/types/cart";

// Type for the Zustand store
interface CartStore {
  cartItems: CartItem[]; // The list of items in the cart
  isCartOpen: boolean; // Whether the cart drawer is open
  isLoading: boolean; // To check the loading state
  setIsLoading: (loading: boolean) => void; // To Set loading state
  setIsCartOpen: (isOpen: boolean) => void; // Toggle the cart drawer
  setCartItems: (newCartItems: CartItem[]) => void; // Directly update cart items
  getItemQuantity: (itemId: number) => number; // Get the quantity of a specific item
  increaseCartQuantity: (itemId: number) => void; // Increment the quantity of a specific item
  decreaseCartQuantity: (itemId: number) => void; // Decrement the quantity of a specific item
  removeFromCart: (itemId: number) => void; // Remove an item from the cart
  clearCart: () => void; // Clear the entire cart
  cartDetails: () => CartDetail[]; // Get detailed cart items with product info
  subtotal: () => number; // Calculate the subtotal of all items in the cart
}

// Define the Zustand store with persist middleware
export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // Array to hold cart items (persisted)
      cartItems: [],
      // Boolean to track if the cart is open
      isCartOpen: false,
      isLoading: true, // Initial state is loading
      setIsLoading: (loading) => set({ isLoading: loading }),

      // Toggle the cart open/close state
      setIsCartOpen: (isOpen) => set({ isCartOpen: isOpen }),
      // Replace the current cart items with a new list
      setCartItems: (newCartItems: CartItem[]) =>
        set({ cartItems: newCartItems }),
      // Get the quantity of an item by ID
      getItemQuantity: (itemId) =>
        get().cartItems.find((item) => item.id === itemId)?.quantity || 0,
      // Increase the quantity of an item in the cart
      increaseCartQuantity: (itemId) =>
        set((state) => {
          const existingItem = state.cartItems.find(
            (item) => item.id === itemId
          );
          if (existingItem) {
            return {
              cartItems: state.cartItems.map((item) =>
                item.id === itemId
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          } else {
            return {
              cartItems: [...state.cartItems, { id: itemId, quantity: 1 }],
            };
          }
        }),
      // Decrease the quantity of an item in the cart
      decreaseCartQuantity: (itemId) =>
        set((state) => {
          const existingItem = state.cartItems.find(
            (item) => item.id === itemId
          );
          // If the quantity is 1, remove the item from the cart
          if (existingItem?.quantity === 1) {
            return {
              cartItems: state.cartItems.filter((item) => item.id !== itemId),
            };
          } else {
            // Otherwise, decrement its quantity
            return {
              cartItems: state.cartItems.map((item) =>
                item.id === itemId
                  ? { ...item, quantity: item.quantity - 1 }
                  : item
              ),
            };
          }
        }),
      // Remove an item from the cart entirely
      removeFromCart: (itemId) =>
        set((state) => ({
          cartItems: state.cartItems.filter((item) => item.id !== itemId),
        })),
      // Clear all items from the cart
      clearCart: () => set({ cartItems: [] }),
      // Get detailed information about each cart item (product details)
      cartDetails: () => {
        const cartItems = get().cartItems || [];
        return cartItems.map((cartItem) => {
          const product = products.find((p) => p.id === cartItem.id);
          if (!product)
            throw new Error(`Product with id ${cartItem.id} not found`);
          return { ...cartItem, productDetails: product };
        });
      },
      // Calculate the subtotal of all items in the cart
      subtotal: () => {
        const cartItems = get().cartItems || [];
        return parseFloat(
          cartItems
            .reduce((acc, cartItem) => {
              const product = products.find((p) => p.id === cartItem.id);
              if (!product) return acc;
              return (
                acc +
                parseFloat(product.price.replace("$", "")) * cartItem.quantity
              );
            }, 0)
            .toFixed(2)
        );
      },
    }),
    {
      name: "cart-storage", // Name of the localStorage key
      onRehydrateStorage: () => (state) => {
        state?.setIsLoading(false); // Hydration is complete
      },
      storage: createJSONStorage(() => localStorage), // Explicitly define the storage mechanism
      partialize: (state) => ({ cartItems: state.cartItems }), // Persist only the cartItems
    }
  )
);
