# Known Limitations & Hardware Considerations

### 1. GPS Accuracy in Dense Urban Environments
In dense urban areas with tall buildings ("urban canyons"), GPS accuracy can degrade to $>30\text{m}$. OffLoop AI includes a safety threshold that requires reasonable GPS accuracy before confirming arrival to prevent false positives.

### 2. Compass Sensor Calibration
Compass azimuth calculations depend on the device's magnetometer and accelerometer. If the magnetic sensor has not been calibrated recently, a standard figure-8 motion with the phone may be required to recalibrate the hardware compass.

### 3. OpenStreetMap Overpass Availability
The public Overpass API community servers occasionally experience rate limiting during peak hours. OffLoop AI implements spatial geo-grid caching and verified public destination fallbacks so discovery remains fast and functional even when the Overpass server is busy.

### 4. Background Battery Usage
To minimize battery drain on entry-level devices (e.g., 8 GB RAM, Intel i3 or Snapdragon 695 in OnePlus Nord CE 2 Lite), the app uses low-frequency location polling (every 4 seconds) during active focus sessions rather than continuous high-drain location streaming.
