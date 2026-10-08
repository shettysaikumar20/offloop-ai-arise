package com.offloop.ai.focus

import android.content.Context
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

class FocusSessionManager(private val context: Context) {
    private val _isFocusActive = MutableStateFlow(false)
    val isFocusActive: StateFlow<Boolean> = _isFocusActive.asStateFlow()

    private val _focusSecondsElapsed = MutableStateFlow(0L)
    val focusSecondsElapsed: StateFlow<Long> = _focusSecondsElapsed.asStateFlow()

    fun startFocusSession() {
        _isFocusActive.value = true
        _focusSecondsElapsed.value = 0L
    }

    fun tickSecond() {
        if (_isFocusActive.value) {
            _focusSecondsElapsed.value += 1
        }
    }

    fun endFocusSession(): Long {
        val totalDuration = _focusSecondsElapsed.value
        _isFocusActive.value = false
        _focusSecondsElapsed.value = 0L
        return totalDuration
    }

    fun cancelFocusSession() {
        _isFocusActive.value = false
        _focusSecondsElapsed.value = 0L
    }
}
