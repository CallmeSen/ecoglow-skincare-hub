#!/usr/bin/env tsx

/**
 * Database Health Check Script for EcoGlow Skincare Hub
 * 
 * This script performs comprehensive health checks on the database,
 * verifying connectivity, schema integrity, and data consistency.
 */

import { checkDatabaseHealth, db } from "../server/db";
import { sql } from "drizzle-orm";

interface HealthCheckResult {
  name: string;
  status: 'pass' | 'fail' | 'warn';
  message: string;
  details?: any;
}

async function runHealthChecks(): Promise<HealthCheckResult[]> {
  const checks: HealthCheckResult[] = [];

  // 1. Basic connectivity check
  try {
    const isHealthy = await checkDatabaseHealth();
    checks.push({
      name: "Database Connectivity",
      status: isHealthy ? 'pass' : 'fail',
      message: isHealthy ? "Database connection successful" : "Database connection failed"
    });
  } catch (error) {
    checks.push({
      name: "Database Connectivity",
      status: 'fail',
      message: "Database connection error",
      details: error
    });
  }

  // 2. Schema validation - check critical tables exist
  const requiredTables = [
    'products', 'users', 'orders', 'order_items', 'cart_items', 
    'wishlist_items', 'reviews', 'categories', 'suppliers', 
    'carbon_footprints', 'blog_posts', 'quiz_responses'
  ];

  for (const table of requiredTables) {
    try {
      const result = await db.execute(sql.raw(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = '${table}'
        );
      `));
      
      const exists = result.rows[0]?.exists;
      checks.push({
        name: `Table: ${table}`,
        status: exists ? 'pass' : 'fail',
        message: exists ? "Table exists" : "Table missing"
      });
    } catch (error) {
      checks.push({
        name: `Table: ${table}`,
        status: 'fail',
        message: "Error checking table",
        details: error
      });
    }
  }

  // 3. Data integrity checks
  try {
    // Check for orphaned records
    const orphanedCartItems = await db.execute(sql.raw(`
      SELECT COUNT(*) as count 
      FROM cart_items ci 
      LEFT JOIN products p ON ci.product_id = p.id 
      WHERE p.id IS NULL;
    `));

    const orphanedCount = parseInt(orphanedCartItems.rows[0]?.count || '0');
    checks.push({
      name: "Data Integrity - Cart Items",
      status: orphanedCount === 0 ? 'pass' : 'warn',
      message: orphanedCount === 0 ? "No orphaned cart items" : `${orphanedCount} orphaned cart items found`,
      details: { orphanedCount }
    });
  } catch (error) {
    checks.push({
      name: "Data Integrity - Cart Items",
      status: 'fail',
      message: "Error checking data integrity",
      details: error
    });
  }

  // 4. Index performance check
  try {
    const indexCheck = await db.execute(sql.raw(`
      SELECT 
        schemaname,
        tablename,
        indexname,
        indexdef
      FROM pg_indexes 
      WHERE schemaname = 'public' 
      AND tablename IN ('products', 'users', 'orders');
    `));

    const indexCount = indexCheck.rows.length;
    checks.push({
      name: "Database Indexes",
      status: indexCount > 5 ? 'pass' : 'warn',
      message: `${indexCount} indexes found`,
      details: { indexCount, indexes: indexCheck.rows }
    });
  } catch (error) {
    checks.push({
      name: "Database Indexes",
      status: 'fail',
      message: "Error checking indexes",
      details: error
    });
  }

  // 5. Sample data validation
  try {
    const productCount = await db.execute(sql.raw(`SELECT COUNT(*) as count FROM products;`));
    const userCount = await db.execute(sql.raw(`SELECT COUNT(*) as count FROM users;`));
    
    const products = parseInt(productCount.rows[0]?.count || '0');
    const users = parseInt(userCount.rows[0]?.count || '0');

    checks.push({
      name: "Sample Data",
      status: products > 0 ? 'pass' : 'warn',
      message: `${products} products, ${users} users`,
      details: { products, users }
    });
  } catch (error) {
    checks.push({
      name: "Sample Data",
      status: 'fail',
      message: "Error checking sample data",
      details: error
    });
  }

  return checks;
}

async function displayHealthReport(checks: HealthCheckResult[]) {
  console.log("🏥 EcoGlow Database Health Check Report\n");
  console.log("=" .repeat(60));

  const passed = checks.filter(c => c.status === 'pass').length;
  const failed = checks.filter(c => c.status === 'fail').length;
  const warnings = checks.filter(c => c.status === 'warn').length;

  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`⚠️  Warnings: ${warnings}`);
  console.log("=" .repeat(60) + "\n");

  for (const check of checks) {
    const icon = check.status === 'pass' ? '✅' : check.status === 'fail' ? '❌' : '⚠️';
    console.log(`${icon} ${check.name}: ${check.message}`);
    
    if (check.details && (check.status === 'fail' || check.status === 'warn')) {
      console.log(`   Details: ${JSON.stringify(check.details, null, 2)}`);
    }
  }

  console.log("\n" + "=" .repeat(60));
  
  if (failed > 0) {
    console.log("❌ Database health check FAILED");
    console.log("\n🔧 Recommended actions:");
    console.log("   1. Run 'npm run db:push' to update schema");
    console.log("   2. Run 'npm run db:setup' to initialize database");
    console.log("   3. Check DATABASE_URL environment variable");
    return false;
  } else if (warnings > 0) {
    console.log("⚠️  Database health check passed with warnings");
    console.log("\n💡 Consider addressing warnings for optimal performance");
    return true;
  } else {
    console.log("✅ Database health check PASSED");
    console.log("\n🎉 Your database is healthy and ready for production!");
    return true;
  }
}

async function main() {
  try {
    const checks = await runHealthChecks();
    const healthy = await displayHealthReport(checks);
    process.exit(healthy ? 0 : 1);
  } catch (error) {
    console.error("❌ Health check failed:", error);
    process.exit(1);
  }
}

// Run health check
main();