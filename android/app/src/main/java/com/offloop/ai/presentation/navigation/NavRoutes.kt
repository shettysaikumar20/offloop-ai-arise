package com.offloop.ai.presentation.navigation

sealed class Screen(val route: String) {
    object Splash : Screen("splash")
    object Onboarding : Screen("onboarding")
    object Permissions : Screen("permissions")
    object Home : Screen("home")
    object Discover : Screen("discover")
    object DestinationDetail : Screen("destination_detail/{destinationId}") {
        fun createRoute(destinationId: String) = "destination_detail/$destinationId"
    }
    object QuestConfig : Screen("quest_config/{destinationId}") {
        fun createRoute(destinationId: String) = "quest_config/$destinationId"
    }
    object QuestPreview : Screen("quest_preview/{questId}") {
        fun createRoute(questId: String) = "quest_preview/$questId"
    }
    object ActiveAdventure : Screen("active_adventure/{questId}") {
        fun createRoute(questId: String) = "active_adventure/$questId"
    }
    object FocusMode : Screen("focus_mode/{questId}") {
        fun createRoute(questId: String) = "focus_mode/$questId"
    }
    object GpsVerification : Screen("gps_verification/{questId}") {
        fun createRoute(questId: String) = "gps_verification/$questId"
    }
    object PhotoChallenge : Screen("photo_challenge/{questId}") {
        fun createRoute(questId: String) = "photo_challenge/$questId"
    }
    object QuestComplete : Screen("quest_complete/{questId}") {
        fun createRoute(questId: String) = "quest_complete/$questId"
    }
    object Journal : Screen("journal")
    object Achievements : Screen("achievements")
    object Analytics : Screen("analytics")
    object Settings : Screen("settings")
}
