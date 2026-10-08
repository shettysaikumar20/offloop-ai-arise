package com.offloop.ai

import android.app.Application
import com.offloop.ai.core.logging.AppLogger

class OffLoopApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        AppLogger.i("OffLoop AI Application initialized")
    }
}
