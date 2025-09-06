# SynergySphere Backend

This is the backend API for SynergySphere - Team Collaboration Platform.

## Technologies Used

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt for password hashing

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Navigate to the backend directory:
   ```bash
   cd backend
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

### Environment Variables

Create a `.env` file in the root of the backend directory with the following variables:

```env
NODE_ENV=development
PORT=5001
MONGODB_URI=mongodb://admin:password@localhost:27017/synergysphere?authSource=admin
JWT_SECRET=your_jwt_secret_key_here_change_it_in_production
JWT_EXPIRE=7d
```

### Running the Application

1. Make sure MongoDB is running on your system.

2. Start the development server:
   ```bash
   npm run dev
   ```

   Or for production:
   ```bash
   npm start
   ```

### Seeding Data

To seed the database with sample data:
```bash
npm run seed
```

To delete all data:
```bash
npm run seed -d
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user

### Projects
- `GET /api/projects` - Get all projects for logged in user
- `GET /api/projects/:id` - Get a single project
- `POST /api/projects` - Create a new project
- `PUT /api/projects/:id` - Update a project
- `DELETE /api/projects/:id` - Delete a project
- `PUT /api/projects/:id/members` - Add a member to a project

### Tasks
- `GET /api/tasks?projectId=ID` - Get tasks for a project (optional status filter: `&status=To-Do`)
- `GET /api/tasks/:id` - Get a single task
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

### Discussions
- `GET /api/discussions?projectId=ID` - Get discussions for a project
- `POST /api/discussions` - Create a new discussion message

### Notifications
- `GET /api/notifications` - Get unread notifications for logged in user
- `PUT /api/notifications/:id/read` - Mark a notification as read
- `PUT /api/notifications/read-all` - Mark all notifications as read

### Profile
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile
- `DELETE /api/profile` - Delete user account

## Project Structure

```
backend/
├── controllers/
│   ├── authController.js
│   ├── projectController.js
│   ├── taskController.js
│   ├── discussionController.js
│   ├── notificationController.js
│   └── profileController.js
├── middleware/
│   ├── auth.js
│   └── error.js
├── models/
│   ├── User.js
│   ├── Project.js
│   ├── Task.js
│   ├── Discussion.js
│   └── Notification.js
├── routes/
│   ├── auth.js
│   ├── projects.js
│   ├── tasks.js
│   ├── discussions.js
│   ├── notifications.js
│   └── profile.js
├── seeders/
│   └── seed.js
├── utils/
│   ├── asyncHandler.js
│   └── errorResponse.js
├── .env
├── server.js
├── package.json
└── README.md
```

## Authentication

Most endpoints require authentication using JWT tokens. After logging in, include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Error Handling

The API uses consistent error responses in the format:
```json
{
  "success": false,
  "message": "Error message"
}
```

## Success Responses

Successful requests return responses in the format:
```json
{
 "success": true,
  "data": {}
}
```

Or for paginated responses:
```json
{
  "success": true,
  "count": 10,
  "data": []
}
