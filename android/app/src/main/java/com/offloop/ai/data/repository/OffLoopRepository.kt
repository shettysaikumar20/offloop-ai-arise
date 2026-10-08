package com.offloop.ai.data.repository

import com.google.gson.Gson
import com.offloop.ai.data.local.OffLoopDatabase
import com.offloop.ai.data.local.entity.AchievementEntity
import com.offloop.ai.data.local.entity.DestinationEntity
import com.offloop.ai.data.local.entity.JournalEntity
import com.offloop.ai.data.local.entity.QuestEntity
import com.offloop.ai.data.remote.*
import com.offloop.ai.model.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.withContext

class OffLoopRepository(
    private val database: OffLoopDatabase,
    private var apiService: OffLoopApiService = ApiClient.createService()
) {
    private val gson = Gson()

    fun updateBaseUrl(newBaseUrl: String) {
        apiService = ApiClient.createService(newBaseUrl)
    }

    // Destinations Flow & Network Sync
    val localDestinations: Flow<List<Destination>> = database.destinationDao().getAllDestinations().map { entities ->
        entities.map { it.toDomain() }
    }

    suspend fun refreshDestinations(lat: Double, lon: Double, radiusMeters: Float = 2000f): Result<List<Destination>> = withContext(Dispatchers.IO) {
        try {
            val dtos = apiService.getNearbyDestinations(lat, lon, radiusMeters)
            val entities = dtos.map { it.toEntity() }
            database.destinationDao().clearDestinations()
            database.destinationDao().insertDestinations(entities)
            Result.success(entities.map { it.toDomain() })
        } catch (e: Exception) {
            // If offline/error, return cached or generated fallback
            val cached = database.destinationDao().getAllDestinations()
            Result.failure(e)
        }
    }

    // Quest Generation (Network + Fallback + Room Cache)
    suspend fun generateQuest(
        destination: Destination,
        preferences: UserPreferences
    ): Result<Quest> = withContext(Dispatchers.IO) {
        val requestDto = QuestGenerationRequestDto(
            destination = destination.toDto(),
            userInterests = preferences.selectedInterests.toList(),
            availableTimeMinutes = preferences.preferredDurationMinutes,
            walkingDistanceMaxMeters = preferences.maxWalkingDistanceMeters,
            difficulty = QuestDifficulty.EASY.name.lowercase(),
            mode = preferences.preferredMode.name.lowercase()
        )

        try {
            val questDto = apiService.generateQuest(requestDto)
            val quest = questDto.toDomain()
            database.questDao().insertQuest(quest.toEntity(gson))
            Result.success(quest)
        } catch (e: Exception) {
            try {
                // Try fallback backend endpoint or local deterministic template
                val fallbackDto = apiService.generateFallbackQuest(requestDto)
                val fallbackQuest = fallbackDto.toDomain()
                database.questDao().insertQuest(fallbackQuest.toEntity(gson))
                Result.success(fallbackQuest)
            } catch (fallbackError: Exception) {
                val localQuest = createLocalTemplateQuest(destination, preferences)
                database.questDao().insertQuest(localQuest.toEntity(gson))
                Result.success(localQuest)
            }
        }
    }

    suspend fun getQuestById(id: String): Quest? = withContext(Dispatchers.IO) {
        database.questDao().getQuestById(id)?.toDomain(gson)
    }

    suspend fun markQuestCompleted(questId: String, reflection: String?, photoPath: String?) = withContext(Dispatchers.IO) {
        database.questDao().markQuestCompleted(questId, reflection, photoPath)
    }

    // Journal & History
    val journalEntries: Flow<List<JournalEntry>> = database.journalDao().getAllJournalEntries().map { entities ->
        entities.map { it.toDomain() }
    }

    suspend fun addJournalEntry(entry: JournalEntry) = withContext(Dispatchers.IO) {
        database.journalDao().insertJournalEntry(entry.toEntity())
    }

    // Achievements
    val achievements: Flow<List<Achievement>> = database.achievementDao().getAllAchievements().map { entities ->
        if (entities.isEmpty()) {
            val defaults = getDefaultAchievements()
            database.achievementDao().insertAchievements(defaults.map { it.toEntity() })
            defaults
        } else {
            entities.map { it.toDomain() }
        }
    }

    suspend fun unlockAchievement(id: String) = withContext(Dispatchers.IO) {
        database.achievementDao().unlockAchievement(id)
    }

    // Local deterministic template generator for zero-network resilience
    private fun createLocalTemplateQuest(destination: Destination, preferences: UserPreferences): Quest {
        val clues = listOf(
            Clue(1, "Orient your heading towards ${destination.name}. Look for tree canopies and landmark architecture.", "landmark", 0, true),
            Clue(2, "Follow the primary pedestrian path leading toward the site entrance.", "direction", 60, false),
            Clue(3, "Notice the ambient environmental sounds and textures as you step onto the grounds.", "sensory", 120, false)
        )
        return Quest(
            id = "quest_local_${destination.id}_${System.currentTimeMillis()}",
            destinationId = destination.id,
            destinationName = destination.name,
            destinationLatitude = destination.latitude,
            destinationLongitude = destination.longitude,
            title = "Sanctuary Walk to ${destination.name}",
            tagline = "Mindful screen-free stroll.",
            narrativeIntro = "Step away from digital noise and reconnect with the natural and historical fabric around you at ${destination.name}.",
            mode = preferences.preferredMode,
            difficulty = QuestDifficulty.EASY,
            estimatedDurationMinutes = maxOf(15, destination.estimatedWalkMinutes + 10),
            startingInstruction = "Pocket your phone, look ahead, and begin walking toward ${destination.name}.",
            clues = clues,
            observationTask = ObservationTask(
                prompt = "Notice the most distinctive architectural feature or landmark tree at ${destination.name}.",
                category = "architecture",
                optionalPhotoPrompt = "Take an optional photo of a plaque, tree, or architectural detail."
            ),
            safetyGuidance = listOf(
                "Always stay on public sidewalks and marked crosswalks.",
                "Keep emergency contacts available at all times."
            ),
            xpReward = 120,
            aiGenerated = false,
            modelName = "on-device-deterministic"
        )
    }

    private fun getDefaultAchievements(): List<Achievement> {
        return listOf(
            Achievement("first_step", "Touch Grass Pioneer", "Complete your very first real-world exploration quest.", "eco", 100),
            Achievement("distance_5k", "Screen-Free Nomad", "Walk over 5,000 meters away from screen loops.", "directions_walk", 250),
            Achievement("historic_sleuth", "Heritage Sleuth", "Discover 3 historical landmarks or monuments.", "account_balance", 200),
            Achievement("mindful_eye", "Mindful Observer", "Complete 5 observation challenges with personal reflections.", "visibility", 200),
            Achievement("social_spark", "Civic Connector", "Complete a voluntary social exploration challenge.", "people", 150)
        )
    }
}

