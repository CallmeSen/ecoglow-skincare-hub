import { type Product, type InsertProduct, type User, type InsertUser, type CartItem, type InsertCartItem, type WishlistItem, type InsertWishlistItem, type Order, type InsertOrder, type BlogPost, type InsertBlogPost, type QuizResponse, type InsertQuizResponse } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Product operations
  getProducts(filters?: { category?: string; featured?: boolean; trending?: boolean }): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined>;
  searchProducts(query: string): Promise<Product[]>;

  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<InsertUser>): Promise<User | undefined>;

  // Cart operations
  getCartItems(userId: string): Promise<CartItem[]>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: string, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: string): Promise<boolean>;
  clearCart(userId: string): Promise<boolean>;

  // Wishlist operations
  getWishlistItems(userId: string): Promise<WishlistItem[]>;
  addToWishlist(item: InsertWishlistItem): Promise<WishlistItem>;
  removeFromWishlist(id: string): Promise<boolean>;

  // Order operations
  createOrder(order: InsertOrder): Promise<Order>;
  getOrders(userId: string): Promise<Order[]>;
  getOrder(id: string): Promise<Order | undefined>;

  // Blog operations
  getBlogPosts(filters?: { category?: string; featured?: boolean }): Promise<BlogPost[]>;
  getBlogPost(slug: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;

  // Quiz operations
  saveQuizResponse(response: InsertQuizResponse): Promise<QuizResponse>;
  getQuizResponse(userId: string): Promise<QuizResponse | undefined>;
}

export class MemStorage implements IStorage {
  private products: Map<string, Product>;
  private users: Map<string, User>;
  private cartItems: Map<string, CartItem>;
  private wishlistItems: Map<string, WishlistItem>;
  private orders: Map<string, Order>;
  private blogPosts: Map<string, BlogPost>;
  private quizResponses: Map<string, QuizResponse>;

