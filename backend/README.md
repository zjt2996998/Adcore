# Course Management System - Backend

## Overview

This is the backend of the Course Management System. It is built with FastAPI and MongoDB, providing a RESTful API for managing university courses.

## Features

- Create, Read, Update, and Delete (CRUD) operations for courses.
- Caching with Redis for improved performance.

## Requirements

- Python 3.8+
- MongoDB
- Redis

## Setup

1. **Clone the repository**

    ```bash
    git clone <repository_url>
    cd backend
    ```

2. **Create a virtual environment**

    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`
    ```

3. **Install dependencies**

    ```bash
    pip install -r requirements.txt
    ```

4. **Environment variables**

    Create a `.env` file in the root of the project and add the following:

    ```env
    MONGO_DETAILS=mongodb://localhost:27017
    REDIS_URL=redis://localhost:6379
    ```

5. **Run the server**

    ```bash
    uvicorn app.main:app --reload
    ```

## API Endpoints

- `GET /courses/` - Get a list of courses with optional search, pagination, and caching.
- `GET /courses/{course_id}` - Get course by Id
- `POST /courses/` - Create a new course.
- `PUT /courses/{course_id}` - Update an existing course.
- `DELETE /courses/{course_id}` - Delete a course.

