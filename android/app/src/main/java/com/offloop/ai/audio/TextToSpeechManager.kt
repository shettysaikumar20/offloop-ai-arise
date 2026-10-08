package com.offloop.ai.audio

import android.content.Context
import android.speech.tts.TextToSpeech
import android.speech.tts.UtteranceProgressListener
import com.offloop.ai.core.logging.AppLogger
import java.util.Locale

class TextToSpeechManager(private val context: Context) : TextToSpeech.OnInitListener {
    private var tts: TextToSpeech? = null
    private var isInitialized = false

    init {
        tts = TextToSpeech(context, this)
    }

    override fun onInit(status: Int) {
        if (status == TextToSpeech.SUCCESS) {
            val result = tts?.setLanguage(Locale.US)
            if (result == TextToSpeech.LANG_MISSING_DATA || result == TextToSpeech.LANG_NOT_SUPPORTED) {
                AppLogger.w("TTS Language not supported or missing data")
            } else {
                isInitialized = true
                tts?.setSpeechRate(0.92f) // Slightly relaxed pace for outdoor walking
                tts?.setPitch(1.0f)
            }
        } else {
            AppLogger.e("TTS Initialization failed with status: $status")
        }
    }

    fun speak(text: String, onComplete: (() -> Unit)? = null) {
        if (!isInitialized || tts == null) {
            AppLogger.w("TTS not ready to speak")
            return
        }

        val utteranceId = "offloop_narration_${System.currentTimeMillis()}"
        if (onComplete != null) {
            tts?.setOnUtteranceProgressListener(object : UtteranceProgressListener() {
                override fun onStart(id: String?) {}
                override fun onDone(id: String?) {
                    if (id == utteranceId) onComplete()
                }
                override fun onError(id: String?) {}
            })
        }

        tts?.speak(text, TextToSpeech.QUEUE_FLUSH, null, utteranceId)
    }

    fun stop() {
        tts?.stop()
    }

    fun shutdown() {
        tts?.stop()
        tts?.shutdown()
        tts = null
        isInitialized = false
    }
}
