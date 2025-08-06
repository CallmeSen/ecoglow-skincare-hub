-- EcoGlow Skincare Hub Database Schema
-- PostgreSQL 16+ with JSONB support and full-text search

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- Users table with comprehensive profile data
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    date_of_birth DATE,
    
    -- Profile preferences in JSONB for flexibility
    preferences JSONB DEFAULT '{}',
    quiz_results JSONB DEFAULT '{}',
    skin_profile JSONB DEFAULT '{}', -- skin_type, concerns, allergies
    
    -- Loyalty program
    loyalty_points INTEGER DEFAULT 0,
    loyalty_tier VARCHAR(20) DEFAULT 'Bronze',
    
    -- Privacy and compliance
    email_verified BOOLEAN DEFAULT FALSE,
    gdpr_consent BOOLEAN DEFAULT FALSE,
    marketing_consent BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE,
    
    -- Indexing for performance
    CONSTRAINT chk_loyalty_points CHECK (loyalty_points >= 0)
);

-- Categories with hierarchical structure
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    parent_id INTEGER REFERENCES categories(id),
    image_url VARCHAR(255),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Suppliers for dropshipping integration
CREATE TABLE suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    api_endpoint VARCHAR(255),
    api_key_encrypted VARCHAR(255),
    
    -- Certification data as JSONB
    certifications JSONB DEFAULT '{}', -- {"organic": true, "cruelty_free": "Leaping Bunny"}
    
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    shipping_methods JSONB DEFAULT '[]',
    
    -- Performance metrics
    reliability_score DECIMAL(3,2) DEFAULT 5.00,
    avg_shipping_days INTEGER DEFAULT 7,
    
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table with comprehensive fields
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    short_description VARCHAR(500),
    
    -- Pricing with markup tracking
    cost_price DECIMAL(10,2), -- supplier cost
    price DECIMAL(10,2) NOT NULL,
    compare_at_price DECIMAL(10,2), -- for sale displays
    markup_percentage DECIMAL(5,2), -- for margin tracking
    
    -- Inventory
    sku VARCHAR(100) UNIQUE,
    stock_quantity INTEGER DEFAULT 0,
    low_stock_threshold INTEGER DEFAULT 10,
    
    -- Product details
    category_id INTEGER REFERENCES categories(id),
    supplier_id UUID REFERENCES suppliers(id),
    
    -- Images as JSON array
    images JSONB DEFAULT '[]',
    
    -- Product specifications
    ingredients JSONB DEFAULT '[]',
    benefits JSONB DEFAULT '[]',
    usage_instructions TEXT,
    
    -- Sustainability metrics
    carbon_footprint DECIMAL(8,3), -- kg CO2e
    sustainability_score INTEGER CHECK (sustainability_score BETWEEN 0 AND 100),
    eco_certifications JSONB DEFAULT '{}',
    
    -- SEO and metadata
    meta_title VARCHAR(255),
    meta_description VARCHAR(500),
    
    -- Product flags
    is_featured BOOLEAN DEFAULT FALSE,
    is_trending BOOLEAN DEFAULT FALSE,
    is_vegan BOOLEAN DEFAULT FALSE,
    is_organic BOOLEAN DEFAULT FALSE,
    is_cruelty_free BOOLEAN DEFAULT TRUE,
    
    -- AR try-on support for makeup
    supports_ar BOOLEAN DEFAULT FALSE,
    ar_model_url VARCHAR(255),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT chk_price_positive CHECK (price > 0),
    CONSTRAINT chk_stock_non_negative CHECK (stock_quantity >= 0)
);

-- Product variants (colors, sizes, etc.)
CREATE TABLE product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL, -- "Fair", "Medium", "Deep"
    sku VARCHAR(100) UNIQUE,
    price_adjustment DECIMAL(10,2) DEFAULT 0,
    stock_quantity INTEGER DEFAULT 0,
    
    -- Variant-specific data
    attributes JSONB DEFAULT '{}', -- {"color": "#F5D5AE", "size": "30ml"}
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Shopping cart
CREATE TABLE cart_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, product_id, variant_id)
);

-- Wishlist
CREATE TABLE wishlist_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, product_id)
);

