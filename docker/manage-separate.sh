#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🌿 EcoGlow Skincare Hub - Separate Services Manager${NC}"
echo "=================================================="

case "$1" in
  "start")
    echo -e "${GREEN}Starting separate frontend and backend services...${NC}"
    docker compose -f docker-compose.dev.yml up -d
    echo ""
    echo -e "${GREEN}✅ Services started successfully!${NC}"
    echo -e "${BLUE}Frontend:${NC} http://localhost:3000"
    echo -e "${BLUE}Backend API:${NC} http://localhost:5000/api"
    echo -e "${BLUE}Swagger Docs:${NC} http://localhost:5000/api/docs"
    echo -e "${BLUE}pgAdmin:${NC} http://localhost:8080"
    ;;
    
  "stop")
    echo -e "${YELLOW}Stopping all services...${NC}"
    docker compose -f docker-compose.dev.yml down
    echo -e "${GREEN}✅ All services stopped${NC}"
    ;;
    
  "restart")
    echo -e "${YELLOW}Restarting services...${NC}"
    docker compose -f docker-compose.dev.yml down
    docker compose -f docker-compose.dev.yml up -d
    echo -e "${GREEN}✅ Services restarted${NC}"
    ;;
    
  "build")
    echo -e "${BLUE}Building images...${NC}"
    docker compose -f docker-compose.dev.yml build --no-cache
    echo -e "${GREEN}✅ Images built successfully${NC}"
    ;;
    
  "rebuild")
    echo -e "${BLUE}Rebuilding and restarting services...${NC}"
    docker compose -f docker-compose.dev.yml down
    docker compose -f docker-compose.dev.yml build --no-cache
    docker compose -f docker-compose.dev.yml up -d
    echo -e "${GREEN}✅ Services rebuilt and restarted${NC}"
    ;;
    
  "logs")
    service=${2:-""}
    if [ -z "$service" ]; then
      echo -e "${BLUE}Showing logs for all services...${NC}"
      docker compose -f docker-compose.dev.yml logs -f
    else
      echo -e "${BLUE}Showing logs for $service...${NC}"
      docker compose -f docker-compose.dev.yml logs -f "$service"
    fi
    ;;
    
  "status")
    echo -e "${BLUE}Service Status:${NC}"
    docker compose -f docker-compose.dev.yml ps
    echo ""
    echo -e "${BLUE}Docker Images:${NC}"
    docker images | grep ecoflow
    ;;
    
  "clean")
    echo -e "${YELLOW}Cleaning up containers and images...${NC}"
    docker compose -f docker-compose.dev.yml down --volumes --remove-orphans
    docker system prune -f
    echo -e "${GREEN}✅ Cleanup completed${NC}"
    ;;
    
  "dev")
    echo -e "${BLUE}Starting development mode...${NC}"
    echo -e "${YELLOW}Backend:${NC} Docker services (DB, Redis, etc.)"
    echo -e "${YELLOW}Frontend:${NC} Vite dev server with hot reload"
    echo ""
    
    # Start backend services only
    docker compose -f docker-compose.dev.yml up -d postgres redis pgadmin server
    
    echo -e "${GREEN}Backend services started. Now starting frontend dev server...${NC}"
    npm run dev:client
    ;;
    
  *)
    echo -e "${YELLOW}Usage: $0 {start|stop|restart|build|rebuild|logs|status|clean|dev}${NC}"
    echo ""
    echo -e "${BLUE}Commands:${NC}"
    echo "  start    - Start all services (separate containers)"
    echo "  stop     - Stop all services"
    echo "  restart  - Restart all services"
    echo "  build    - Build Docker images"
    echo "  rebuild  - Rebuild images and restart services"
    echo "  logs     - Show logs (optional: specify service name)"
    echo "  status   - Show service status and images"
    echo "  clean    - Clean up containers, volumes, and images"
    echo "  dev      - Development mode (backend Docker + frontend dev server)"
    echo ""
    echo -e "${BLUE}Examples:${NC}"
    echo "  $0 start"
    echo "  $0 logs client"
    echo "  $0 logs server"
    exit 1
    ;;
esac
