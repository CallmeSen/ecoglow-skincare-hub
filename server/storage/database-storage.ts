import { eq, ilike, and, desc, asc, sql, inArray } from "drizzle-orm";
import { db } from "../db";
import { 
  products, 
  users, 
  cartItems, 
  wishlistItems, 
  orders, 
  orderItems,
  reviews,
  blogPosts, 
  quizResponses,
  categories,
  suppliers,
  carbonFootprints,
  inventoryLogs,
  auditLogs
} from "../../shared/schema";
import type { IStorage } from "../storage";
import type { 
  Product, InsertProduct,
  User, InsertUser,
  CartItem, InsertCartItem,
  WishlistItem, InsertWishlistItem,
  Order, InsertOrder,
  BlogPost, InsertBlogPost,
  QuizResponse, InsertQuizResponse,
  Category, InsertCategory,
  Supplier, InsertSupplier,
  Review, InsertReview,
  CarbonFootprint, InsertCarbonFootprint,
  InventoryLog, InsertInventoryLog,
  AuditLog, InsertAuditLog
} from "../../shared/schema";

export class DatabaseStorage implements IStorage {
  
  // Product operations with enhanced database querying
  async getProducts(): Promise<Product[]> {
    try {
      return await db.select().from(products).orderBy(desc(products.featured), desc(products.trending));
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  }

  async getProduct(id: string): Promise<Product | undefined> {
    try {
      const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
      return result[0];
    } catch (error) {
      console.error("Error fetching product:", error);
      return undefined;
    }
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    try {
      const result = await db.insert(products).values(product).returning();
      
      // Log inventory addition
      if (product.stock && product.stock > 0) {
        await this.logInventoryChange(result[0].id, 'add', product.stock);
      }
      
      return result[0];
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  }

  async updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined> {
    try {
      const existing = await this.getProduct(id);
      if (!existing) return undefined;

      const result = await db.update(products)
        .set({ ...product, updatedAt: new Date() })
        .where(eq(products.id, id))
        .returning();

      // Log stock changes
      if (product.stock !== undefined && product.stock !== existing.stock) {
        const changeType = product.stock > existing.stock ? 'add' : 'remove';
        const quantity = Math.abs(product.stock - existing.stock);
        await this.logInventoryChange(id, changeType, quantity);
      }

      return result[0];
    } catch (error) {
      console.error("Error updating product:", error);
      return undefined;
    }
  }

  async deleteProduct(id: string): Promise<boolean> {
    try {
      const result = await db.delete(products).where(eq(products.id, id));
      return result.rowCount ? result.rowCount > 0 : false;
    } catch (error) {
      console.error("Error deleting product:", error);
      return false;
    }
  }

  async searchProducts(query: string): Promise<Product[]> {
    try {
      const searchTerm = `%${query.toLowerCase()}%`;
      return await db.select()
        .from(products)
        .where(
          sql`to_tsvector('english', ${products.name} || ' ' || ${products.description}) @@ plainto_tsquery('english', ${query})
              OR lower(${products.name}) LIKE ${searchTerm}
              OR lower(${products.description}) LIKE ${searchTerm}
              OR lower(${products.category}) LIKE ${searchTerm}`
        )
        .orderBy(desc(products.sustainabilityScore));
    } catch (error) {
      console.error("Error searching products:", error);
      return [];
    }
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    try {
      return await db.select()
        .from(products)
        .where(eq(products.category, category))
        .orderBy(desc(products.featured), desc(products.rating));
    } catch (error) {
      console.error("Error fetching products by category:", error);
      return [];
    }
  }

  // Enhanced user operations with GDPR compliance
  async getUsers(): Promise<User[]> {
    try {
      return await db.select().from(users).orderBy(desc(users.createdAt));
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  }

  async getUser(id: string): Promise<User | undefined> {
    try {
      const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
      return result[0];
    } catch (error) {
      console.error("Error fetching user:", error);
      return undefined;
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    try {
      const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
      return result[0];
    } catch (error) {
      console.error("Error fetching user by email:", error);
      return undefined;
    }
  }

  async createUser(user: InsertUser): Promise<User> {
    try {
      const result = await db.insert(users).values(user).returning();
      
      // Log user creation
      await this.logAuditAction("user_created", result[0].id, { email: user.email });
      
      return result[0];
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  async updateUser(id: string, user: Partial<InsertUser>): Promise<User | undefined> {
    try {
      const result = await db.update(users)
        .set({ ...user, updatedAt: new Date() })
        .where(eq(users.id, id))
        .returning();

      if (result.length > 0) {
        await this.logAuditAction("user_updated", id, user);
      }

      return result[0];
    } catch (error) {
      console.error("Error updating user:", error);
      return undefined;
    }
  }

  async deleteUser(id: string): Promise<boolean> {
    try {
      // GDPR compliance: Delete all user-related data
      await db.delete(cartItems).where(eq(cartItems.userId, id));
      await db.delete(wishlistItems).where(eq(wishlistItems.userId, id));
      await db.delete(reviews).where(eq(reviews.userId, id));
      await db.delete(quizResponses).where(eq(quizResponses.userId, id));
      
      // Anonymize orders instead of deleting for business records
      await db.update(orders)
        .set({ userId: null })
        .where(eq(orders.userId, id));

      const result = await db.delete(users).where(eq(users.id, id));
      
      await this.logAuditAction("user_deleted", id, { gdprCompliant: true });
      
      return result.rowCount ? result.rowCount > 0 : false;
    } catch (error) {
      console.error("Error deleting user:", error);
      return false;
    }
  }

  // Enhanced order operations with analytics support
  async getOrders(): Promise<Order[]> {
    try {
      return await db.select().from(orders).orderBy(desc(orders.createdAt));
    } catch (error) {
      console.error("Error fetching orders:", error);
      return [];
    }
  }

  async getOrder(id: string): Promise<Order | undefined> {
    try {
      const result = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
      return result[0];
    } catch (error) {
      console.error("Error fetching order:", error);
      return undefined;
    }
  }

  async getOrdersByUser(userId: string): Promise<Order[]> {
    try {
      return await db.select()
        .from(orders)
        .where(eq(orders.userId, userId))
        .orderBy(desc(orders.createdAt));
    } catch (error) {
      console.error("Error fetching user orders:", error);
      return [];
    }
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    try {
      const result = await db.insert(orders).values(order).returning();
      
      await this.logAuditAction("order_created", order.userId || null, { 
        orderId: result[0].id, 
        total: order.total 
      });
      
      return result[0];
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  }

  // Enhanced sustainability tracking
  async getSustainabilityStats(): Promise<{ treesPlanted: number; co2Offset: string }> {
    try {
      const result = await db.select({
        totalTrees: sql<number>`COALESCE(SUM(${users.treesPlanted}), 0)`,
        totalCo2: sql<string>`COALESCE(SUM(${users.co2Offset}::numeric), 0)`
      }).from(users);

      return {
        treesPlanted: result[0]?.totalTrees || 0,
        co2Offset: result[0]?.totalCo2 || "0"
      };
    } catch (error) {
      console.error("Error fetching sustainability stats:", error);
      return { treesPlanted: 0, co2Offset: "0" };
    }
  }

  // Cart operations remain the same but with database persistence
  async getCartItems(userId: string): Promise<CartItem[]> {
    try {
      return await db.select().from(cartItems).where(eq(cartItems.userId, userId));
    } catch (error) {
      console.error("Error fetching cart items:", error);
      return [];
    }
  }

  async addToCart(item: InsertCartItem): Promise<CartItem> {
    try {
      // Check if item already exists in cart
      const existing = await db.select()
        .from(cartItems)
        .where(and(
          eq(cartItems.userId, item.userId!),
          eq(cartItems.productId, item.productId)
        ))
        .limit(1);

      if (existing.length > 0) {
        // Update quantity if item exists
        const updated = await db.update(cartItems)
          .set({ quantity: existing[0].quantity + (item.quantity || 1) })
          .where(eq(cartItems.id, existing[0].id))
          .returning();
        return updated[0];
      } else {
        // Insert new item
        const result = await db.insert(cartItems).values(item).returning();
        return result[0];
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      throw error;
    }
  }

  async updateCartItem(id: string, quantity: number): Promise<CartItem | undefined> {
    try {
      const result = await db.update(cartItems)
        .set({ quantity })
        .where(eq(cartItems.id, id))
        .returning();
      return result[0];
    } catch (error) {
      console.error("Error updating cart item:", error);
      return undefined;
    }
  }

  async removeFromCart(userId: string, productId: string): Promise<boolean> {
    try {
      const result = await db.delete(cartItems)
        .where(and(
          eq(cartItems.userId, userId),
          eq(cartItems.productId, productId)
        ));
      return result.rowCount ? result.rowCount > 0 : false;
    } catch (error) {
      console.error("Error removing from cart:", error);
      return false;
    }
  }

  async clearCart(userId: string): Promise<boolean> {
    try {
      const result = await db.delete(cartItems).where(eq(cartItems.userId, userId));
      return result.rowCount ? result.rowCount >= 0 : false;
    } catch (error) {
      console.error("Error clearing cart:", error);
      return false;
    }
  }

  // Similar implementations for wishlist, blog posts, and quiz responses...
  async getWishlistItems(userId: string): Promise<WishlistItem[]> {
    try {
      return await db.select().from(wishlistItems).where(eq(wishlistItems.userId, userId));
    } catch (error) {
      console.error("Error fetching wishlist items:", error);
      return [];
    }
  }

  async addToWishlist(item: InsertWishlistItem): Promise<WishlistItem> {
    try {
      const result = await db.insert(wishlistItems).values(item).returning();
      return result[0];
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      throw error;
    }
  }

  async removeFromWishlist(userId: string, productId: string): Promise<boolean> {
    try {
      const result = await db.delete(wishlistItems)
        .where(and(
          eq(wishlistItems.userId, userId),
          eq(wishlistItems.productId, productId)
        ));
      return result.rowCount ? result.rowCount > 0 : false;
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      return false;
    }
  }

  async getBlogPosts(): Promise<BlogPost[]> {
    try {
      return await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      return [];
    }
  }

  async getBlogPost(id: string): Promise<BlogPost | undefined> {
    try {
      const result = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
      return result[0];
    } catch (error) {
      console.error("Error fetching blog post:", error);
      return undefined;
    }
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    try {
      const result = await db.insert(blogPosts).values(post).returning();
      return result[0];
    } catch (error) {
      console.error("Error creating blog post:", error);
      throw error;
    }
  }

  async createQuizResponse(response: InsertQuizResponse): Promise<QuizResponse> {
    try {
      const result = await db.insert(quizResponses).values(response).returning();
      return result[0];
    } catch (error) {
      console.error("Error creating quiz response:", error);
      throw error;
    }
  }

  async getQuizResponse(userId: string): Promise<QuizResponse | undefined> {
    try {
      const result = await db.select()
        .from(quizResponses)
        .where(eq(quizResponses.userId, userId))
        .orderBy(desc(quizResponses.createdAt))
        .limit(1);
      return result[0];
    } catch (error) {
      console.error("Error fetching quiz response:", error);
      return undefined;
    }
  }

  // Enhanced helper methods for advanced functionality
  private async logInventoryChange(productId: string, changeType: string, quantity: number, userId?: string): Promise<void> {
    try {
      await db.insert(inventoryLogs).values({
        productId,
        changeType,
        quantity,
        userId: userId || null
      });
    } catch (error) {
      console.error("Error logging inventory change:", error);
    }
  }

  private async logAuditAction(action: string, userId: string | null, details: Record<string, any>): Promise<void> {
    try {
      await db.insert(auditLogs).values({
        action,
        userId,
        details,
        ipAddress: null, // Would be filled by middleware
        userAgent: null  // Would be filled by middleware
      });
    } catch (error) {
      console.error("Error logging audit action:", error);
    }
  }

  // Analytics and reporting methods
  async getTopProducts(limit: number = 10): Promise<Product[]> {
    try {
      return await db.select()
        .from(products)
        .orderBy(desc(products.rating), desc(products.reviewCount))
        .limit(limit);
    } catch (error) {
      console.error("Error fetching top products:", error);
      return [];
    }
  }

  async getProductAnalytics(productId: string): Promise<{
    totalReviews: number;
    averageRating: number;
    sustainabilityScore: number;
    carbonFootprint: number;
  }> {
    try {
      const product = await this.getProduct(productId);
      if (!product) {
        return { totalReviews: 0, averageRating: 0, sustainabilityScore: 0, carbonFootprint: 0 };
      }

      const reviewStats = await db.select({
        count: sql<number>`COUNT(*)`,
        avgRating: sql<number>`AVG(${reviews.rating})`
      })
      .from(reviews)
      .where(eq(reviews.productId, productId));

      return {
        totalReviews: reviewStats[0]?.count || 0,
        averageRating: reviewStats[0]?.avgRating || 0,
        sustainabilityScore: product.sustainabilityScore || 0,
        carbonFootprint: parseFloat(product.carbonFootprint || "0")
      };
    } catch (error) {
      console.error("Error fetching product analytics:", error);
      return { totalReviews: 0, averageRating: 0, sustainabilityScore: 0, carbonFootprint: 0 };
    }
  }
}