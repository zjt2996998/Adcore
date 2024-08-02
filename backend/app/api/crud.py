from pymongo.collection import Collection
from app.api.schemas import CourseCreate, CourseUpdate
from bson.objectid import ObjectId
from app.utils.helper import map_to_mongo_fields
from datetime import datetime, date
import pytz
def serialize_course(course):
    return {
        'id': str(course.get('_id')),
        'university': course.get('University', None),
        'city': course.get('City', None),
        'country': course.get('Country', None),
        'course_name': course.get('CourseName', None),
        'course_description': course.get('CourseDescription', None),
        'start_date': course.get('StartDate').isoformat() if course.get('StartDate') else None,
        'end_date': course.get('EndDate').isoformat() if course.get('EndDate') else None,
        'price': course.get('Price', None),
        'currency': course.get('Currency', None),
    }

async def get_courses(db, search: str = None, page: int = 1, page_size: int = 10):
    query = {}
    if search:
        search = f".*{search}.*"
        query = {
            "$or": [
                {"University": {"$regex": search, "$options": "i"}},
                {"City": {"$regex": search, "$options": "i"}},
                {"Country": {"$regex": search, "$options": "i"}},
                {"CourseName": {"$regex": search, "$options": "i"}},
                {"CourseDescription": {"$regex": search, "$options": "i"}},
            ]
        }

    total_count = await db.count_documents(query)
    cursor = db.find(query).skip((page - 1) * page_size).limit(page_size)
    courses = await cursor.to_list(length=page_size)
    return courses, total_count

async def create_course(db: Collection, course: CourseCreate):
    course_dict = course.dict(exclude_unset=True)
    mongo_course_dict = map_to_mongo_fields(course_dict)
    result = await db.insert_one(mongo_course_dict)
    return str(result.inserted_id)

async def get_course_by_id(db: Collection, course_id: str):
    course = await db.find_one({"_id": ObjectId(course_id)})
    if course:
        return serialize_course(course)
    return None

async def update_course(db: Collection, course_id: str, course: CourseUpdate):
    update_data = course.dict(exclude_unset=True)
    update_data_mongo = map_to_mongo_fields(update_data)
    await db.update_one({"_id": ObjectId(course_id)}, {"$set": update_data_mongo})
    return course_id

async def delete_course(db: Collection, course_id: str):
    await db.delete_one({"_id": ObjectId(course_id)})
    return course_id
