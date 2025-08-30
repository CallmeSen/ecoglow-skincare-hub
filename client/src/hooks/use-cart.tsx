import { createContext, useContext, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { CartItemWithProduct } from "@/lib/types";

interface CartContextType {
  items: CartItemWithProduct[];
  itemCount: number;
  total: number;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [userId] = useState("demo-user"); // In real app, get from auth
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["/api/cart", userId],
    enabled: !!userId,
  });

  const cartItems = Array.isArray(items) ? (items as CartItemWithProduct[]) : [];
  const itemCount = cartItems.reduce((sum: number, item: CartItemWithProduct) => sum + item.quantity, 0);
  const total = cartItems.reduce((sum: number, item: CartItemWithProduct) => {
    return sum + (parseFloat(item.product?.price || "0") * item.quantity);
  }, 0);

  const addToCartMutation = useMutation({
    mutationFn: async ({ productId, quantity = 1 }: { productId: string; quantity?: number }) => {
      await apiRequest("POST", "/api/cart", {
        userId,
        productId,
        quantity,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart", userId] });
      toast({
        title: "Added to cart",
        description: "Product has been added to your cart",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add product to cart",
        variant: "destructive",
      });
    },
  });

  const updateQuantityMutation = useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: string; quantity: number }) => {
      await apiRequest("PATCH", `/api/cart/${itemId}`, { quantity });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart", userId] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update cart item",
        variant: "destructive",
      });
    },
  });

  const removeFromCartMutation = useMutation({
    mutationFn: async (itemId: string) => {
      await apiRequest("DELETE", `/api/cart/${itemId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart", userId] });
      toast({
        title: "Removed from cart",
        description: "Product has been removed from your cart",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove product from cart",
        variant: "destructive",
      });
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/cart/clear/${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart", userId] });
      toast({
        title: "Cart cleared",
        description: "All items have been removed from your cart",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to clear cart",
        variant: "destructive",
      });
    },
  });

  const value: CartContextType = {
    items: cartItems,
    itemCount,
    total,
    addToCart: (productId: string, quantity = 1) => 
      addToCartMutation.mutateAsync({ productId, quantity }),
    updateQuantity: (itemId: string, quantity: number) =>
      updateQuantityMutation.mutateAsync({ itemId, quantity }),
    removeFromCart: (itemId: string) =>
      removeFromCartMutation.mutateAsync(itemId),
    clearCart: () => clearCartMutation.mutateAsync(),
    isLoading,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
