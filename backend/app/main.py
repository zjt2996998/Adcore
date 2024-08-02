from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import course
from app.db.mongo import database

app = FastAPI()

# Configure CORS
origins = [
    "http://localhost:4200",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure the prefix does not have a trailing slash
app.include_router(course.router, prefix="/courses", tags=["courses"])

@app.on_event("startup")
async def startup():
    # Ensure the database is up
    await database.client.server_info()

@app.on_event("shutdown")
async def shutdown():
    await database.client.close()
