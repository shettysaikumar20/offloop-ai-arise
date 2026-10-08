package com.offloop.ai.data.local

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.room.TypeConverters
import com.offloop.ai.data.local.dao.AchievementDao
import com.offloop.ai.data.local.dao.DestinationDao
import com.offloop.ai.data.local.dao.JournalDao
import com.offloop.ai.data.local.dao.QuestDao
import com.offloop.ai.data.local.entity.AchievementEntity
import com.offloop.ai.data.local.entity.DestinationEntity
import com.offloop.ai.data.local.entity.JournalEntity
import com.offloop.ai.data.local.entity.QuestEntity

@Database(
    entities = [
        DestinationEntity::class,
        QuestEntity::class,
        JournalEntity::class,
        AchievementEntity::class
    ],
    version = 1,
    exportSchema = false
)
@TypeConverters(Converters::class)
abstract class OffLoopDatabase : RoomDatabase() {
    abstract fun destinationDao(): DestinationDao
    abstract fun questDao(): QuestDao
    abstract fun journalDao(): JournalDao
    abstract fun achievementDao(): AchievementDao

    companion object {
        @Volatile
        private var INSTANCE: OffLoopDatabase? = null

        fun getDatabase(context: Context): OffLoopDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    OffLoopDatabase::class.java,
                    "offloop_database"
                ).fallbackToDestructiveMigration().build()
                INSTANCE = instance
                instance
            }
        }
    }
}
