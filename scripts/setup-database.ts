#!/usr/bin/env tsx

/**
 * Database Setup Script for EcoGlow Skincare Hub
 * 
 * This script sets up the PostgreSQL database with all necessary tables,
 * indexes, constraints, triggers, and seed data for the EcoGlow platform.
 * 
 * Usage: npm run db:setup
 */

import { initializeDatabase } from "../server/db";
import { DatabaseMigrations } from "../database/migrations";
import { runSeeds } from "../database/seeds";

async function setupDatabase() {
  console.log("🌱 EcoGlow Database Setup Starting...\n");

  try {
    // Step 1: Initialize database connection
    console.log("📡 Connecting to database...");
    await initializeDatabase();
    console.log("✅ Database connection established\n");

    // Step 2: Push schema changes
    console.log("🔄 Pushing database schema...");
    console.log("Please run: npm run db:push");
    console.log("This will create all tables and relationships\n");

    // Step 3: Run migrations (indexes, constraints, triggers)
    console.log("🏗️  Running database migrations...");
    await DatabaseMigrations.runMigrations();
    console.log("✅ Database migrations completed\n");

    // Step 4: Seed initial data
    console.log("🌱 Seeding initial data...");
    const seedResults = await runSeeds();
    console.log("✅ Database seeding completed");
    console.log(`   - Categories: ${seedResults.categories.length}`);
    console.log(`   - Suppliers: ${seedResults.suppliers.length}`);
    console.log(`   - Products: ${seedResults.products.length}\n`);

    console.log("🎉 Database setup completed successfully!");
    console.log("\n📊 Next steps:");
    console.log("   1. Run 'npm run dev' to start the application");
    console.log("   2. Visit the application to test functionality");
    console.log("   3. Check database health with sustainability tracking");

  } catch (error) {
    console.error("❌ Database setup failed:", error);
    console.log("\n🔧 Troubleshooting:");
    console.log("   1. Verify DATABASE_URL environment variable is set");
    console.log("   2. Ensure PostgreSQL database is accessible");
    console.log("   3. Check Neon database connection status");
    console.log("   4. Run 'npm run db:push' if schema is not up to date");
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Database setup interrupted');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Database setup terminated');
  process.exit(0);
});

// Run the setup
setupDatabase();