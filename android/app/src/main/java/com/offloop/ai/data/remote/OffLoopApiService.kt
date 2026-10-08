package com.offloop.ai.data.remote

import com.google.gson.annotations.SerializedName
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Query
import java.util.concurrent.TimeUnit

// Network DTOs
data class DestinationDto(
    val id: String,
    @SerializedName("osm_id") val osmId: String?,
    val name: String,
    val category: String,
    val description: String?,
    val latitude: Double,
    val longitude: Double,
    @SerializedName("distance_meters") val distanceMeters: Float,
    @SerializedName("estimated_walk_minutes") val estimatedWalkMinutes: Int,
    @SerializedName("access_type") val accessType: String,
    @SerializedName("is_verified_public") val isVerifiedPublic: Boolean,
    @SerializedName("opening_hours") val openingHours: String?,
    val address: String?,
    val tags: Map<String, String>?
)

data class ClueDto(
    val step: Int,
    @SerializedName("clue_text") val clueText: String,
    @SerializedName("hint_type") val hintType: String,
    @SerializedName("unlock_delay_seconds") val unlockDelaySeconds: Int
)

data class ObservationTaskDto(
    val prompt: String,
    val category: String,
    @SerializedName("optional_photo_prompt") val optionalPhotoPrompt: String?
)

data class SocialChallengeDto(
    val prompt: String,
    @SerializedName("is_voluntary") val isVoluntary: Boolean,
    @SerializedName("alternative_solo_task") val alternativeSoloTask: String
)

data class QuestDto(
    val id: String,
    @SerializedName("destination_id") val destinationId: String,
    @SerializedName("destination_name") val destinationName: String,
    @SerializedName("destination_latitude") val destinationLatitude: Double,
    @SerializedName("destination_longitude") val destinationLongitude: Double,
    val title: String,
    val tagline: String,
    @SerializedName("narrative_intro") val narrativeIntro: String,
    val mode: String,
    val difficulty: String,
    @SerializedName("estimated_duration_minutes") val estimatedDurationMinutes: Int,
    @SerializedName("starting_instruction") val startingInstruction: String,
    val clues: List<ClueDto>,
    @SerializedName("observation_task") val observationTask: ObservationTaskDto,
    @SerializedName("optional_social_challenge") val optionalSocialChallenge: SocialChallengeDto?,
    @SerializedName("safety_guidance") val safetyGuidance: List<String>,
    @SerializedName("xp_reward") val xpReward: Int,
    @SerializedName("ai_generated") val aiGenerated: Boolean,
    @SerializedName("model_name") val modelName: String,
    @SerializedName("generated_at") val generatedAt: String
)

data class QuestGenerationRequestDto(
    val destination: DestinationDto,
    @SerializedName("user_interests") val userInterests: List<String>,
    @SerializedName("available_time_minutes") val availableTimeMinutes: Int,
    @SerializedName("walking_distance_max_meters") val walkingDistanceMaxMeters: Float,
    val difficulty: String,
    val mode: String,
    @SerializedName("custom_theme") val customTheme: String? = null
)

data class NarrationRequestDto(
    val text: String,
    @SerializedName("voice_id") val voiceId: String? = null
)

data class NarrationResponseDto(
    @SerializedName("audio_base64") val audioBase64: String?,
    val format: String,
    @SerializedName("is_fallback") val isFallback: Boolean,
    val message: String
)

interface OffLoopApiService {
    @GET("api/v1/destinations/nearby")
    suspend fun getNearbyDestinations(
        @Query("lat") lat: Double,
        @Query("lon") lon: Double,
        @Query("radius_meters") radiusMeters: Float = 2000f,
        @Query("limit") limit: Int = 20
    ): List<DestinationDto>

    @POST("api/v1/quests/generate")
    suspend fun generateQuest(
        @Body request: QuestGenerationRequestDto
    ): QuestDto

    @POST("api/v1/quests/fallback")
    suspend fun generateFallbackQuest(
        @Body request: QuestGenerationRequestDto
    ): QuestDto

    @POST("api/v1/narration/generate")
    suspend fun generateNarration(
        @Body request: NarrationRequestDto
    ): NarrationResponseDto
}

object ApiClient {
    private const val DEFAULT_BASE_URL = "http://10.0.2.2:8000/" // Android Emulator loopback or local LAN

    private val loggingInterceptor = HttpLoggingInterceptor().apply {
        level = HttpLoggingInterceptor.Level.BODY
    }

    private val okHttpClient = OkHttpClient.Builder()
        .addInterceptor(loggingInterceptor)
        .connectTimeout(15, TimeUnit.SECONDS)
        .readTimeout(45, TimeUnit.SECONDS)
        .build()

    fun createService(baseUrl: String = DEFAULT_BASE_URL): OffLoopApiService {
        val cleanUrl = if (baseUrl.endsWith("/")) baseUrl else "$baseUrl/"
        return Retrofit.Builder()
            .baseUrl(cleanUrl)
            .client(okHttpClient)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(OffLoopApiService::class.java)
    }
}
