import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.models.schemas import Destination, DestinationCategory, AccessType

@pytest.mark.asyncio
async def test_health_endpoint():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "OffLoop AI" in data["service"]

@pytest.mark.asyncio
async def test_config_capabilities_endpoint():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.get("/api/v1/config/capabilities")
    assert response.status_code == 200
    data = response.json()
    assert "supported_modes" in data
    assert "explorer" in data["supported_modes"]

@pytest.mark.asyncio
async def test_destinations_nearby_endpoint():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.get("/api/v1/destinations/nearby?lat=12.9716&lon=77.5946&radius_meters=2000")
    assert response.status_code == 200
    destinations = response.json()
    assert isinstance(destinations, list)
    assert len(destinations) > 0
    assert "name" in destinations[0]
    assert "latitude" in destinations[0]

@pytest.mark.asyncio
async def test_quest_fallback_endpoint():
    dest = {
        "id": "dest_test_park",
        "name": "Sunset Park",
        "category": "park",
        "latitude": 37.7749,
        "longitude": -122.4194,
        "distance_meters": 600.0,
        "estimated_walk_minutes": 9,
        "access_type": "free_public",
        "is_verified_public": True
    }
    payload = {
        "destination": dest,
        "user_interests": ["nature"],
        "available_time_minutes": 30,
        "walking_distance_max_meters": 1500.0,
        "difficulty": "easy",
        "mode": "explorer"
    }

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.post("/api/v1/quests/fallback", json=payload)
    assert response.status_code == 200
    quest = response.json()
    assert quest["destination_name"] == "Sunset Park"
    assert len(quest["clues"]) >= 3

@pytest.mark.asyncio
async def test_narration_endpoint():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.post("/api/v1/narration/generate", json={"text": "Look ahead and take the first pedestrian walkway."})
    assert response.status_code == 200
    data = response.json()
    assert "format" in data
