package com.offloop.ai.location

import android.app.*
import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.IBinder
import androidx.core.app.NotificationCompat
import com.offloop.ai.MainActivity

class AdventureForegroundService : Service() {

    override fun onCreate() {
        super.onCreate()
        createNotificationChannel()
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val destinationName = intent?.getStringExtra(EXTRA_DESTINATION_NAME) ?: "Real-World Exploration"

        val notificationIntent = Intent(this, MainActivity::class.java)
        val pendingIntent = PendingIntent.getActivity(
            this,
            0,
            notificationIntent,
            PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
        )

        val notification = NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("OffLoop Active: Pocket Your Phone")
            .setContentText("Exploring towards $destinationName. Keep exploring the real world!")
            .setSmallIcon(android.R.drawable.ic_dialog_map)
            .setContentIntent(pendingIntent)
            .setOngoing(true)
            .setPriority(NotificationCompat.PRIORITY_LOW)
            .build()

        startForeground(NOTIFICATION_ID, notification)
        return START_NOT_STICKY
    }

    override fun onBind(intent: Intent?): IBinder? = null

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                "OffLoop Exploration Session",
                NotificationManager.IMPORTANCE_LOW
            ).apply {
                description = "Notifies that a screen-light outdoor quest is in progress"
            }
            val manager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            manager.createNotificationChannel(channel)
        }
    }

    companion object {
        const val CHANNEL_ID = "offloop_adventure_channel"
        const val NOTIFICATION_ID = 1001
        const val EXTRA_DESTINATION_NAME = "extra_destination_name"

        fun start(context: Context, destinationName: String) {
            val intent = Intent(context, AdventureForegroundService::class.java).apply {
                putExtra(EXTRA_DESTINATION_NAME, destinationName)
            }
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                context.startForegroundService(intent)
            } else {
                context.startService(intent)
            }
        }

        fun stop(context: Context) {
            val intent = Intent(context, AdventureForegroundService::class.java)
            context.stopService(intent)
        }
    }
}
