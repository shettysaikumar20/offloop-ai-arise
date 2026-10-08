# OffLoop AI — The Real World Is Your Game 🌿

> **"Break the Scroll. Explore the Real World."**

[![Backend CI](https://github.com/offloop-ai/offloop-ai/actions/workflows/backend-ci.yml/badge.svg)](https://github.com/offloop-ai/offloop-ai/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Hacktoberfest 2026](https://img.shields.io/badge/Hacktoberfest-2026-orange.svg)](https://hacktoberfest.com/)
[![Track](https://img.shields.io/badge/Track-Touch_Grass_Challenge-emerald.svg)](#)

**OffLoop AI** is an open-source digital wellbeing and location-based adventure platform designed to reduce excessive smartphone usage and passive doomscrolling by turning nearby public spaces into engaging real-world quests.

---

## 🌟 Key Highlights

- 🧭 **Screen-Light Navigation:** No turn-by-turn map-gazing. Explore using environmental clues, landmark bearings, and an azimuth compass dial.
- 🤖 **Gemma AI Quest Engine:** Generates personalized outdoor quests tailored to your available time, walking preferences, and interests using Google's **Gemma** open-weight model.
- 📍 **Verified Real-World Destinations:** Discovers confirmed free public parks, botanical gardens, historic monuments, and pedestrian plazas using OpenStreetMap and Overpass API.
- 🔒 **Voluntary Focus Shield:** Tracks screen-free walking sessions and notifies you upon arrival via gentle vibration while keeping emergency calling accessible.
- 🏆 **Gamification & Exploration Journal:** Earn XP, unlock explorer tiers (Novice Stroller $\to$ Grand Nature Sage), collect badges, and write personal reflections with optional local photos.
- 🛡️ **Privacy by Design:** Zero breadcrumb GPS tracking, no mandatory accounts, local-first Room database storage.

---

## 🏗️ Repository Architecture

```
offloop-ai/
├── android/                   # Android App (Kotlin, Jetpack Compose, Room, CameraX)
│   ├── app/src/main/java/com/offloop/ai/
│   │   ├── presentation/      # 18 Compose screens, Theme, ViewModels, Navigation
│   │   ├── location/          # GPS arrival verifier, Compass sensor, Foreground service
│   │   ├── focus/             # FocusSessionManager & distraction shield
│   │   ├── audio/             # Native Android Text-to-Speech manager
│   │   ├── camera/            # CameraX photo capture helper
│   │   ├── data/              # Room DB entities, DAOs, Repository, Retrofit API
│   │   └── model/             # Domain data classes & gamification models
│   └── app/src/test/          # JUnit tests for GPS verification & gamification
├── backend/                   # FastAPI Backend (Python 3.11+)
│   ├── app/api/v1/            # REST endpoints (/destinations, /quests, /narration)
│   ├── app/services/          # Location discovery, Gemma AI service, TTS proxy
│   ├── app/validation/        # Anti-hallucination & safety validator
│   ├── tests/                 # 17/17 automated Pytest unit and integration tests
│   ├── Dockerfile             # Production container definition
│   └── render.yaml            # Render deployment blueprint
├── shared/schemas/            # Shared JSON schemas for Quests & Destinations
├── scripts/                   # Startup, demo, and test scripts (.ps1 & .sh)
└── docs/                      # Comprehensive Hackathon & Architecture documentation
```

---

## 🚀 Quick Start Guide

### 1. Start the Backend Service
```bash
# Windows PowerShell
.\scripts\run_backend.ps1

# Linux / macOS
chmod +x ./scripts/run_backend.sh && ./scripts/run_backend.sh
```
Interactive API docs will be live at: [http://localhost:8000/docs](http://localhost:8000/docs)

### 2. Run Backend Tests
```bash
pytest backend/tests -v
```

### 3. Run Simulated Walk & Quest Demo
```bash
python scripts/mock_demo.py
```

### 4. Build and Run the Android App
Open the `android/` directory in Android Studio (Jellyfish / Koala or newer), sync Gradle, and run on your physical Android phone (e.g. OnePlus Nord CE 2 Lite) or emulator.

---

## 📖 Documentation

- 🏛️ [System Architecture](docs/ARCHITECTURE.md)
- 🏆 [Hacktoberfest 2026 Submission](docs/HACKATHON_SUBMISSION.md)
- 📱 [Physical Device Demo Script](docs/DEMO_SCRIPT.md)
- 🧪 [Automated Test Results](docs/TEST_RESULTS.md)
- 📊 [Feature Matrix](docs/FEATURE_MATRIX.md)
- 🛡️ [Privacy Policy](docs/PRIVACY.md)
- ⚠️ [Known Limitations](docs/KNOWN_LIMITATIONS.md)

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).
