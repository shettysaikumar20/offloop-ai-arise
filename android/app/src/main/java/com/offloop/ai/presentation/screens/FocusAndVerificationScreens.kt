package com.offloop.ai.presentation.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
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
import com.offloop.ai.presentation.components.EmergencyExitButton
import com.offloop.ai.presentation.components.OffLoopTopBar
import com.offloop.ai.presentation.viewmodel.MainViewModel
import com.offloop.ai.theme.*

@Composable
fun FocusModeScreen(
    viewModel: MainViewModel,
    onBack: () -> Unit,
    onCancelQuest: () -> Unit
) {
    val uiState by viewModel.uiState.collectAsState()

    Scaffold(
        topBar = { OffLoopTopBar(title = "Screen-Light Focus", onBack = onBack) }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .background(ForestDark)
                .padding(padding)
                .padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                modifier = Modifier.weight(1f),
                verticalArrangement = Arrangement.Center
            ) {
                Box(
                    modifier = Modifier
                        .size(120.dp)
                        .clip(CircleShape)
                        .background(ForestPrimary),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = Icons.Default.PhoneAndroid,
                        contentDescription = null,
                        modifier = Modifier.size(64.dp),
                        tint = LeafGreen
                    )
                }

                Spacer(modifier = Modifier.height(32.dp))

                Text(
                    text = "${uiState.focusSessionMinutes} min",
                    style = MaterialTheme.typography.headlineLarge,
                    color = Color.White,
                    fontWeight = FontWeight.Bold,
                    fontSize = 44.sp
                )

                Spacer(modifier = Modifier.height(8.dp))

                Text(
                    text = "Screen-Free Exploration in Progress",
                    style = MaterialTheme.typography.titleMedium,
                    color = LeafGreen,
                    fontWeight = FontWeight.SemiBold
                )

                Spacer(modifier = Modifier.height(16.dp))

                Text(
                    text = "Pocket your phone. Look at the trees, buildings, and streets around you. Your phone will gently vibrate when you reach the destination.",
                    style = MaterialTheme.typography.bodyMedium,
                    color = SoftCream,
                    textAlign = TextAlign.Center
                )
            }

            Column(modifier = Modifier.fillMaxWidth()) {
                Button(
                    onClick = onBack,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(50.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = LeafGreen),
                    shape = RoundedCornerShape(14.dp)
                ) {
                    Text("View Navigation Clues", color = ForestDark, fontWeight = FontWeight.Bold)
                }
                Spacer(modifier = Modifier.height(10.dp))
                EmergencyExitButton(onExit = onCancelQuest)
            }
        }
    }
}

@Composable
fun GpsVerificationScreen(
    viewModel: MainViewModel,
    onProceedToPhoto: () -> Unit,
    onProceedToComplete: () -> Unit,
    onBack: () -> Unit
) {
    val uiState by viewModel.uiState.collectAsState()
    val isArrived = uiState.isArrivalVerified || uiState.distanceToTargetMeters <= 35f

    Scaffold(
        topBar = { OffLoopTopBar(title = "Destination Arrival", onBack = onBack) }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .background(MaterialTheme.colorScheme.background)
                .padding(padding)
                .padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                modifier = Modifier.weight(1f),
                verticalArrangement = Arrangement.Center
            ) {
                Box(
                    modifier = Modifier
                        .size(110.dp)
                        .clip(CircleShape)
                        .background(if (isArrived) SuccessGreen.copy(alpha = 0.2f) else WarmSand.copy(alpha = 0.3f)),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = if (isArrived) Icons.Default.CheckCircle else Icons.Default.GpsFixed,
                        contentDescription = null,
                        modifier = Modifier.size(60.dp),
                        tint = if (isArrived) SuccessGreen else EarthBrown
                    )
                }

                Spacer(modifier = Modifier.height(24.dp))

                Text(
                    text = if (isArrived) "Arrival Verified!" else "Approaching Destination",
                    style = MaterialTheme.typography.headlineMedium,
                    fontWeight = FontWeight.Bold,
                    textAlign = TextAlign.Center
                )

                Spacer(modifier = Modifier.height(12.dp))

                Text(
                    text = if (isArrived)
                        "You have successfully arrived at ${uiState.activeQuest?.destinationName}."
                    else
                        "You are currently ${uiState.distanceToTargetMeters.toInt()} meters away. Walk a bit closer to verify arrival.",
                    style = MaterialTheme.typography.bodyLarge,
                    textAlign = TextAlign.Center,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )

                // Demo Mode Simulation Check
                if (!isArrived && uiState.userPreferences.isDemoModeEnabled) {
                    Spacer(modifier = Modifier.height(16.dp))
                    Button(
                        onClick = { viewModel.toggleDemoMode(true) },
                        colors = ButtonDefaults.buttonColors(containerColor = AccentAmber)
                    ) {
                        Text("Simulate Arrival (Demo Mode)")
                    }
                }
            }

            Column(modifier = Modifier.fillMaxWidth()) {
                if (isArrived) {
                    Button(
                        onClick = onProceedToPhoto,
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(52.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = ForestPrimary),
                        shape = RoundedCornerShape(14.dp)
                    ) {
                        Icon(Icons.Default.CameraAlt, contentDescription = null, tint = Color.White)
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("Complete Photo Challenge (Optional)", fontWeight = FontWeight.Bold)
                    }

                    Spacer(modifier = Modifier.height(10.dp))

                    OutlinedButton(
                        onClick = onProceedToComplete,
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(52.dp),
                        shape = RoundedCornerShape(14.dp)
                    ) {
                        Text("Skip Photo & Write Reflection", fontWeight = FontWeight.Bold, color = ForestPrimary)
                    }
                } else {
                    Button(
                        onClick = onBack,
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(52.dp),
                        shape = RoundedCornerShape(14.dp)
                    ) {
                        Text("Continue Exploring")
                    }
                }
            }
        }
    }
}