// Mappers
fun DestinationDto.toEntity(): DestinationEntity = DestinationEntity(
    id = id,
    osmId = osmId,
    name = name,
    category = category,
    description = description,
    latitude = latitude,
    longitude = longitude,
    distanceMeters = distanceMeters,
    estimatedWalkMinutes = estimatedWalkMinutes,
    accessType = accessType,
    isVerifiedPublic = isVerifiedPublic,
    openingHours = openingHours,
    address = address
)

fun DestinationEntity.toDomain(): Destination = Destination(
    id = id,
    osmId = osmId,
    name = name,
    category = try { DestinationCategory.valueOf(category.uppercase()) } catch (e: Exception) { DestinationCategory.PARK },
    description = description,
    latitude = latitude,
    longitude = longitude,
    distanceMeters = distanceMeters,
    estimatedWalkMinutes = estimatedWalkMinutes,
    accessType = try { AccessType.valueOf(accessType.uppercase()) } catch (e: Exception) { AccessType.FREE_PUBLIC },
    isVerifiedPublic = isVerifiedPublic,
    openingHours = openingHours,
    address = address
)

fun Destination.toDto(): DestinationDto = DestinationDto(
    id = id,
    osmId = osmId,
    name = name,
    category = category.name.lowercase(),
    description = description,
    latitude = latitude,
    longitude = longitude,
    distanceMeters = distanceMeters,
    estimatedWalkMinutes = estimatedWalkMinutes,
    accessType = accessType.name.lowercase(),
    isVerifiedPublic = isVerifiedPublic,
    openingHours = openingHours,
    address = address,
    tags = tags
)

