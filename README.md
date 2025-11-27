# JavaScript Chess Learning Platform

A progressive JavaScript learning platform where you build a chess game from scratch while mastering JavaScript, React, and Next.js concepts.

## Getting Started

### Prerequisites
- Bun installed
- Docker Desktop with WSL2 integration enabled
- PostgreSQL running via Docker

### Setup Instructions

1. **Start PostgreSQL Database**
   ```bash
   # Navigate to docker directory
   cd docker

   # Start the database (make sure Docker Desktop is running)
   docker compose up -d

   # Return to project root
   cd ..
   ```

2. **Install Dependencies**
   ```bash
   bun install
   ```

3. **Setup Database Schema**
   ```bash
   # Generate migration files
   bun db:generate

   # Push schema to database
   bun db:push

   # Seed initial phase data
   bun db:seed
   ```

4. **Run Development Server**
   ```bash
   bun dev
   ```

5. **Access the Application**
   Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

- `/app` - Next.js App Router pages
- `/components` - React components (UI, chess, learning)
- `/lib` - Utilities, database, authentication
- `/workspace` - Your learning workspace (you write code here in Phases 3-4)
- `/docker` - PostgreSQL configuration

## Learning Phases

1. **Phase 1**: JavaScript Fundamentals (loops, arrays, variables)
2. **Phase 2**: Promises & Async JavaScript
3. **Phase 3**: React Basics & Chess Setup
4. **Phase 4**: Chess Game Logic
5. **Phase 5**: AI Integration with Ollama

## Tech Stack

- **Frontend**: Next.js 15 (App Router)
- **UI**: ShadCN + Tailwind CSS
- **Backend**: PostgreSQL + DrizzleORM
- **Package Manager**: Bun
- **Infrastructure**: Docker

## Development Commands

```bash
# Run dev server
bun dev

# Database commands
bun db:generate  # Generate migrations
bun db:push      # Push schema to database
bun db:migrate   # Run migrations
bun db:seed      # Seed initial data
bun db:studio    # Open Drizzle Studio

# Build for production
bun build
bun start
```

## Important Notes

- **Docker Required**: Make sure Docker Desktop is running with WSL2 integration enabled
- **Database Port**: PostgreSQL runs on port 5432
- **Session-based Auth**: No password required - single user learning environment
- **Progressive Unlocking**: Complete each phase to unlock the next

## Troubleshooting

### Docker not found
Make sure Docker Desktop is installed and WSL2 integration is enabled in Docker Desktop settings.

### Database connection errors
1. Check if Docker container is running: `docker ps`
2. Verify DATABASE_URL in `.env.local` matches docker-compose.yml
3. Restart the container: `cd docker && docker compose restart`

### Migration issues
If you encounter migration errors, you can reset the database:
```bash
cd docker
docker compose down -v  # Remove volumes
docker compose up -d    # Restart
cd ..
bun db:push            # Push schema
bun db:seed            # Seed data
```
