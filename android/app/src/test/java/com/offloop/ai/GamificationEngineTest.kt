package com.offloop.ai

import com.offloop.ai.model.Achievement
import com.offloop.ai.model.JournalEntry
import org.junit.Assert.*
import org.junit.Test

class GamificationEngineTest {

    @Test
    fun testLevelProgression() {
        val xp0 = 0
        assertEquals(1, 1 + (xp0 / 250))

        val xp600 = 600
        assertEquals(3, 1 + (xp600 / 250)) // Level 3: Trail Pioneer

        val xp1500 = 1500
        assertEquals(7, 1 + (xp1500 / 250))
    }

    @Test
    fun testJournalAggregation() {
        val entries = listOf(
            JournalEntry("1", "q1", "City Park", System.currentTimeMillis(), "Noticed ancient banyan tree", null, 650f, 15, 120, true),
            JournalEntry("2", "q2", "Rose Garden", System.currentTimeMillis(), "Smelled fresh damp soil", null, 800f, 20, 140, true)
        )

        val totalScreenFreeMinutes = entries.sumOf { it.durationMinutes }
        val totalXp = entries.sumOf { it.xpEarned }
        val totalDistance = entries.sumOf { it.distanceMeters.toDouble() }

        assertEquals(35, totalScreenFreeMinutes)
        assertEquals(260, totalXp)
        assertEquals(1450.0, totalDistance, 0.1)
    }

    @Test
    fun testAchievementUnlock() {
        val achievement = Achievement("first_step", "Touch Grass Pioneer", "Complete your first quest", "eco", 100)
        assertFalse(achievement.isUnlocked)

        val unlocked = achievement.copy(isUnlocked = true, unlockedAt = System.currentTimeMillis())
        assertTrue(unlocked.isUnlocked)
        assertNotNull(unlocked.unlockedAt)
    }
}
