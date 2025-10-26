# Docker Setup Guide for To-Do Application

This guide explains how to run the To-Do Application using Docker containers.

## Prerequisites

- **Docker**: Version 20.10 or higher
- **Docker Compose**: Version 2.0 or higher

### Installation

#### For Windows (Your Current Setup):
1. Install [Docker Desktop for Windows](https://docs.docker.com/desktop/install/windows-install/)
2. Docker Compose comes bundled with Docker Desktop
3. Enable WSL 2 backend for better performance

#### For Linux (Evaluator's Setup):
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Add user to docker group (optional, to run without sudo)
sudo usermod -aG docker $USER
```

## Project Structure

```
to-do-application/
├── docker-compose.yml                 # Orchestrates all services
├── todo-application-backend/
│   ├── Dockerfile                     # Backend Docker image
│   ├── .dockerignore                  # Excludes unnecessary files
│   └── src/                          # Spring Boot source code
└── todo-application-frontend/
    ├── Dockerfile                     # Frontend Docker image
    ├── .dockerignore                  # Excludes unnecessary files
    ├── nginx.conf                     # Nginx configuration
    └── src/                          # React source code
```

## Architecture

The application consists of three containers:
1. **MySQL Database** (mysql:8.0)
   - Port: 3306
   - Database: `todo`
   - User: `root`
   - Password: `password123#`

2. **Spring Boot Backend** (Java 21)
   - Port: 8080
   - API: `http://localhost:8080/api/v1/tasks`

3. **React Frontend** (Node 20-alpine)
   - Port: 80
   - URL: `http://localhost`
   - Nginx serves static files and proxies API calls

## Quick Start

### 1. Build and Run (All Platforms)

```bash
# Navigate to project root
cd to-do-application

# Build and start all containers
docker-compose up --build

# Or run in detached mode (background)
docker-compose up --build -d
```

### 2. Access the Application

- **Frontend**: http://localhost
- **Backend API**: http://localhost:8080/api/v1/tasks
- **MySQL**: localhost:3306

### 3. Stop the Application

```bash
# Stop containers (preserves data)
docker-compose stop

# Stop and remove containers (preserves volumes)
docker-compose down

# Stop, remove containers, and delete data
docker-compose down -v
```

## Common Commands

### View Logs
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mysql

# Follow logs (real-time)
docker-compose logs -f backend
```

### Rebuild After Code Changes
```bash
# Rebuild specific service
docker-compose up --build backend
docker-compose up --build frontend

# Rebuild all services
docker-compose up --build
```

### Check Service Status
```bash
docker-compose ps
```

### Execute Commands in Containers
```bash
# Backend - Run Maven tests
docker-compose exec backend mvn test

# MySQL - Access database
docker-compose exec mysql mysql -uroot -ppassword123# todo

# Frontend - Shell access
docker-compose exec frontend sh
```

## Platform-Specific Notes

### Windows (PowerShell/CMD)
```powershell
# Navigate to project
cd C:\Users\HP\Downloads\to-do-application

# Run docker-compose
docker-compose up --build -d

# View logs
docker-compose logs -f
```

### Linux (Bash)
```bash
# Navigate to project
cd ~/to-do-application

# Run docker-compose (with sudo if needed)
docker-compose up --build -d

# View logs
docker-compose logs -f
```

## Troubleshooting

### Port Conflicts
If ports 80, 3306, or 8080 are already in use:

1. **Change ports in docker-compose.yml**:
```yaml
ports:
  - "8081:8080"  # Backend
  - "8080:80"    # Frontend
  - "3307:3306"  # MySQL
```

### Database Connection Issues
```bash
# Check MySQL is healthy
docker-compose ps

# Restart backend after MySQL is ready
docker-compose restart backend

# View backend logs for errors
docker-compose logs backend
```

### Frontend Can't Reach Backend
```bash
# Check nginx configuration
docker-compose exec frontend cat /etc/nginx/conf.d/default.conf

# Verify network connectivity
docker-compose exec frontend ping backend
```

### Clear Everything and Start Fresh
```bash
# Stop and remove everything
docker-compose down -v

# Remove all Docker images
docker-compose down --rmi all

# Rebuild from scratch
docker-compose up --build
```

## Development Workflow

### Making Code Changes

**Backend Changes:**
1. Edit Java files in `todo-application-backend/src/`
2. Rebuild backend: `docker-compose up --build backend`

**Frontend Changes:**
1. Edit React files in `todo-application-frontend/src/`
2. Rebuild frontend: `docker-compose up --build frontend`

### Running Tests

```bash
# Backend tests (inside container)
docker-compose exec backend mvn test

# Frontend tests (requires stopping container first)
cd todo-application-frontend
npm test
```

## Production Considerations

For production deployment:

1. **Use environment variables**: Don't hardcode passwords
2. **Use secrets management**: Docker secrets or external vaults
3. **Set up SSL/TLS**: Use Let's Encrypt with nginx
4. **Scale services**: Use Docker Swarm or Kubernetes
5. **Add monitoring**: Prometheus, Grafana, ELK stack
6. **Use production database**: External managed MySQL/PostgreSQL

## Security Notes

⚠️ **Important**: The current setup uses default credentials for demonstration. In production:
- Change all default passwords
- Use environment variables for secrets
- Implement proper authentication
- Use HTTPS
- Set up firewall rules

## Support

For issues or questions:
1. Check logs: `docker-compose logs -f`
2. Verify services are running: `docker-compose ps`
3. Check Docker daemon: `docker info`
4. Review container health: `docker inspect <container_name>`

## License

This project is for educational purposes.


