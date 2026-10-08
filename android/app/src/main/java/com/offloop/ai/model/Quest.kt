package com.offloop.ai.model

enum class QuestMode(val title: String, val description: String) {
    EXPLORER("Explorer Mode", "Reach nearby destinations using landmarks, clues, and compass headings."),
    MYSTERY("Mystery Mode", "Progressively unlock environmental hints as you get closer."),
    SOCIAL_EXPLORER("Social Explorer", "Optional, friendly interactions and conversations about local history.")
}

enum class QuestDifficulty {
    EASY,
    MODERATE,
    CHALLENGING
}

data class Clue(
    val step: Int,
    val clueText: String,
    val hintType: String = "landmark",
    val unlockDelaySeconds: Int = 0,
    var isUnlocked: Boolean = false
)

data class ObservationTask(
    val prompt: String,
    val category: String,
    val optionalPhotoPrompt: String? = null
)

data class SocialChallenge(
    val prompt: String,
    val isVoluntary: Boolean = true,
    val alternativeSoloTask: String
)

data class CompletionConditions(
    val arrivalRadiusMeters: Float = 35f,
    val requiresGpsVerification: Boolean = true
)

data class Quest(
    val id: String,
    val destinationId: String,
    val destinationName: String,
    val destinationLatitude: Double,
    val destinationLongitude: Double,
    val title: String,
    val tagline: String,
    val narrativeIntro: String,
    val mode: QuestMode = QuestMode.EXPLORER,
    val difficulty: QuestDifficulty = QuestDifficulty.EASY,
    val estimatedDurationMinutes: Int,
    val startingInstruction: String,
    val clues: List<Clue>,
    val observationTask: ObservationTask,
    val optionalSocialChallenge: SocialChallenge? = null,
    val completionConditions: CompletionConditions = CompletionConditions(),
    val safetyGuidance: List<String> = emptyList(),
    val xpReward: Int = 100,
    val aiGenerated: Boolean = false,
    val modelName: String = "template-engine",
    val generatedAt: String = "",
    val isCompleted: Boolean = false,
    val userReflection: String? = null,
    val capturedPhotoPath: String? = null
)
