import { Product } from "./product";

// Type for individual cart items
export interface CartItem {
  id: number;
  quantity: number;
}

// Type for cart details (cart item + product details)
export interface CartDetail {
  id: number;
  quantity: number;
  productDetails: Product;
}
