from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date
from bson import ObjectId

class CourseBase(BaseModel):
    university: str
    city: str
    country: str
    course_name: str
    course_description: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    price: float
    currency: str

class CourseCreate(CourseBase):
    pass

class CourseUpdate(BaseModel):
    course_description: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    price: Optional[float] = None
    currency: Optional[str] = None

class Course(CourseBase):
    id: str = Field(default_factory=lambda: str(ObjectId()))

    class Config:
        from_attributes = True

class CourseResponse(BaseModel):
    totalCount: int
    courses: List[Course]
