package com.offloop.ai.presentation.viewmodel

import android.app.Application
import android.location.Location
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.offloop.ai.audio.TextToSpeechManager
import com.offloop.ai.data.local.OffLoopDatabase
import com.offloop.ai.data.repository.OffLoopRepository
import com.offloop.ai.focus.FocusSessionManager
import com.offloop.ai.location.AdventureForegroundService
import com.offloop.ai.location.CompassSensorHelper
import com.offloop.ai.location.LocationManagerHelper
import com.offloop.ai.model.*
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch

data class UiState(
    val isLoading: Boolean = false,
    val destinations: List<Destination> = emptyList(),
    val selectedDestination: Destination? = null,
    val activeQuest: Quest? = null,
    val userPreferences: UserPreferences = UserPreferences(),
    val currentLatitude: Double = 12.9716,
    val currentLongitude: Double = 77.5946,
    val currentCompassAzimuth: Float = 0f,
    val targetBearing: Float = 0f,
    val distanceToTargetMeters: Float = 0f,
    val isArrivalVerified: Boolean = false,
    val focusSessionMinutes: Int = 0,
    val errorMessage: String? = null,
    val journalEntries: List<JournalEntry> = emptyList(),
    val achievements: List<Achievement> = emptyList(),
    val totalXp: Int = 0,
    val explorerLevel: Int = 1,
    val explorerLevelTitle: String = "Novice Stroller",
    val screenFreeMinutesTotal: Int = 0
)

class MainViewModel(application: Application) : AndroidViewModel(application) {
    private val database = OffLoopDatabase.getDatabase(application)
    val repository = OffLoopRepository(database)
    val locationManagerHelper = LocationManagerHelper(application)
    private val compassSensorHelper = CompassSensorHelper(application)
    val focusSessionManager = FocusSessionManager(application)
    val ttsManager = TextToSpeechManager(application)

    private val _uiState = MutableStateFlow(UiState())
    val uiState: StateFlow<UiState> = _uiState.asStateFlow()

    private var locationJob: Job? = null
    private var compassJob: Job? = null
    private var focusTimerJob: Job? = null
    private var clueTimerJob: Job? = null

    init {
        observeRepositoryData()
        startCompassTracking()
    }

    private fun observeRepositoryData() {
        viewModelScope.launch {
            repository.localDestinations.collect { list ->
                _uiState.update { it.copy(destinations = list) }
            }
        }

        viewModelScope.launch {
            repository.journalEntries.collect { entries ->
                val totalMinutes = entries.sumOf { it.durationMinutes }
                val xp = entries.sumOf { it.xpEarned }
                val level = 1 + (xp / 250)
                val title = when (level) {
                    1 -> "Novice Stroller"
                    2 -> "Neighborhood Scout"
                    3 -> "Trail Pioneer"
                    4 -> "Urban Explorer"
                    else -> "Grand Nature Sage"
                }

                _uiState.update {
                    it.copy(
                        journalEntries = entries,
                        totalXp = xp,
                        explorerLevel = level,
                        explorerLevelTitle = title,
                        screenFreeMinutesTotal = totalMinutes
                    )
                }
            }
        }

        viewModelScope.launch {
            repository.achievements.collect { achs ->
                _uiState.update { it.copy(achievements = achs) }
            }
        }
    }

    fun startLocationTracking() {
        locationJob?.cancel()
        locationJob = viewModelScope.launch {
            locationManagerHelper.getLocationUpdates().collect { loc ->
                updateCurrentLocation(loc)
            }
        }
    }

    private fun startCompassTracking() {
        compassJob?.cancel()
        compassJob = viewModelScope.launch {
            compassSensorHelper.compassHeadingFlow.collect { azimuth ->
                _uiState.update { it.copy(currentCompassAzimuth = azimuth) }
            }
        }
    }

    private fun updateCurrentLocation(location: Location) {
        val lat = location.latitude
        val lon = location.longitude
        val active = _uiState.value.activeQuest

        var distance = 0f
        var bearing = 0f
        var arrived = false

        if (active != null) {
            distance = LocationManagerHelper.calculateDistanceMeters(
                lat, lon, active.destinationLatitude, active.destinationLongitude
            )
            bearing = LocationManagerHelper.calculateBearing(
                lat, lon, active.destinationLatitude, active.destinationLongitude
            )
            arrived = LocationManagerHelper.isArrivalVerified(
                lat, lon, active.destinationLatitude, active.destinationLongitude,
                location.accuracy, active.completionConditions.arrivalRadiusMeters
            )
        }

        _uiState.update {
            it.copy(
                currentLatitude = lat,
                currentLongitude = lon,
                distanceToTargetMeters = distance,
                targetBearing = bearing,
                isArrivalVerified = arrived
            )
        }
    }

