from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
import requests
import json
import os
from backend.database import get_db
from backend.models import Business, BusinessPhoto, User
from ..auth import get_current_user

router = APIRouter()

@router.get("/", response_model=List[dict])
def get_businesses(
    skip: int = 0,
    limit: int = 100,
    category: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Business)

    if category:
        query = query.filter(Business.category == category)

    if search:
        query = query.filter(Business.name.contains(search) | Business.description.contains(search))

    businesses = query.offset(skip).limit(limit).all()

    result = []
    for business in businesses:
        business_dict = {
            "id": business.id,
            "name": business.name,
            "description": business.description,
            "category": business.category,
            "address": business.address,
            "latitude": business.latitude,
            "longitude": business.longitude,
            "phone": business.phone,
            "email": business.email,
            "website": business.website,
            "price_range": business.price_range,
            "operating_hours": business.operating_hours,
            "is_verified": business.is_verified,
            "is_featured": business.is_featured,
            "photos": [{"url": photo.url, "is_main": photo.is_main} for photo in business.photos]
        }
        result.append(business_dict)

    return result

@router.get("/{business_id}")
def get_business(business_id: int, db: Session = Depends(get_db)):
    business = db.query(Business).filter(Business.id == business_id).first()
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")

    return {
        "id": business.id,
        "name": business.name,
        "description": business.description,
        "category": business.category,
        "address": business.address,
        "latitude": business.latitude,
        "longitude": business.longitude,
        "phone": business.phone,
        "email": business.email,
        "website": business.website,
        "price_range": business.price_range,
        "operating_hours": business.operating_hours,
        "is_verified": business.is_verified,
        "is_featured": business.is_featured,
        "photos": [{"url": photo.url, "is_main": photo.is_main} for photo in business.photos]
    }

