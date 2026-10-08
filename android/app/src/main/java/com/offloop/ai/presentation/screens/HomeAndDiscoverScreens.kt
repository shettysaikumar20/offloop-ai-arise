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
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.offloop.ai.model.Destination
import com.offloop.ai.presentation.components.DestinationCard
import com.offloop.ai.presentation.components.OffLoopTopBar
import com.offloop.ai.presentation.viewmodel.MainViewModel
import com.offloop.ai.theme.*

@Composable
fun HomeScreen(
    viewModel: MainViewModel,
    onNavigateToDiscover: () -> Unit,
    onNavigateToJournal: () -> Unit,
    onNavigateToAchievements: () -> Unit,
    onNavigateToAnalytics: () -> Unit,
    onNavigateToSettings: () -> Unit,
    onSelectDestination: (Destination) -> Unit
) {
    val uiState by viewModel.uiState.collectAsState()

    Scaffold(
        topBar = {
            OffLoopTopBar(
                title = "OffLoop AI",
                actions = {
                    IconButton(onClick = onNavigateToAnalytics) {
                        Icon(Icons.Default.BarChart, contentDescription = "Analytics", tint = ForestDark)
                    }
                    IconButton(onClick = onNavigateToSettings) {
                        Icon(Icons.Default.Settings, contentDescription = "Settings", tint = ForestDark)
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
                .padding(horizontal = 20.dp, vertical = 12.dp)
        ) {
            // Hero Status Card
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(containerColor = ForestPrimary),
                    shape = RoundedCornerShape(20.dp)
                ) {
                    Column(modifier = Modifier.padding(20.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column {
                                Text(
                                    text = "LEVEL ${uiState.explorerLevel}",
                                    style = MaterialTheme.typography.labelMedium,
                                    color = LeafGreen,
                                    fontWeight = FontWeight.Bold
                                )
                                Text(
                                    text = uiState.explorerLevelTitle,
                                    style = MaterialTheme.typography.titleLarge,
                                    color = Color.White,
                                    fontWeight = FontWeight.Bold
                                )
                            }
                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(12.dp))
                                    .background(WarmSand.copy(alpha = 0.25f))
                                    .padding(horizontal = 12.dp, vertical = 6.dp)
                            ) {
                                Text(
                                    text = "${uiState.totalXp} XP",
                                    color = WarmSand,
                                    fontWeight = FontWeight.Bold
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(16.dp))

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            StatBox(
                                label = "Screen-Free",
                                value = "${uiState.screenFreeMinutesTotal}m",
                                icon = Icons.Default.Timer
                            )
                            StatBox(
                                label = "Quests Done",
                                value = "${uiState.journalEntries.size}",
                                icon = Icons.Default.DoneAll
                            )
                            StatBox(
                                label = "Badges",
                                value = "${uiState.achievements.count { it.isUnlocked }}",
                                icon = Icons.Default.EmojiEvents
                            )
                        }
                    }
                }
            }

            // Quick Actions Bar
            item {
                Spacer(modifier = Modifier.height(16.dp))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    Button(
                        onClick = onNavigateToDiscover,
                        modifier = Modifier
                            .weight(1f)
                            .height(50.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = ForestPrimary),
                        shape = RoundedCornerShape(14.dp)
                    ) {
                        Icon(Icons.Default.Explore, contentDescription = null, tint = Color.White)
                        Spacer(modifier = Modifier.width(6.dp))
                        Text("Find Quests", fontWeight = FontWeight.Bold)
                    }
                    OutlinedButton(
                        onClick = onNavigateToJournal,
                        modifier = Modifier
                            .weight(1f)
                            .height(50.dp),
                        shape = RoundedCornerShape(14.dp)
                    ) {
                        Icon(Icons.Default.Book, contentDescription = null, tint = ForestPrimary)
                        Spacer(modifier = Modifier.width(6.dp))
                        Text("Journal", color = ForestPrimary, fontWeight = FontWeight.Bold)
                    }
                }
            }

            // Nearby Destinations Section
            item {
                Spacer(modifier = Modifier.height(24.dp))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "Nearby Free Destinations",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold
                    )
                    TextButton(onClick = { viewModel.refreshNearbyDestinations() }) {
                        Icon(Icons.Default.Refresh, contentDescription = null, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("Refresh")
                    }
                }
            }

            if (uiState.destinations.isEmpty()) {
                item {
                    Card(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 12.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
                    ) {
                        Column(
                            modifier = Modifier
                                .padding(24.dp)
                                .fillMaxWidth(),
                            horizontalAlignment = Alignment.CenterHorizontally
                        ) {
                            Text("Tap refresh to discover nearby public parks, landmarks, and gardens.")
                            Spacer(modifier = Modifier.height(12.dp))
                            Button(onClick = { viewModel.refreshNearbyDestinations() }) {
                                Text("Discover Now")
                            }
                        }
                    }
                }
            } else {
                items(uiState.destinations.take(4)) { dest ->
                    DestinationCard(
                        destination = dest,
                        onClick = {
                            viewModel.selectDestination(dest)
                            onSelectDestination(dest)
                        }
                    )
                }
            }
        }
    }
}

