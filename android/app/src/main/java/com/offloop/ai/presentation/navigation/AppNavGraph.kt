package com.offloop.ai.presentation.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.offloop.ai.presentation.screens.*
import com.offloop.ai.presentation.viewmodel.MainViewModel

@Composable
fun AppNavGraph(
    viewModel: MainViewModel,
    navController: NavHostController = rememberNavController()
) {
    NavHost(
        navController = navController,
        startDestination = Screen.Splash.route
    ) {
        composable(Screen.Splash.route) {
            SplashScreen(
                onSplashComplete = {
                    navController.navigate(Screen.Onboarding.route) {
                        popUpTo(Screen.Splash.route) { inclusive = true }
                    }
                }
            )
        }

        composable(Screen.Onboarding.route) {
            OnboardingScreen(
                onGetStarted = {
                    navController.navigate(Screen.Permissions.route)
                }
            )
        }

        composable(Screen.Permissions.route) {
            PermissionsScreen(
                onContinue = {
                    navController.navigate(Screen.Home.route) {
                        popUpTo(Screen.Onboarding.route) { inclusive = true }
                    }
                }
            )
        }

        composable(Screen.Home.route) {
            HomeScreen(
                viewModel = viewModel,
                onNavigateToDiscover = { navController.navigate(Screen.Discover.route) },
                onNavigateToJournal = { navController.navigate(Screen.Journal.route) },
                onNavigateToAchievements = { navController.navigate(Screen.Achievements.route) },
                onNavigateToAnalytics = { navController.navigate(Screen.Analytics.route) },
                onNavigateToSettings = { navController.navigate(Screen.Settings.route) },
                onSelectDestination = { dest ->
                    navController.navigate(Screen.DestinationDetail.createRoute(dest.id))
                }
            )
        }

        composable(Screen.Discover.route) {
            DiscoverScreen(
                viewModel = viewModel,
                onBack = { navController.popBackStack() },
                onSelectDestination = { dest ->
                    navController.navigate(Screen.DestinationDetail.createRoute(dest.id))
                }
            )
        }

        composable(Screen.DestinationDetail.route) { backStackEntry ->
            val destId = backStackEntry.arguments?.getString("destinationId") ?: ""
            DestinationDetailScreen(
                viewModel = viewModel,
                onBack = { navController.popBackStack() },
                onConfigureQuest = {
                    navController.navigate(Screen.QuestConfig.createRoute(destId))
                }
            )
        }

        composable(Screen.QuestConfig.route) { backStackEntry ->
            val destId = backStackEntry.arguments?.getString("destinationId") ?: ""
            QuestConfigScreen(
                viewModel = viewModel,
                onBack = { navController.popBackStack() },
                onQuestGenerated = {
                    navController.navigate(Screen.QuestPreview.createRoute(destId))
                }
            )
        }

        composable(Screen.QuestPreview.route) { backStackEntry ->
            val questId = backStackEntry.arguments?.getString("questId") ?: ""
            QuestPreviewScreen(
                viewModel = viewModel,
                onBack = { navController.popBackStack() },
                onStartAdventure = {
                    navController.navigate(Screen.ActiveAdventure.createRoute(questId))
                }
            )
        }

        composable(Screen.ActiveAdventure.route) { backStackEntry ->
            val questId = backStackEntry.arguments?.getString("questId") ?: ""
            ActiveAdventureScreen(
                viewModel = viewModel,
                onOpenFocusMode = {
                    navController.navigate(Screen.FocusMode.createRoute(questId))
                },
                onVerifyArrival = {
                    navController.navigate(Screen.GpsVerification.createRoute(questId))
                },
                onCancelQuest = {
                    viewModel.cancelQuest()
                    navController.navigate(Screen.Home.route) {
                        popUpTo(Screen.Home.route) { inclusive = true }
                    }
                }
            )
        }

        composable(Screen.FocusMode.route) {
            FocusModeScreen(
                viewModel = viewModel,
                onBack = { navController.popBackStack() },
                onCancelQuest = {
                    viewModel.cancelQuest()
                    navController.navigate(Screen.Home.route) {
                        popUpTo(Screen.Home.route) { inclusive = true }
                    }
                }
            )
        }

        composable(Screen.GpsVerification.route) { backStackEntry ->
            val questId = backStackEntry.arguments?.getString("questId") ?: ""
            GpsVerificationScreen(
                viewModel = viewModel,
                onProceedToPhoto = {
                    navController.navigate(Screen.PhotoChallenge.createRoute(questId))
                },
                onProceedToComplete = {
                    navController.navigate(Screen.QuestComplete.createRoute(questId))
                },
                onBack = { navController.popBackStack() }
            )
        }

        composable(Screen.PhotoChallenge.route) { backStackEntry ->
            val questId = backStackEntry.arguments?.getString("questId") ?: ""
            PhotoChallengeScreen(
                viewModel = viewModel,
                onPhotoCompleted = { photoPath ->
                    navController.navigate(Screen.QuestComplete.createRoute(questId))
                },
                onSkip = {
                    navController.navigate(Screen.QuestComplete.createRoute(questId))
                }
            )
        }

        composable(Screen.QuestComplete.route) {
            QuestCompleteScreen(
                viewModel = viewModel,
                onDone = {
                    navController.navigate(Screen.Home.route) {
                        popUpTo(Screen.Home.route) { inclusive = true }
                    }
                }
            )
        }

        composable(Screen.Journal.route) {
            JournalScreen(viewModel = viewModel, onBack = { navController.popBackStack() })
        }

        composable(Screen.Achievements.route) {
            AchievementsScreen(viewModel = viewModel, onBack = { navController.popBackStack() })
        }

        composable(Screen.Analytics.route) {
            AnalyticsScreen(viewModel = viewModel, onBack = { navController.popBackStack() })
        }

        composable(Screen.Settings.route) {
            SettingsScreen(viewModel = viewModel, onBack = { navController.popBackStack() })
        }
    }
}
