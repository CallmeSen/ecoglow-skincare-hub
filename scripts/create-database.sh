#!/bin/bash

# EcoGlow Skincare Hub - Database Creation Script
# This script creates and initializes the PostgreSQL database

set -e  # Exit on any error

echo "🌿 EcoGlow Skincare Hub - Database Setup"
echo "========================================"

# Check if database environment variables are set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ Error: DATABASE_URL environment variable is not set"
    echo "   Please ensure PostgreSQL database is provisioned in Replit"
    exit 1
fi

echo "✅ Database URL found: ${DATABASE_URL}"

# Extract database connection details
DB_HOST=${PGHOST:-localhost}
DB_PORT=${PGPORT:-5432}
DB_NAME=${PGDATABASE:-ecoflow}
DB_USER=${PGUSER:-postgres}

echo "📊 Database Connection Details:"
echo "   Host: $DB_HOST"
echo "   Port: $DB_PORT"
echo "   Database: $DB_NAME"
echo "   User: $DB_USER"

# Test database connection
echo "🔍 Testing database connection..."
if command -v psql >/dev/null 2>&1; then
    if psql "$DATABASE_URL" -c "SELECT version();" >/dev/null 2>&1; then
        echo "✅ Database connection successful"
    else
        echo "❌ Failed to connect to database"
        exit 1
    fi
else
    echo "⚠️  psql not available, skipping connection test"
fi

# Apply database schema
echo "🗄️  Creating database schema..."
if [ -f "database/schema.sql" ]; then
    if command -v psql >/dev/null 2>&1; then
        psql "$DATABASE_URL" -f database/schema.sql
        echo "✅ Database schema created successfully"
    else
        echo "⚠️  psql not available, please run schema manually:"
        echo "   psql \$DATABASE_URL -f database/schema.sql"
    fi
else
    echo "❌ Schema file not found: database/schema.sql"
    exit 1
fi

# Run Drizzle migrations if available
echo "🔄 Running Drizzle migrations..."
if [ -f "package.json" ] && npm list drizzle-kit >/dev/null 2>&1; then
    npm run db:push
    echo "✅ Drizzle migrations completed"
else
    echo "⚠️  Drizzle not available, skipping migrations"
fi

# Verify tables were created
echo "🔍 Verifying database setup..."
if command -v psql >/dev/null 2>&1; then
    TABLE_COUNT=$(psql "$DATABASE_URL" -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';")
    echo "✅ Created $TABLE_COUNT tables"
    
    # List main tables
    echo "📋 Main tables:"
    psql "$DATABASE_URL" -t -c "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;" | sed 's/^/ - /'
else
    echo "⚠️  Cannot verify tables without psql"
fi

echo ""
echo "🎉 Database setup completed successfully!"
echo ""
echo "🔧 Next steps:"
echo "   1. Start the application: npm run dev"
echo "   2. Visit the app to see the EcoGlow platform"
echo "   3. Check database connectivity in the app"
echo ""
echo "📚 Database features enabled:"
echo "   - UUID primary keys for security"
echo "   - JSONB for flexible product attributes"
echo "   - Full-text search with pg_trgm"
echo "   - Sustainability tracking"
echo "   - Loyalty program support"
echo "   - AR try-on session tracking"
echo "   - GDPR compliance fields"
echo ""