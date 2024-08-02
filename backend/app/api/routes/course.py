from fastapi import APIRouter, Depends, HTTPException, status
from typing import Dict, Any
from app.api.schemas import Course, CourseCreate, CourseUpdate, CourseResponse
from app.api import crud
from app.db.mongo import get_db
from app.db.redis import get_redis
from app.utils.helper import map_to_pydantic_fields
import json
import logging

router = APIRouter()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@router.get("/", response_model=CourseResponse)
async def read_courses(search: str = None, page: int = 1, page_size: int = 10, db = Depends(get_db), redis = Depends(get_redis)):
    try:
        cache_key = f"courses:{search}:{page}:{page_size}"
        cached_courses = await redis.get(cache_key)
        if cached_courses:
            cached_data = json.loads(cached_courses)
            cached_courses_list = [Course(**course) for course in cached_data['courses']]
            return CourseResponse(totalCount=cached_data['totalCount'], courses=cached_courses_list)

        courses, total_count = await crud.get_courses(db, search, page, page_size)
        courses_dict = [crud.serialize_course(course) for course in courses]
        response = {"totalCount": total_count, "courses": courses_dict}
        await redis.set(cache_key, json.dumps(response, default=str), ex=60)  # Cache for 60 seconds
        course_instances = [Course(**course) for course in courses_dict]
        return CourseResponse(totalCount=total_count, courses=course_instances)
    except Exception as e:
        logger.error(f"Error reading courses: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal Server Error")

@router.get("/{course_id}", response_model=Course)
async def get_course(course_id: str, db = Depends(get_db), redis = Depends(get_redis)):
    try:
        cache_key = f"course:{course_id}"
        cached_course = await redis.get(cache_key)
        if cached_course:
            return Course(**json.loads(cached_course))

        course = await crud.get_course_by_id(db, course_id)
        if not course:
            raise HTTPException(status_code=404, detail="Course not found")
        
        await redis.set(cache_key, json.dumps(course, default=str), ex=60)  # Cache for 60 seconds
        return Course(**course)
    except Exception as e:
        logger.error(f"Error retrieving course {course_id}: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal Server Error")

@router.post("/", response_model=Course)
async def create_course(course: CourseCreate, db = Depends(get_db)):
    try:
        course_id = await crud.create_course(db, course)
        created_course = await crud.get_course_by_id(db, course_id)
        created_course = map_to_pydantic_fields(created_course)
        return Course(**created_course)
    except Exception as e:
        logger.error(f"Error creating course: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal Server Error")

@router.put("/{course_id}", response_model=Course)
async def update_course(course_id: str, course: CourseUpdate, db = Depends(get_db), redis = Depends(get_redis)):
    try:
        await crud.update_course(db, course_id, course)
        await redis.flushdb()  # Clear cache
        updated_course = await crud.get_course_by_id(db, course_id)
        if not updated_course:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found")
        updated_course = map_to_pydantic_fields(updated_course)
        return Course(**updated_course)
    except Exception as e:
        logger.error(f"Error updating course with id {course_id}: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal Server Error")

@router.delete("/{course_id}")
async def delete_course(course_id: str, db = Depends(get_db), redis = Depends(get_redis)):
    try:
        deleted_course_id = await crud.delete_course(db, course_id)
        await redis.flushdb()  # Clear cache
        return {"id": deleted_course_id}
    except Exception as e:
        logger.error(f"Error updating course with id {course_id}: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal Server Error")
