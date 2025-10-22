# Event Management API

## Introduction

Event Management is a RESTful API service built with Express.js and TypeScript that allows users to create, manage, and participate in events. The application supports two types of users:

-   **Organizers**: Can create, update, and delete events, as well as view event registrations.
-   **Attendees**: Can register for events, view available events, and cancel their registrations.

The service provides secure authentication using JWT tokens and includes data validation using Zod schemas.

## Setup and Development

### Prerequisites

-   Node.js (v14.x or higher)
-   npm or yarn
-   TypeScript

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
PORT=4001
ACCESS_TOKEN_SECRET=your_secret_key_here
```

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/tejasvijb/event_management.git
    cd event_management
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Run the development server:
    ```bash
    npm run dev
    ```

The server will start on port 4001 (or the port specified in your .env file).

### Build for Production

```bash
npm run build
npm start
```

## API Endpoints

### Authentication

#### Register a New User

-   **URL**: `/api/v1/users/register`
-   **Method**: `POST`
-   **Authentication**: Not required
-   **Request Body**:
    ```json
    {
        "username": "john_doe",
        "password": "password123",
        "type": "organizer" // or "attendee"
    }
    ```
-   **Success Response**: `201 Created`
    ```json
    {
        "username": "john_doe",
        "type": "organizer"
    }
    ```

#### User Login

-   **URL**: `/api/v1/users/login`
-   **Method**: `POST`
-   **Authentication**: Not required
-   **Request Body**:
    ```json
    {
        "username": "john_doe",
        "password": "password123"
    }
    ```
-   **Success Response**: `200 OK`
    ```json
    {
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
    ```

### Events

#### Get All Events

-   **URL**: `/api/v1/events`
-   **Method**: `GET`
-   **Authentication**: Required (JWT token)
-   **Success Response**: `200 OK`
    ```json
    [
        {
            "id": "123e4567-e89b-12d3-a456-426614174000",
            "title": "Tech Conference 2025",
            "description": "Annual technology conference with workshops and presentations",
            "date": "2025-12-10T09:00:00.000Z",
            "location": "Convention Center, City",
            "organizerId": "123e4567-e89b-12d3-a456-426614174001",
            "createdAt": "2025-10-01T08:00:00.000Z",
            "participants": []
        }
        // More events...
    ]
    ```

#### Get Event by ID

-   **URL**: `/api/v1/events/:id`
-   **Method**: `GET`
-   **Authentication**: Required (JWT token)
-   **Success Response**: `200 OK`
    ```json
    {
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "title": "Tech Conference 2025",
        "description": "Annual technology conference with workshops and presentations",
        "date": "2025-12-10T09:00:00.000Z",
        "location": "Convention Center, City",
        "organizerId": "123e4567-e89b-12d3-a456-426614174001",
        "createdAt": "2025-10-01T08:00:00.000Z",
        "participants": []
    }
    ```

#### Create Event

-   **URL**: `/api/v1/events`
-   **Method**: `POST`
-   **Authentication**: Required (JWT token with organizer role)
-   **Request Body**:
    ```json
    {
        "title": "Tech Conference 2025",
        "description": "Annual technology conference with workshops and presentations",
        "date": "2025-12-10T09:00:00.000Z",
        "location": "Convention Center, City"
    }
    ```
-   **Success Response**: `201 Created`
    ```json
    {
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "title": "Tech Conference 2025",
        "description": "Annual technology conference with workshops and presentations",
        "date": "2025-12-10T09:00:00.000Z",
        "location": "Convention Center, City",
        "organizerId": "123e4567-e89b-12d3-a456-426614174001",
        "createdAt": "2025-10-22T12:00:00.000Z",
        "participants": []
    }
    ```

#### Update Event

-   **URL**: `/api/v1/events/:id`
-   **Method**: `PUT`
-   **Authentication**: Required (JWT token with organizer role, must be the event creator)
-   **Request Body**:
    ```json
    {
        "title": "Updated Tech Conference 2025",
        "description": "Updated description for the annual technology conference"
    }
    ```
-   **Success Response**: `200 OK`
    ```json
    {
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "title": "Updated Tech Conference 2025",
        "description": "Updated description for the annual technology conference",
        "date": "2025-12-10T09:00:00.000Z",
        "location": "Convention Center, City",
        "organizerId": "123e4567-e89b-12d3-a456-426614174001",
        "createdAt": "2025-10-01T08:00:00.000Z",
        "participants": []
    }
    ```

#### Delete Event

-   **URL**: `/api/v1/events/:id`
-   **Method**: `DELETE`
-   **Authentication**: Required (JWT token with organizer role, must be the event creator)
-   **Success Response**: `200 OK`
    ```json
    {
        "message": "Event deleted successfully"
    }
    ```

### Event Registration

#### Register for an Event

-   **URL**: `/api/v1/events/:id/register`
-   **Method**: `POST`
-   **Authentication**: Required (JWT token with attendee role)
-   **Success Response**: `200 OK`
    ```json
    {
        "message": "Successfully registered for the event"
    }
    ```

#### Get Event Registrations

-   **URL**: `/api/v1/events/:id/registrations`
-   **Method**: `GET`
-   **Authentication**: Required (JWT token with organizer role, preferably the event creator)
-   **Success Response**: `200 OK`
    ```json
    [
        {
            "id": "123e4567-e89b-12d3-a456-426614174002",
            "username": "jane_doe",
            "type": "attendee"
        }
        // More participants...
    ]
    ```

#### Check Registration Status

-   **URL**: `/api/v1/events/:id/registration-status`
-   **Method**: `GET`
-   **Authentication**: Required (JWT token)
-   **Success Response**: `200 OK`
    ```json
    {
        "isRegistered": true
    }
    ```

#### Cancel Registration

-   **URL**: `/api/v1/events/:id/register`
-   **Method**: `DELETE`
-   **Authentication**: Required (JWT token)
-   **Success Response**: `200 OK`
    ```json
    {
        "message": "Registration cancelled successfully"
    }
    ```

## Authentication

All API endpoints (except for register and login) require a valid JWT token in the Authorization header:

```
Authorization: Bearer <your_access_token>
```

## Error Handling

The API returns appropriate HTTP status codes and error messages:

-   `400 Bad Request`: Invalid input data
-   `401 Unauthorized`: Missing or invalid authentication
-   `403 Forbidden`: Insufficient permissions
-   `404 Not Found`: Resource not found
-   `500 Internal Server Error`: Server-side errors

Example error response:

```json
{
    "message": "Event not found"
}
```
