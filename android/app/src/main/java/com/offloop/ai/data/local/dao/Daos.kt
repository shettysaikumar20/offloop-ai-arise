package com.offloop.ai.data.local.dao

import androidx.room.*
import com.offloop.ai.data.local.entity.AchievementEntity
import com.offloop.ai.data.local.entity.DestinationEntity
import com.offloop.ai.data.local.entity.JournalEntity
import com.offloop.ai.data.local.entity.QuestEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface DestinationDao {
    @Query("SELECT * FROM destinations ORDER BY distanceMeters ASC")
    fun getAllDestinations(): Flow<List<DestinationEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertDestinations(destinations: List<DestinationEntity>)

    @Query("DELETE FROM destinations")
    suspend fun clearDestinations()
}

@Dao
interface QuestDao {
    @Query("SELECT * FROM quests ORDER BY savedAt DESC")
    fun getAllQuests(): Flow<List<QuestEntity>>

    @Query("SELECT * FROM quests WHERE id = :id LIMIT 1")
    suspend fun getQuestById(id: String): QuestEntity?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertQuest(quest: QuestEntity)

    @Update
    suspend fun updateQuest(quest: QuestEntity)

    @Query("UPDATE quests SET isCompleted = 1, userReflection = :reflection, capturedPhotoPath = :photoPath WHERE id = :id")
    suspend fun markQuestCompleted(id: String, reflection: String?, photoPath: String?)
}

@Dao
interface JournalDao {
    @Query("SELECT * FROM journal_entries ORDER BY completedAt DESC")
    fun getAllJournalEntries(): Flow<List<JournalEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertJournalEntry(entry: JournalEntity)

    @Query("DELETE FROM journal_entries WHERE id = :id")
    suspend fun deleteJournalEntry(id: String)
}

@Dao
interface AchievementDao {
    @Query("SELECT * FROM achievements ORDER BY isUnlocked DESC, xpValue ASC")
    fun getAllAchievements(): Flow<List<AchievementEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAchievements(achievements: List<AchievementEntity>)

    @Query("UPDATE achievements SET isUnlocked = 1, unlockedAt = :unlockedAt WHERE id = :id")
    suspend fun unlockAchievement(id: String, unlockedAt: Long = System.currentTimeMillis())
}
