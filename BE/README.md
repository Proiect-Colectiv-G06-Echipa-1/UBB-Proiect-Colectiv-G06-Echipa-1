# Backend API

A Spring Boot REST API project.

## Prerequisites

- Java 21 or higher
- Maven 3.6 or higher

## Running the Application

Navigate to the BE directory and run:

```bash
mvn spring-boot:run
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
```

## Building the Project

To build a JAR file:

```bash
mvn clean package
```

The JAR will be created in the `target/` directory.

## Running the JAR

```bash
java -jar target/backend-api-0.0.1-SNAPSHOT.jar
```