    fun refreshNearbyDestinations() {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, errorMessage = null) }
            val lat = _uiState.value.currentLatitude
            val lon = _uiState.value.currentLongitude
            val result = repository.refreshDestinations(lat, lon)
            _uiState.update {
                it.copy(
                    isLoading = false,
                    errorMessage = if (result.isFailure) "Showing offline destinations" else null
                )
            }
        }
    }

    fun selectDestination(destination: Destination) {
        _uiState.update { it.copy(selectedDestination = destination) }
    }

    fun generateQuestForDestination(destination: Destination) {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, errorMessage = null) }
            val result = repository.generateQuest(destination, _uiState.value.userPreferences)
            result.onSuccess { quest ->
                _uiState.update { it.copy(isLoading = false, activeQuest = quest) }
            }.onFailure { err ->
                _uiState.update { it.copy(isLoading = false, errorMessage = err.message) }
            }
        }
    }

    fun startActiveQuest(quest: Quest) {
        _uiState.update { it.copy(activeQuest = quest, isArrivalVerified = false) }
        startLocationTracking()
        AdventureForegroundService.start(getApplication(), quest.destinationName)

        if (_uiState.value.userPreferences.isFocusModeEnabled) {
            focusSessionManager.startFocusSession()
            startFocusTimer()
        }

        // Voice mission intro
        if (_uiState.value.userPreferences.isVoiceNarrationEnabled) {
            ttsManager.speak("Beginning adventure to ${quest.destinationName}. ${quest.startingInstruction}")
        }

        startClueTimers(quest)
    }

    private fun startFocusTimer() {
        focusTimerJob?.cancel()
        focusTimerJob = viewModelScope.launch {
            while (focusSessionManager.isFocusActive.value) {
                delay(1000)
                focusSessionManager.tickSecond()
                _uiState.update { it.copy(focusSessionMinutes = (focusSessionManager.focusSecondsElapsed.value / 60).toInt()) }
            }
        }
    }

    private fun startClueTimers(quest: Quest) {
        clueTimerJob?.cancel()
        clueTimerJob = viewModelScope.launch {
            quest.clues.forEachIndexed { index, clue ->
                if (index > 0 && clue.unlockDelaySeconds > 0) {
                    delay(clue.unlockDelaySeconds * 1000L)
                    val updatedClues = _uiState.value.activeQuest?.clues?.map {
                        if (it.step == clue.step) it.copy(isUnlocked = true) else it
                    } ?: emptyList()
                    _uiState.update { state ->
                        state.copy(activeQuest = state.activeQuest?.copy(clues = updatedClues))
                    }
                }
            }
        }
    }

    fun speakClue(clueText: String) {
        ttsManager.speak(clueText)
    }

    fun completeQuest(userReflection: String, photoPath: String?) {
        val quest = _uiState.value.activeQuest ?: return
        val duration = maxOf(1, _uiState.value.focusSessionMinutes)
        val distance = _uiState.value.distanceToTargetMeters

        viewModelScope.launch {
            val journalEntry = JournalEntry(
                id = "entry_${System.currentTimeMillis()}",
                questId = quest.id,
                destinationName = quest.destinationName,
                completedAt = System.currentTimeMillis(),
                reflection = userReflection,
                photoUri = photoPath,
                distanceMeters = distance,
                durationMinutes = duration,
                xpEarned = quest.xpReward,
                isGpsVerified = _uiState.value.isArrivalVerified
            )
            repository.addJournalEntry(journalEntry)
            repository.markQuestCompleted(quest.id, userReflection, photoPath)

            // Unlock First Step achievement
            repository.unlockAchievement("first_step")

            AdventureForegroundService.stop(getApplication())
            focusSessionManager.endFocusSession()
            focusTimerJob?.cancel()
            clueTimerJob?.cancel()
            locationJob?.cancel()
        }
    }

    fun cancelQuest() {
        AdventureForegroundService.stop(getApplication())
        focusSessionManager.cancelFocusSession()
        focusTimerJob?.cancel()
        clueTimerJob?.cancel()
        locationJob?.cancel()
        _uiState.update { it.copy(activeQuest = null, isArrivalVerified = false) }
    }

    fun updatePreferences(prefs: UserPreferences) {
        _uiState.update { it.copy(userPreferences = prefs) }
        repository.updateBaseUrl(prefs.backendBaseUrl)
    }

    fun toggleDemoMode(enabled: Boolean) {
        locationManagerHelper.isDemoMode = enabled
        _uiState.update {
            it.copy(
                userPreferences = it.userPreferences.copy(isDemoModeEnabled = enabled),
                isArrivalVerified = enabled // If demo mode enabled, allow simulated arrival
            )
        }
    }

    override fun onCleared() {
        super.onCleared()
        ttsManager.shutdown()
        AdventureForegroundService.stop(getApplication())
    }
}
