package com.offloop.ai

import com.offloop.ai.location.LocationManagerHelper
import org.junit.Assert.*
import org.junit.Test

class GpsVerificationTest {

    @Test
    fun testBearingCalculation() {
        // Heading directly North (same longitude, higher latitude) should be close to 0 degrees
        val bearingNorth = LocationManagerHelper.calculateBearing(12.0, 77.0, 13.0, 77.0)
        assertEquals(0f, bearingNorth, 1.5f)

        // Heading directly East should be close to 90 degrees
        val bearingEast = LocationManagerHelper.calculateBearing(12.0, 77.0, 12.0, 78.0)
        assertEquals(90f, bearingEast, 2f)
    }

    @Test
    fun testArrivalVerificationAccuracy() {
        val destLat = 12.9716
        val destLon = 77.5946

        // Exact location with high accuracy (5m) should verify arrival
        val isArrived = LocationManagerHelper.isArrivalVerified(
            currentLat = 12.9716,
            currentLon = 77.5946,
            destLat = destLat,
            destLon = destLon,
            accuracyMeters = 5f,
            targetRadiusMeters = 35f
        )
        assertTrue(isArrived)

        // Location 500m away should NOT verify arrival
        val farArrived = LocationManagerHelper.isArrivalVerified(
            currentLat = 12.9760,
            currentLon = 77.5990,
            destLat = destLat,
            destLon = destLon,
            accuracyMeters = 10f,
            targetRadiusMeters = 35f
        )
        assertFalse(farArrived)

        // Location with poor GPS accuracy (>30m) should be rejected for safety
        val inaccurateGps = LocationManagerHelper.isArrivalVerified(
            currentLat = 12.9716,
            currentLon = 77.5946,
            destLat = destLat,
            destLon = destLon,
            accuracyMeters = 45f,
            targetRadiusMeters = 35f
        )
        assertFalse(inaccurateGps)
    }
}
