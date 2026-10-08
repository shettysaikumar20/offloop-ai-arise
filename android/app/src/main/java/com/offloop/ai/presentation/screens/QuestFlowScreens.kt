package com.offloop.ai.presentation.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
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
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.offloop.ai.model.QuestMode
import com.offloop.ai.presentation.components.ClueCard
import com.offloop.ai.presentation.components.CompassDial
import com.offloop.ai.presentation.components.EmergencyExitButton
import com.offloop.ai.presentation.components.OffLoopTopBar
import com.offloop.ai.presentation.viewmodel.MainViewModel
import com.offloop.ai.theme.*

@Composable
fun QuestConfigScreen(
    viewModel: MainViewModel,
    onBack: () -> Unit,
    onQuestGenerated: () -> Unit
) {
    val uiState by viewModel.uiState.collectAsState()
    val destination = uiState.selectedDestination ?: return

    var selectedMode by remember { mutableStateOf(QuestMode.EXPLORER) }
    var selectedDuration by remember { mutableIntStateOf(30) }

    Scaffold(
        topBar = { OffLoopTopBar(title = "Quest Preferences", onBack = onBack) }
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
                Text(
                    text = "Adventure Mode",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold
                )
                Spacer(modifier = Modifier.height(8.dp))

                QuestMode.values().forEach { mode ->
                    Card(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 4.dp)
                            .clickable { selectedMode = mode },
                        colors = CardDefaults.cardColors(
                            containerColor = if (selectedMode == mode) ForestPrimary.copy(alpha = 0.12f) else MaterialTheme.colorScheme.surface
                        ),
                        border = if (selectedMode == mode) CardDefaults.outlinedCardBorder().copy(brush = androidx.compose.ui.graphics.SolidColor(ForestPrimary)) else null,
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Row(
                            modifier = Modifier.padding(14.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            RadioButton(
                                selected = selectedMode == mode,
                                onClick = { selectedMode = mode }
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Column {
                                Text(mode.title, fontWeight = FontWeight.Bold)
                                Text(mode.description, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                            }
                        }
                    }
                }

                Spacer(modifier = Modifier.height(20.dp))

                Text(
                    text = "Available Time: $selectedDuration minutes",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold
                )
                Slider(
                    value = selectedDuration.toFloat(),
                    onValueChange = { selectedDuration = it.toInt() },
                    valueRange = 15f..90f,
                    steps = 4,
                    colors = SliderDefaults.colors(thumbColor = ForestPrimary, activeTrackColor = ForestPrimary)
                )
            }

            Button(
                onClick = {
                    viewModel.updatePreferences(
                        uiState.userPreferences.copy(
                            preferredMode = selectedMode,
                            preferredDurationMinutes = selectedDuration
                        )
                    )
                    viewModel.generateQuestForDestination(destination)
                    onQuestGenerated()
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(54.dp),
                colors = ButtonDefaults.buttonColors(containerColor = ForestPrimary),
                shape = RoundedCornerShape(16.dp)
            ) {
                if (uiState.isLoading) {
                    CircularProgressIndicator(color = Color.White, modifier = Modifier.size(24.dp))
                } else {
                    Text("Generate Quest with Gemma", fontWeight = FontWeight.Bold, style = MaterialTheme.typography.titleMedium)
                }
            }
        }
    }
}

@Composable
fun QuestPreviewScreen(
    viewModel: MainViewModel,
    onBack: () -> Unit,
    onStartAdventure: () -> Unit
) {
    val uiState by viewModel.uiState.collectAsState()
    val quest = uiState.activeQuest

    if (quest == null) {
        Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            CircularProgressIndicator()
        }
        return
    }

    Scaffold(
        topBar = { OffLoopTopBar(title = "Adventure Preview", onBack = onBack) }
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
                        Text(
                            text = quest.title,
                            style = MaterialTheme.typography.headlineSmall,
                            color = Color.White,
                            fontWeight = FontWeight.Bold
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = quest.tagline,
                            style = MaterialTheme.typography.bodyMedium,
                            color = LeafGreen
                        )
                        Spacer(modifier = Modifier.height(14.dp))
                        Text(
                            text = quest.narrativeIntro,
                            style = MaterialTheme.typography.bodyLarge,
                            color = SoftCream
                        )
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))
            }

            item {
                Text(
                    text = "Starting Navigation Clue:",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold
                )
                Spacer(modifier = Modifier.height(8.dp))
                quest.clues.firstOrNull()?.let { firstClue ->
                    ClueCard(clue = firstClue)
                }

                Spacer(modifier = Modifier.height(16.dp))

                Text(
                    text = "Observation Task:",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold
                )
                Spacer(modifier = Modifier.height(6.dp))
                Card(
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(14.dp)) {
                        Text(quest.observationTask.prompt, style = MaterialTheme.typography.bodyMedium)
                    }
                }

                Spacer(modifier = Modifier.height(24.dp))

                Button(
                    onClick = {
                        viewModel.startActiveQuest(quest)
                        onStartAdventure()
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(54.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = ForestPrimary),
                    shape = RoundedCornerShape(16.dp)
                ) {
                    Icon(Icons.Default.PlayArrow, contentDescription = null, tint = Color.White)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Pocket Phone & Start Exploring", fontWeight = FontWeight.Bold, style = MaterialTheme.typography.titleMedium)
                }
            }
        }
    }
}

