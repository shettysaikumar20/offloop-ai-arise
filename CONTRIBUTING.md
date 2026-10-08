# Contributing to OffLoop AI

Thank you for your interest in contributing to **OffLoop AI — The Real World Is Your Game**!

OffLoop AI is an open-source digital wellbeing and location-based adventure platform designed to reduce excessive smartphone screen time by turning real-world outdoor spaces into exploratory quests.

## Hacktoberfest 2026 Participation

OffLoop AI is participating in Hacktoberfest 2026 under the **Touch Grass Challenge** track. We welcome high-quality contributions from developers, designers, and outdoor enthusiasts worldwide!

## Code of Conduct

- Be welcoming, inclusive, and respectful.
- Emphasize user safety: never design features that encourage trespassing, dangerous exploration, or distracted walking.
- Respect privacy: all location verification is local-first. We do not track continuous GPS trails.

## How to Contribute

1. **Fork the repository** and clone it locally.
2. **Create a branch**: `git checkout -b feature/your-feature-name`.
3. **Set up local development**:
   - Backend: Python 3.11+, `pip install -r backend/requirements.txt`
   - Android: Android Studio Jellyfish/Koala+ (or JDK 17/21 + Gradle)
   - AI Engine: Local Ollama with `gemma2:2b` or template fallback mode.
4. **Run tests**:
   - Backend: `pytest backend/tests`
   - Android: `./gradlew test`
5. **Submit a Pull Request** with a detailed description and screenshots/logs.

## Code Standards
- **Android**: Kotlin, Jetpack Compose, Material 3, Clean Architecture (MVVM), Coroutines/Flow, Room.
- **Backend**: Python 3.11+, FastAPI, Pydantic v2, strict type annotations, Pytest.
