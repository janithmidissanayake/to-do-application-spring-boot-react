# 🐳 Docker Quick Start

This is a simplified guide for running the application with Docker.

## For Windows Users (Your Current Setup)

### Option 1: Using the Start Script
1. Open PowerShell or Command Prompt as Administrator
2. Navigate to the project folder:
   ```cmd
   cd C:\Users\HP\Downloads\to-do-application
   ```

### Option 2: Manual Commands
```powershell
# Build and start
docker-compose up --build -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

## For Linux Users (Evaluator's Setup)

### Option 1: Using the Start Script
```bash
# Make script executable
chmod +x start.sh

# Run the script
./start.sh
```

### Option 2: Manual Commands
```bash
# Build and start
docker-compose up --build -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

## Access Points

Once running:
- **Frontend**: http://localhost
- **Backend API**: http://localhost:8080/api/v1/tasks
- **MySQL**: localhost:3306

## Test the Application

1. Open browser: http://localhost
2. Add a task with title and description
3. Click "Add Task"
4. See your task appear in the list
5. Click "Done" to complete the task

## Common Issues

### Port Already in Use
If you see "port is already allocated":
- Stop the conflicting service
- Or change ports in `docker-compose.yml`

### Backend Can't Connect to MySQL
```bash
# Restart the backend
docker-compose restart backend

# Check logs
docker-compose logs backend
```

### Application Not Loading
```bash
# Check all services are running
docker-compose ps

# View logs for errors
docker-compose logs -f
```

## Need More Help?

See the detailed guide: [DOCKER_SETUP.md](./DOCKER_SETUP.md)


