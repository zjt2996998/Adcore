import pandas as pd
from app.db.mongo import course_collection

def download_and_normalize_data(file_path: str):
    courses = pd.read_csv(file_path)
    
    # Print the columns to debug
    print("Columns in CSV:", courses.columns)
    
    # Normalize column names by stripping leading/trailing spaces
    courses.columns = courses.columns.str.strip()
    
    # Check if the necessary columns exist
    required_columns = ['StartDate', 'EndDate']
    for column in required_columns:
        if column not in courses.columns:
            raise KeyError(f"CSV does not contain required column '{column}'")
    
    courses['StartDate'] = pd.to_datetime(courses['StartDate'])
    courses['EndDate'] = pd.to_datetime(courses['EndDate'])
    return courses

def save_courses_to_db(file_path: str):
    courses = download_and_normalize_data(file_path)
    courses_dict = courses.to_dict('records')
    course_collection.delete_many({})
    course_collection.insert_many(courses_dict)

if __name__ == "__main__":
    save_courses_to_db('./app/db/UniversitySchema.csv')
