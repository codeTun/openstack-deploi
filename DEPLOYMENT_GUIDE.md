# 🚀 Complete Deployment Guide: Todo App with PostgreSQL on Ubuntu VM

## Overview
This guide will help you deploy your Todo application with PostgreSQL database on an Ubuntu VM using Docker.

---

## 📦 Option 1: Deploy Full Docker Compose Setup (RECOMMENDED)

### Prerequisites on Ubuntu VM
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add your user to docker group (to run docker without sudo)
sudo usermod -aG docker $USER
newgrp docker

# Install Docker Compose
sudo apt install docker-compose-plugin -y

# Verify installations
docker --version
docker compose version
```

### Step 1: Transfer Your Project to Ubuntu VM

**Method A: Using Git (Recommended)**
```bash
# On Ubuntu VM
cd ~
git clone <your-repository-url>
cd cloud-project
```

**Method B: Using SCP (from your Windows machine)**
```bash
# From Windows PowerShell (in your project directory)
scp -r . username@ubuntu-vm-ip:~/cloud-project
```

**Method C: Create a tarball**
```bash
# On Windows (in project directory)
tar -czf cloud-project.tar.gz .

# Transfer to VM
scp cloud-project.tar.gz username@ubuntu-vm-ip:~/

# On Ubuntu VM
cd ~
tar -xzf cloud-project.tar.gz -C cloud-project
cd cloud-project
```

### Step 2: Create Environment File on Ubuntu VM

```bash
# Create .env file
cat > .env << 'EOF'
# Database Configuration
POSTGRES_USER=todouser
POSTGRES_PASSWORD=todopassword
POSTGRES_DB=tododb
POSTGRES_PORT=5432

# Application Configuration
APP_PORT=3000
EOF
```

### Step 3: Deploy with Docker Compose

```bash
# Build and start all services
docker compose up -d

# Check if services are running
docker compose ps

# View logs
docker compose logs -f

# Check specific service logs
docker compose logs -f server
docker compose logs -f db
```

### Step 4: Verify Deployment

```bash
# Check if containers are running
docker ps

# Test database connection
docker exec -it todo-postgres psql -U todouser -d tododb -c "SELECT version();"

# Check app health
curl http://localhost:3000

# Or from browser: http://your-vm-ip:3000
```

### Useful Commands

```bash
# Stop all services
docker compose down

# Stop and remove volumes (⚠️ deletes database data)
docker compose down -v

# Restart services
docker compose restart

# View logs
docker compose logs -f

# Rebuild and restart
docker compose up -d --build

# Check resource usage
docker stats
```

---

## 📦 Option 2: Pull Pre-built Image + Separate PostgreSQL

If you've pushed your app image to Docker Hub and want to run it separately:

### Step 1: Create a New Docker Compose File on Ubuntu VM

```bash
# Create deployment directory
mkdir -p ~/todo-app-deployment
cd ~/todo-app-deployment

# Create docker-compose.yml
cat > docker-compose.yml << 'EOF'
services:
  # PostgreSQL Database
  db:
    image: postgres:16-alpine
    container_name: todo-postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: todouser
      POSTGRES_PASSWORD: todopassword
      POSTGRES_DB: tododb
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U todouser"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - app-network

  # Your Application (replace with your Docker Hub image)
  app:
    image: your-dockerhub-username/todo-app:latest
    container_name: todo-app
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://todouser:todopassword@db:5432/tododb?schema=public
    ports:
      - "3000:3000"
    depends_on:
      db:
        condition: service_healthy
    restart: unless-stopped
    networks:
      - app-network

volumes:
  postgres_data:
    driver: local

networks:
  app-network:
    driver: bridge
EOF
```

### Step 2: Deploy

```bash
# Pull and start services
docker compose up -d

# Check logs
docker compose logs -f
```

---

## 📦 Option 3: Manual Container Setup (Advanced)

If you want to run containers manually without Docker Compose:

### Step 1: Create Network

```bash
docker network create todo-network
```

### Step 2: Run PostgreSQL Container

```bash
docker run -d \
  --name todo-postgres \
  --network todo-network \
  -e POSTGRES_USER=todouser \
  -e POSTGRES_PASSWORD=todopassword \
  -e POSTGRES_DB=tododb \
  -p 5432:5432 \
  -v postgres_data:/var/lib/postgresql/data \
  --restart unless-stopped \
  postgres:16-alpine
```

### Step 3: Wait for Database to be Ready

```bash
# Wait about 10 seconds, then test connection
docker exec todo-postgres pg_isready -U todouser
```

### Step 4: Run Your Application Container

```bash
docker run -d \
  --name todo-app \
  --network todo-network \
  -e NODE_ENV=production \
  -e DATABASE_URL="postgresql://todouser:todopassword@todo-postgres:5432/tododb?schema=public" \
  -p 3000:3000 \
  --restart unless-stopped \
  your-dockerhub-username/todo-app:latest
