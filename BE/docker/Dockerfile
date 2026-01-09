# Backend Dockerfile for Spring Boot application
# Multi-platform support: linux/amd64, linux/arm64, windows/amd64
FROM --platform=$BUILDPLATFORM eclipse-temurin:24-jdk AS build

# Set working directory
WORKDIR /app

# Copy everything (subprojects like pmd must exist before Gradle runs)
# .dockerignore handles exclusions; new modules are auto-included
COPY . .

# Fix line endings for gradlew script and make it executable
RUN sed -i 's/\r$//' ./gradlew && chmod +x ./gradlew

# Generate OpenAPI client for frontend
RUN ./gradlew openApiGenerate --no-daemon

# Build the application
RUN ./gradlew assemble --no-daemon

# Runtime stage - multi-platform support (Java 24 EA)
FROM eclipse-temurin:24-jre

WORKDIR /app

# Copy the built jar from build stage
COPY --from=build /app/build/libs/*.jar app.jar

# Expose the Spring Boot port
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
