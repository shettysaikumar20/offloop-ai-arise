package com.offloop.ai.presentation.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.offloop.ai.model.Achievement
import com.offloop.ai.model.JournalEntry
import com.offloop.ai.presentation.components.OffLoopTopBar
import com.offloop.ai.presentation.viewmodel.MainViewModel
import com.offloop.ai.theme.*
import java.text.SimpleDateFormat
import java.util.*

@Composable
fun JournalScreen(viewModel: MainViewModel, onBack: () -> Unit) {
    val uiState by viewModel.uiState.collectAsState()

    Scaffold(
        topBar = { OffLoopTopBar(title = "Exploration Journal", onBack = onBack) }
    ) { padding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .background(MaterialTheme.colorScheme.background)
                .padding(padding)
                .padding(20.dp)
        ) {
            if (uiState.journalEntries.isEmpty()) {
                item {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(top = 80.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Icon(Icons.Default.MenuBook, contentDescription = null, modifier = Modifier.size(54.dp), tint = Color.Gray)
                            Spacer(modifier = Modifier.height(12.dp))
                            Text("Your journal is empty.", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
                            Spacer(modifier = Modifier.height(6.dp))
                            Text("Complete an outdoor adventure to record your first entry.", color = MaterialTheme.colorScheme.onSurfaceVariant)
                        }
                    }
                }
            } else {
                items(uiState.journalEntries) { entry ->
                    JournalCard(entry = entry)
                }
            }
        }
    }
}

@Composable
fun JournalCard(entry: JournalEntry) {
    val dateStr = remember(entry.completedAt) {
        SimpleDateFormat("MMM dd, yyyy • hh:mm a", Locale.getDefault()).format(Date(entry.completedAt))
    }

    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 6.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        shape = RoundedCornerShape(14.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(entry.destinationName, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
                Text("+${entry.xpEarned} XP", color = ForestPrimary, fontWeight = FontWeight.Bold)
            }
            Spacer(modifier = Modifier.height(4.dp))
            Text(dateStr, style = MaterialTheme.typography.bodySmall, color = Color.Gray)
            Spacer(modifier = Modifier.height(8.dp))

            if (entry.reflection.isNotBlank()) {
                Text("“${entry.reflection}”", style = MaterialTheme.typography.bodyMedium)
                Spacer(modifier = Modifier.height(8.dp))
            }

            Row(horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                Text("⏱ ${entry.durationMinutes} min away from screen", style = MaterialTheme.typography.labelSmall)
                if (entry.isGpsVerified) {
                    Text("✓ GPS Verified", style = MaterialTheme.typography.labelSmall, color = SuccessGreen, fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}

@Composable
fun AchievementsScreen(viewModel: MainViewModel, onBack: () -> Unit) {
    val uiState by viewModel.uiState.collectAsState()

    Scaffold(
        topBar = { OffLoopTopBar(title = "Achievements & Badges", onBack = onBack) }
    ) { padding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .background(MaterialTheme.colorScheme.background)
                .padding(padding)
                .padding(20.dp)
        ) {
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(containerColor = ForestPrimary),
                    shape = RoundedCornerShape(16.dp)
                ) {
                    Column(modifier = Modifier.padding(18.dp)) {
                        Text("Total Progress", style = MaterialTheme.typography.titleMedium, color = LeafGreen)
                        Text("${uiState.achievements.count { it.isUnlocked }} of ${uiState.achievements.size} Badges Unlocked", style = MaterialTheme.typography.headlineSmall, color = Color.White, fontWeight = FontWeight.Bold)
                    }
                }
                Spacer(modifier = Modifier.height(16.dp))
            }

            items(uiState.achievements) { ach ->
                AchievementCard(achievement = ach)
            }
        }
    }
}

@Composable
fun AchievementCard(achievement: Achievement) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 5.dp),
        colors = CardDefaults.cardColors(
            containerColor = if (achievement.isUnlocked) MaterialTheme.colorScheme.surface else MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f)
        ),
        shape = RoundedCornerShape(12.dp)
    ) {
        Row(
            modifier = Modifier.padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier
                    .size(46.dp)
                    .clip(CircleShape)
                    .background(if (achievement.isUnlocked) ForestPrimary else Color.LightGray),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = Icons.Default.EmojiEvents,
                    contentDescription = null,
                    tint = if (achievement.isUnlocked) WarmSand else Color.DarkGray
                )
            }

            Spacer(modifier = Modifier.width(14.dp))

            Column(modifier = Modifier.weight(1f)) {
                Text(achievement.title, fontWeight = FontWeight.Bold, style = MaterialTheme.typography.titleSmall)
                Text(achievement.description, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
            }

            Text("+${achievement.xpValue} XP", fontWeight = FontWeight.Bold, color = if (achievement.isUnlocked) ForestPrimary else Color.Gray)
        }
    }
}

