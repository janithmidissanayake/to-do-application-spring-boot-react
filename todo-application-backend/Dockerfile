# Multi-stage build for Spring Boot backend

# Stage 1: Build the application and dependencies
FROM maven:3.9-eclipse-temurin-21-alpine AS maven-builder

WORKDIR /app

# Copy pom.xml first for dependency caching
COPY pom.xml .

# Download dependencies (cached layer if pom.xml doesn't change)
RUN mvn dependency:go-offline -B

# Copy all source code, including test sources
COPY src src

# Build the application jar (SKIPPING tests for the production artifact)
# The resulting JAR is available for the runner stage
RUN mvn clean package -DskipTests

# --- Stage 2: Final Application Runner ---
FROM eclipse-temurin:21-jre-alpine AS final-runner

WORKDIR /app

# Copy the built jar from the build stage
COPY --from=maven-builder /app/target/todo-application-backend-0.0.1-SNAPSHOT.jar app.jar

# Expose port
EXPOSE 8080

# Run the application with increased memory settings
ENTRYPOINT ["java", "-Xms256m", "-Xmx512m", "-jar", "app.jar"]
