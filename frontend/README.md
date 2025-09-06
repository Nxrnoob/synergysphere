# SynergySphere Frontend

This is the frontend for SynergySphere - Team Collaboration Platform.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- pnpm (package manager)

### Installation

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Create a `.env` file with the following content:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5001/api
   ```

### Running the Application

1. Make sure the backend is running on `http://localhost:5001`

2. Start the development server:
   ```bash
   pnpm dev
   ```

3. Open your browser and navigate to `http://localhost:3000`

## Connecting to the Backend

The frontend connects to the backend API through the following configuration:

- API Base URL: `http://localhost:5001/api` (configurable via `.env` file)
- Authentication: JWT tokens stored in localStorage
- CORS: Configured in the backend to allow requests from the frontend

## API Integration

The frontend uses a service layer located in `lib/api.ts` to communicate with the backend API. This service layer handles:

- Authentication (login, signup, logout)
- Project management (CRUD operations)
- Task management (CRUD operations)
- Discussion messages (create and read)
- Notifications (fetch and mark as read)

## Components Updated for API Integration

The following components have been updated to use real API calls instead of mock data:

1. `components/auth/login-form.tsx` - Uses authAPI.login for authentication
2. `components/auth/signup-form.tsx` - Uses authAPI.signup for user registration
3. `components/dashboard/new-project-modal.tsx` - Uses projectsAPI.create for project creation
4. `components/project/task-creation-modal.tsx` - Uses tasksAPI.create for task creation

## Error Handling

The application uses toast notifications (via Sonner) to display success and error messages from API calls.

## Environment Variables

- `NEXT_PUBLIC_API_URL`: The base URL for the backend API (default: `http://localhost:5001/api`)

## Development

To run the development server:

```bash
pnpm dev
```

To build the application:

```bash
pnpm build
```

To start the production server:

```bash
pnpm start
