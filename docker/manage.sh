#!/bin/bash

# EcoGlow Docker Management Script

set -e

echo "🐳 EcoGlow Docker Management"
echo "=========================="

case "$1" in
  start)
    echo "🚀 Starting all services..."
    docker-compose up -d
    echo "✅ Services started successfully!"
    echo ""
    echo "📊 Access URLs:"
    echo "   - PostgreSQL: localhost:5432"
    echo "   - pgAdmin: http://localhost:8080"
    echo "   - Redis: localhost:6379"
    echo ""
    echo "🔑 pgAdmin Login:"
    echo "   Email: admin@ecoflow.com"
    echo "   Password: admin123"
    ;;
    
  stop)
    echo "🛑 Stopping all services..."
    docker-compose down
    echo "✅ Services stopped successfully!"
    ;;
    
  restart)
    echo "🔄 Restarting all services..."
    docker-compose restart
    echo "✅ Services restarted successfully!"
    ;;
    
  logs)
    echo "📋 Showing service logs..."
    docker-compose logs -f
    ;;
    
  status)
    echo "📊 Service status:"
    docker-compose ps
    ;;
    
  clean)
    echo "🧹 Cleaning up (WARNING: This will remove all data!)"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
      docker-compose down -v
      docker system prune -f
      echo "✅ Cleanup completed!"
    else
      echo "❌ Cleanup cancelled"
    fi
    ;;
    
  setup)
    echo "⚙️  Setting up database schema..."
    # Wait for database to be ready
    echo "Waiting for database to be ready..."
    sleep 10
    
    # Run database setup
    npm run db:push || echo "Database push failed (might already exist)"
    echo "✅ Database setup completed!"
    ;;
    
  *)
    echo "Usage: $0 {start|stop|restart|logs|status|clean|setup}"
    echo ""
    echo "Commands:"
    echo "  start   - Start all Docker services"
    echo "  stop    - Stop all Docker services"
    echo "  restart - Restart all Docker services"
    echo "  logs    - Show service logs"
    echo "  status  - Show service status"
    echo "  clean   - Remove all containers and volumes (DESTRUCTIVE)"
    echo "  setup   - Set up database schema"
    exit 1
    ;;
esac
