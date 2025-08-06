import { db } from "../server/db";
import { sql } from "drizzle-orm";

// Database migration utilities for schema evolution
export class DatabaseMigrations {
  
  // Create indexes for performance optimization
  static async createIndexes() {
    const indexes = [
      // Product search and filtering indexes
      sql`CREATE INDEX IF NOT EXISTS idx_products_category ON products(category)`,
      sql`CREATE INDEX IF NOT EXISTS idx_products_trending ON products(trending) WHERE trending = true`,
      sql`CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured) WHERE featured = true`,
      sql`CREATE INDEX IF NOT EXISTS idx_products_stock ON products(stock) WHERE stock > 0`,
      sql`CREATE INDEX IF NOT EXISTS idx_products_rating ON products(rating DESC)`,
      sql`CREATE INDEX IF NOT EXISTS idx_products_price ON products(price)`,
      sql`CREATE INDEX IF NOT EXISTS idx_products_sustainability ON products(sustainability_score DESC)`,
      
      // Full-text search index for products
      sql`CREATE INDEX IF NOT EXISTS idx_products_search ON products USING gin(to_tsvector('english', name || ' ' || description))`,
      
      // User-related indexes
      sql`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email) WHERE email IS NOT NULL`,
      sql`CREATE INDEX IF NOT EXISTS idx_users_loyalty ON users(loyalty_points DESC)`,
      
      // Cart and wishlist indexes
      sql`CREATE INDEX IF NOT EXISTS idx_cart_items_user ON cart_items(user_id)`,
      sql`CREATE INDEX IF NOT EXISTS idx_wishlist_items_user ON wishlist_items(user_id)`,
      
      // Order indexes
      sql`CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id)`,
      sql`CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status)`,
      sql`CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC)`,
      sql`CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id)`,
      sql`CREATE INDEX IF NOT EXISTS idx_order_items_product ON order_items(product_id)`,
      
      // Review indexes
      sql`CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id)`,
      sql`CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(user_id)`,
      sql`CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating DESC)`,
      sql`CREATE INDEX IF NOT EXISTS idx_reviews_verified ON reviews(verified) WHERE verified = true`,
      
      // Carbon footprint indexes
      sql`CREATE INDEX IF NOT EXISTS idx_carbon_footprints_product ON carbon_footprints(product_id)`,
      
      // Audit log indexes
      sql`CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id)`,
      sql`CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp DESC)`,
      sql`CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action)`,
      
      // Inventory tracking indexes
      sql`CREATE INDEX IF NOT EXISTS idx_inventory_logs_product ON inventory_logs(product_id)`,
      sql`CREATE INDEX IF NOT EXISTS idx_inventory_logs_timestamp ON inventory_logs(timestamp DESC)`,
      
      // Category hierarchy indexes
      sql`CREATE INDEX IF NOT EXISTS idx_categories_parent ON categories(parent_id)`,
    ];

    try {
      for (const index of indexes) {
        await db.execute(index);
      }
      console.log("Database indexes created successfully");
    } catch (error) {
      console.error("Error creating indexes:", error);
      throw error;
    }
  }