-- Orders
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    
    -- Order totals
    subtotal DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    shipping_amount DECIMAL(10,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    
    -- Addresses as JSONB
    billing_address JSONB NOT NULL,
    shipping_address JSONB NOT NULL,
    
    -- Order status
    status VARCHAR(50) DEFAULT 'pending', -- pending, processing, shipped, delivered, cancelled
    payment_status VARCHAR(50) DEFAULT 'pending',
    
    -- Sustainability tracking
    carbon_offset_purchased BOOLEAN DEFAULT FALSE,
    trees_planted INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    shipped_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE
);

-- Order items
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE RESTRICT,
    variant_id UUID REFERENCES product_variants(id) ON DELETE RESTRICT,
    
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    
    -- Product snapshot at time of order
    product_snapshot JSONB, -- name, description, etc.
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews and ratings
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    title VARCHAR(255),
    comment TEXT,
    
    -- Review metadata
    verified_purchase BOOLEAN DEFAULT FALSE,
    helpful_count INTEGER DEFAULT 0,
    
    -- Moderation
    is_approved BOOLEAN DEFAULT FALSE,
    moderated_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(product_id, user_id) -- One review per user per product
);

-- Quiz responses for personalization
CREATE TABLE quiz_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Quiz data as JSONB for flexibility
    responses JSONB NOT NULL,
    results JSONB, -- AI-generated recommendations
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AR try-on sessions
CREATE TABLE ar_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    
    -- Session data
    screenshot_url VARCHAR(255),
    session_duration INTEGER, -- seconds
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blog posts
CREATE TABLE blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt VARCHAR(500),
    content TEXT NOT NULL,
    
    -- SEO
    meta_title VARCHAR(255),
    meta_description VARCHAR(500),
    
    -- Publishing
    is_published BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP WITH TIME ZONE,
    
    -- Featured content
    is_featured BOOLEAN DEFAULT FALSE,
    featured_image_url VARCHAR(255),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Newsletter subscriptions
CREATE TABLE newsletter_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    source VARCHAR(100), -- popup, footer, etc.
    
    -- GDPR compliance
    consent_given BOOLEAN DEFAULT TRUE,
    consent_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Loyalty transactions
CREATE TABLE loyalty_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    
    points_change INTEGER NOT NULL, -- positive for earning, negative for spending
    transaction_type VARCHAR(50) NOT NULL, -- purchase, redemption, bonus, etc.
    description TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Performance indexes
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_featured ON products(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_products_trending ON products(is_trending) WHERE is_trending = TRUE;
CREATE INDEX idx_products_stock ON products(stock_quantity);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_search ON products USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '')));

CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at);

CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_reviews_approved ON reviews(is_approved) WHERE is_approved = TRUE;

CREATE INDEX idx_cart_user ON cart_items(user_id);
CREATE INDEX idx_wishlist_user ON wishlist_items(user_id);

-- Full-text search indexes
CREATE INDEX idx_products_fulltext ON products USING gin(
    to_tsvector('english', name || ' ' || COALESCE(description, '') || ' ' || COALESCE(short_description, ''))
);

-- JSONB indexes for performance
CREATE INDEX idx_products_certifications ON products USING gin(eco_certifications);
CREATE INDEX idx_users_preferences ON users USING gin(preferences);
CREATE INDEX idx_suppliers_certifications ON suppliers USING gin(certifications);

-- Update triggers for timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Sample data for development
INSERT INTO categories (name, slug, description) VALUES
('Skincare', 'skincare', 'Sustainable skincare products'),
('Serums', 'serums', 'Anti-aging and treatment serums'),
('Makeup', 'makeup', 'Vegan and cruelty-free makeup'),
('Supplements', 'supplements', 'Beauty supplements for internal health');

INSERT INTO categories (name, slug, description, parent_id) VALUES
('Anti-Aging Serums', 'anti-aging-serums', 'Bakuchiol and plant-based anti-aging', 2),
('Face Makeup', 'face-makeup', 'Foundations and concealers', 3),
('Lip Makeup', 'lip-makeup', 'Lipsticks and lip care', 3);

-- Add sample supplier
INSERT INTO suppliers (name, contact_email, certifications) VALUES
('EcoBeauty Wholesale', 'contact@ecobeauty.com', '{"organic": true, "cruelty_free": true, "leaping_bunny": true}');