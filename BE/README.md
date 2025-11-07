# Backend API

A Spring Boot REST API project built with Gradle.

## Prerequisites

- Java 21 or higher
- Gradle 8.x or higher (or use the included Gradle Wrapper)

## Running the Application

Navigate to the BE directory and run:

**Using Gradle Wrapper (Recommended - no installation needed):**
```bash
./gradlew bootRun
```

**On Windows:**
```bash
.\gradlew.bat bootRun
```

**Using installed Gradle:**
```bash
gradle bootRun
```

The application will start on `http://localhost:8080`

## API Endpoints

- `GET http://localhost:8080/api` - Returns "Hello World"

## Project Structure

```
src/
├── main/
│   ├── java/
│   │   └── com/
│   │       └── example/
│   │           ├── Application.java          # Main Spring Boot application
│   │           └── controller/
│   │               └── ApiController.java    # REST controller
│   └── resources/
│       └── application.properties            # Configuration file
build.gradle                                   # Gradle build configuration
settings.gradle                                # Gradle project settings
```

## Building the Project

To build a JAR file:

```bash
./gradlew clean build
```

The JAR will be created in the `build/libs/` directory.

## Running the JAR

```bash
java -jar build/libs/backend-api-0.0.1-SNAPSHOT.jar
```
