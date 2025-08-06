import { 
  type Product, type InsertProduct,
  type User, type InsertUser,
  type CartItem, type InsertCartItem,
  type WishlistItem, type InsertWishlistItem,
  type Order, type InsertOrder,
  type BlogPost, type InsertBlogPost,
  type QuizResponse, type InsertQuizResponse,
  type Category, type InsertCategory,
  type Supplier, type InsertSupplier,
  type Review, type InsertReview,
  type CarbonFootprint, type InsertCarbonFootprint,
  type InventoryLog, type InsertInventoryLog,
  type AuditLog, type InsertAuditLog
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Product operations
  getProducts(filters?: { category?: string; featured?: boolean; trending?: boolean }): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;
  searchProducts(query: string): Promise<Product[]>;
  getProductsByCategory(category: string): Promise<Product[]>;

  // User operations
  getUsers(): Promise<User[]>;
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<InsertUser>): Promise<User | undefined>;
  deleteUser(id: string): Promise<boolean>;

  // Cart operations
  getCartItems(userId: string): Promise<CartItem[]>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: string, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(userId: string, productId: string): Promise<boolean>;
  clearCart(userId: string): Promise<boolean>;

  // Wishlist operations
  getWishlistItems(userId: string): Promise<WishlistItem[]>;
  addToWishlist(item: InsertWishlistItem): Promise<WishlistItem>;
  removeFromWishlist(userId: string, productId: string): Promise<boolean>;

  // Order operations
  getOrders(): Promise<Order[]>;
  getOrder(id: string): Promise<Order | undefined>;
  getOrdersByUser(userId: string): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;

  // Blog operations
  getBlogPosts(filters?: { category?: string; featured?: boolean }): Promise<BlogPost[]>;
  getBlogPost(slug: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;

  // Quiz operations
  createQuizResponse(response: InsertQuizResponse): Promise<QuizResponse>;
  getQuizResponse(userId: string): Promise<QuizResponse | undefined>;

  // Sustainability operations
  getSustainabilityStats(): Promise<{ treesPlanted: number; co2Offset: string }>;
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
        cost: "10.00",
        sku: "BK-SER-001",
        category: "serums",
        subcategory: "anti-aging",
        categoryId: null,
        supplierId: null,
        images: ["https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800"],
        ingredients: [
          { name: "Bakuchiol", percentage: 1, source: "plant-derived" },
          { name: "Hyaluronic Acid", percentage: 2, source: "synthetic" },
          { name: "Vitamin E", percentage: 0.5, source: "natural" },
          { name: "Jojoba Oil", percentage: 10, source: "plant-derived" },
          { name: "Rose Hip Oil", percentage: 5, source: "plant-derived" }
        ],
        benefits: ["Reduces fine lines", "Improves skin elasticity", "Gentle on sensitive skin", "Antioxidant protection"],
        skinTypes: ["dry", "combination", "sensitive"],
        concerns: ["aging", "hydration"],
        sustainabilityMetrics: {
          co2PerUnit: 0.5,
          recycledPackaging: true,
          offsetProgram: "Ecologi"
        },
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
        cost: "6.00",
        sku: "BT-BAL-002",
        category: "makeup",
        subcategory: "lips",
        categoryId: null,
        supplierId: null,
        images: ["https://images.unsplash.com/photo-1586495777744-4413f21062fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800"],
        ingredients: [
          { name: "Beet Extract", percentage: 15, source: "plant-derived" },
          { name: "Coconut Oil", percentage: 20, source: "plant-derived" },
          { name: "Shea Butter", percentage: 25, source: "plant-derived" },
          { name: "Carnauba Wax", percentage: 5, source: "plant-derived" },
          { name: "Vitamin E", percentage: 0.5, source: "natural" }
        ],
        benefits: ["Natural color", "Moisturizing", "Long-lasting", "Buildable coverage"],
        skinTypes: ["all"],
        concerns: ["hydration"],
        sustainabilityMetrics: {
          co2PerUnit: 0.3,
          recycledPackaging: true,
          offsetProgram: "One Tree Planted"
        },
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
        cost: "25.00",
        sku: "CG-KIT-003",
        category: "kits",
        subcategory: "skincare",
        categoryId: null,
        supplierId: null,
        images: ["https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800"],
        ingredients: [
          { name: "Bakuchiol", percentage: 1, source: "plant-derived" },
          { name: "Hyaluronic Acid", percentage: 2, source: "synthetic" },
          { name: "Plant Ceramides", percentage: 3, source: "plant-derived" },
          { name: "Green Tea Extract", percentage: 5, source: "plant-derived" },
          { name: "Niacinamide", percentage: 5, source: "synthetic" }
        ],
        benefits: ["Complete routine", "Eco-friendly packaging", "Customizable", "15% savings"],
        skinTypes: ["all"],
        concerns: ["aging", "hydration", "acne"],
        sustainabilityMetrics: {
          co2PerUnit: 1.2,
          recycledPackaging: true,
          offsetProgram: "TreeApp"
        },
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
        cost: "8.00",
        sku: "BG-GUM-004",
        category: "supplements",
        subcategory: "gummies",
        categoryId: null,
        supplierId: null,
        images: ["https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800"],
        ingredients: [
          { name: "Beet Extract", percentage: 25, source: "plant-derived" },
          { name: "Vitamin C", percentage: 5, source: "synthetic" },
          { name: "Biotin", percentage: 0.1, source: "synthetic" },
          { name: "Zinc", percentage: 1, source: "mineral" },
          { name: "Natural Berry Flavor", percentage: 2, source: "natural" }
        ],
        benefits: ["Internal glow", "Detoxification", "Antioxidant support", "Skin health"],
        skinTypes: ["all"],
        concerns: ["dullness", "detox"],
        sustainabilityMetrics: {
          co2PerUnit: 0.8,
          recycledPackaging: false,
          offsetProgram: "Cool Effect"
        },
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
      id,
      name: product.name,
      description: product.description,
      price: product.price,
      cost: product.cost,
      sku: product.sku,
      category: product.category,
      subcategory: product.subcategory || null,
      categoryId: product.categoryId || null,
      supplierId: product.supplierId || null,
      images: product.images ? [...product.images] : [],
      ingredients: product.ingredients ? product.ingredients.map((ing: any) => ({
        name: ing.name,
        percentage: typeof ing.percentage === 'number' ? ing.percentage : undefined,
        source: typeof ing.source === 'string' ? ing.source : undefined
      })) : [],
      benefits: product.benefits ? [...product.benefits] : [],
      skinTypes: product.skinTypes ? [...product.skinTypes] : [],
      concerns: product.concerns ? [...product.concerns] : [],
      sustainabilityMetrics: product.sustainabilityMetrics ? {
        co2PerUnit: typeof product.sustainabilityMetrics.co2PerUnit === 'number' ? product.sustainabilityMetrics.co2PerUnit : undefined,
        recycledPackaging: typeof product.sustainabilityMetrics.recycledPackaging === 'boolean' ? product.sustainabilityMetrics.recycledPackaging : undefined,
        offsetProgram: typeof product.sustainabilityMetrics.offsetProgram === 'string' ? product.sustainabilityMetrics.offsetProgram : undefined
      } : {},
      sustainabilityScore: product.sustainabilityScore || 0,
      isVegan: product.isVegan || false,
      isCrueltyFree: product.isCrueltyFree || false,
      isOrganic: product.isOrganic || false,
      carbonFootprint: product.carbonFootprint || "0",
      stock: product.stock || 0,
      rating: product.rating || "0",
      reviewCount: product.reviewCount || 0,
      featured: product.featured || false,
      trending: product.trending || false,
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
      concerns: product.concerns ? [...product.concerns] : existing.concerns,
      ingredients: product.ingredients ? product.ingredients.map((ing: any) => ({
        name: ing.name,
        percentage: typeof ing.percentage === 'number' ? ing.percentage : undefined,
        source: typeof ing.source === 'string' ? ing.source : undefined
      })) : existing.ingredients,
      sustainabilityMetrics: product.sustainabilityMetrics ? {
        co2PerUnit: typeof product.sustainabilityMetrics.co2PerUnit === 'number' ? product.sustainabilityMetrics.co2PerUnit : undefined,
        recycledPackaging: typeof product.sustainabilityMetrics.recycledPackaging === 'boolean' ? product.sustainabilityMetrics.recycledPackaging : undefined,
        offsetProgram: typeof product.sustainabilityMetrics.offsetProgram === 'string' ? product.sustainabilityMetrics.offsetProgram : undefined
      } : existing.sustainabilityMetrics,
      benefits: product.benefits ? [...product.benefits] : existing.benefits,
      skinTypes: product.skinTypes ? [...product.skinTypes] : existing.skinTypes,
      images: product.images ? [...product.images] : existing.images,
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
      (product.ingredients && product.ingredients.some(ing => ing.name.toLowerCase().includes(lowercaseQuery)))
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
      id,
      email: user.email || null,
      passwordHash: user.passwordHash || null,
      firstName: user.firstName || null,
      lastName: user.lastName || null,
      profileImageUrl: user.profileImageUrl || null,
      skinType: user.skinType || null,
      skinConcerns: user.skinConcerns ? [...user.skinConcerns] : [],
      preferences: user.preferences || {},
      address: user.address ? {
        street: typeof user.address.street === 'string' ? user.address.street : undefined,
        city: typeof user.address.city === 'string' ? user.address.city : undefined,
        zip: typeof user.address.zip === 'string' ? user.address.zip : undefined,
        country: typeof user.address.country === 'string' ? user.address.country : undefined
      } : {},
      sustainabilityPreference: user.sustainabilityPreference || null,
      budget: user.budget || null,
      loyaltyPoints: user.loyaltyPoints || 0,
      treesPlanted: user.treesPlanted || 0,
      co2Offset: user.co2Offset || "0",
      role: user.role || "user",
      consentFlags: user.consentFlags ? {
        gdprConsent: typeof user.consentFlags.gdprConsent === 'boolean' ? user.consentFlags.gdprConsent : undefined,
        marketingConsent: typeof user.consentFlags.marketingConsent === 'boolean' ? user.consentFlags.marketingConsent : undefined,
        dataExportRequested: typeof user.consentFlags.dataExportRequested === 'boolean' ? user.consentFlags.dataExportRequested : undefined
      } : {},
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLogin: null,
    };
    this.users.set(id, newUser);
    return newUser;
  }

  async updateUser(id: string, user: Partial<InsertUser>): Promise<User | undefined> {
    const existing = this.users.get(id);
    if (!existing) return undefined;
    
    const updated = { 
      ...existing, 
      ...user, 
      skinConcerns: user.skinConcerns ? [...user.skinConcerns] : existing.skinConcerns,
      preferences: user.preferences || existing.preferences,
      address: user.address ? {
        street: typeof user.address.street === 'string' ? user.address.street : undefined,
        city: typeof user.address.city === 'string' ? user.address.city : undefined,
        zip: typeof user.address.zip === 'string' ? user.address.zip : undefined,
        country: typeof user.address.country === 'string' ? user.address.country : undefined
      } : existing.address,
      consentFlags: user.consentFlags ? {
        gdprConsent: typeof user.consentFlags.gdprConsent === 'boolean' ? user.consentFlags.gdprConsent : undefined,
        marketingConsent: typeof user.consentFlags.marketingConsent === 'boolean' ? user.consentFlags.marketingConsent : undefined,
        dataExportRequested: typeof user.consentFlags.dataExportRequested === 'boolean' ? user.consentFlags.dataExportRequested : undefined
      } : existing.consentFlags,
      updatedAt: new Date() 
    };
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
      id,
      userId: item.userId || null,
      productId: item.productId,
      quantity: item.quantity || 1,
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

  async removeFromCart(userId: string, productId: string): Promise<boolean> {
    const item = Array.from(this.cartItems.values()).find(
      item => item.userId === userId && item.productId === productId
    );
    if (item) {
      return this.cartItems.delete(item.id);
    }
    return false;
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
      id,
      userId: item.userId || null,
      productId: item.productId,
      createdAt: new Date(),
    };
    this.wishlistItems.set(id, newItem);
    return newItem;
  }

  async removeFromWishlist(userId: string, productId: string): Promise<boolean> {
    const item = Array.from(this.wishlistItems.values()).find(
      item => item.userId === userId && item.productId === productId
    );
    if (item) {
      return this.wishlistItems.delete(item.id);
    }
    return false;
  }

  // Order operations
  async getOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  async getOrder(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getOrdersByUser(userId: string): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(order => order.userId === userId);
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const newOrder: Order = {
      id,
      userId: order.userId || null,
      subtotal: order.subtotal,
      shipping: order.shipping || "0",
      total: order.total,
      shippingAddress: order.shippingAddress ? {
        street: typeof order.shippingAddress.street === 'string' ? order.shippingAddress.street : undefined,
        city: typeof order.shippingAddress.city === 'string' ? order.shippingAddress.city : undefined,
        zip: typeof order.shippingAddress.zip === 'string' ? order.shippingAddress.zip : undefined,
        country: typeof order.shippingAddress.country === 'string' ? order.shippingAddress.country : undefined
      } : {},
      paymentMethod: order.paymentMethod || "stripe",
      paymentStatus: order.paymentStatus || "pending",
      shippingType: order.shippingType || "standard",
      carbonOffset: order.carbonOffset || "0",
      treesPlanted: order.treesPlanted || 0,
      status: order.status || "pending",
      createdAt: new Date(),
    };
    this.orders.set(id, newOrder);
    return newOrder;
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
    
    return posts.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async getBlogPost(slug: string): Promise<BlogPost | undefined> {
    return Array.from(this.blogPosts.values()).find(post => post.slug === slug);
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const id = randomUUID();
    const newPost: BlogPost = {
      id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || null,
      content: post.content,
      featuredImage: post.featuredImage || null,
      category: post.category,
      readTime: post.readTime || 5,
      featured: post.featured || false,
      productIds: post.productIds ? [...post.productIds] : [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.blogPosts.set(id, newPost);
    return newPost;
  }

  // Quiz operations
  async createQuizResponse(response: InsertQuizResponse): Promise<QuizResponse> {
    const id = randomUUID();
    const newResponse: QuizResponse = {
      id,
      userId: response.userId || null,
      responses: response.responses,
      recommendations: response.recommendations ? [...response.recommendations] : [],
      createdAt: new Date(),
    };
    this.quizResponses.set(id, newResponse);
    return newResponse;
  }

  async getQuizResponse(userId: string): Promise<QuizResponse | undefined> {
    return Array.from(this.quizResponses.values()).find(response => response.userId === userId);
  }

  // Additional methods for enhanced interface
  async getUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async deleteProduct(id: string): Promise<boolean> {
    return this.products.delete(id);
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.users.delete(id);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(product => product.category === category);
  }

  async getSustainabilityStats(): Promise<{ treesPlanted: number; co2Offset: string }> {
    const users = Array.from(this.users.values());
    const treesPlanted = users.reduce((sum, user) => sum + (user.treesPlanted || 0), 0);
    const co2Offset = users.reduce((sum, user) => sum + parseFloat(user.co2Offset || "0"), 0);
    return {
      treesPlanted,
      co2Offset: co2Offset.toString()
    };
  }
}

export const storage = new MemStorage();
