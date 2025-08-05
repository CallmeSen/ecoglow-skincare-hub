import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProductSchema, insertUserSchema, insertCartItemSchema, insertWishlistItemSchema, insertOrderSchema, insertBlogPostSchema, insertQuizResponseSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Product routes
  app.get("/api/products", async (req, res) => {
    try {
      const { category, featured, trending } = req.query;
      const filters: any = {};
      
      if (category) filters.category = category as string;
      if (featured !== undefined) filters.featured = featured === 'true';
      if (trending !== undefined) filters.trending = trending === 'true';
      
      const products = await storage.getProducts(filters);
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.get("/api/products/search/:query", async (req, res) => {
    try {
      const products = await storage.searchProducts(req.params.query);
      res.json(products);
    } catch (error) {
      console.error("Error searching products:", error);
      res.status(500).json({ message: "Failed to search products" });
    }
  });

  // User routes
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.patch("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.updateUser(req.params.id, req.body);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  // Cart routes
  app.get("/api/cart/:userId", async (req, res) => {
    try {
      const cartItems = await storage.getCartItems(req.params.userId);
      
      // Fetch product details for each cart item
      const itemsWithProducts = await Promise.all(
        cartItems.map(async (item) => {
          const product = await storage.getProduct(item.productId);
          return { ...item, product };
        })
      );
      
      res.json(itemsWithProducts);
    } catch (error) {
      console.error("Error fetching cart:", error);
      res.status(500).json({ message: "Failed to fetch cart" });
    }
  });

  app.post("/api/cart", async (req, res) => {
    try {
      const cartData = insertCartItemSchema.parse(req.body);
      const cartItem = await storage.addToCart(cartData);
      res.json(cartItem);
    } catch (error) {
      console.error("Error adding to cart:", error);
      res.status(500).json({ message: "Failed to add to cart" });
    }
  });

  app.patch("/api/cart/:id", async (req, res) => {
    try {
      const { quantity } = req.body;
      const cartItem = await storage.updateCartItem(req.params.id, quantity);
      if (!cartItem) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      res.json(cartItem);
    } catch (error) {
      console.error("Error updating cart item:", error);
      res.status(500).json({ message: "Failed to update cart item" });
    }
  });

  app.delete("/api/cart/:id", async (req, res) => {
    try {
      const success = await storage.removeFromCart(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      res.json({ message: "Item removed from cart" });
    } catch (error) {
      console.error("Error removing from cart:", error);
      res.status(500).json({ message: "Failed to remove from cart" });
    }
  });

  app.delete("/api/cart/clear/:userId", async (req, res) => {
    try {
      await storage.clearCart(req.params.userId);
      res.json({ message: "Cart cleared" });
    } catch (error) {
      console.error("Error clearing cart:", error);
      res.status(500).json({ message: "Failed to clear cart" });
    }
  });

  // Wishlist routes
  app.get("/api/wishlist/:userId", async (req, res) => {
    try {
      const wishlistItems = await storage.getWishlistItems(req.params.userId);
      
      // Fetch product details for each wishlist item
      const itemsWithProducts = await Promise.all(
        wishlistItems.map(async (item) => {
          const product = await storage.getProduct(item.productId);
          return { ...item, product };
        })
      );
      
      res.json(itemsWithProducts);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      res.status(500).json({ message: "Failed to fetch wishlist" });
    }
  });

  app.post("/api/wishlist", async (req, res) => {
    try {
      const wishlistData = insertWishlistItemSchema.parse(req.body);
      const wishlistItem = await storage.addToWishlist(wishlistData);
      res.json(wishlistItem);
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      res.status(500).json({ message: "Failed to add to wishlist" });
    }
  });

  app.delete("/api/wishlist/:id", async (req, res) => {
    try {
      const success = await storage.removeFromWishlist(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Wishlist item not found" });
      }
      res.json({ message: "Item removed from wishlist" });
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      res.status(500).json({ message: "Failed to remove from wishlist" });
    }
  });

  // Order routes
  app.post("/api/orders", async (req, res) => {
    try {
      const orderData = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(orderData);
      
      // Clear cart after successful order
      if (orderData.userId) {
        await storage.clearCart(orderData.userId);
      }
      
      res.json(order);
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  app.get("/api/orders/:userId", async (req, res) => {
    try {
      const orders = await storage.getOrders(req.params.userId);
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  // Blog routes
  app.get("/api/blog", async (req, res) => {
    try {
      const { category, featured } = req.query;
      const filters: any = {};
      
      if (category) filters.category = category as string;
      if (featured !== undefined) filters.featured = featured === 'true';
      
      const posts = await storage.getBlogPosts(filters);
      res.json(posts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  app.get("/api/blog/:slug", async (req, res) => {
    try {
      const post = await storage.getBlogPost(req.params.slug);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      console.error("Error fetching blog post:", error);
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  // Quiz routes
  app.post("/api/quiz", async (req, res) => {
    try {
      const quizData = insertQuizResponseSchema.parse(req.body);
      
      // Generate recommendations based on quiz responses
      const recommendations = await generateRecommendations(quizData.responses);
      
      const response = await storage.saveQuizResponse({
        ...quizData,
        recommendations,
      });
      
      res.json(response);
    } catch (error) {
      console.error("Error saving quiz response:", error);
      res.status(500).json({ message: "Failed to save quiz response" });
    }
  });

  app.get("/api/quiz/:userId", async (req, res) => {
    try {
      const response = await storage.getQuizResponse(req.params.userId);
      if (!response) {
        return res.status(404).json({ message: "Quiz response not found" });
      }
      res.json(response);
    } catch (error) {
      console.error("Error fetching quiz response:", error);
      res.status(500).json({ message: "Failed to fetch quiz response" });
    }
  });

  // Analytics and stats
  app.get("/api/stats/sustainability", async (req, res) => {
    try {
      // Calculate sustainability stats
      const stats = {
        treesPlanted: 12000,
        co2Offset: 500,
        sustainablePackaging: 95,
        happyCustomers: 25000,
      };
      res.json(stats);
    } catch (error) {
      console.error("Error fetching sustainability stats:", error);
      res.status(500).json({ message: "Failed to fetch sustainability stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Helper function to generate product recommendations based on quiz responses
async function generateRecommendations(responses: Record<string, any>): Promise<string[]> {
  const { skinType, concerns, sustainability, budget } = responses;
  
  // Simple recommendation algorithm
  const recommendations: string[] = [];
  
  // Always recommend bakuchiol serum for anti-aging concerns
  if (concerns?.includes('aging')) {
    recommendations.push('1'); // Bakuchiol Glow Serum
  }
  
  // Recommend beet balm for makeup users
  if (responses.makeup === 'yes' || concerns?.includes('hydration')) {
    recommendations.push('2'); // Beet Tinted Balm
  }
  
  // Recommend kit for complete routine seekers
  if (budget === 'medium' || budget === 'high') {
    recommendations.push('3'); // Complete Glow Kit
  }
  
  // Recommend supplements for internal health
  if (concerns?.includes('dullness') || sustainability === 'very') {
    recommendations.push('4'); // Beet Glow Gummies
  }
  
  return recommendations;
}
