# System Architecture: OffLoop AI

> **"Break the Scroll. Explore the Real World."**

OffLoop AI is an open-source digital wellbeing and location-based real-world adventure application. It transforms passive smartphone doomscrolling into active outdoor exploration.

---

## 1. High-Level Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                          ANDROID CLIENT (Kotlin)                       │
│                                                                        │
│  ┌───────────────────────┐  ┌──────────────────────────────────────┐  │
│  │   Jetpack Compose UI  │  │         Domain & ViewModels          │  │
│  │  (18 Screen Workflows)│  │   (MainViewModel, Gamification)      │  │
│  └───────────┬───────────┘  └──────────────────┬───────────────────┘  │
│              │                                 │                      │
│  ┌───────────▼───────────┐  ┌──────────────────▼───────────────────┐  │
│  │   Hardware Sensors    │  │        Offline-First Room DB         │  │
│  │ (GPS, Azimuth Compass,│  │(Destinations, Quests, Journal, Badges│  │
│  │  CameraX, Android TTS)│  └──────────────────┬───────────────────┘  │
│  └───────────────────────┘                     │                      │
└────────────────────────────────────────────────┼───────────────────────┘
                                                 │ HTTP / JSON
                                                 ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        BACKEND API (FastAPI)                           │
│                                                                        │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │                      REST Endpoints (/api/v1)                  │   │
│   │   • /destinations/nearby  • /quests/generate  • /narration     │   │
│   └───────────────┬────────────────────────────┬───────────────────┘   │
│                   │                            │                       │
│   ┌───────────────▼──────────────┐   ┌─────────▼───────────────────┐   │
│   │   OpenStreetMap & Overpass   │   │     Gemma AI Quest Engine   │   │
│   │     POI Discovery & Cache    │   │  (Ollama / Hosted / Fallback│   │
│   └──────────────────────────────┘   └─────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Core Subsystems

### A. Location & POI Discovery Engine
- **Data Source:** OpenStreetMap via Overpass API queries filtered specifically for verified public recreational, natural, historical, and civic spaces (`leisure=park`, `leisure=garden`, `historic=*`, `tourism=monument`, `place=square`).
- **Safety Filters:** Explicitly excludes private grounds, restricted military zones, and dangerous terrain.
- **Pedestrian Routing Heuristic:** Calculates Haversine distance with a $1.2\times$ pedestrian route multiplier and realistic 4.5 km/h walking speed estimation.
- **In-Memory Geo-Grid Cache:** Caches nearby results using a spatial coordinate grid to avoid redundant queries to community OSM servers.

### B. Gemma AI Quest Engine & Anti-Hallucination Guardrails
- **Model:** Open-weight **Google Gemma** (via local Ollama `gemma2:2b` or hosted endpoint) with a deterministic fallback template engine.
- **Strict Structured JSON:** Generated quests must conform to the shared JSON schema containing clues, observation prompts, safety notes, and XP rewards.
- **Validator & Ground-Truth Enforcement:**
  1. *Anti-Hallucination:* Replaces any fabricated destination names or coordinates with the verified ground-truth OSM record.
  2. *Safety Filtering:* Sanitizes prompt injection attacks and rejects dangerous keywords (trespassing, railway tracks, nighttime exploration).
  3. *Auto-Repair:* Automatically populates missing clues or tasks with curated outdoor templates.

### C. Screen-Light Navigation (Anti-Map-Gazing)
- **Landmark Clues:** Users navigate via progressive environmental clues and sensory cues.
- **Live Azimuth Compass:** Built-in sensor smoothing filter using accelerometer and magnetometer hardware vectors (`Sensor.TYPE_ROTATION_VECTOR`).
- **Hands-Free Audio:** Spoken mission introductions and clue narration via Android Text-to-Speech (`TextToSpeechManager`).

### D. GPS Geofencing Arrival Verification
- **Verification Rule:**
  $$\text{Distance} \le \text{ArrivalRadius} + \frac{\text{GPS Accuracy}}{2}$$
- **Accuracy Safeguard:** Rejects location measurements with accuracy error $>30\text{m}$ to prevent simulated GPS jumping.

### E. Privacy-First Local Storage
- **Room Database:** All exploration journals, reflections, unlocked achievements, and cached destinations are persisted locally on-device.
- **Zero Breadcrumb Tracking:** OffLoop does not store or upload continuous GPS location histories.
