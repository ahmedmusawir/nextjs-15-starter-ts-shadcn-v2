"use client";

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import Link from "next/link";
import { Button } from "../ui/button";

const Cart = () => {
  const router = useRouter();

  // Access Zustand store
  const {
    cartDetails,
    subtotal,
    removeFromCart,
    setIsCartOpen,
    isCartOpen,
    setCartItems,
  } = useCartStore();

  // console.log("CART DETAILS (/comp/cart)", cartDetails);

  // Handle quantity changes
  const handleQuantityChange = (itemId: number, newQuantity: number) => {
    const updatedCartItems = cartDetails().map((item) =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCartItems); // Update Zustand store
  };

  // Redirect to shop if cart is empty
  const handleRemoveCartItem = (id: number) => {
    removeFromCart(id);
    if (cartDetails.length === 1) {
      router.push("/shop");
    }
  };

  const goBackToShop = () => {
    router.push("/shop");
    setIsCartOpen(false);
  };

  return (
    <Dialog open={isCartOpen} onClose={setIsCartOpen} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity duration-500 ease-in-out data-[closed]:opacity-0"
      />

      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <DialogPanel
              transition
              className="pointer-events-auto w-screen max-w-md transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
            >
              <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                  <div className="flex items-start justify-between">
                    <DialogTitle className="text-lg font-medium text-gray-900">
                      Shopping cart
                    </DialogTitle>
                    <div className="ml-3 flex h-7 items-center">
                      <button
                        type="button"
                        onClick={() => setIsCartOpen(false)}
                        className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                      >
                        <span className="sr-only">Close panel</span>
                        <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-8">
                    <div className="flow-root">
                      <ul
                        role="list"
                        className="-my-6 divide-y divide-gray-200"
                      >
                        {cartDetails().length === 0 && (
                          <h3 className="mt-12">The Shopping Cart is empty!</h3>
                        )}
                        {cartDetails().map((cartItem) => (
                          <li key={cartItem.id} className="flex py-6">
                            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                              <img
                                src={cartItem.productDetails.imageSrc}
                                alt={cartItem.productDetails.imageAlt}
                                className="h-full w-full object-cover object-center"
                              />
                            </div>

                            <div className="ml-4 flex flex-1 flex-col">
                              <div>
                                <div className="flex justify-between text-base font-medium text-gray-900">
                                  <h3>{cartItem.productDetails.name}</h3>
                                  <p className="ml-4">
                                    {cartItem.productDetails.price}
                                  </p>
                                </div>
                                <p className="mt-1 text-sm text-gray-500">
                                  {cartItem.productDetails.color}
                                </p>
                              </div>
                              <div className="flex flex-1 items-end justify-between text-sm">
                                <div className="flex items-center">
                                  <label
                                    htmlFor={`quantity-${cartItem.id}`}
                                    className="text-gray-500 mr-2 font-bold"
                                  >
                                    Qty
                                  </label>
                                  <select
                                    id={`quantity-${cartItem.id}`}
                                    name={`quantity-${cartItem.id}`}
                                    value={cartItem.quantity}
                                    onChange={(e) =>
                                      handleQuantityChange(
                                        cartItem.id,
                                        parseInt(e.target.value, 10)
                                      )
                                    }
                                    className="block max-w-full rounded-md border border-gray-300 py-1.5 px-3 text-base font-medium text-gray-700 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                  >
                                    {[...Array(10).keys()].map((i) => (
                                      <option key={i} value={i + 1}>
                                        {i + 1}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                                <button
                                  type="button"
                                  className="font-medium text-red-600 hover:text-red-500"
                                  onClick={() =>
                                    handleRemoveCartItem(cartItem.id)
                                  }
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                  <div className="flex justify-between text-base font-medium text-gray-900">
                    <p>Subtotal</p>
                    <p>${subtotal()}</p>
                  </div>
                  <div className="mt-6">
                    <Link
                      href={cartDetails().length > 0 ? "/checkout" : "#"}
                      className={`flex items-center justify-center rounded-md px-6 py-3 text-base font-medium shadow-sm ${
                        cartDetails().length > 0
                          ? "bg-indigo-600 text-white hover:bg-indigo-700 border border-transparent"
                          : "bg-gray-300 text-gray-500 border border-gray-400 cursor-not-allowed"
                      }`}
                    >
                      Checkout
                    </Link>
                    <Link
                      href={cartDetails().length > 0 ? "/cart" : "#"}
                      className={`flex items-center justify-center rounded-md px-6 py-3 text-base font-medium shadow-sm mt-5 ${
                        cartDetails().length > 0
                          ? "bg-purple-600 text-white hover:bg-indigo-700 border border-transparent"
                          : "bg-gray-300 text-gray-500 border border-gray-400 cursor-not-allowed"
                      }`}
                    >
                      Cart Page
                    </Link>
                  </div>
                  <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                    <p>
                      or{" "}
                      <button
                        type="button"
                        onClick={goBackToShop}
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        Continue Shopping
                        <span aria-hidden="true"> &rarr;</span>
                      </button>
                    </p>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default Cart;