@Composable
fun AnalyticsScreen(viewModel: MainViewModel, onBack: () -> Unit) {
    val uiState by viewModel.uiState.collectAsState()

    Scaffold(
        topBar = { OffLoopTopBar(title = "Digital Wellbeing", onBack = onBack) }
    ) { padding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .background(MaterialTheme.colorScheme.background)
                .padding(padding)
                .padding(20.dp)
        ) {
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(containerColor = ForestPrimary),
                    shape = RoundedCornerShape(18.dp)
                ) {
                    Column(modifier = Modifier.padding(20.dp)) {
                        Text("Screen Time Reclaimed", color = LeafGreen, style = MaterialTheme.typography.labelMedium)
                        Text("${uiState.screenFreeMinutesTotal} Minutes", style = MaterialTheme.typography.headlineLarge, color = Color.White, fontWeight = FontWeight.Bold)
                        Spacer(modifier = Modifier.height(8.dp))
                        Text("Outdoor walking time substituted directly for passive scrolling sessions.", color = SoftCream, style = MaterialTheme.typography.bodySmall)
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))
            }

            item {
                Text("Exploration Metrics", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
                Spacer(modifier = Modifier.height(8.dp))

                Card(colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                            Text("Total Quests Completed")
                            Text("${uiState.journalEntries.size}", fontWeight = FontWeight.Bold)
                        }
                        Divider(modifier = Modifier.padding(vertical = 12.dp))
                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                            Text("Total XP Earned")
                            Text("${uiState.totalXp} XP", fontWeight = FontWeight.Bold, color = ForestPrimary)
                        }
                        Divider(modifier = Modifier.padding(vertical = 12.dp))
                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                            Text("Current Explorer Tier")
                            Text(uiState.explorerLevelTitle, fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun SettingsScreen(viewModel: MainViewModel, onBack: () -> Unit) {
    val uiState by viewModel.uiState.collectAsState()
    var backendUrl by remember { mutableStateOf(uiState.userPreferences.backendBaseUrl) }
    var voiceNarration by remember { mutableStateOf(uiState.userPreferences.isVoiceNarrationEnabled) }
    var focusMode by remember { mutableStateOf(uiState.userPreferences.isFocusModeEnabled) }
    var demoMode by remember { mutableStateOf(uiState.userPreferences.isDemoModeEnabled) }

    Scaffold(
        topBar = { OffLoopTopBar(title = "Settings & Privacy", onBack = onBack) }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .background(MaterialTheme.colorScheme.background)
                .padding(padding)
                .padding(20.dp),
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            Column {
                Text("Preferences", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
                Spacer(modifier = Modifier.height(12.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text("Voice Clue Narration (TTS)")
                    Switch(
                        checked = voiceNarration,
                        onCheckedChange = {
                            voiceNarration = it
                            viewModel.updatePreferences(uiState.userPreferences.copy(isVoiceNarrationEnabled = it))
                        }
                    )
                }

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text("Voluntary Focus Mode")
                    Switch(
                        checked = focusMode,
                        onCheckedChange = {
                            focusMode = it
                            viewModel.updatePreferences(uiState.userPreferences.copy(isFocusModeEnabled = it))
                        }
                    )
                }

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text("Demo / Simulated GPS Mode")
                    Switch(
                        checked = demoMode,
                        onCheckedChange = {
                            demoMode = it
                            viewModel.toggleDemoMode(it)
                        }
                    )
                }

                Spacer(modifier = Modifier.height(20.dp))
                Text("Backend Server Endpoint", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
                Spacer(modifier = Modifier.height(8.dp))
                OutlinedTextField(
                    value = backendUrl,
                    onValueChange = {
                        backendUrl = it
                        viewModel.updatePreferences(uiState.userPreferences.copy(backendBaseUrl = it))
                    },
                    modifier = Modifier.fillMaxWidth(),
                    singleLine = true,
                    label = { Text("Base URL (e.g. http://10.0.2.2:8000)") }
                )
            }

            Text(
                text = "OffLoop AI v1.0.0 • Hacktoberfest 2026\nPrivacy-First • No Tracking • Open Source",
                style = MaterialTheme.typography.bodySmall,
                color = Color.Gray
            )
        }
    }
}