@Composable
fun PhotoChallengeScreen(
    viewModel: MainViewModel,
    onPhotoCompleted: (String) -> Unit,
    onSkip: () -> Unit
) {
    val uiState by viewModel.uiState.collectAsState()
    val quest = uiState.activeQuest

    var capturedPath by remember { mutableStateOf<String?>(null) }

    Scaffold(
        topBar = { OffLoopTopBar(title = "Photo Challenge", onBack = onSkip) }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .background(MaterialTheme.colorScheme.background)
                .padding(padding)
                .padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    shape = RoundedCornerShape(16.dp)
                ) {
                    Column(modifier = Modifier.padding(18.dp)) {
                        Text("Observation Task:", fontWeight = FontWeight.Bold, style = MaterialTheme.typography.titleMedium)
                        Spacer(modifier = Modifier.height(6.dp))
                        Text(
                            quest?.observationTask?.prompt ?: "Observe an interesting architectural or natural feature.",
                            style = MaterialTheme.typography.bodyMedium
                        )
                        Spacer(modifier = Modifier.height(12.dp))
                        Text(
                            "📷 Note: All photos are strictly saved locally to your personal journal. No personal information or stranger photos allowed.",
                            style = MaterialTheme.typography.bodySmall,
                            color = ForestPrimary
                        )
                    }
                }

                Spacer(modifier = Modifier.height(24.dp))

                Box(
                    modifier = Modifier
                        .size(180.dp)
                        .clip(RoundedCornerShape(16.dp))
                        .background(MaterialTheme.colorScheme.surfaceVariant),
                    contentAlignment = Alignment.Center
                ) {
                    if (capturedPath != null) {
                        Text("✓ Photo Captured", fontWeight = FontWeight.Bold, color = SuccessGreen)
                    } else {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Icon(Icons.Default.CameraAlt, contentDescription = null, modifier = Modifier.size(48.dp), tint = ForestPrimary)
                            Spacer(modifier = Modifier.height(8.dp))
                            Text("Local Photo Viewfinder", style = MaterialTheme.typography.bodySmall)
                        }
                    }
                }
            }

            Column(modifier = Modifier.fillMaxWidth()) {
                Button(
                    onClick = {
                        val path = "/sdcard/Pictures/offloop_quest_${System.currentTimeMillis()}.jpg"
                        capturedPath = path
                        onPhotoCompleted(path)
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(52.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = ForestPrimary),
                    shape = RoundedCornerShape(14.dp)
                ) {
                    Icon(Icons.Default.Camera, contentDescription = null, tint = Color.White)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Capture & Attach Photo", fontWeight = FontWeight.Bold)
                }

                Spacer(modifier = Modifier.height(10.dp))

                TextButton(
                    onClick = onSkip,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text("Skip Photography")
                }
            }
        }
    }
}

@Composable
fun QuestCompleteScreen(
    viewModel: MainViewModel,
    photoPath: String? = null,
    onDone: () -> Unit
) {
    val uiState by viewModel.uiState.collectAsState()
    val quest = uiState.activeQuest ?: return
    var reflectionText by remember { mutableStateOf("") }

    Scaffold(
        topBar = { OffLoopTopBar(title = "Quest Completed!") }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .background(MaterialTheme.colorScheme.background)
                .padding(padding)
                .padding(24.dp),
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            Column {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(containerColor = ForestPrimary),
                    shape = RoundedCornerShape(18.dp)
                ) {
                    Column(
                        modifier = Modifier.padding(20.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Text("🎉 Quest Accomplished!", style = MaterialTheme.typography.headlineSmall, color = Color.White, fontWeight = FontWeight.Bold)
                        Spacer(modifier = Modifier.height(6.dp))
                        Text(quest.title, style = MaterialTheme.typography.titleMedium, color = LeafGreen)
                        Spacer(modifier = Modifier.height(12.dp))
                        Text("+${quest.xpReward} Explorer XP Earned", fontWeight = FontWeight.Bold, color = WarmSand)
                    }
                }

                Spacer(modifier = Modifier.height(20.dp))

                Text("Personal Reflection (Optional):", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
                Spacer(modifier = Modifier.height(8.dp))
                OutlinedTextField(
                    value = reflectionText,
                    onValueChange = { reflectionText = it },
                    placeholder = { Text("What subtle details did you notice today away from your phone?") },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(130.dp),
                    shape = RoundedCornerShape(12.dp)
                )
            }

            Button(
                onClick = {
                    viewModel.completeQuest(reflectionText, photoPath)
                    onDone()
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(54.dp),
                colors = ButtonDefaults.buttonColors(containerColor = ForestPrimary),
                shape = RoundedCornerShape(16.dp)
            ) {
                Text("Save to Exploration Journal", fontWeight = FontWeight.Bold, style = MaterialTheme.typography.titleMedium)
            }
        }
    }
}
