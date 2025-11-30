from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from backend.database import get_db
from backend.models import Event, Business, User
from backend.auth import get_current_user

router = APIRouter()

@router.get("/", response_model=List[dict])
def get_events(
    skip: int = 0,
    limit: int = 100,
    upcoming: bool = True,
    db: Session = Depends(get_db)
):
    query = db.query(Event)
    
    if upcoming:
        query = query.filter(Event.start_date >= datetime.utcnow())
    
    query = query.order_by(Event.start_date)
    events = query.offset(skip).limit(limit).all()
    
    result = []
    for event in events:
        event_dict = {
            "id": event.id,
            "title": event.title,
            "description": event.description,
            "start_date": event.start_date,
            "end_date": event.end_date,
            "location": event.location,
            "business": {
                "id": event.business.id,
                "name": event.business.name
            } if event.business else None
        }
        result.append(event_dict)
    
    return result

@router.get("/{event_id}")
def get_event(event_id: int, db: Session = Depends(get_db)):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    return {
        "id": event.id,
        "title": event.title,
        "description": event.description,
        "start_date": event.start_date,
        "end_date": event.end_date,
        "location": event.location,
        "business": {
            "id": event.business.id,
            "name": event.business.name
        } if event.business else None
    }

@router.post("/")
def create_event(
    title: str,
    description: str,
    start_date: datetime,
    end_date: datetime,
    location: str,
    business_id: int = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if business exists and user owns it (if business_id provided)
    if business_id:
        business = db.query(Business).filter(Business.id == business_id).first()
        if not business:
            raise HTTPException(status_code=404, detail="Business not found")
        if business.owner_id != current_user.id:
            raise HTTPException(status_code=403, detail="Not authorized to create events for this business")
    
    event = Event(
        title=title,
        description=description,
        start_date=start_date,
        end_date=end_date,
        location=location,
        business_id=business_id
    )
    db.add(event)
    db.commit()
    db.refresh(event)
    return {"message": "Event created successfully", "id": event.id}

@router.put("/{event_id}")
def update_event(
    event_id: int,
    title: str = None,
    description: str = None,
    start_date: datetime = None,
    end_date: datetime = None,
    location: str = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    # Check if user owns the business associated with the event
    if event.business and event.business.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this event")
    
    update_data = {}
    if title is not None: update_data["title"] = title
    if description is not None: update_data["description"] = description
    if start_date is not None: update_data["start_date"] = start_date
    if end_date is not None: update_data["end_date"] = end_date
    if location is not None: update_data["location"] = location
    
    for field, value in update_data.items():
        setattr(event, field, value)
    
    db.commit()
    return {"message": "Event updated successfully"}

@router.delete("/{event_id}")
def delete_event(
    event_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    # Check if user owns the business associated with the event
    if event.business and event.business.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this event")
    
    db.delete(event)
    db.commit()
    return {"message": "Event deleted successfully"}
