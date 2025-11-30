from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine
from .models import Base
from .routers import businesses, auth, events

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Local Business Directory API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(businesses.router, prefix="/businesses", tags=["businesses"])
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(events.router, prefix="/events", tags=["events"])

@app.get("/")
def read_root():
    return {"message": "Welcome to Local Business Directory API"}
