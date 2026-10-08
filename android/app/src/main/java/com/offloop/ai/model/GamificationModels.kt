package com.offloop.ai.model

data class Achievement(
    val id: String,
    val title: String,
    val description: String,
    val iconName: String,
    val xpValue: Int,
    val isUnlocked: Boolean = false,
    val unlockedAt: Long? = null,
    val progress: Float = 0f
)

data class JournalEntry(
    val id: String,
    val questId: String,
    val destinationName: String,
    val completedAt: Long,
    val reflection: String,
    val photoUri: String? = null,
    val distanceMeters: Float,
    val durationMinutes: Int,
    val xpEarned: Int,
    val isGpsVerified: Boolean
)

data class AnalyticsSummary(
    val totalQuestsCompleted: Int = 0,
    val totalScreenFreeMinutes: Int = 0,
    val totalDistanceMeters: Float = 0f,
    val totalDestinationsExplored: Int = 0,
    val totalXp: Int = 0,
    val currentLevel: Int = 1,
    val currentLevelName: String = "Novice Stroller",
    val weeklyGoalProgressPercent: Int = 0
)

data class UserPreferences(
    val selectedInterests: Set<String> = setOf("nature", "architecture", "history"),
    val preferredDurationMinutes: Int = 30,
    val maxWalkingDistanceMeters: Float = 2000f,
    val preferredMode: QuestMode = QuestMode.EXPLORER,
    val isVoiceNarrationEnabled: Boolean = true,
    val isFocusModeEnabled: Boolean = true,
    val isDemoModeEnabled: Boolean = false,
    val backendBaseUrl: String = "http://10.0.2.2:8000"
)