@Composable
fun ActiveAdventureScreen(
    viewModel: MainViewModel,
    onOpenFocusMode: () -> Unit,
    onVerifyArrival: () -> Unit,
    onCancelQuest: () -> Unit
) {
    val uiState by viewModel.uiState.collectAsState()
    val quest = uiState.activeQuest ?: return

    Scaffold(
        topBar = {
            OffLoopTopBar(
                title = quest.destinationName,
                actions = {
                    IconButton(onClick = onOpenFocusMode) {
                        Icon(Icons.Default.PhoneAndroid, contentDescription = "Focus Mode", tint = ForestDark)
                    }
                }
            )
        }
    ) { padding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .background(MaterialTheme.colorScheme.background)
                .padding(padding)
                .padding(20.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // Live Compass Heading Dial
            item {
                Text(
                    text = "Target Compass Heading",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold
                )
                Spacer(modifier = Modifier.height(8.dp))
                CompassDial(
                    currentAzimuth = uiState.currentCompassAzimuth,
                    targetBearing = uiState.targetBearing
                )
                Spacer(modifier = Modifier.height(10.dp))
                Text(
                    text = "${uiState.distanceToTargetMeters.toInt()}m to destination",
                    style = MaterialTheme.typography.headlineSmall,
                    fontWeight = FontWeight.Bold,
                    color = ForestPrimary
                )
                Spacer(modifier = Modifier.height(16.dp))
            }

            // Clues List
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "Environmental Clues",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold
                    )
                }
                Spacer(modifier = Modifier.height(6.dp))
            }

            items(quest.clues.size) { idx ->
                val clue = quest.clues[idx]
                ClueCard(
                    clue = clue,
                    onSpeakClue = { viewModel.speakClue(clue.clueText) }
                )
            }

            // Arrival or Verification Button
            item {
                Spacer(modifier = Modifier.height(20.dp))
                Button(
                    onClick = onVerifyArrival,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(54.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = if (uiState.isArrivalVerified) SuccessGreen else ForestPrimary
                    ),
                    shape = RoundedCornerShape(16.dp)
                ) {
                    Icon(
                        imageVector = if (uiState.isArrivalVerified) Icons.Default.CheckCircle else Icons.Default.GpsFixed,
                        contentDescription = null,
                        tint = Color.White
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = if (uiState.isArrivalVerified) "Arrived! Complete Quest" else "Check In & Verify Arrival",
                        fontWeight = FontWeight.Bold,
                        style = MaterialTheme.typography.titleMedium
                    )
                }

                Spacer(modifier = Modifier.height(12.dp))
                EmergencyExitButton(onExit = onCancelQuest)
            }
        }
    }
}
