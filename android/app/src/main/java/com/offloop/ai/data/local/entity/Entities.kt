package com.offloop.ai.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "destinations")
data class DestinationEntity(
    @PrimaryKey val id: String,
    val osmId: String?,
    val name: String,
    val category: String,
    val description: String?,
    val latitude: Double,
    val longitude: Double,
    val distanceMeters: Float,
    val estimatedWalkMinutes: Int,
    val accessType: String,
    val isVerifiedPublic: Boolean,
    val openingHours: String?,
    val address: String?,
    val cachedAt: Long = System.currentTimeMillis()
)

@Entity(tableName = "quests")
data class QuestEntity(
    @PrimaryKey val id: String,
    val destinationId: String,
    val destinationName: String,
    val destinationLatitude: Double,
    val destinationLongitude: Double,
    val title: String,
    val tagline: String,
    val narrativeIntro: String,
    val mode: String,
    val difficulty: String,
    val estimatedDurationMinutes: Int,
    val startingInstruction: String,
    val cluesJson: String,
    val observationTaskJson: String,
    val socialChallengeJson: String?,
    val safetyGuidanceJson: String,
    val xpReward: Int,
    val aiGenerated: Boolean,
    val modelName: String,
    val generatedAt: String,
    val isCompleted: Boolean = false,
    val userReflection: String? = null,
    val capturedPhotoPath: String? = null,
    val savedAt: Long = System.currentTimeMillis()
)

@Entity(tableName = "journal_entries")
data class JournalEntity(
    @PrimaryKey val id: String,
    val questId: String,
    val destinationName: String,
    val completedAt: Long,
    val reflection: String,
    val photoUri: String?,
    val distanceMeters: Float,
    val durationMinutes: Int,
    val xpEarned: Int,
    val isGpsVerified: Boolean
)

@Entity(tableName = "achievements")
data class AchievementEntity(
    @PrimaryKey val id: String,
    val title: String,
    val description: String,
    val iconName: String,
    val xpValue: Int,
    val isUnlocked: Boolean,
    val unlockedAt: Long?,
    val progress: Float
)
