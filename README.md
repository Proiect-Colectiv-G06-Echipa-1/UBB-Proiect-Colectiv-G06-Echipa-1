# Task Management System - TuDu

A gamified task management application with Pokemon-style boss battles. Complete tasks to deal damage to bosses and track your progress through an interactive dependency graph.

Link Figma: https://www.figma.com/design/zOSuTj3yuZmgXZnAM1XeV2/Untitled?node-id=0-1&t=7jLdvUaFMdztQEd3-1

## Features

### Task Management
- **Create, Edit, Delete Tasks** - Full CRUD operations for tasks
- **Task Dependencies** - Create complex dependency chains between tasks
- **Status Tracking** - Track tasks through BACKLOG, IN_PROGRESS, ON_HOLD, and COMPLETED states
- **Energy System** - Each task has an energy cost that affects boss health
- **Search Functionality** - Real-time search to filter tasks by name

### Visualization
- **Dependency Graph** - Interactive force-directed graph showing task relationships
- **Auto-centering** - Current task is automatically centered with optimal zoom
- **Pokemon-style Cards** - Tasks displayed as cards with ID badges and metadata

### Boss Battle System
- **Dynamic Boss Health** - Boss HP updates based on completed tasks
- **Damage Animations** - Pokemon-style hit effects with red/white flash
- **Faint Animation** - Boss faints when all tasks are completed
- **Victory Screen** - Celebratory screen with gold text and shine effects

### Admin Panel
- **User Management** - View all users and their energy levels

## Tech Stack

### Backend
- **Spring Boot 3.x** - Java 24
- **PostgreSQL** - Database
- **Flyway** - Database migrations
- **Hibernate** - ORM with validation mode
- **OpenAPI** - API documentation

### Frontend
- **React** - UI framework
- **TypeScript** - Type safety
- **Material-UI** - Component library
- **Vite** - Build tool
- **React Force Graph** - Dependency visualization

## Getting Started

### Prerequisites
- Docker & Docker Compose
- Node.js (for local frontend development)
- Java 24 (for local backend development)

### Running with Docker

```bash
# Start all services
docker compose up --build

# Access the application
Frontend: http://localhost:5173
Backend API: http://localhost:8080
PostgreSQL: localhost:5401
```

### Environment Configuration

Update `env.prod.yaml` with your database credentials:
```yaml
POSTGRES_PASSWORD: your_secure_password
```

#### Manual Migrations
- Go to **resources/db/migration** in the backend's root
- Add a new SQL file: **Vx__description.sql** (where x = last version + 1)
- Write your migration script
- Ensure Hibernate entities match the DB schema

**Important:** Hibernate validates schema but does not auto-persist changes. Use Flyway for migrations.

## API Documentation

Once the backend is running, access OpenAPI docs at:
- Swagger UI: http://localhost:8080/swagger-ui.html
- OpenAPI JSON: http://localhost:8080/v3/api-docs

## Project Structure

```
├── BE/                    # Spring Boot backend
│   ├── src/main/
│   │   ├── java/         # Java source code
│   │   └── resources/    # Application config & migrations
│   └── docker/           # Backend Dockerfile
├── FE/                    # React frontend
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   └── api/          # API client
│   └── docker/           # Frontend Dockerfile
├── architecture/          # Documentation
├── docker-compose.yml    # Multi-container setup
├── env.prod.yaml         # Production environment
└── README.md             # Project overview
```

## Key Features Implementation

### Task Completion Flow
1. User marks task as COMPLETED
2. Energy is consumed from user's balance
3. Navigate to boss view
4. Boss health updates via API
5. Damage animation plays
6. If boss HP = 0, victory animation triggers

### Dependency Graph
- Breadth-first search traversal
- Auto-centering on current task (1.5x zoom)
- Zoom range: 0.5x - 4x
- Click nodes to navigate between tasks

### Card Display
- Fixed width: 280px
- Title truncation: 20 characters
- Overflow handling for long descriptions
- Hover effects with pointer cursor

## Development

### Frontend
```bash
cd FE
npm install
npm run dev
```

### Backend
```bash
cd BE
./gradlew bootRun
```

### Generate OpenAPI Client
```bash
cd BE
./gradlew openApiGenerate
```

## Team

UBB-Proiect-Colectiv-G06-Echipa-1
```
