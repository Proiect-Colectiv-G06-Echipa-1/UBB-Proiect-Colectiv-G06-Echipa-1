# Backend Dockerfile for Spring Boot application
# Multi-platform support: linux/amd64, linux/arm64, windows/amd64
FROM --platform=$BUILDPLATFORM eclipse-temurin:24-jdk AS build

# Set working directory
WORKDIR /app

# Copy gradle files and set permissions first
COPY build.gradle settings.gradle ./
COPY gradle ./gradle

# Copy gradlew scripts for cross-platform support
COPY gradlew gradlew.bat ./

# Make gradlew executable (Linux/macOS) - Windows uses gradlew.bat automatically
RUN chmod +x ./gradlew

# Download dependencies first (better caching)
RUN ./gradlew dependencies --no-daemon

# Copy source code
COPY src ./src

# Build the application (dependencies already downloaded)
RUN ./gradlew build --no-daemon -x test

# Runtime stage - multi-platform support (Java 24 EA)
FROM eclipse-temurin:24-jre

WORKDIR /app

# Copy the built jar from build stage
COPY --from=build /app/build/libs/*.jar app.jar

# Expose the Spring Boot port
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