```

---

## 🔐 Security Best Practices for Production

### 1. Use Strong Passwords

```bash
# Generate random password
openssl rand -base64 32
```

Update your `.env`:
```env
POSTGRES_PASSWORD=<your-strong-password>
```

### 2. Don't Expose PostgreSQL Port Publicly

In `docker-compose.yml`, remove or comment out the ports section for db:
```yaml
db:
  # ports:
  #   - "5432:5432"  # Remove this in production
```

### 3. Use Docker Secrets (for Swarm) or Environment Files

```bash
# Create secrets file
echo "todopassword" | docker secret create db_password -
```

### 4. Firewall Configuration

```bash
# Allow only necessary ports
sudo ufw allow 3000/tcp
sudo ufw enable
```

---

## 🔧 Troubleshooting

### Problem: "Connection refused" to database

**Solution:**
```bash
# Check if database is running
docker ps | grep postgres

# Check database logs
docker logs todo-postgres

# Test connection
docker exec -it todo-postgres psql -U todouser -d tododb
```

### Problem: "Database does not exist"

**Solution:**
```bash
# Connect to postgres container
docker exec -it todo-postgres psql -U todouser -d postgres

# Create database
CREATE DATABASE tododb;
\q
```

### Problem: Migrations fail

**Solution:**
```bash
# Run migrations manually
docker exec -it todo-app pnpm prisma migrate deploy

# Or reset database (⚠️ deletes all data)
docker exec -it todo-app pnpm prisma migrate reset --force
```

### Problem: App can't connect to database

**Check the DATABASE_URL:**
```bash
# Verify environment variable
docker exec todo-app env | grep DATABASE_URL

# Should be: postgresql://todouser:todopassword@db:5432/tododb?schema=public
# Note: Use service name 'db' not 'localhost'
```

### Problem: Permission denied on docker-entrypoint.sh

**Solution:**
```bash
# Make script executable
chmod +x docker-entrypoint.sh

# Rebuild image
docker compose build --no-cache
```

---

## 📊 Monitoring and Maintenance

### Check Resource Usage

```bash
# View resource usage
docker stats

# View disk usage
docker system df
```

### Backup Database

```bash
# Create backup
docker exec todo-postgres pg_dump -U todouser tododb > backup_$(date +%Y%m%d).sql

# Restore backup
cat backup_20241208.sql | docker exec -i todo-postgres psql -U todouser -d tododb
```

### Clean Up Old Images and Containers

```bash
# Remove unused images
docker image prune -a

# Remove unused volumes
docker volume prune

# Full cleanup (⚠️ be careful)
docker system prune -a --volumes
```

---

## 🎯 Quick Start Commands

### First Time Setup on Ubuntu VM

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh && sudo sh get-docker.sh
sudo usermod -aG docker $USER && newgrp docker

# Clone or transfer project
git clone <your-repo> && cd cloud-project

# Create environment file
cat > .env << 'EOF'
POSTGRES_USER=todouser
POSTGRES_PASSWORD=todopassword
POSTGRES_DB=tododb
APP_PORT=3000
EOF

# Start everything
docker compose up -d

# Check status
docker compose ps
docker compose logs -f
```

### Daily Operations

```bash
# Start services
docker compose up -d

# Stop services
docker compose down

# View logs
docker compose logs -f

# Restart app only
docker compose restart server

# Update and redeploy
git pull
docker compose up -d --build
```

---

## 🌐 Accessing Your Application

- **Local access:** `http://localhost:3000`
- **From another machine:** `http://your-vm-ip:3000`
- **Find your VM IP:** `ip addr show` or `hostname -I`

---

## 📝 Notes

1. **Data Persistence:** Your PostgreSQL data is stored in a Docker volume named `postgres_data`. Even if you stop containers, data persists.

2. **Network:** Both containers communicate through the `app-network` bridge network. The app references the database as `db` (service name).

3. **Health Checks:** The app waits for the database to be healthy before starting, preventing connection errors.

4. **Automatic Migrations:** The `docker-entrypoint.sh` script runs `prisma migrate deploy` on startup.

5. **Environment Variables:** The app gets `DATABASE_URL` automatically from the compose file using the service name `db`.

---

## 🎓 Understanding the Setup

### How Containers Communicate

```
[Internet] → Port 3000 → [todo-app container]
                              ↓ (app-network)
                         [todo-postgres container]
                              ↓
                         [postgres_data volume]
```

- The app connects to database using hostname `db` (not `localhost`)
- Docker's internal DNS resolves `db` to the PostgreSQL container's IP
- Data persists in named volume even when containers are recreated

---

## 🚀 Next Steps

1. ✅ Deploy using Option 1 (Docker Compose)
2. ✅ Test your application
3. ✅ Set up regular backups
4. ✅ Configure firewall rules
5. ✅ Consider using HTTPS with reverse proxy (nginx/traefik)
6. ✅ Set up monitoring (Portainer, Grafana, etc.)

Good luck with your deployment! 🎉

