import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, decimal, jsonb, uuid, serial, smallint } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Categories table with hierarchical nesting
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  description: text("description"),
  parentId: integer("parent_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Suppliers table for dropshipping integration
export const suppliers = pgTable("suppliers", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }).notNull(),
  apiEndpoint: varchar("api_endpoint", { length: 255 }),
  certification: jsonb("certification").$type<Record<string, any>>().default({}),
  contactEmail: varchar("contact_email", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const products = pgTable("products", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  cost: decimal("cost", { precision: 10, scale: 2 }).notNull(),
  sku: varchar("sku", { length: 50 }).notNull().unique(),
  category: varchar("category").notNull(),
  subcategory: varchar("subcategory"),
  categoryId: integer("category_id").references(() => categories.id),
  supplierId: uuid("supplier_id").references(() => suppliers.id),
  images: jsonb("images").$type<string[]>().default([]),
  ingredients: jsonb("ingredients").$type<{name: string, percentage?: number, source?: string}[]>().default([]),
  benefits: jsonb("benefits").$type<string[]>().default([]),
  skinTypes: jsonb("skin_types").$type<string[]>().default([]),
  concerns: jsonb("concerns").$type<string[]>().default([]),
  sustainabilityMetrics: jsonb("sustainability_metrics").$type<{
    co2PerUnit?: number,
    recycledPackaging?: boolean,
    offsetProgram?: string
  }>().default({}),
  sustainabilityScore: integer("sustainability_score").default(0),
  isVegan: boolean("is_vegan").default(false),
  isCrueltyFree: boolean("is_cruelty_free").default(false),
  isOrganic: boolean("is_organic").default(false),
  carbonFootprint: decimal("carbon_footprint", { precision: 5, scale: 2 }).default("0"),
  stock: integer("stock").default(0),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
  reviewCount: integer("review_count").default(0),
  featured: boolean("featured").default(false),
  trending: boolean("trending").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Inventory logs for auditing
export const inventoryLogs = pgTable("inventory_logs", {
  id: serial("id").primaryKey(),
  productId: uuid("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  changeType: varchar("change_type").notNull(), // 'add', 'remove', 'sale'
  quantity: integer("quantity").notNull(),
  userId: uuid("user_id"),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const users = pgTable("users", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email", { length: 255 }).unique(),
  passwordHash: varchar("password_hash", { length: 255 }),
  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),
  profileImageUrl: varchar("profile_image_url"),
  skinType: varchar("skin_type"), // 'oily', 'dry', 'combination', 'sensitive'
  skinConcerns: jsonb("skin_concerns").$type<string[]>().default([]),
  preferences: jsonb("preferences").$type<Record<string, any>>().default({}),
  address: jsonb("address").$type<{
    street?: string,
    city?: string,
    zip?: string,
    country?: string
  }>().default({}),
  sustainabilityPreference: varchar("sustainability_preference"),
  budget: varchar("budget"),
  loyaltyPoints: integer("loyalty_points").default(0),
  treesPlanted: integer("trees_planted").default(0),
  co2Offset: decimal("co2_offset", { precision: 8, scale: 2 }).default("0"),
  role: varchar("role").default("user"), // 'user', 'admin'
  consentFlags: jsonb("consent_flags").$type<{
    gdprConsent?: boolean,
    marketingConsent?: boolean,
    dataExportRequested?: boolean
  }>().default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  lastLogin: timestamp("last_login"),
});

export const cartItems = pgTable("cart_items", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").references(() => users.id),
  productId: uuid("product_id").notNull().references(() => products.id),
  quantity: integer("quantity").default(1),
  createdAt: timestamp("created_at").defaultNow(),
});

export const wishlistItems = pgTable("wishlist_items", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").references(() => users.id),
  productId: uuid("product_id").notNull().references(() => products.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  shipping: decimal("shipping", { precision: 10, scale: 2 }).default("0"),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  shippingAddress: jsonb("shipping_address").$type<{
    street?: string,
    city?: string,
    zip?: string,
    country?: string
  }>().default({}),
  paymentMethod: varchar("payment_method").default("stripe"), // 'stripe', 'paypal', 'apple_pay'
  paymentStatus: varchar("payment_status").default("pending"), // 'paid', 'failed', 'refunded'
  shippingType: varchar("shipping_type").default("standard"),
  carbonOffset: decimal("carbon_offset", { precision: 8, scale: 2 }).default("0"),
  treesPlanted: integer("trees_planted").default(0),
  status: varchar("status").default("pending"), // 'pending', 'processing', 'shipped', 'delivered', 'cancelled'
  createdAt: timestamp("created_at").defaultNow(),
});

// Order items junction table for relational integrity
export const orderItems = pgTable("order_items", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: uuid("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  productId: uuid("product_id").notNull().references(() => products.id, { onDelete: "restrict" }),
  quantity: integer("quantity").notNull(),
  priceAtPurchase: decimal("price_at_purchase", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Reviews table
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  productId: uuid("product_id").notNull().references(() => products.id),
  userId: uuid("user_id").notNull().references(() => users.id),
  rating: smallint("rating").notNull(), // 1-5
  comment: text("comment"),
  verified: boolean("verified").default(false),
  helpful: integer("helpful").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Carbon footprints table for sustainability tracking
export const carbonFootprints = pgTable("carbon_footprints", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: uuid("product_id").notNull().references(() => products.id),
  co2Value: decimal("co2_value", { precision: 5, scale: 2 }).notNull(),
  calculationMethod: text("calculation_method"),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

// Audit logs table for tracking user actions
export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  action: text("action").notNull(),
  userId: uuid("user_id").references(() => users.id),
  details: jsonb("details").$type<Record<string, any>>().default({}),
  ipAddress: varchar("ip_address"),
  userAgent: text("user_agent"),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const blogPosts = pgTable("blog_posts", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  slug: varchar("slug").notNull().unique(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  featuredImage: varchar("featured_image"),
  category: varchar("category").notNull(),
  readTime: integer("read_time").default(5),
  featured: boolean("featured").default(false),
  productIds: jsonb("product_ids").$type<string[]>().default([]),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const quizResponses = pgTable("quiz_responses", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").references(() => users.id),
  responses: jsonb("responses").$type<Record<string, any>>().notNull(),
  recommendations: jsonb("recommendations").$type<string[]>().default([]),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSupplierSchema = createInsertSchema(suppliers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertInventoryLogSchema = createInsertSchema(inventoryLogs).omit({
  id: true,
  timestamp: true,
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastLogin: true,
});

export const insertCartItemSchema = createInsertSchema(cartItems).omit({
  id: true,
  createdAt: true,
});

export const insertWishlistItemSchema = createInsertSchema(wishlistItems).omit({
  id: true,
  createdAt: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
});

export const insertOrderItemSchema = createInsertSchema(orderItems).omit({
  id: true,
  createdAt: true,
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCarbonFootprintSchema = createInsertSchema(carbonFootprints).omit({
  id: true,
  lastUpdated: true,
});

export const insertAuditLogSchema = createInsertSchema(auditLogs).omit({
  id: true,
  timestamp: true,
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertQuizResponseSchema = createInsertSchema(quizResponses).omit({
  id: true,
  createdAt: true,
});

// Type exports
export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Supplier = typeof suppliers.$inferSelect;
export type InsertSupplier = z.infer<typeof insertSupplierSchema>;
export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type InventoryLog = typeof inventoryLogs.$inferSelect;
export type InsertInventoryLog = z.infer<typeof insertInventoryLogSchema>;
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type CartItem = typeof cartItems.$inferSelect;
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
export type WishlistItem = typeof wishlistItems.$inferSelect;
export type InsertWishlistItem = z.infer<typeof insertWishlistItemSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type CarbonFootprint = typeof carbonFootprints.$inferSelect;
export type InsertCarbonFootprint = z.infer<typeof insertCarbonFootprintSchema>;
export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type QuizResponse = typeof quizResponses.$inferSelect;
export type InsertQuizResponse = z.infer<typeof insertQuizResponseSchema>;
