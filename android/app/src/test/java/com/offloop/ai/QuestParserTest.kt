package com.offloop.ai

import com.google.gson.Gson
import com.offloop.ai.data.repository.toDomain
import com.offloop.ai.data.repository.toEntity
import com.offloop.ai.model.*
import org.junit.Assert.*
import org.junit.Test

class QuestParserTest {
    private val gson = Gson()

    @Test
    fun testQuestEntitySerializationCycle() {
        val quest = Quest(
            id = "quest_cubbon_123",
            destinationId = "dest_cubbon",
            destinationName = "Cubbon Park Bamboo Grove",
            destinationLatitude = 12.9763,
            destinationLongitude = 77.5929,
            title = "Sanctuary of Ancient Trees",
            tagline = "Feel the breeze through the grove",
            narrativeIntro = "Escape the notification loop and follow the green canopy path.",
            mode = QuestMode.EXPLORER,
            difficulty = QuestDifficulty.EASY,
            estimatedDurationMinutes = 25,
            startingInstruction = "Pocket your phone and head west toward the park gate.",
            clues = listOf(
                Clue(1, "Look for the red brick colonial library in the distance.", "landmark", 0, true),
                Clue(2, "Follow the shaded cobblestone path.", "direction", 60, false)
            ),
            observationTask = ObservationTask("Identify two varieties of tropical ferns.", "nature", "Photograph the fern patterns."),
            optionalSocialChallenge = SocialChallenge("Ask a park gardener about tree pruning seasons.", true, "Read the tree species plaque."),
            completionConditions = CompletionConditions(35f, true),
            safetyGuidance = listOf("Stay on marked footpaths", "Watch for uneven cobblestones"),
            xpReward = 140,
            aiGenerated = true,
            modelName = "gemma2:2b"
        )

        val entity = quest.toEntity(gson)
        val deserialized = entity.toDomain(gson)

        assertEquals(quest.id, deserialized.id)
        assertEquals(quest.title, deserialized.title)
        assertEquals(quest.destinationLatitude, deserialized.destinationLatitude, 0.0001)
        assertEquals(quest.clues.size, deserialized.clues.size)
        assertEquals(quest.observationTask.prompt, deserialized.observationTask.prompt)
        assertEquals(quest.optionalSocialChallenge?.prompt, deserialized.optionalSocialChallenge?.prompt)
        assertEquals(quest.xpReward, deserialized.xpReward)
    }
}
