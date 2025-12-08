#!/bin/bash

# 🚀 Quick Deployment Script for Ubuntu VM
# This script automates the deployment of your Todo App with PostgreSQL

set -e

echo "🚀 Todo App Deployment Script"
echo "=============================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

# Check if Docker is installed
echo "Checking for Docker..."
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed!"
    print_info "Installing Docker..."
    
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    
    print_success "Docker installed successfully!"
    print_info "Please log out and log back in for group changes to take effect."
    print_info "Then run this script again."
    exit 0
else
    print_success "Docker is installed"
fi

# Check if Docker Compose is available
echo ""
echo "Checking for Docker Compose..."
if ! docker compose version &> /dev/null; then
    print_error "Docker Compose is not installed!"
    print_info "Installing Docker Compose plugin..."
    
    sudo apt update
    sudo apt install docker-compose-plugin -y
    
    print_success "Docker Compose installed successfully!"
else
    print_success "Docker Compose is available"
fi

# Check if .env file exists
echo ""
if [ ! -f .env ]; then
    print_info "Creating .env file..."
    
    cat > .env << 'EOF'
# Database Configuration
POSTGRES_USER=todouser
POSTGRES_PASSWORD=todopassword
POSTGRES_DB=tododb
POSTGRES_PORT=5432

# Application Configuration
APP_PORT=3000
EOF
    
    print_success ".env file created"
    print_info "⚠️  Please update .env with secure passwords before deploying to production!"
else
    print_success ".env file already exists"
fi

# Stop any running containers
echo ""
print_info "Stopping any existing containers..."
docker compose down 2>/dev/null || true

# Build and start services
echo ""
print_info "Building and starting services..."
docker compose up -d --build

# Wait for services to be healthy
echo ""
print_info "Waiting for services to be healthy..."
sleep 10

# Check service status
echo ""
echo "Service Status:"
docker compose ps

# Get the VM IP address
VM_IP=$(hostname -I | awk '{print $1}')

echo ""
print_success "Deployment complete!"
echo ""
echo "📊 Useful Information:"
echo "====================="
echo "🌐 Application URL: http://localhost:3000"
echo "🌐 External Access: http://$VM_IP:3000"
echo ""
echo "📝 Useful Commands:"
echo "  View logs:         docker compose logs -f"
echo "  Stop services:     docker compose down"
echo "  Restart services:  docker compose restart"
echo "  Check status:      docker compose ps"
echo ""
echo "🔧 Troubleshooting:"
echo "  App logs:          docker compose logs -f server"
echo "  Database logs:     docker compose logs -f db"
echo "  Enter app shell:   docker exec -it todo-app sh"
echo "  Enter DB shell:    docker exec -it todo-postgres psql -U todouser -d tododb"
echo ""
print_success "Happy coding! 🎉"

