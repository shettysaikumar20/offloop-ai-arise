# Live Demonstration & Device Testing Script

This guide walks through testing **OffLoop AI** on physical Android hardware (e.g., **OnePlus Nord CE 2 Lite**) or an Android Emulator.

---

## 1. Prerequisites & Setup

### A. Start the Backend API
In a terminal:
```powershell
# Windows PowerShell
.\scripts\run_backend.ps1
```
Or with Python:
```bash
python -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload
```
Verify the API is live at `http://localhost:8000/docs`.

### B. Device Connection (OnePlus Nord CE 2 Lite)
1. Enable **Developer Options** on your OnePlus phone (Tap *Settings > About Device > Version > Build Number* 7 times).
2. Enable **USB Debugging** in *Developer Options*.
3. Connect your phone via USB cable and allow USB debugging when prompted.
4. If testing via local Wi-Fi, ensure your phone and laptop are on the same Wi-Fi network, and update the Backend Base URL in the app's Settings to your laptop's local IP (e.g., `http://192.168.1.X:8000`).

---

## 2. Walkthrough Demonstration Steps

### Step 1: Launch & Onboarding
1. Launch **OffLoop AI**.
2. Observe the splash screen and swipe through the 3 onboarding slides highlighting the *Escape the Screen Loop* philosophy.
3. Tap **Grant Location Access** when prompted.

### Step 2: Destination Discovery
1. On the Home screen, tap **Find Quests** or the refresh icon.
2. The app queries OpenStreetMap for public parks, historic markers, botanical gardens, and squares within walking distance.
3. Select any verified public destination (e.g., *Central Green Sanctuary*).

### Step 3: Quest Configuration & AI Generation
1. Choose an adventure mode: **Explorer Mode**, **Mystery Mode**, or **Social Explorer**.
2. Select your walking duration (e.g., 25 minutes) and tap **Generate Quest with Gemma**.
3. Review the narrative introduction, landmark clues, and observation challenge.

### Step 4: Active Adventure & Screen-Off Mode
1. Tap **Pocket Phone & Start Exploring**.
2. The compass dial dynamically rotates to indicate the heading toward the destination.
3. Clue 1 is unlocked. Spoken narration reads the clue if audio is enabled.
4. Tap the phone icon to activate **Focus Mode** and pocket the phone.

### Step 5: GPS Arrival Verification
1. As you walk within 35 meters of the destination, the app verifies arrival using live GPS.
2. Tap **Check In & Verify Arrival**.
3. (Optional) Take a photo of an architectural feature or botanical leaf using the camera challenge.
4. Write a 1-sentence reflection in your **Exploration Journal**.

### Step 6: Gamification & Insights
1. Tap **Save to Exploration Journal**.
2. View your earned XP (+120 XP), level progression, and the newly unlocked **Touch Grass Pioneer** achievement badge.
3. Check the **Digital Wellbeing** tab to see your screen-free outdoor minutes reclaimed!
