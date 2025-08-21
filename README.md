# Blog App - Full Stack Application

A full-stack blog application built with React frontend and Express.js backend.

## Project Structure

```
blog-app/
├── backend/          # Express.js API server
├── frontend/         # React application
├── e2e/              # Playwright E2E tests
├── package.json      # Root package.json for project management
└── README.md         # This file
```

## Quick Start

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (for backend)

### Installation

1. **Install all dependencies:**

   ```bash
   npm run install:all
   ```

2. **Set up environment variables:**

   - Copy `.env.example` to `.env` in the backend directory
   - Configure your MongoDB connection string and JWT secret

3. **Start development servers:**
   ```bash
   npm run dev
   ```
   This will start both backend (port 3001) and frontend (port 5173) concurrently.

## Available Scripts

### Root Level (from project root)

- `npm run dev` - Start both frontend and backend in development mode
- `npm run build` - Build the frontend for production
- `npm run start` - Start the backend in production mode
- `npm run test` - Run tests for both frontend and backend
- `npm run test:e2e` - Run E2E tests with Playwright
- `npm run test:all` - Run all tests (unit + E2E)
- `npm run lint` - Run linting for both frontend and backend
- `npm run install:all` - Install dependencies for all packages

### Backend (from backend/ directory)

- `npm run dev` - Start backend in development mode with auto-reload
- `npm start` - Start backend in production mode
- `npm test` - Run backend tests
- `npm run lint` - Run backend linting

### Frontend (from frontend/ directory)

- `npm run dev` - Start frontend development server
- `npm run build` - Build for production
- `npm test` - Run frontend tests
- `npm run lint` - Run frontend linting

### E2E Testing (from e2e/ directory)

- `npm test` - Run E2E tests with Playwright
- `npx playwright test --ui` - Run tests with UI mode
- `npx playwright show-report` - Show test report
- `npx playwright install` - Install browser binaries

## Development

### Backend API

- **Port**: 3001 (default)
- **Database**: MongoDB
- **Authentication**: JWT tokens
- **Features**: User management, blog CRUD operations, comments, likes

### Frontend

- **Port**: 5173 (default)
- **Framework**: React with Vite
- **Features**: User authentication, blog management, responsive UI

## Environment Variables

Create a `.env` file in the backend directory:

```env
MONGODB_URI=mongodb://localhost:27017/blog-app
JWT_SECRET=your-secret-key
PORT=3001
NODE_ENV=development
```

## API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Blogs

- `GET /api/blogs` - Get all blogs
- `POST /api/blogs` - Create new blog
- `PUT /api/blogs/:id` - Update blog
- `DELETE /api/blogs/:id` - Delete blog
- `POST /api/blogs/:id/like` - Like/unlike blog

### Users

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID

## Testing

### Unit Tests

Run tests for both frontend and backend:

```bash
npm test
```

Or run tests individually:

```bash
# Backend tests
npm run test:backend

# Frontend tests
npm run test:frontend
```

### E2E Tests

Run E2E tests with Playwright:

```bash
# First start the development servers
npm run dev

# Then in another terminal, run E2E tests
npm run test:e2e
```

Or run all tests (unit + E2E):

```bash
npm run test:all
```

**E2E Test Features:**

- Tests user authentication flows
- Tests blog creation, editing, and deletion
- Tests like/unlike functionality
- Cross-browser testing (Chrome, Firefox, Safari)
- Visual test reports with `npm run e2e:report`
- UI mode for debugging with `npm run e2e:ui`

## Deployment

### Option 1: Separate Frontend and Backend (Recommended for Development)

1. **Build the frontend:**

   ```bash
   npm run build
   ```

2. **Start the backend in production:**
   ```bash
   npm start
   ```

### Option 2: Single Server Deployment (Recommended for Production)

1. **Build and copy frontend to backend, then start:**
   ```bash
   npm run start:with-build
   ```

This will:

- Build the frontend React app
- Copy the built files to `backend/dist/`
- Start the backend server which serves both API and frontend

### Option 3: Manual Copy

1. **Build the frontend:**

   ```bash
   npm run build
   ```

2. **Copy frontend build to backend:**

   ```bash
   npm run build:copy
   ```

3. **Start the backend:**
   ```bash
   npm start
   ```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

ISC