@router.post("/")
def create_business(
    name: str,
    description: str,
    category: str,
    address: str,
    latitude: float,
    longitude: float,
    phone: str = None,
    email: str = None,
    website: str = None,
    price_range: str = None,
    operating_hours: str = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    business = Business(
        name=name,
        description=description,
        category=category,
        address=address,
        latitude=latitude,
        longitude=longitude,
        phone=phone,
        email=email,
        website=website,
        price_range=price_range,
        operating_hours=operating_hours,
        owner_id=current_user.id
    )
    db.add(business)
    db.commit()
    db.refresh(business)
    return {"message": "Business created successfully", "id": business.id}

@router.put("/{business_id}")
def update_business(
    business_id: int,
    name: Optional[str] = None,
    description: Optional[str] = None,
    category: Optional[str] = None,
    address: Optional[str] = None,
    latitude: Optional[float] = None,
    longitude: Optional[float] = None,
    phone: Optional[str] = None,
    email: Optional[str] = None,
    website: Optional[str] = None,
    price_range: Optional[str] = None,
    operating_hours: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    business = db.query(Business).filter(Business.id == business_id).first()
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")

    if business.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this business")

    update_data = {}
    if name is not None: update_data["name"] = name
    if description is not None: update_data["description"] = description
    if category is not None: update_data["category"] = category
    if address is not None: update_data["address"] = address
    if latitude is not None: update_data["latitude"] = latitude
    if longitude is not None: update_data["longitude"] = longitude
    if phone is not None: update_data["phone"] = phone
    if email is not None: update_data["email"] = email
    if website is not None: update_data["website"] = website
    if price_range is not None: update_data["price_range"] = price_range
    if operating_hours is not None: update_data["operating_hours"] = operating_hours

    for field, value in update_data.items():
        setattr(business, field, value)

    db.commit()
    return {"message": "Business updated successfully"}

@router.get("/institutions")
def get_institutions():
    """
    Fetch real institutions (colleges/schools) in Coimbatore from multiple sources
    """
    try:
        institutions = []

        # 1. OpenStreetMap Overpass API
        overpass_url = "https://overpass-api.de/api/interpreter"
        overpass_query = """
        [out:json][timeout:25];
        area["name"="Coimbatore"]["admin_level"="6"];
        (
          node["amenity"="school"](area);
          node["amenity"="college"](area);
          node["amenity"="university"](area);
          way["amenity"="school"](area);
          way["amenity"="college"](area);
          way["amenity"="university"](area);
        );
        out center;
        """
        response = requests.post(overpass_url, data={"data": overpass_query}, timeout=30)
        response.raise_for_status()
        data = response.json()

        for element in data.get("elements", []):
            if "tags" in element:
                name = element["tags"].get("name", "")
                if name and len(name) > 3:  # Filter out very short names
                    lat = element.get("lat", element.get("center", {}).get("lat", 0))
                    lon = element.get("lon", element.get("center", {}).get("lon", 0))
                    if lat and lon:
                        institutions.append({
                            "name": name,
                            "type": "college" if "college" in element["tags"].get("amenity", "").lower() or "university" in element["tags"].get("amenity", "").lower() else "school",
                            "address": element["tags"].get("addr:full", element["tags"].get("addr:street", "Coimbatore, Tamil Nadu")),
                            "latitude": float(lat),
                            "longitude": float(lon),
                            "place_id": f"osm_{element['id']}"
                        })

        # 2. Nominatim API as fallback/supplement
        if len(institutions) < 20:
            nominatim_url = "https://nominatim.openstreetmap.org/search"
            params = {
                "q": "college OR school OR university in Coimbatore Tamil Nadu India",
                "format": "json",
                "limit": 50,
                "countrycodes": "IN"
            }
            response = requests.get(nominatim_url, params=params, headers={"User-Agent": "LocalBusinessDirectory/1.0"})
            response.raise_for_status()

            existing_names = {inst["name"].lower() for inst in institutions}
            for item in response.json():
                name = item.get("display_name", "").split(",")[0]
                if name and name.lower() not in existing_names and len(name) > 3:
                    institutions.append({
                        "name": name,
                        "type": "college" if "college" in item.get("display_name", "").lower() else "school",
                        "address": item.get("display_name", ""),
                        "latitude": float(item.get("lat", 0)),
                        "longitude": float(item.get("lon", 0)),
                        "place_id": f"nominatim_{item.get('place_id')}"
                    })

        # Deduplicate
        seen = set()
        deduplicated = []
        for inst in institutions:
            key = (inst["name"].lower(), round(inst["latitude"], 4), round(inst["longitude"], 4))
            if key not in seen:
                seen.add(key)
                deduplicated.append(inst)

        return deduplicated[:50]  # Limit to 50 institutions

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch institutions: {str(e)}")

@router.get("/nearby-businesses")
def get_nearby_businesses(
    lat: float,
    lon: float,
    radius: int = 3000,
    category: Optional[str] = None,
    sort_by: str = "distance"
):
    """
    Fetch real nearby businesses within radius from multiple sources
    """
    try:
        businesses = []

        # Categories mapping
        category_mapping = {
            "restaurants": ["restaurant", "food", "cafe"],
            "cafes": ["cafe", "coffee"],
            "xerox": ["copyshop", "stationery"],
            "hostels": ["hostel", "guest_house"],
            "groceries": ["supermarket", "convenience"],
            "salons": ["hairdresser", "beauty"],
            "gyms": ["gym", "fitness"],
            "electronics": ["electronics", "computer"],
            "hospitals": ["hospital", "clinic"],
            "libraries": ["library"],
            "study_spots": ["library", "cafe", "study"]
        }

        # 1. OpenStreetMap Overpass API
        overpass_url = "https://overpass-api.de/api/interpreter"

        # Build query based on category
        if category and category in category_mapping:
            amenities = category_mapping[category]
            amenity_conditions = " OR ".join([f'["amenity"="{amenity}"]' for amenity in amenities])
        else:
            # Default to all relevant business types
            amenity_conditions = '''
            ["amenity"~"restaurant|cafe|bar|fast_food"]
            ["amenity"~"supermarket|convenience|shop"]
            ["amenity"~"bank|atm|pharmacy|hospital|clinic"]
            ["amenity"~"school|college|library"]
            ["shop"~"clothes|electronics|books|stationery"]
            '''

        overpass_query = f"""
        [out:json][timeout:25];
        (
          node{amenity_conditions}(around:{radius},{lat},{lon});
          way{amenity_conditions}(around:{radius},{lat},{lon});
        );
        out center;
        """

        response = requests.post(overpass_url, data={"data": overpass_query}, timeout=30)
        response.raise_for_status()
        data = response.json()

        for element in data.get("elements", []):
            if "tags" in element:
                name = element["tags"].get("name", "")
                if name and len(name) > 2:
                    lat_biz = element.get("lat", element.get("center", {}).get("lat", 0))
                    lon_biz = element.get("lon", element.get("center", {}).get("lon", 0))

                    if lat_biz and lon_biz:
                        # Calculate distance (rough approximation)
                        from math import radians, sin, cos, sqrt, atan2
                        R = 6371  # Earth's radius in km
                        dlat = radians(float(lat_biz) - lat)
                        dlon = radians(float(lon_biz) - lon)
                        a = sin(dlat/2)**2 + cos(radians(lat)) * cos(radians(float(lat_biz))) * sin(dlon/2)**2
                        c = 2 * atan2(sqrt(a), sqrt(1-a))
                        distance_m = R * c * 1000

                        if distance_m <= radius:
                            businesses.append({
                                "business_name": name,
                                "category": category or element["tags"].get("amenity", element["tags"].get("shop", "business")),
                                "rating": 4.0,  # Default rating since OSM doesn't provide
                                "address": element["tags"].get("addr:full", element["tags"].get("addr:street", f"Coimbatore, {distance_m:.0f}m away")),
                                "distance_m": int(distance_m),
                                "lat": float(lat_biz),
                                "lng": float(lon_biz),
                                "opening_hours": element["tags"].get("opening_hours", "Not specified"),
                                "place_id": f"osm_{element['id']}"
                            })

        # 2. Google Places API (if API key available)
        google_api_key = os.getenv("GOOGLE_PLACES_API_KEY")
        if google_api_key and len(businesses) < 20:
            places_url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
            params = {
                "location": f"{lat},{lon}",
                "radius": radius,
                "type": category or "restaurant",
                "key": google_api_key
            }
            response = requests.get(places_url, params=params, timeout=30)
            response.raise_for_status()
            data = response.json()

            existing_names = {biz["business_name"].lower() for biz in businesses}
            for place in data.get("results", []):
                name = place.get("name", "")
                if name and name.lower() not in existing_names:
                    businesses.append({
                        "business_name": name,
                        "category": category or place.get("types", ["business"])[0],
                        "rating": place.get("rating", 0),
                        "address": place.get("vicinity", "Coimbatore"),
                        "distance_m": 0,  # Google doesn't provide exact distance in nearby search
                        "lat": place["geometry"]["location"]["lat"],
                        "lng": place["geometry"]["location"]["lng"],
                        "opening_hours": "Check Google Maps",
                        "place_id": place.get("place_id", "")
                    })

        # Sort businesses
        if sort_by == "distance":
            businesses.sort(key=lambda x: x["distance_m"])
        elif sort_by == "rating":
            businesses.sort(key=lambda x: x["rating"], reverse=True)

        return businesses[:50]  # Limit to 50 businesses

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch nearby businesses: {str(e)}")

@router.get("/real-data")
def get_real_data():
    """
    Return clean structured JSON with institutions and sample nearby businesses
    """
    try:
        institutions = get_institutions()
        # Get sample businesses around first institution
        if institutions:
            first_inst = institutions[0]
            businesses = get_nearby_businesses(
                lat=first_inst["latitude"],
                lon=first_inst["longitude"],
                radius=3000
            )
        else:
            businesses = []

        return {
            "institutions": institutions,
            "nearby_businesses": businesses,
            "status": "success"
        }
    except Exception as e:
        return {
            "institutions": [],
            "nearby_businesses": [],
            "status": "error",
            "message": str(e)
        }
