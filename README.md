# Adcore
# Course Management System

This repository contains the full-stack Course Management System application. The system includes both frontend and backend components, built with Angular for the frontend and FastAPI for the backend.

## Overview

- **Frontend:** Angular application for interacting with the backend.
- **Backend:** FastAPI application providing RESTful API endpoints for course management.

## Prerequisites

- [Node.js](https://nodejs.org/) (v20 or later) for the frontend.
- [Angular CLI](https://angular.io/cli) for Angular development.
- [Python](https://www.python.org/) (v3.8 or later) for the backend.
- [MongoDB](https://www.mongodb.com/) for the database.
- [Redis](https://redis.io/) for caching.

## Technologies Used

- **Frontend:** Angular
- **Backend:** FastAPI
- **Database:** MongoDB
- **Cache:** Redis
- **Containerization:** Docker, Docker Compose

## Getting Started

These instructions will help you set up the project on your local machine for development and testing purposes.

### Prerequisites

Ensure you have the following installed:

- Docker
- Docker Compose

### Installation

1. **Clone the repository:**

    ```sh
    git clone https://github.com/your-username/course-management-app.git
    cd Adcore
    ```

2. **Set up environment variables:**

    Create a `.env` file in the `backend/` directory with the following content:

    ```env
    MONGO_DETAILS=mongodb://mongo:27017
    REDIS_URL=redis://redis:6379
    ```

3. **Build and run the containers:**

    ```sh
    docker-compose up --build
    ```

    This command will build the Docker images and start the containers for the backend, frontend, MongoDB, and Redis.

### Usage

1. **Access the application:**

    The Angular frontend will be available at `http://localhost:4200`.

2. **API Endpoints:**

    The FastAPI backend will be available at `http://localhost:8000`.

    - Create a new course: `POST /courses/`
    - Get all courses: `GET /courses/`
    - Get a specific course: `GET /courses/{course_id}`
    - Update a course: `PUT /courses/{course_id}`
    - Delete a course: `DELETE /courses/{course_id}`

3. **Example of creating a new course:**

    Send a `POST` request to `http://localhost:8000/courses/` with the following JSON body:

    ```json
    {
      "university": "Universidade de Passo Fundo",
      "city": "New York",
      "country": "United States",
      "course_name": "Advanced Computer Science",
      "course_description": "A comprehensive course on advanced computer science topics.",
      "start_date": "2024-08-15",
      "end_date": "2024-12-15",
      "price": 500,
      "currency": "USD"
    }
    ```

### Project Structure

```plaintext
course-management-app/
├── backend/
│   ├── Dockerfile
│   ├── entrypoint.sh
│   ├── requirements.txt
│   ├── wait-for-it.sh
│   ├── .env
│   ├── app/
│       ├── __init__.py
│       ├── main.py
│       ├── utils/
│       │   ├── downloader.py
│       ├── db/
│           ├── mongo.py
│           ├── redis.py
├── frontend/
│   ├── Dockerfile
│   ├── src/
│       ├── app.config.server.ts
│       ├── app.config.ts
│       ├── app.routes.ts
│       ├── components
│       │   ├── course-create
│       │   │   ├── course-create.component.html
│       │   │   ├── course-create.component.scss
│       │   │   ├── course-create.component.spec.ts
│       │   │   └── course-create.component.ts
│       │   ├── course-edit
│       │   │   ├── course-edit.component.html
│       │   │   ├── course-edit.component.scss
│       │   │   ├── course-edit.component.spec.ts
│       │   │   └── course-edit.component.ts
│       │   └── course-list
│       │       ├── course-list.component.html
│       │       ├── course-list.component.scss
│       │       ├── course-list.component.spec.ts
│       │       └── course-list.component.ts
│       ├── course.service.ts
│       ├── models
│       │   └── course.model.ts
│       └── services
│           ├── course.service.spec.ts
│           └── course.service.ts
│       ├── docker-compose.yml
