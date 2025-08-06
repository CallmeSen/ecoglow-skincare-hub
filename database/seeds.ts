import { db } from "../server/db";
import { 
  categories, 
  suppliers, 
  products, 
  carbonFootprints 
} from "../shared/schema";

// Seed data for categories with hierarchical structure
export async function seedCategories() {
  const categoryData = [
    { name: "Skincare", description: "Premium skincare products" },
    { name: "Makeup", description: "Natural and vegan makeup" },
    { name: "Supplements", description: "Beauty supplements and vitamins" },
    { name: "Kits", description: "Curated product bundles" },
    { name: "Accessories", description: "Beauty tools and accessories" }
  ];

  try {
    const insertedCategories = await db.insert(categories).values(categoryData).returning();
    console.log(`Seeded ${insertedCategories.length} categories`);
    return insertedCategories;
  } catch (error) {
    console.error("Error seeding categories:", error);
    throw error;
  }
}

// Seed data for suppliers
export async function seedSuppliers() {
  const supplierData = [
    {
      name: "EcoSource Labs",
      apiEndpoint: "https://api.ecosource.com/v1",
      certification: {
        organic: true,
        fairTrade: true,
        carbonNeutral: true
      },
      contactEmail: "partners@ecosource.com"
    },
    {
      name: "Green Beauty Co",
      apiEndpoint: "https://api.greenbeauty.co/v2",
      certification: {
        vegan: true,
        crueltyFree: true,
        sustainablePackaging: true
      },
      contactEmail: "wholesale@greenbeauty.co"
    },
    {
      name: "Pure Botanicals",
      apiEndpoint: "https://api.purebotanicals.net/api",
      certification: {
        organic: true,
        wildcrafted: true,
        biodynamic: true
      },
      contactEmail: "b2b@purebotanicals.net"
    }
  ];

  try {
    const insertedSuppliers = await db.insert(suppliers).values(supplierData).returning();
    console.log(`Seeded ${insertedSuppliers.length} suppliers`);
    return insertedSuppliers;
  } catch (error) {
    console.error("Error seeding suppliers:", error);
    throw error;
  }
}

// Seed enhanced product data with new schema fields
export async function seedProducts() {
  const productData = [
    {
      name: "Bakuchiol Glow Serum",
      description: "Our bestselling bakuchiol serum offers gentle anti-aging benefits without irritation.",
      price: "28.00",
      cost: "10.00",
      sku: "BK-SER-001",
      category: "serums",
      subcategory: "anti-aging",
      ingredients: [
        { name: "Bakuchiol", percentage: 1, source: "plant-derived" },
        { name: "Hyaluronic Acid", percentage: 2, source: "synthetic" },
        { name: "Vitamin E", percentage: 0.5, source: "natural" }
      ],
      benefits: ["Reduces fine lines", "Improves elasticity", "Gentle on sensitive skin"],
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
      trending: true
    },
    {
      name: "Beet Tinted Balm",
      description: "Multi-use vegan color made from natural beet extracts.",
      price: "15.00",
      cost: "6.00",
      sku: "BT-BAL-002",
      category: "makeup",
      subcategory: "lips",
      ingredients: [
        { name: "Beet Extract", percentage: 15, source: "plant-derived" },
        { name: "Coconut Oil", percentage: 20, source: "plant-derived" },
        { name: "Shea Butter", percentage: 25, source: "plant-derived" }
      ],
      benefits: ["Natural color", "Moisturizing", "Long-lasting"],
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
      trending: false
    }
  ];

  try {
    const insertedProducts = await db.insert(products).values(productData).returning();
    console.log(`Seeded ${insertedProducts.length} products`);
    return insertedProducts;
  } catch (error) {
    console.error("Error seeding products:", error);
    throw error;
  }
}

// Seed carbon footprint data
export async function seedCarbonFootprints(productIds: string[]) {
  const carbonData = productIds.map(productId => ({
    productId,
    co2Value: Math.random() * 2,
    calculationMethod: "LCA standard methodology with third-party verification"
  }));

  try {
    const insertedFootprints = await db.insert(carbonFootprints).values(carbonData).returning();
    console.log(`Seeded ${insertedFootprints.length} carbon footprints`);
    return insertedFootprints;
  } catch (error) {
    console.error("Error seeding carbon footprints:", error);
    throw error;
  }
}

// Main seed function
export async function runSeeds() {
  try {
    console.log("Starting database seeding...");
    
    const seededCategories = await seedCategories();
    const seededSuppliers = await seedSuppliers();
    const seededProducts = await seedProducts();
    
    const productIds = seededProducts.map(p => p.id);
    await seedCarbonFootprints(productIds);
    
    console.log("Database seeding completed successfully!");
    
    return {
      categories: seededCategories,
      suppliers: seededSuppliers,
      products: seededProducts
    };
  } catch (error) {
    console.error("Database seeding failed:", error);
    throw error;
  }
}

// Run seeds if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runSeeds()
    .then(() => {
      console.log("✅ Seeding completed successfully");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Seeding failed:", error);
      process.exit(1);
    });
}