@Composable
fun StatBox(label: String, value: String, icon: androidx.compose.ui.graphics.vector.ImageVector) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Icon(icon, contentDescription = null, modifier = Modifier.size(14.dp), tint = LeafGreen)
            Spacer(modifier = Modifier.width(4.dp))
            Text(text = label, fontSize = 11.sp, color = LeafGreen)
        }
        Spacer(modifier = Modifier.height(2.dp))
        Text(text = value, fontSize = 18.sp, fontWeight = FontWeight.Bold, color = Color.White)
    }
}

@Composable
fun DiscoverScreen(
    viewModel: MainViewModel,
    onBack: () -> Unit,
    onSelectDestination: (Destination) -> Unit
) {
    val uiState by viewModel.uiState.collectAsState()

    Scaffold(
        topBar = {
            OffLoopTopBar(
                title = "Discover Public Places",
                onBack = onBack,
                actions = {
                    IconButton(onClick = { viewModel.refreshNearbyDestinations() }) {
                        Icon(Icons.Default.Refresh, contentDescription = "Refresh", tint = ForestDark)
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
                .padding(horizontal = 20.dp, vertical = 12.dp)
        ) {
            item {
                Text(
                    text = "Showing verified public open spaces within walking distance:",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                Spacer(modifier = Modifier.height(12.dp))
            }

            items(uiState.destinations) { dest ->
                DestinationCard(
                    destination = dest,
                    onClick = {
                        viewModel.selectDestination(dest)
                        onSelectDestination(dest)
                    }
                )
            }
        }
    }
}

@Composable
fun DestinationDetailScreen(
    viewModel: MainViewModel,
    onBack: () -> Unit,
    onConfigureQuest: () -> Unit
) {
    val uiState by viewModel.uiState.collectAsState()
    val destination = uiState.selectedDestination

    if (destination == null) {
        Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            Text("Destination not found")
        }
        return
    }

    Scaffold(
        topBar = {
            OffLoopTopBar(title = destination.name, onBack = onBack)
        }
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
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    shape = RoundedCornerShape(16.dp)
                ) {
                    Column(modifier = Modifier.padding(18.dp)) {
                        Text(
                            text = destination.name,
                            style = MaterialTheme.typography.headlineSmall,
                            fontWeight = FontWeight.Bold
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = destination.description ?: "Verified public accessible space.",
                            style = MaterialTheme.typography.bodyLarge,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                        Spacer(modifier = Modifier.height(16.dp))

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(12.dp)
                        ) {
                            Text("🚶 ${destination.estimatedWalkMinutes} min walk", fontWeight = FontWeight.SemiBold)
                            Text("📍 ${destination.distanceMeters.toInt()}m distance", fontWeight = FontWeight.SemiBold)
                        }
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                Card(
                    colors = CardDefaults.cardColors(containerColor = LeafGreen.copy(alpha = 0.15f)),
                    shape = RoundedCornerShape(14.dp)
                ) {
                    Row(
                        modifier = Modifier.padding(14.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(Icons.Default.Security, contentDescription = null, tint = ForestPrimary)
                        Spacer(modifier = Modifier.width(10.dp))
                        Text(
                            text = "Safety Checked: Confirmed free public grounds with designated pedestrian access.",
                            style = MaterialTheme.typography.bodySmall,
                            color = ForestDark
                        )
                    }
                }
            }

            Button(
                onClick = onConfigureQuest,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(54.dp),
                colors = ButtonDefaults.buttonColors(containerColor = ForestPrimary),
                shape = RoundedCornerShape(16.dp)
            ) {
                Icon(Icons.Default.AutoAwesome, contentDescription = null, tint = Color.White)
                Spacer(modifier = Modifier.width(8.dp))
                Text("Generate AI Quest", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
            }
        }
    }
}
