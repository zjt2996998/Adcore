from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

client = AsyncIOMotorClient(settings.mongo_details)
database = client.university
course_collection = database.get_collection("courses")

def get_db():
    return course_collection
