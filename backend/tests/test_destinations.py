import pytest
from app.services.location_service import LocationService
from app.models.schemas import DestinationCategory, AccessType

@pytest.fixture
def location_service():
    return LocationService()

def test_haversine_distance(location_service):
    # Distance between London Eye (51.5033, -0.1195) and Big Ben (51.5007, -0.1246) is ~450m
    dist = location_service.haversine_distance(51.5033, -0.1195, 51.5007, -0.1246)
    assert 400 < dist < 500

def test_estimate_walk_minutes(location_service):
    # 750 meters should take ~12 minutes at 4.5km/h with 1.2 route factor
    walk_min = location_service.estimate_walk_minutes(750)
    assert 10 <= walk_min <= 14

def test_fallback_destinations_generated(location_service):
    destinations = location_service._generate_fallback_destinations(12.9716, 77.5946)
    assert len(destinations) >= 4
    for d in destinations:
        assert d.is_verified_public is True
        assert d.access_type == AccessType.FREE_PUBLIC
        assert d.distance_meters > 0
        assert d.estimated_walk_minutes > 0

def test_categorize_tags(location_service):
    assert location_service._categorize_tags({"leisure": "park"}) == DestinationCategory.PARK
    assert location_service._categorize_tags({"leisure": "garden"}) == DestinationCategory.GARDEN
    assert location_service._categorize_tags({"historic": "monument"}) == DestinationCategory.HISTORIC
    assert location_service._categorize_tags({"tourism": "artwork"}) == DestinationCategory.ARTWORK
    assert location_service._categorize_tags({"place": "square"}) == DestinationCategory.PUBLIC_SQUARE

@pytest.mark.asyncio
async def test_fetch_nearby_destinations(location_service):
    destinations = await location_service.fetch_nearby_destinations(
        lat=12.9716,
        lon=77.5946,
        radius_meters=2000.0,
        limit=10
    )
    assert len(destinations) > 0
    assert destinations[0].name != ""
    assert destinations[0].latitude != 0.0
