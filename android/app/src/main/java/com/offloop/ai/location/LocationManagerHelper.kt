package com.offloop.ai.location

import android.annotation.SuppressLint
import android.content.Context
import android.location.Location
import android.os.Looper
import com.google.android.gms.location.*
import kotlinx.coroutines.channels.awaitClose
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.callbackFlow
import kotlin.math.*

class LocationManagerHelper(private val context: Context) {
    private val fusedLocationClient: FusedLocationProviderClient =
        LocationServices.getFusedLocationProviderClient(context)

    var isDemoMode: Boolean = false
    var demoCurrentLat: Double = 12.9716
    var demoCurrentLon: Double = 77.5946

    @SuppressLint("MissingPermission")
    fun getLocationUpdates(intervalMs: Long = 4000L): Flow<Location> = callbackFlow {
        if (isDemoMode) {
            val mockLocation = Location("demo_provider").apply {
                latitude = demoCurrentLat
                longitude = demoCurrentLon
                accuracy = 5f
                time = System.currentTimeMillis()
            }
            trySend(mockLocation)
        }

        val locationRequest = LocationRequest.Builder(Priority.PRIORITY_HIGH_ACCURACY, intervalMs)
            .setMinUpdateIntervalMillis(intervalMs / 2)
            .setMinUpdateDistanceMeters(2f)
            .build()

        val locationCallback = object : LocationCallback() {
            override fun onLocationResult(result: LocationResult) {
                for (loc in result.locations) {
                    trySend(loc)
                }
            }
        }

        try {
            fusedLocationClient.requestLocationUpdates(
                locationRequest,
                locationCallback,
                Looper.getMainLooper()
            )
        } catch (e: SecurityException) {
            close(e)
        }

        awaitClose {
            fusedLocationClient.removeLocationUpdates(locationCallback)
        }
    }

    companion object {
        fun calculateDistanceMeters(lat1: Double, lon1: Double, lat2: Double, lon2: Double): Float {
            val results = FloatArray(1)
            Location.distanceBetween(lat1, lon1, lat2, lon2, results)
            return results[0]
        }

        fun calculateBearing(lat1: Double, lon1: Double, lat2: Double, lon2: Double): Float {
            val phi1 = Math.toRadians(lat1)
            val phi2 = Math.toRadians(lat2)
            val deltaLambda = Math.toRadians(lon2 - lon1)

            val y = sin(deltaLambda) * cos(phi2)
            val x = cos(phi1) * sin(phi2) - sin(phi1) * cos(phi2) * cos(deltaLambda)
            val bearingRad = atan2(y, x)
            return ((Math.toDegrees(bearingRad) + 360) % 360).toFloat()
        }

        fun isArrivalVerified(
            currentLat: Double,
            currentLon: Double,
            destLat: Double,
            destLon: Double,
            accuracyMeters: Float,
            targetRadiusMeters: Float = 35f
        ): Boolean {
            // Protect against inaccurate GPS jumps (>30m accuracy report)
            if (accuracyMeters > 30f) return false
            val distance = calculateDistanceMeters(currentLat, currentLon, destLat, destLon)
            return distance <= (targetRadiusMeters + (accuracyMeters / 2f))
        }
    }
}
