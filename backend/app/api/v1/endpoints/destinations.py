from fastapi import APIRouter, Query, HTTPException
from typing import List
from app.models.schemas import Destination
from app.services.location_service import location_service

router = APIRouter()

@router.get("/destinations/nearby", response_model=List[Destination], summary="Discover nearby public destinations")
async def get_nearby_destinations(
    lat: float = Query(..., ge=-90.0, le=90.0, description="User latitude"),
    lon: float = Query(..., ge=-180.0, le=180.0, description="User longitude"),
    radius_meters: float = Query(2000.0, ge=100.0, le=10000.0, description="Search radius in meters"),
    limit: int = Query(20, ge=1, le=50, description="Maximum destinations to return")
):
    try:
        destinations = await location_service.fetch_nearby_destinations(
            lat=lat,
            lon=lon,
            radius_meters=radius_meters,
            limit=limit
        )
        return destinations
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch destinations: {str(e)}")


@router.get("/destinations/{destination_id}", response_model=Destination, summary="Get destination details by ID")
async def get_destination_by_id(destination_id: str, lat: float = 0.0, lon: float = 0.0):
    destinations = await location_service.fetch_nearby_destinations(lat, lon, radius_meters=5000.0)
    for d in destinations:
        if d.id == destination_id:
            return d
    raise HTTPException(status_code=404, detail="Destination not found")
