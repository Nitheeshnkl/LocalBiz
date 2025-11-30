from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    is_business_owner = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    businesses = relationship("Business", back_populates="owner")
    reviews = relationship("Review", back_populates="user")

class Business(Base):
    __tablename__ = "businesses"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(Text)
    category = Column(String)
    address = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    phone = Column(String)
    email = Column(String)
    website = Column(String)
    price_range = Column(String)  # e.g., "$", "$$", "$$$"
    operating_hours = Column(String)
    is_verified = Column(Boolean, default=False)
    is_featured = Column(Boolean, default=False)
    owner_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User", back_populates="businesses")
    reviews = relationship("Review", back_populates="business")
    photos = relationship("BusinessPhoto", back_populates="business")

class BusinessPhoto(Base):
    __tablename__ = "business_photos"

    id = Column(Integer, primary_key=True, index=True)
    business_id = Column(Integer, ForeignKey("businesses.id"))
    url = Column(String)
    is_main = Column(Boolean, default=False)

    business = relationship("Business", back_populates="photos")

class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    business_id = Column(Integer, ForeignKey("businesses.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    rating = Column(Integer)  # 1-5 stars
    comment = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

    business = relationship("Business", back_populates="reviews")
    user = relationship("User", back_populates="reviews")
    photos = relationship("ReviewPhoto", back_populates="review")

class ReviewPhoto(Base):
    __tablename__ = "review_photos"

    id = Column(Integer, primary_key=True, index=True)
    review_id = Column(Integer, ForeignKey("reviews.id"))
    url = Column(String)

    review = relationship("Review", back_populates="photos")

class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(Text)
    business_id = Column(Integer, ForeignKey("businesses.id"))
    start_date = Column(DateTime)
    end_date = Column(DateTime)
    location = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

    business = relationship("Business")
