from datetime import datetime, date
def map_to_mongo_fields(create_data):
    field_mapping = {
        'university': 'University',
        'city': 'City',
        'country': 'Country',
        'course_name': 'CourseName',
        'course_description': 'CourseDescription',
        'start_date': 'StartDate',
        'end_date': 'EndDate',
        'price': 'Price',
        'currency': 'Currency',
    }
    mongo_data = {field_mapping.get(k, k): v for k, v in create_data.items()}
    
    # Convert date fields to datetime.datetime only if they are date objects
    if 'StartDate' in mongo_data:
        if isinstance(mongo_data['StartDate'], date) and not isinstance(mongo_data['StartDate'], datetime):
            mongo_data['StartDate'] = datetime.combine(mongo_data['StartDate'], datetime.min.time())
        elif isinstance(mongo_data['StartDate'], str):
            try:
                mongo_data['StartDate'] = datetime.fromisoformat(mongo_data['StartDate'].replace('Z', '+00:00'))
            except ValueError:
                pass 

    if 'EndDate' in mongo_data:
        if isinstance(mongo_data['EndDate'], date) and not isinstance(mongo_data['EndDate'], datetime):
            mongo_data['EndDate'] = datetime.combine(mongo_data['EndDate'], datetime.min.time())
        elif isinstance(mongo_data['EndDate'], str):
            try:
                mongo_data['EndDate'] = datetime.fromisoformat(mongo_data['EndDate'].replace('Z', '+00:00'))
            except ValueError:
                pass  
    
    return mongo_data

def map_to_pydantic_fields(course):
    field_mapping = {
        'CourseDescription': 'course_description',
        'StartDate': 'start_date',
        'EndDate': 'end_date',
        'Price': 'price',
        'Currency': 'currency',
    }
    pydantic_data = {field_mapping.get(k, k): v for k, v in course.items()}
    
    # Convert date fields back to date objects
    if 'start_date' in pydantic_data and isinstance(pydantic_data['start_date'], datetime):
        pydantic_data['start_date'] = pydantic_data['start_date'].date()
    if 'end_date' in pydantic_data and isinstance(pydantic_data['end_date'], datetime):
        pydantic_data['end_date'] = pydantic_data['end_date'].date()
    
    return pydantic_data
