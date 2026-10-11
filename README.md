<div align="center">

<img src="./assets/header_banner.svg" alt="OffLoop AI: ARISE - Solo Leveling System Header" width="100%" />

<br/><br/>

[![System Status](https://img.shields.io/badge/System-ONLINE-38bdf8?style=for-the-badge&logo=electron&logoColor=white)](#)
[![Hunter Rank](https://img.shields.io/badge/Rank-E_to_S_Monarch-8b5cf6?style=for-the-badge&logo=sublime-text&logoColor=white)](#)
[![Tech Stack](https://img.shields.io/badge/Tech-React_19_+_Vite_+_CSS-10b981?style=for-the-badge&logo=react&logoColor=white)](#)
[![Target Platform](https://img.shields.io/badge/Target-Desktop_Web-facc15?style=for-the-badge&logo=windows&logoColor=black)](#)
[![License](https://img.shields.io/badge/License-MIT-f43f5e?style=for-the-badge)](#)

</div>

<br/>

> [!IMPORTANT]
> **SYSTEM NOTICE: CANDIDATE DETECTED**  
> *Passive scrolling drains mana. Procrastination is a D-Rank beast. Engage physical world quests to restore vitality and ascend to the throne of the Monarch.*

---

## 🌌 The Concept

**OffLoop AI: ARISE** is a desktop-first quest, productivity, and self-improvement web application inspired by the supernatural **"System"** interface from *Solo Leveling*. 

It transforms your daily real-world chores, deep study sessions, physical workouts, and digital detox habits into high-stakes **Hunter Quests**, **Dungeon Raids**, and **Rank Promotions** — running 100% locally in your browser with zero bloat and zero telemetry.

<br/>

<div align="center">
  <img src="./assets/system_status_window.svg" alt="Solo Leveling System Status HUD Window" width="100%" />
</div>

<br/>

---

## 🔮 The Four Pillars of Ascension

<div align="center">
  <img src="./assets/features_cards.svg" alt="Four Pillars of Ascension" width="100%" />
</div>

<br/>

### 1. ⚔️ Quest Gates & Real-World Missions
- **Daily Conditioning Protocols**: Physical pushups, scholar's non-fiction reading, digital feed detox, unbroken deep work strikes.
- **Weekly Gates**: Extended trials that test consistency across multiple consecutive days.
- **Custom Quest Creation**: Register your own real-world tasks with custom difficulties (**E / D / C / B / A / S**), attribute bonuses, and XP bounties.
- **Floating Reward Burst**: Completing a quest launches an animated `+XP` indicator with a neon emerald/blue flash and audio confirmation.

### 2. 🗝️ Dungeon Challenges (Productivity Raids)
Timed, multi-phase boss missions designed to defeat real-world procrastination before the clock expires:
- **Gate of the Cluttered Chamber (D-Rank — 25 Min)**: Clear desk, hydration & airflow, digital tab purge.
- **Red Gate: The Procrastination Labyrinth (B-Rank — 45 Min)**: Identify dread task, break into angles, strike down the deliverable.
- **Monarch's Citadel of Transcendent Craft (S-Rank — 75 Min)**: Full sensory lockdown, blueprint design, deep work surges.

### 3. ⏳ Focus Sanctum (Pomodoro Temporal Barrier)
- **Presets**: 15m Sprint, 25m Pomodoro, 45m Deep Work, 60m Flow Block, 90m Monastic.
- **Hardware-Accelerated Circular Timer**: SVG circular countdown with animated stroke dashoffset and calm breathing aura.
- **Session History Log**: Automatic tracking of focus minutes, task titles, and XP rewards.
- **Pure Local Execution**: Zero blocking of other Windows apps.

### 4. 👥 Shadow Companions & Echoes
Original unlockable companion manifestations born from past self-discipline:

<br/>

<div align="center">
  <img src="./assets/shadow_legion.svg" alt="Shadow Army & Unlocks" width="100%" />
</div>

<br/>

---

## 🌟 First-Time Hunter Awakening Protocol

When a new user launches **OffLoop AI: ARISE**, the System initiates a staged 3-step RPG awakening ritual:

1. **The Summons**: The System intercepts passive scrolling habits and presents the call to become a real-world Hunter.
2. **Hunter Registration**: Enter your custom Hunter Name (*e.g., Sung Jin-Woo*) and Moniker/Title (*e.g., The Reawakened One*).
3. **Discipline Path Selection**: Choose your starting focus:
   - 🛡️ **Iron Will & Digital Detox** (+2 Discipline bonus)
   - 🗡️ **Physical Vessel Awakening** (+2 Strength bonus)
   - 🔮 **Arcane Architect & Scholar** (+2 Intelligence bonus)
   - ⚡ **Temporal Sentinel** (+2 Endurance bonus)
4. **Initiation Rewards**: Grants your customized first E-Rank Awakening Quest and **+75 starting XP**.
5. *You can skip the awakening ritual or replay it anytime from System Settings.*

---

## 🎬 Solo Leveling Cinematic Animations

Engineered specifically for low-power laptops (**Intel i3-6006U, 8 GB RAM**):

| Animation | Implementation | Performance |
|---|---|---|
| **System Awakening** | Translucent obsidian modal reveal with glowing violet borders | Pure CSS transform |
| **Floating XP Rewards** | `+150 XP` floats upward and fades away on quest claim | GPU-accelerated translate3d |
| **Quest Completion Flash** | Border glow pulse in electric emerald & blue | Lightweight CSS keyframe |
| **Rank Promotion Ring** | Expanding energy-ring pseudo-element (`.rank-energy-ring`) | Pure CSS, 0% CPU leak |
| **Dungeon Portal Entry** | Spatial swirl and scale transition on gate opening | 0.38s CSS transform |
| **Focus Breathing Timer** | Animated SVG `stroke-dashoffset` circle with aura pulse | Pauses when timer pauses |
| **Achievement Shimmer** | Diagonal light sweep across unlocked achievement badges | Hardware-accelerated gradient |
| **Tactile Buttons** | Micro-scale compression on click (`:active`) | Zero layout reflow |

> [!NOTE]  
> All animations respect `@media (prefers-reduced-motion: reduce)` for complete accessibility.

---

## 🏗️ Repository Architecture

```
offloop-ai-arise/
├── assets/                    # Solo Leveling System SVG visual cards & banners
│   ├── header_banner.svg      # Cinematic obsidian header banner
│   ├── system_status_window.svg # Full Hunter Status HUD card
│   ├── features_cards.svg     # Four Pillars of Ascension card
│   └── shadow_legion.svg      # Shadow Inventory showcase card
├── frontend/                  # Desktop Web Application
│   ├── src/
│   │   ├── components/        # Status, Quests, Dungeons, Focus Sanctum, Shadows, Achievements
│   │   ├── context/           # SystemContext reactive state engine
│   │   ├── types/             # Models, Ranks (E->S), Quests, Shadows, Stats
│   │   ├── utils/             # LocalStorage manager, Web Audio synthesis, Self-tests
│   │   ├── App.jsx            # Master layout with view transitions
│   │   ├── index.css          # Dark fantasy System stylesheet & animations
│   │   └── main.jsx           # React DOM root
│   ├── test-mechanics.js      # Headless Node.js automated test runner (25 tests)
│   ├── index.html             # HTML shell with Orbitron & Rajdhani fonts
│   ├── vite.config.js         # Vite configuration
│   └── package.json           # Minimal dependencies (React 19, Lucide, Vite)
├── backend/                   # Optional FastAPI Backend (Python 3.11+)
├── scripts/                   # run_web.ps1, run_web.sh
└── .gitignore                 # Clean repository exclusions
```

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js 18+ (tested on Node v20/v22/v26)
- Any desktop web browser (Chrome, Edge, Firefox, Brave)

### 1. Launch the Web Application
```bash
# Clone the repository
git clone https://github.com/shettysaikumar20/offloop-ai-arise.git
cd offloop-ai-arise/frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Or run the convenient root runner script:
```powershell
# Windows PowerShell
.\scripts\run_web.ps1
```
```bash
# Linux / macOS
chmod +x ./scripts/run_web.sh && ./scripts/run_web.sh
```

Open your browser to: **[http://localhost:5173](http://localhost:5173)**

---

## 🧪 Testing & Verification

The project includes an automated test runner validating all RPG calculations:

```bash
cd frontend
npm test
```

```
====================================================
⚡ STARTING OFFLOOP AI: ARISE AUTOMATED TEST SUITE
====================================================
✅ [PASS] Level 1-4 resolves to E-Rank
✅ [PASS] Level 5-9 resolves to D-Rank
✅ [PASS] Level 10 resolves to C-Rank
✅ [PASS] Level 20 resolves to B-Rank
✅ [PASS] Level 35 resolves to A-Rank
✅ [PASS] Level 50 resolves to S-Rank Monarch
✅ [PASS] Level 1 requires 100 XP to advance
✅ [PASS] Level 2 requires more XP than Level 1
✅ [PASS] XP requirements scale consistently across levels
✅ [PASS] 100 XP triggers Level 2 and awards +3 stat points
✅ [PASS] 2000 XP ascends player to Level 10+ and C-Rank
✅ [PASS] Allocating point decrements available points and increases STR
✅ [PASS] Initial quest library populated with dailies and weeklies
✅ [PASS] Three multi-phase Dungeon Gates defined
✅ [PASS] Five original Shadow Companions configured
✅ [PASS] Hunter Feats / Achievements library defined
✅ [PASS] Full state passes JSON import schema validation
✅ [PASS] Empty payload fails validation
✅ [PASS] Null payload safely rejected
✅ [PASS] Tenebris extracts at Level 5
✅ [PASS] Umbra extracts at 5 Focus Sessions
✅ [PASS] Vortex extracts at 7-Day Streak
✅ [PASS] Ignis extracts at 25 Quests Completed
✅ [PASS] Fresh state initializes with awakened=false for onboarding
✅ [PASS] Default Hunter name is properly registered
====================================================
🏁 TEST RESULTS: 25/25 TESTS PASSED (0 FAILED)
====================================================
```

### Production Build Verification
```bash
cd frontend
npm run build
```
Outputs a compact, highly optimized bundle:
- CSS: `~10.9 kB` (`3.2 kB` gzip)
- JS: `~351 kB` (`100 kB` gzip)
- Build time: `< 12 seconds`

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
