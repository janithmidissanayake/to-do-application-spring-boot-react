# Todo Application - Spring Boot + React

A full-stack todo application with Spring Boot backend and React frontend, fully containerized with Docker.

## 🚀 Quick Start with Docker

### Prerequisites

- **Docker** (20.10 or later)
- **Docker Compose** (2.0 or later)

That's it! No need to install Java, Maven, Node.js, or npm.

### 1. Clone the Repository

```bash
git clone <repository-url>
cd to-do-application
```

### 2. Start the Application

```bash
docker-compose up --build
```

This command will:
- Build all Docker images (first time takes 5-10 minutes)
- Start MySQL database
- Start Spring Boot backend
- Start React frontend with Nginx

### 3. Access the Application

Once all services are running, open your browser:

- **Frontend**: http://localhost
- **Backend API**: http://localhost:8080/api/v1
- **MySQL Database**: localhost:3306

## 🎯 Using the Application

1. **Add a Task**: Enter a task title and description, then click "Add Task"
2. **View Tasks**: Recent uncompleted tasks are displayed automatically
3. **Complete Task**: Click the checkmark button to mark a task as complete

## 🧪 Running Tests

### Backend Unit & Integration Tests (JUnit)

Run all backend tests (19 tests):

```bash
docker-compose run --rm backend-test
```

**Test Coverage:**
- ✅ 1 Application Context Test
- ✅ 6 Controller Tests (REST API endpoints)
- ✅ 2 Mapper Tests (DTO conversions)
- ✅ 5 Repository Tests (Database operations with H2)
- ✅ 5 Service Tests (Business logic with mocked dependencies)

### Get Backend Test Coverage Report

```bash
# Run tests first
docker-compose run --rm backend-test

# Copy coverage report to local machine
docker cp todo-backend-test-runner:/app/target/site/jacoco ./backend-coverage-report

# Open the report (Windows)
# Navigate to: backend-coverage-report/index.html and open in browser
```

The report shows:
- Line coverage
- Branch coverage
- Method coverage
- Color-coded source code

### Frontend Unit Tests (Vitest)

Run frontend unit tests (37 tests):

```bash
docker-compose run --rm frontend-unit-test
```

**Test Coverage:**
- ✅ App Component Tests
- ✅ Task Service Tests
- ✅ API Integration Tests

### Frontend E2E Tests (Playwright)

**⚡ PERFORMANCE TIP**: E2E tests now install browsers during Docker build (only once), not at runtime!

Run end-to-end tests:

```bash
# Full test suite (Chromium + Firefox) - More thorough
docker-compose run --rm frontend-e2e-test

# Fast mode (Chromium only) - 2x faster for quick feedback
docker-compose run --rm frontend-e2e-test-fast
```

**Speed Comparison:**
- First build: ~2 minutes (downloads browsers once)
- Subsequent runs: ~30 seconds (browsers cached in image)
- Fast mode: ~15 seconds (single browser)

After tests complete, view the HTML report:

```bash
docker exec todo-frontend-e2e-test-runner npx playwright show-report
```

## 🏗️ Architecture

### Backend Stack
- **Framework**: Spring Boot 3.5.6
- **Java**: 21
- **Database**: MySQL 8.0
- **Build Tool**: Maven 3.9
- **ORM**: Hibernate/JPA
- **Testing**: JUnit 5, Mockito, H2 (in-memory for tests)
- **Code Coverage**: JaCoCo

### Frontend Stack
- **Framework**: React 18
- **Build Tool**: Vite
- **HTTP Client**: Axios
- **Testing**: Vitest (unit), Playwright (E2E)
- **Web Server**: Nginx (production)


## 🔧 Docker Commands Reference

### Starting and Stopping

```bash
# Start all services in foreground
docker-compose up

# Start all services in background
docker-compose up -d

# Rebuild and start services
docker-compose up --build

# Stop all services
docker-compose down

# Stop and remove volumes (clean database)
docker-compose down -v
```

### Viewing Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

### Individual Service Management

```bash
# Restart a specific service
docker-compose restart backend

# Rebuild a specific service
docker-compose up --build frontend

# Stop a specific service
docker-compose stop backend
```

### Database Access

```bash
# Connect to MySQL
docker exec -it todo-db mysql -u root -p
# Password: password123#

# View database
USE todo;
SHOW TABLES;
SELECT * FROM task;
```

## 📊 Test Coverage

### Backend Coverage
- **Total Tests**: 19
- **Coverage Tool**: JaCoCo
- **Report Location**: `backend-coverage-report/index.html`
- **Covered Areas**:
  - Controllers: REST API endpoint validation
  - Services: Business logic with mocked dependencies
  - Repositories: Database queries with H2
  - Mappers: DTO ↔ Entity conversions
  - Application Context: Spring Boot integration

### Frontend Coverage
- **Total Tests**: 37+ unit tests, 8+ E2E tests
- **Coverage Tool**: Vitest + Playwright
- **Covered Areas**:
  - Component rendering and interactions
  - API service calls
  - Form validation
  - User workflows





