import { create } from "zustand";
import { products } from "@/demo-data/data";
import { ProductStore } from "@/types/product";

export const useProductStore = create<ProductStore>(() => ({
  products, // Initialize with demo data
}));
