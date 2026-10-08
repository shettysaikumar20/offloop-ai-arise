package com.offloop.ai.model

enum class DestinationCategory(val displayName: String) {
    PARK("Park & Nature"),
    GARDEN("Botanical Garden"),
    HISTORIC("Historical Site"),
    MONUMENT("Monument"),
    PUBLIC_SQUARE("Public Square"),
    ARTWORK("Public Art"),
    LIBRARY("Public Library"),
    VIEWPOINT("Scenic Viewpoint"),
    PEDESTRIAN_PLAZA("Pedestrian Plaza"),
    NATURE_RESERVE("Nature Reserve"),
    OTHER_PUBLIC("Public Space")
}

enum class AccessType {
    FREE_PUBLIC,
    UNKNOWN_FEE,
    ACCESSIBLE_GROUNDS
}

data class Destination(
    val id: String,
    val osmId: String? = null,
    val name: String,
    val category: DestinationCategory,
    val description: String? = null,
    val latitude: Double,
    val longitude: Double,
    val distanceMeters: Float = 0f,
    val estimatedWalkMinutes: Int = 0,
    val accessType: AccessType = AccessType.FREE_PUBLIC,
    val isVerifiedPublic: Boolean = true,
    val openingHours: String? = null,
    val address: String? = null,
    val tags: Map<String, String> = emptyMap()
)
