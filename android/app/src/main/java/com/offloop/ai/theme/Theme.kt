package com.offloop.ai.theme

import android.app.Activity
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalView
import androidx.core.view.WindowCompat

private val DarkColorScheme = darkColorScheme(
    primary = AccentGreen,
    onPrimary = ForestDark,
    primaryContainer = ForestPrimary,
    onPrimaryContainer = SoftCream,
    secondary = AccentAmber,
    onSecondary = DarkBackground,
    background = DarkBackground,
    onBackground = TextPrimaryDark,
    surface = DarkSurface,
    onSurface = TextPrimaryDark,
    surfaceVariant = DarkCard,
    onSurfaceVariant = TextSecondaryDark,
    error = EmergencyRed
)

private val LightColorScheme = lightColorScheme(
    primary = ForestPrimary,
    onPrimary = SoftCream,
    primaryContainer = LeafGreen,
    onPrimaryContainer = ForestDark,
    secondary = EarthBrown,
    onSecondary = SoftCream,
    background = NeutralBackground,
    onBackground = TextPrimaryLight,
    surface = CardBackgroundLight,
    onSurface = TextPrimaryLight,
    surfaceVariant = SoftCream,
    onSurfaceVariant = TextSecondaryLight,
    error = EmergencyRed
)

@Composable
fun OffLoopTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme
    val view = LocalView.current
    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as Activity).window
            window.statusBarColor = colorScheme.primary.toArgb()
            WindowCompat.getInsetsController(window, view).isAppearanceLightStatusBars = !darkTheme
        }
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}
