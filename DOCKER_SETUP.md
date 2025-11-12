# Docker Setup Guide

This guide explains how to run the application using Docker and Docker Compose.

## Prerequisites

- Docker Desktop installed on your system
- Docker Compose (usually included with Docker Desktop)

## Project Structure

```
├── BE/                    # Backend (Spring Boot)
│   ├── Dockerfile
│   └── .dockerignore
├── FE/                    # Frontend (React + Vite)
│   ├── Dockerfile
│   └── .dockerignore
├── docker-compose.yml     # Docker Compose configuration
└── .env.example          # Environment variables example
```

## Quick Start

### 1. Setup Environment Variables

Copy the example environment file and customize if needed:

```bash
cp .env.example .env
```

Edit `.env` to customize database credentials and other settings.

### 2. Build and Start All Services

To build and start the entire stack (PostgreSQL, Backend, Frontend):

```bash
docker compose up --build
```

Or to run in detached mode (background):

```bash
docker compose up --build -d
```

**Note:** Depending on your Docker installation, use either `docker compose` (newer) or `docker-compose` (older) command.

### 3. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080
- **PostgreSQL**: localhost:5432

## Docker Compose Commands

### Build and start services
```bash
docker compose up --build
```

### Build and start services in background
```bash
docker compose up --build -d
```

### Stop services
```bash
docker compose down
```

### Stop services and remove volumes (deletes database data)
```bash
docker compose down -v
```

### View logs
```bash
# All services
docker compose logs

# Specific service
docker compose logs backend
docker compose logs frontend
docker compose logs postgres

# Follow logs
docker compose logs -f
```

### Rebuild services
```bash
# Rebuild all
docker compose build

# Rebuild specific service
docker compose build backend
docker compose build frontend
```

### Restart a specific service
```bash
docker compose restart backend
docker compose restart frontend
```

## Services Configuration

### PostgreSQL Database
- **Port**: 5432
- **Database**: pcdb (configurable via .env)
- **Username**: pcuser (configurable via .env)
- **Password**: pcpassword (configurable via .env)
- **Data Persistence**: Data is stored in a Docker volume named `postgres_data`

### Backend (Spring Boot)
- **Port**: 8080
- **Build**: Multi-stage build using Gradle
- **Database Connection**: Automatically connects to PostgreSQL container
- **Auto-restart**: Enabled

### Frontend (React + Vite)
- **Port**: 5173
- **Hot Reload**: Enabled via volume mounting
- **Dependencies**: npm install runs during container build
- **API URL**: Configurable via VITE_API_URL environment variable

## Development Workflow

### Frontend Development with Hot Reload

The frontend container has volume mounting enabled, so changes to your local files will automatically reflect in the container:

1. Start the services: `docker compose up --build`
2. Edit files in `./FE/src/`
3. Changes will be automatically detected by Vite

### Backend Development

To see changes in the backend, you need to rebuild:

```bash
docker compose up --build backend
```

Or restart the backend service:

```bash
docker compose restart backend
```

## Troubleshooting

### Port Conflicts

If you get port conflicts, ensure ports 5173, 8080, and 5432 are not in use:

```bash
# macOS/Linux
lsof -i :5173
lsof -i :8080
lsof -i :5432

# Kill process if needed
kill -9 <PID>
```

### Database Connection Issues

If the backend can't connect to PostgreSQL:

1. Check if PostgreSQL is healthy: `docker compose ps`
2. View PostgreSQL logs: `docker compose logs postgres`
3. Verify environment variables in `.env`

### Reset Everything

To completely reset and start fresh:

```bash
# Stop and remove containers, networks, and volumes
docker compose down -v

# Remove any dangling images
docker system prune -a

# Start fresh
docker compose up --build
```

### Node Modules Issues

If you encounter node_modules issues in the frontend:

```bash
# Remove the container and volumes
docker compose down -v

# Rebuild without cache
docker compose build --no-cache frontend

# Start again
docker compose up --build
```

## Multi-OS Development

Since this is a team project with multiple operating systems:

1. **Don't commit node_modules or build artifacts** - These are generated inside containers
2. **Use the .dockerignore files** - Already configured to exclude unnecessary files
3. **Environment variables** - Use `.env` file for local customization (add it to `.gitignore`)
4. **Line endings** - Configure Git to handle line endings properly:
   ```bash
   git config --global core.autocrlf input  # macOS/Linux
   git config --global core.autocrlf true   # Windows
   ```

## Production Considerations

For production deployment, consider:

1. **Environment Variables**: Use secrets management instead of .env files
2. **Build Optimization**: Use production builds for frontend (`npm run build`)
3. **Database Persistence**: Ensure proper backup strategy for PostgreSQL volume
4. **Security**: Change default passwords and use strong credentials
5. **Reverse Proxy**: Use nginx or similar for routing and SSL termination

## Additional Commands

### Access container shell
```bash
# Backend
docker compose exec backend sh

# Frontend
docker compose exec frontend sh

# PostgreSQL
docker compose exec postgres psql -U pcuser -d pcdb
```

### Check running containers
```bash
docker compose ps
```

### View resource usage
```bash
docker stats
```

## Support

For issues or questions, please refer to the project documentation or contact the team.