  // Create database constraints for data integrity
  static async createConstraints() {
    const constraints = [
      // Rating constraints (using DO block for IF NOT EXISTS)
      sql`DO $$ 
          BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_products_rating') THEN
              ALTER TABLE products ADD CONSTRAINT chk_products_rating 
              CHECK (rating::numeric >= 0 AND rating::numeric <= 5);
            END IF;
          END $$`,
      
      sql`DO $$ 
          BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_reviews_rating') THEN
              ALTER TABLE reviews ADD CONSTRAINT chk_reviews_rating 
              CHECK (rating >= 1 AND rating <= 5);
            END IF;
          END $$`,
      
      // Price constraints
      sql`DO $$ 
          BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_products_price_positive') THEN
              ALTER TABLE products ADD CONSTRAINT chk_products_price_positive 
              CHECK (price::numeric > 0);
            END IF;
          END $$`,
      
      sql`DO $$ 
          BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_products_cost_positive') THEN
              ALTER TABLE products ADD CONSTRAINT chk_products_cost_positive 
              CHECK (cost::numeric >= 0);
            END IF;
          END $$`,
      
      // Stock constraints
      sql`DO $$ 
          BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_products_stock_non_negative') THEN
              ALTER TABLE products ADD CONSTRAINT chk_products_stock_non_negative 
              CHECK (stock >= 0);
            END IF;
          END $$`,
      
      // Sustainability score constraints
      sql`DO $$ 
          BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_products_sustainability_score') THEN
              ALTER TABLE products ADD CONSTRAINT chk_products_sustainability_score 
              CHECK (sustainability_score >= 0 AND sustainability_score <= 100);
            END IF;
          END $$`,
      
      // Order total constraints
      sql`DO $$ 
          BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_orders_subtotal_positive') THEN
              ALTER TABLE orders ADD CONSTRAINT chk_orders_subtotal_positive 
              CHECK (subtotal::numeric >= 0);
            END IF;
          END $$`,
      
      sql`DO $$ 
          BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_orders_total_positive') THEN
              ALTER TABLE orders ADD CONSTRAINT chk_orders_total_positive 
              CHECK (total::numeric >= 0);
            END IF;
          END $$`,
      
      // Loyalty points constraints
      sql`DO $$ 
          BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_users_loyalty_points_non_negative') THEN
              ALTER TABLE users ADD CONSTRAINT chk_users_loyalty_points_non_negative 
              CHECK (loyalty_points >= 0);
            END IF;
          END $$`,
      
      // Carbon footprint constraints
      sql`DO $$ 
          BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_carbon_footprints_co2_non_negative') THEN
              ALTER TABLE carbon_footprints ADD CONSTRAINT chk_carbon_footprints_co2_non_negative 
              CHECK (co2_value::numeric >= 0);
            END IF;
          END $$`,
    ];

    try {
      for (const constraint of constraints) {
        await db.execute(constraint);
      }
      console.log("Database constraints created successfully");
    } catch (error) {
      console.error("Error creating constraints:", error);
      throw error;
    }
  }

  // Create database triggers for automated operations
  static async createTriggers() {
    try {
      // Create the rating update function
      await db.execute(sql`
        CREATE OR REPLACE FUNCTION update_product_rating()
        RETURNS TRIGGER AS $$
        BEGIN
          UPDATE products 
          SET 
            rating = (
              SELECT ROUND(AVG(rating)::numeric, 2)::text 
              FROM reviews 
              WHERE product_id = COALESCE(NEW.product_id, OLD.product_id)
            ),
            review_count = (
              SELECT COUNT(*) 
              FROM reviews 
              WHERE product_id = COALESCE(NEW.product_id, OLD.product_id)
            ),
            updated_at = NOW()
          WHERE id = COALESCE(NEW.product_id, OLD.product_id);
          RETURN COALESCE(NEW, OLD);
        END;
        $$ LANGUAGE plpgsql;
      `);

      // Drop existing trigger if exists
      await db.execute(sql`DROP TRIGGER IF EXISTS trigger_update_product_rating ON reviews;`);
      
      // Create the rating update trigger
      await db.execute(sql`
        CREATE TRIGGER trigger_update_product_rating
        AFTER INSERT OR UPDATE OR DELETE ON reviews
        FOR EACH ROW EXECUTE FUNCTION update_product_rating();
      `);

      // Create the timestamp update function
      await db.execute(sql`
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
      `);

      // Create timestamp triggers for each table
      await db.execute(sql`DROP TRIGGER IF EXISTS trigger_update_products_updated_at ON products;`);
      await db.execute(sql`
        CREATE TRIGGER trigger_update_products_updated_at
        BEFORE UPDATE ON products
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
      `);

      await db.execute(sql`DROP TRIGGER IF EXISTS trigger_update_users_updated_at ON users;`);
      await db.execute(sql`
        CREATE TRIGGER trigger_update_users_updated_at
        BEFORE UPDATE ON users
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
      `);

      await db.execute(sql`DROP TRIGGER IF EXISTS trigger_update_categories_updated_at ON categories;`);
      await db.execute(sql`
        CREATE TRIGGER trigger_update_categories_updated_at
        BEFORE UPDATE ON categories
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
      `);

      console.log("Database triggers created successfully");
    } catch (error) {
      console.error("Error creating triggers:", error);
      throw error;
    }
  }

  // Run all migrations
  static async runMigrations() {
    try {
      console.log("Running database migrations...");
      
      await this.createIndexes();
      await this.createConstraints();
      await this.createTriggers();
      
      console.log("Database migrations completed successfully");
    } catch (error) {
      console.error("Database migration failed:", error);
      throw error;
    }
  }
}