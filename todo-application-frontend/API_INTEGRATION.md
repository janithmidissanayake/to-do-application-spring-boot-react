 # Frontend-Backend Integration Guide

## Overview
The frontend React application is now connected to the Spring Boot backend using Axios for HTTP requests.

## What Was Implemented

### 1. API Service (`src/services/api.js`)
A centralized API service that handles all HTTP requests to the backend:
- `createTask(taskData)` - POST request to create a new task
- `getRecentTasks(limit)` - GET request to fetch recent tasks
- `completeTask(id)` - PUT request to mark a task as complete

### 2. Updated Components

#### App.jsx
- Added `useEffect` hook to fetch tasks on component mount
- Implemented async `handleAddTask` function that calls the backend API
- Implemented async `handleToggleTask` function to complete tasks
- Added error handling and loading states
- Added error message display in the UI

#### TaskForm.jsx
- Updated to handle async form submission
- Added loading state for the submit button
- Only clears form fields on successful task creation
- Button is disabled while submitting or when title is empty

### 3. Backend Configuration
- Created `WebConfig.java` to enable CORS for frontend requests
- Allows requests from `http://localhost:5173` (Vite dev server)

### 4. Vite Configuration
- Added proxy configuration to forward `/api` requests to the backend
- This helps avoid CORS issues during development

## Backend API Endpoints

### Base URL: `http://localhost:8080/api/v1/tasks`

1. **Create Task**
   - Method: `POST`
   - Endpoint: `/createTask`
   - Request Body:
     ```json
     {
       "title": "Task title",
       "description": "Task description"
     }
     ```
   - Response: `201 Created` with TaskResponse object

2. **Get Recent Tasks**
   - Method: `GET`
   - Endpoint: `/recentTasks?limit=5`
   - Response: `200 OK` with array of TaskResponse objects

3. **Complete Task**
   - Method: `PUT`
   - Endpoint: `/{id}/complete`
   - Response: `204 No Content`

## How to Run

### Backend
1. Make sure MySQL is running (or H2 in-memory database for testing)
2. Navigate to `todo-application-backend` directory
3. Run: `./mvnw spring-boot:run` (Linux/Mac) or `mvnw.cmd spring-boot:run` (Windows)
4. Backend will start on `http://localhost:8080`

### Frontend
1. Navigate to `todo-application-frontend` directory
2. Install dependencies: `npm install`
3. Run: `npm run dev`
4. Frontend will start on `http://localhost:5173`

## Testing the Integration

1. Start the backend server
2. Start the frontend development server
3. Open browser to `http://localhost:5173`
4. Try adding a new task:
   - Fill in the title and description
   - Click "Add Task"
   - The task should appear in the task list immediately
   - Check the browser console for any errors
5. Try completing a task by clicking the checkbox
6. The task list will automatically fetch recent tasks from the backend

## Troubleshooting

### CORS Errors
- Make sure the backend's `WebConfig.java` is properly configured
- Verify the frontend is running on `http://localhost:5173`
- Check browser console for specific CORS error messages

### Connection Refused
- Ensure the backend is running on port 8080
- Check if another service is using port 8080
- Verify the API base URL in `src/services/api.js`

### Tasks Not Appearing
- Check browser console for API errors
- Verify the backend database is accessible
- Check Network tab in browser DevTools to see API responses

## Future Enhancements
- Add toast notifications for success/error messages
- Implement task editing functionality
- Add pagination for task list
- Implement task deletion
- Add task filtering and sorting


