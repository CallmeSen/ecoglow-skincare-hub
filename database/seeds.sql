-- EcoGlow Skincare Hub - Seed Data
-- Initial data for development and testing

-- Insert Categories
INSERT INTO categories (name, slug, description, sort_order) VALUES
('Skincare', 'skincare', 'Premium skincare products for all skin types', 1),
('Makeup', 'makeup', 'Natural and vegan makeup products', 2),
('Supplements', 'supplements', 'Beauty supplements and vitamins', 3),
('Kits', 'kits', 'Curated product bundles and sets', 4),
('Accessories', 'accessories', 'Beauty tools and accessories', 5);

-- Insert Suppliers
INSERT INTO suppliers (name, contact_email, certification_info) VALUES
('EcoSource Labs', 'partners@ecosource.com', '{"organic": true, "fairTrade": true, "carbonNeutral": true}'),
('Green Beauty Co', 'wholesale@greenbeauty.co', '{"vegan": true, "crueltyFree": true, "sustainablePackaging": true}'),
('Pure Elements', 'orders@pureelements.com', '{"natural": true, "organic": true, "localSourcing": true}');

-- Insert Sample Products
INSERT INTO products (name, slug, description, price, category_id, supplier_id, sustainability_score, ingredients_data) VALUES
('Hydrating Vitamin C Serum', 'hydrating-vitamin-c-serum', 
 'Brightening serum with 20% Vitamin C and hyaluronic acid', 
 29.99, 1, 1, 85, 
 '{"active": ["Vitamin C", "Hyaluronic Acid"], "natural": true, "vegan": true}'),

('Gentle Cleansing Oil', 'gentle-cleansing-oil', 
 'Nourishing oil cleanser removes makeup and impurities', 
 24.99, 1, 1, 90, 
 '{"active": ["Jojoba Oil", "Sunflower Oil"], "natural": true, "crueltyFree": true}'),

('Mineral Sunscreen SPF 50', 'mineral-sunscreen-spf-50', 
 'Reef-safe mineral sunscreen with zinc oxide', 
 19.99, 1, 2, 95, 
 '{"active": ["Zinc Oxide"], "reefSafe": true, "waterResistant": true}'),

('Natural Tinted Moisturizer', 'natural-tinted-moisturizer', 
 'Light coverage tinted moisturizer with SPF 15', 
 34.99, 2, 2, 80, 
 '{"coverage": "light", "spf": 15, "natural": true}'),

('Collagen Beauty Supplement', 'collagen-beauty-supplement', 
 'Marine collagen peptides for skin health', 
 39.99, 3, 3, 75, 
 '{"type": "marine collagen", "servingSize": "1 scoop", "vegan": false}');

-- Insert Blog Posts
INSERT INTO blog_posts (title, slug, content, author, status) VALUES
('The Science Behind Vitamin C Skincare', 'science-vitamin-c-skincare',
 'Discover how Vitamin C transforms your skin and why it''s essential in your routine...', 
 'Dr. Sarah Wilson', 'published'),

('Sustainable Beauty: Making Eco-Friendly Choices', 'sustainable-beauty-eco-friendly',
 'Learn how to build a beauty routine that''s kind to both your skin and the planet...', 
 'Emma Green', 'published'),

('Understanding Your Skin Type: A Complete Guide', 'understanding-skin-type-guide',
 'Identify your skin type and learn how to care for it with the right products...', 
 'Dr. Sarah Wilson', 'published');

-- Insert Quiz Questions
INSERT INTO quiz_questions (question_text, question_type, options) VALUES
('What is your primary skin concern?', 'multiple_choice', 
 '["Acne and breakouts", "Dryness and flakiness", "Dark spots and hyperpigmentation", "Fine lines and aging", "Sensitivity and redness"]'),

('How would you describe your skin type?', 'multiple_choice',
 '["Oily", "Dry", "Combination", "Sensitive", "Normal"]'),

('What is your current skincare routine frequency?', 'multiple_choice',
 '["No routine", "Basic cleansing only", "Morning and evening routine", "Extensive multi-step routine"]'),

('Do you have any known allergies to skincare ingredients?', 'text',
 '[]'),

('What is your budget range for skincare products?', 'multiple_choice',
 '["Under $25", "$25-50", "$50-100", "Over $100"]');

-- Insert Sample User for Testing
INSERT INTO users (email, password_hash, first_name, last_name, preferences, gdpr_consent) VALUES
('admin@ecoflow.com', '$2b$10$example.hash.for.testing.only', 'Admin', 'User', 
 '{"newsletter": true, "smsUpdates": false, "theme": "light"}', true),
 
('test@example.com', '$2b$10$example.hash.for.testing.only', 'Test', 'User', 
 '{"skinType": "combination", "concerns": ["acne", "dryness"]}', true);

-- Insert Sustainability Metrics
INSERT INTO sustainability_metrics (metric_name, current_value, target_value, unit) VALUES
('Carbon Footprint Reduction', 25.5, 50.0, 'percentage'),
('Sustainable Packaging', 78.2, 95.0, 'percentage'),
('Recycled Materials Usage', 45.8, 70.0, 'percentage'),
('Water Conservation', 32.1, 60.0, 'percentage'),
('Local Sourcing', 56.3, 80.0, 'percentage');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_supplier ON products(supplier_id);
CREATE INDEX IF NOT EXISTS idx_products_sustainability ON products(sustainability_score);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Insert sample carbon footprint data
INSERT INTO carbon_footprints (product_id, manufacturing_emissions, packaging_emissions, shipping_emissions, total_footprint) 
SELECT 
  p.id, 
  ROUND((RANDOM() * 10 + 5), 2), -- Random manufacturing emissions 5-15 kg CO2
  ROUND((RANDOM() * 3 + 1), 2),  -- Random packaging emissions 1-4 kg CO2
  ROUND((RANDOM() * 5 + 2), 2),  -- Random shipping emissions 2-7 kg CO2
  ROUND((RANDOM() * 18 + 8), 2)  -- Total footprint 8-26 kg CO2
FROM products p
WHERE p.id IS NOT NULL;
