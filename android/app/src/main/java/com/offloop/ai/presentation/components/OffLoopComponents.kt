package com.offloop.ai.presentation.components

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.offloop.ai.model.AccessType
import com.offloop.ai.model.Clue
import com.offloop.ai.model.Destination
import com.offloop.ai.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun OffLoopTopBar(
    title: String,
    onBack: (() -> Unit)? = null,
    actions: @Composable RowScope.() -> Unit = {}
) {
    TopAppBar(
        title = {
            Text(
                text = title,
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onPrimaryContainer
            )
        },
        navigationIcon = {
            if (onBack != null) {
                IconButton(onClick = onBack) {
                    Icon(
                        imageVector = Icons.Default.ArrowBack,
                        contentDescription = "Back",
                        tint = MaterialTheme.colorScheme.onPrimaryContainer
                    )
                }
            }
        },
        actions = actions,
        colors = TopAppBarDefaults.topAppBarColors(
            containerColor = MaterialTheme.colorScheme.primaryContainer
        )
    )
}

@Composable
fun DestinationCard(
    destination: Destination,
    onClick: () -> Unit
) {
    Card(
        onClick = onClick,
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 6.dp),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surface
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
        shape = RoundedCornerShape(16.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = destination.name,
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    modifier = Modifier.weight(1f)
                )
                AccessBadge(accessType = destination.accessType)
            }

            Spacer(modifier = Modifier.height(4.dp))

            Text(
                text = destination.description ?: "Public accessible space for outdoor discovery.",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                maxLines = 2
            )

            Spacer(modifier = Modifier.height(10.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                MetricChip(
                    icon = Icons.Default.DirectionsWalk,
                    label = "~${destination.estimatedWalkMinutes} min walk"
                )
                MetricChip(
                    icon = Icons.Default.Place,
                    label = "${destination.distanceMeters.toInt()}m away"
                )
                MetricChip(
                    icon = Icons.Default.Category,
                    label = destination.category.displayName
                )
            }
        }
    }
}

@Composable
fun AccessBadge(accessType: AccessType) {
    val (label, bg, fg) = when (accessType) {
        AccessType.FREE_PUBLIC -> Triple("Free Public", LeafGreen.copy(alpha = 0.3f), ForestDark)
        AccessType.UNKNOWN_FEE -> Triple("Fee Unknown", WarmSand.copy(alpha = 0.5f), EarthBrown)
        AccessType.ACCESSIBLE_GROUNDS -> Triple("Open Grounds", LeafGreen.copy(alpha = 0.2f), ForestPrimary)
    }

    Box(
        modifier = Modifier
            .clip(RoundedCornerShape(8.dp))
            .background(bg)
            .padding(horizontal = 8.dp, vertical = 4.dp)
    ) {
        Text(text = label, fontSize = 11.sp, fontWeight = FontWeight.Bold, color = fg)
    }
}

@Composable
fun MetricChip(icon: androidx.compose.ui.graphics.vector.ImageVector, label: String) {
    Row(
        modifier = Modifier
            .clip(RoundedCornerShape(8.dp))
            .background(MaterialTheme.colorScheme.surfaceVariant)
            .padding(horizontal = 8.dp, vertical = 4.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(
            imageVector = icon,
            contentDescription = null,
            modifier = Modifier.size(14.dp),
            tint = MaterialTheme.colorScheme.primary
        )
        Spacer(modifier = Modifier.width(4.dp))
        Text(
            text = label,
            style = MaterialTheme.typography.labelMedium,
            fontSize = 12.sp,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
    }
}

@Composable
fun ClueCard(
    clue: Clue,
    onSpeakClue: (() -> Unit)? = null
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 6.dp),
        colors = CardDefaults.cardColors(
            containerColor = if (clue.isUnlocked) MaterialTheme.colorScheme.surface else MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.6f)
        ),
        shape = RoundedCornerShape(12.dp)
    ) {
        Column(modifier = Modifier.padding(14.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .size(24.dp)
                            .clip(CircleShape)
                            .background(if (clue.isUnlocked) ForestPrimary else Color.Gray),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = "${clue.step}",
                            color = Color.White,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "Clue ${clue.step} • ${clue.hintType.replaceFirstChar { it.uppercase() }}",
                        style = MaterialTheme.typography.titleSmall,
                        fontWeight = FontWeight.SemiBold
                    )
                }

                if (clue.isUnlocked && onSpeakClue != null) {
                    IconButton(onClick = onSpeakClue, modifier = Modifier.size(32.dp)) {
                        Icon(
                            imageVector = Icons.Default.VolumeUp,
                            contentDescription = "Read Clue",
                            tint = ForestPrimary
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(6.dp))

            if (clue.isUnlocked) {
                Text(
                    text = clue.clueText,
                    style = MaterialTheme.typography.bodyLarge,
                    color = MaterialTheme.colorScheme.onSurface
                )
            } else {
                Text(
                    text = "🔒 Unlocks as you explore closer or after ${clue.unlockDelaySeconds} seconds",
                    style = MaterialTheme.typography.bodyMedium,
                    color = Color.Gray
                )
            }
        }
    }
}

@Composable
fun CompassDial(
    currentAzimuth: Float,
    targetBearing: Float,
    modifier: Modifier = Modifier
) {
    val animatedTargetRotation by animateFloatAsState(targetValue = targetBearing - currentAzimuth, label = "compass")

    Box(
        modifier = modifier
            .size(160.dp)
            .clip(CircleShape)
            .background(DarkSurface),
        contentAlignment = Alignment.Center
    ) {
        // Dial background markings
        Canvas(modifier = Modifier.fillMaxSize().padding(12.dp)) {
            drawCircle(color = Color(0xFF2E3A2E), radius = size.minDimension / 2f)
        }

        // Pointer Needle pointing to target destination
        Box(
            modifier = Modifier
                .fillMaxSize()
                .rotate(animatedTargetRotation),
            contentAlignment = Alignment.Center
        ) {
            Canvas(modifier = Modifier.size(90.dp)) {
                val path = Path().apply {
                    moveTo(size.width / 2f, 0f)
                    lineTo(size.width / 2f + 14f, size.height / 2f)
                    lineTo(size.width / 2f - 14f, size.height / 2f)
                    close()
                }
                drawPath(path = path, color = AccentCoral)

                val southPath = Path().apply {
                    moveTo(size.width / 2f, size.height)
                    lineTo(size.width / 2f + 14f, size.height / 2f)
                    lineTo(size.width / 2f - 14f, size.height / 2f)
                    close()
                }
                drawPath(path = southPath, color = Color.Gray)
            }
        }

        Box(
            modifier = Modifier
                .size(18.dp)
                .clip(CircleShape)
                .background(WarmSand)
        )
    }
}

@Composable
fun EmergencyExitButton(onExit: () -> Unit) {
    Button(
        onClick = onExit,
        colors = ButtonDefaults.buttonColors(containerColor = EmergencyRed),
        shape = RoundedCornerShape(12.dp),
        modifier = Modifier.fillMaxWidth()
    ) {
        Icon(Icons.Default.ExitToApp, contentDescription = null, tint = Color.White)
        Spacer(modifier = Modifier.width(8.dp))
        Text("Emergency Exit / Cancel Quest", color = Color.White, fontWeight = FontWeight.Bold)
    }
}