  constructor() {
    this.products = new Map();
    this.users = new Map();
    this.cartItems = new Map();
    this.wishlistItems = new Map();
    this.orders = new Map();
    this.blogPosts = new Map();
    this.quizResponses = new Map();
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample products
    const sampleProducts: Product[] = [
      {
        id: "1",
        name: "Bakuchiol Glow Serum",
        description: "Our bestselling bakuchiol serum offers gentle anti-aging benefits without irritation. Derived from Psoralea corylifolia, this plant-based powerhouse reduces fine lines by up to 20% in clinical studies while being 100% vegan and cruelty-free.",
        price: "28.00",
        category: "serums",
        subcategory: "anti-aging",
        images: ["https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800"],
        ingredients: ["Bakuchiol 1%", "Hyaluronic Acid", "Vitamin E", "Jojoba Oil", "Rose Hip Oil"],
        benefits: ["Reduces fine lines", "Improves skin elasticity", "Gentle on sensitive skin", "Antioxidant protection"],
        skinTypes: ["dry", "combination", "sensitive"],
        concerns: ["aging", "hydration"],
        sustainabilityScore: 95,
        isVegan: true,
        isCrueltyFree: true,
        isOrganic: true,
        carbonFootprint: "0.5",
        stock: 50,
        rating: "4.8",
        reviewCount: 234,
        featured: true,
        trending: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "2",
        name: "Beet Tinted Balm",
        description: "Multi-use vegan color made from natural beet extracts. This nourishing balm provides buildable color while moisturizing your lips with organic ingredients.",
        price: "15.00",
        category: "makeup",
        subcategory: "lips",
        images: ["https://images.unsplash.com/photo-1586495777744-4413f21062fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800"],
        ingredients: ["Beet Extract", "Coconut Oil", "Shea Butter", "Carnauba Wax", "Vitamin E"],
        benefits: ["Natural color", "Moisturizing", "Long-lasting", "Buildable coverage"],
        skinTypes: ["all"],
        concerns: ["hydration"],
        sustainabilityScore: 90,
        isVegan: true,
        isCrueltyFree: true,
        isOrganic: true,
        carbonFootprint: "0.3",
        stock: 75,
        rating: "4.6",
        reviewCount: 156,
        featured: true,
        trending: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "3",
        name: "Complete Glow Kit",
        description: "5-piece sustainable routine with customizable options. Includes cleanser, toner, serum, moisturizer, and mask in eco-friendly packaging.",
        price: "65.00",
        category: "kits",
        subcategory: "skincare",
        images: ["https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800"],
        ingredients: ["Bakuchiol", "Hyaluronic Acid", "Plant Ceramides", "Green Tea Extract", "Niacinamide"],
        benefits: ["Complete routine", "Eco-friendly packaging", "Customizable", "15% savings"],
        skinTypes: ["all"],
        concerns: ["aging", "hydration", "acne"],
        sustainabilityScore: 98,
        isVegan: true,
        isCrueltyFree: true,
        isOrganic: true,
        carbonFootprint: "1.2",
        stock: 30,
        rating: "4.9",
        reviewCount: 89,
        featured: true,
        trending: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "4",
        name: "Beet Glow Gummies",
        description: "Internal radiance supplement with 500mg beet extract for natural glow and detoxification. Comes in compostable packaging.",
        price: "22.00",
        category: "supplements",
        subcategory: "gummies",
        images: ["https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800"],
        ingredients: ["Beet Extract 500mg", "Vitamin C", "Biotin", "Zinc", "Natural Berry Flavor"],
        benefits: ["Internal glow", "Detoxification", "Antioxidant support", "Skin health"],
        skinTypes: ["all"],
        concerns: ["dullness", "detox"],
        sustainabilityScore: 85,
        isVegan: true,
        isCrueltyFree: true,
        isOrganic: false,
        carbonFootprint: "0.8",
        stock: 100,
        rating: "4.5",
        reviewCount: 167,
        featured: false,
        trending: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    sampleProducts.forEach(product => this.products.set(product.id, product));

    // Sample blog posts
    const sampleBlogPosts: BlogPost[] = [
      {
        id: "1",
        title: "Bakuchiol: The 2025 Retinol Revolution",
        slug: "bakuchiol-retinol-revolution-2025",
        excerpt: "Discover why this plant-based alternative is taking the beauty world by storm with 300% search growth.",
        content: "Full blog content about bakuchiol benefits and usage...",
        featuredImage: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        category: "skincare-science",
        readTime: 5,
        featured: true,
        productIds: ["1"],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "2",
        title: "Beet-Tinted Looks for Natural Glow",
        slug: "beet-tinted-natural-glow-makeup",
        excerpt: "Master the art of natural, plant-based color with our step-by-step tutorials.",
        content: "Full blog content about beet-based makeup...",
        featuredImage: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        category: "makeup-trends",
        readTime: 7,
        featured: true,
        productIds: ["2"],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "3",
        title: "Zero-Waste Beauty Routine Guide",
        slug: "zero-waste-beauty-routine-guide",
        excerpt: "Simple steps to create an eco-friendly beauty routine that's good for you and the planet.",
        content: "Full blog content about sustainable beauty...",
        featuredImage: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        category: "sustainability",
        readTime: 4,
        featured: true,
        productIds: ["3"],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    sampleBlogPosts.forEach(post => this.blogPosts.set(post.id, post));
  }

  // Product operations
  async getProducts(filters?: { category?: string; featured?: boolean; trending?: boolean }): Promise<Product[]> {
    let products = Array.from(this.products.values());
    
    if (filters?.category) {
      products = products.filter(p => p.category === filters.category);
    }
    if (filters?.featured !== undefined) {
      products = products.filter(p => p.featured === filters.featured);
    }
    if (filters?.trending !== undefined) {
      products = products.filter(p => p.trending === filters.trending);
    }
    
    return products;
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const newProduct: Product = {
      ...product,
      id,
      concerns: product.concerns || [],
      ingredients: product.ingredients || [],
      benefits: product.benefits || [],
      skinTypes: product.skinTypes || [],
      images: product.images || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.products.set(id, newProduct);
    return newProduct;
  }

  async updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const existing = this.products.get(id);
    if (!existing) return undefined;
    
    const updated = { 
      ...existing, 
      ...product,
      concerns: product.concerns || existing.concerns,
      ingredients: product.ingredients || existing.ingredients,
      benefits: product.benefits || existing.benefits,
      skinTypes: product.skinTypes || existing.skinTypes,
      images: product.images || existing.images,
      updatedAt: new Date() 
    };
    this.products.set(id, updated);
    return updated;
  }

  async searchProducts(query: string): Promise<Product[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.products.values()).filter(product =>
      product.name.toLowerCase().includes(lowercaseQuery) ||
      product.description.toLowerCase().includes(lowercaseQuery) ||
      product.category.toLowerCase().includes(lowercaseQuery) ||
      (product.ingredients && product.ingredients.some(ing => ing.toLowerCase().includes(lowercaseQuery)))
    );
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = randomUUID();
    const newUser: User = {
      ...user,
      id,
      skinConcerns: user.skinConcerns || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(id, newUser);
    return newUser;
  }

  async updateUser(id: string, user: Partial<InsertUser>): Promise<User | undefined> {
    const existing = this.users.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...user, updatedAt: new Date() };
    this.users.set(id, updated);
    return updated;
  }

  // Cart operations
  async getCartItems(userId: string): Promise<CartItem[]> {
    return Array.from(this.cartItems.values()).filter(item => item.userId === userId);
  }

  async addToCart(item: InsertCartItem): Promise<CartItem> {
    const id = randomUUID();
    const newItem: CartItem = {
      ...item,
      id,
      createdAt: new Date(),
    };
    this.cartItems.set(id, newItem);
    return newItem;
  }

  async updateCartItem(id: string, quantity: number): Promise<CartItem | undefined> {
    const existing = this.cartItems.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, quantity };
    this.cartItems.set(id, updated);
    return updated;
  }

  async removeFromCart(id: string): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  async clearCart(userId: string): Promise<boolean> {
    const items = await this.getCartItems(userId);
    items.forEach(item => this.cartItems.delete(item.id));
    return true;
  }

  // Wishlist operations
  async getWishlistItems(userId: string): Promise<WishlistItem[]> {
    return Array.from(this.wishlistItems.values()).filter(item => item.userId === userId);
  }

  async addToWishlist(item: InsertWishlistItem): Promise<WishlistItem> {
    const id = randomUUID();
    const newItem: WishlistItem = {
      ...item,
      id,
      createdAt: new Date(),
    };
    this.wishlistItems.set(id, newItem);
    return newItem;
  }

  async removeFromWishlist(id: string): Promise<boolean> {
    return this.wishlistItems.delete(id);
  }

  // Order operations
  async createOrder(order: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const newOrder: Order = {
      ...order,
      id,
      createdAt: new Date(),
    };
    this.orders.set(id, newOrder);
    return newOrder;
  }

  async getOrders(userId: string): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(order => order.userId === userId);
  }

  async getOrder(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  // Blog operations
  async getBlogPosts(filters?: { category?: string; featured?: boolean }): Promise<BlogPost[]> {
    let posts = Array.from(this.blogPosts.values());
    
    if (filters?.category) {
      posts = posts.filter(p => p.category === filters.category);
    }
    if (filters?.featured !== undefined) {
      posts = posts.filter(p => p.featured === filters.featured);
    }
    
    return posts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getBlogPost(slug: string): Promise<BlogPost | undefined> {
    return Array.from(this.blogPosts.values()).find(post => post.slug === slug);
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const id = randomUUID();
    const newPost: BlogPost = {
      ...post,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.blogPosts.set(id, newPost);
    return newPost;
  }

  // Quiz operations
  async saveQuizResponse(response: InsertQuizResponse): Promise<QuizResponse> {
    const id = randomUUID();
    const newResponse: QuizResponse = {
      ...response,
      id,
      createdAt: new Date(),
    };
    this.quizResponses.set(id, newResponse);
    return newResponse;
  }

  async getQuizResponse(userId: string): Promise<QuizResponse | undefined> {
    return Array.from(this.quizResponses.values()).find(response => response.userId === userId);
  }
}

export const storage = new MemStorage();
