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

# Download dependencies first (better caching) - cross-platform
RUN if [ -f "./gradlew" ]; then bash ./gradlew dependencies --no-daemon; else ./gradlew.bat dependencies --no-daemon; fi

# Copy source code
COPY src ./src

# Build the application - cross-platform (dependencies already downloaded)
RUN if [ -f "./gradlew" ]; then bash ./gradlew build --no-daemon -x test; else ./gradlew.bat build --no-daemon -x test; fi

# Runtime stage - multi-platform support (Java 24 EA)
FROM eclipse-temurin:24-jre

WORKDIR /app

# Copy the built jar from build stage
COPY --from=build /app/build/libs/*.jar app.jar

# Expose the Spring Boot port
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
