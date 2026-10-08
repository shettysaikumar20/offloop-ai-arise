# Hacktoberfest 2026 — Touch Grass Challenge Submission

## Project Name: OffLoop AI — The Real World Is Your Game
**Tagline:** Break the Scroll. Explore the Real World.  
**Track:** Touch Grass Challenge (Digital Wellbeing, Open-Source AI, Real-World Exploration)

---

### 1. Problem Statement & Motivation
Excessive smartphone screen time and compulsive social media scrolling have disconnected people from their physical neighborhoods. Existing digital wellbeing apps rely solely on friction, restrictions, and app blockers, which often lead to user frustration.

**OffLoop AI** introduces an active replacement model: it converts time away from screens into a gamified, real-world exploration experience powered by open-weight AI (**Gemma**) and verified open data (**OpenStreetMap**).

---

### 2. What We Built
OffLoop AI is an end-to-end open-source platform consisting of:
1. **Android Application (Kotlin / Jetpack Compose / Material 3):**
   - 18 complete user workflow screens (Discovery $\to$ Quest Configuration $\to$ Active Compass $\to$ Focus Mode $\to$ GPS Verification $\to$ Optional Photo Challenge $\to$ Reflection Journal).
   - Offline-first **Room database** persistence.
   - Screen-light navigation with hardware compass azimuth dial and Android Text-to-Speech narration.
   - CameraX integration for local-only photo challenges.
   - Gamification with XP, Explorer Tiers, and Badges.

2. **Backend Engine (FastAPI / Python 3.11):**
   - Real-time OpenStreetMap Overpass POI discovery with caching and safety filtering.
   - **Gemma AI Quest Engine** (supporting local Ollama `gemma2:2b`, hosted endpoints, and deterministic template fallback).
   - Strict anti-hallucination validation and prompt injection defenses.
   - ElevenLabs voice proxy with automatic fallback to native Android TTS.

3. **Comprehensive Testing Suite:**
   - 17/17 automated Pytest unit and integration tests passing.
   - Android JUnit test suite verifying GPS arrival formulas and Room entity serialization.

---

### 3. Open-Source Technologies Used
- **AI/ML:** Google Gemma (`gemma2:2b` / `gemma3:4b`), Ollama
- **Maps & Location:** OpenStreetMap, Overpass API, Android Location Services, Hardware SensorManager
- **Android:** Kotlin, Jetpack Compose, Material 3, Room, CameraX, Retrofit, Kotlin Coroutines & Flow
- **Backend:** FastAPI, Pydantic v2, HTTPX, Pytest, Uvicorn, Docker
- **Deployment:** Render, Dockerfile, GitHub Actions CI/CD

---

### 4. How It Encourages "Touching Grass"
- **Anti-Map-Gazing Design:** Unlike turn-by-turn navigation apps that force users to stare at a moving blue dot, OffLoop displays landmark clues and compass bearings, encouraging users to pocket their phone and observe the physical world.
- **Voluntary Focus Shield:** Tracks screen-free minutes during walking quests and alerts the user with gentle vibrations upon destination arrival.
- **Mindful Observation Tasks:** Prompts users to notice architectural details, flora, and local history, writing a brief reflection in their local journal.

---

### 5. Open Source Repository & Links
- **GitHub Repository:** `offloop-ai` (MIT Licensed)
- **Architecture Spec:** `docs/ARCHITECTURE.md`
- **Demo Script:** `docs/DEMO_SCRIPT.md`
- **Test Results:** `docs/TEST_RESULTS.md`