fun QuestDto.toDomain(): Quest = Quest(
    id = id,
    destinationId = destinationId,
    destinationName = destinationName,
    destinationLatitude = destinationLatitude,
    destinationLongitude = destinationLongitude,
    title = title,
    tagline = tagline,
    narrativeIntro = narrativeIntro,
    mode = try { QuestMode.valueOf(mode.uppercase()) } catch (e: Exception) { QuestMode.EXPLORER },
    difficulty = try { QuestDifficulty.valueOf(difficulty.uppercase()) } catch (e: Exception) { QuestDifficulty.EASY },
    estimatedDurationMinutes = estimatedDurationMinutes,
    startingInstruction = startingInstruction,
    clues = clues.map { Clue(it.step, it.clueText, it.hintType, it.unlockDelaySeconds, it.step == 1) },
    observationTask = ObservationTask(observationTask.prompt, observationTask.category, observationTask.optionalPhotoPrompt),
    optionalSocialChallenge = optionalSocialChallenge?.let { SocialChallenge(it.prompt, it.isVoluntary, it.alternativeSoloTask) },
    completionConditions = CompletionConditions(),
    safetyGuidance = safetyGuidance,
    xpReward = xpReward,
    aiGenerated = aiGenerated,
    modelName = modelName,
    generatedAt = generatedAt
)

fun Quest.toEntity(gson: Gson): QuestEntity = QuestEntity(
    id = id,
    destinationId = destinationId,
    destinationName = destinationName,
    destinationLatitude = destinationLatitude,
    destinationLongitude = destinationLongitude,
    title = title,
    tagline = tagline,
    narrativeIntro = narrativeIntro,
    mode = mode.name,
    difficulty = difficulty.name,
    estimatedDurationMinutes = estimatedDurationMinutes,
    startingInstruction = startingInstruction,
    cluesJson = gson.toJson(clues),
    observationTaskJson = gson.toJson(observationTask),
    socialChallengeJson = optionalSocialChallenge?.let { gson.toJson(it) },
    safetyGuidanceJson = gson.toJson(safetyGuidance),
    xpReward = xpReward,
    aiGenerated = aiGenerated,
    modelName = modelName,
    generatedAt = generatedAt,
    isCompleted = isCompleted,
    userReflection = userReflection,
    capturedPhotoPath = capturedPhotoPath
)

fun QuestEntity.toDomain(gson: Gson): Quest = Quest(
    id = id,
    destinationId = destinationId,
    destinationName = destinationName,
    destinationLatitude = destinationLatitude,
    destinationLongitude = destinationLongitude,
    title = title,
    tagline = tagline,
    narrativeIntro = narrativeIntro,
    mode = try { QuestMode.valueOf(mode) } catch (e: Exception) { QuestMode.EXPLORER },
    difficulty = try { QuestDifficulty.valueOf(difficulty) } catch (e: Exception) { QuestDifficulty.EASY },
    estimatedDurationMinutes = estimatedDurationMinutes,
    startingInstruction = startingInstruction,
    clues = gson.fromJson(cluesJson, Array<Clue>::class.java)?.toList() ?: emptyList(),
    observationTask = gson.fromJson(observationTaskJson, ObservationTask::class.java) ?: ObservationTask("Look around.", "nature"),
    optionalSocialChallenge = socialChallengeJson?.let { gson.fromJson(it, SocialChallenge::class.java) },
    safetyGuidance = gson.fromJson(safetyGuidanceJson, Array<String>::class.java)?.toList() ?: emptyList(),
    xpReward = xpReward,
    aiGenerated = aiGenerated,
    modelName = modelName,
    generatedAt = generatedAt,
    isCompleted = isCompleted,
    userReflection = userReflection,
    capturedPhotoPath = capturedPhotoPath
)

fun JournalEntry.toEntity(): JournalEntity = JournalEntity(
    id = id,
    questId = questId,
    destinationName = destinationName,
    completedAt = completedAt,
    reflection = reflection,
    photoUri = photoUri,
    distanceMeters = distanceMeters,
    durationMinutes = durationMinutes,
    xpEarned = xpEarned,
    isGpsVerified = isGpsVerified
)

fun JournalEntity.toDomain(): JournalEntry = JournalEntry(
    id = id,
    questId = questId,
    destinationName = destinationName,
    completedAt = completedAt,
    reflection = reflection,
    photoUri = photoUri,
    distanceMeters = distanceMeters,
    durationMinutes = durationMinutes,
    xpEarned = xpEarned,
    isGpsVerified = isGpsVerified
)

fun Achievement.toEntity(): AchievementEntity = AchievementEntity(
    id = id,
    title = title,
    description = description,
    iconName = iconName,
    xpValue = xpValue,
    isUnlocked = isUnlocked,
    unlockedAt = unlockedAt,
    progress = progress
)

fun AchievementEntity.toDomain(): Achievement = Achievement(
    id = id,
    title = title,
    description = description,
    iconName = iconName,
    xpValue = xpValue,
    isUnlocked = isUnlocked,
    unlockedAt = unlockedAt,
    progress = progress
)
