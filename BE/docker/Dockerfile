# Backend Dockerfile for Spring Boot application
# Multi-architecture support (AMD64, ARM64 CPUs)
FROM eclipse-temurin:21-jdk AS build

# Set working directory
WORKDIR /app

# Copy gradle files
COPY build.gradle settings.gradle gradlew ./
COPY gradle ./gradle

# Make gradlew executable
RUN chmod +x gradlew

# Copy source code
COPY src ./src

# Build the application
RUN ./gradlew build --no-daemon -x test

# Runtime stage - uses multi-platform base image
FROM eclipse-temurin:21-jre-jammy

WORKDIR /app

# Copy the built jar from build stage
COPY --from=build /app/build/libs/*.jar app.jar

# Expose the Spring Boot port
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
