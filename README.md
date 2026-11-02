# ECOSPHERE – Smart City Solutions

> **Student Innovation Project · Blossoms Convent School**  
> *Smarter Systems. Cleaner Tomorrow.*

ECOSPHERE is an integrated municipal IoT web platform and AI companion combining three automated urban subsystems:
1. **Smart Waste Management & Segregation** (Dry vs. Organic segregation via Arduino Mega, IR proximity detection, servo diverter mechanism, and decentralized composting).
2. **Smart Farming & Precision Irrigation** (Soil moisture capacitive sensing with threshold-based relay actuation and submersible pump control).
3. **Environmental & Air Quality Monitoring** (MQ-2 gas sensing array and DHT11 digital thermo-hygrometer).
4. **CityPulse AI Assistant** (Powered by Gemini 3.8 Flash, evaluating real-time subsystem telemetry and providing prescriptive municipal engineering recommendations).

---

## 🏗️ Hardware Architecture & Serial Chain

The physical hardware connects three Arduino Megas in a serial daisy-chain, ending at an ESP8266 NodeMCU Wi-Fi bridge:

```
┌─────────────────┐        ┌──────────────────┐        ┌──────────────────┐        ┌───────────────────┐
│   Waste Mega    │ Serial │ Irrigation Mega  │ Serial │  Air Mega Node   │ Serial │  NodeMCU ESP8266  │
│  (Intake & IR)  ├───────►│  (Pump & Relay)  ├───────►│  (MQ-2 & DHT11)  ├───────►│   (Wi-Fi Bridge)  │
└─────────────────┘  TX1   └──────────────────┘  TX2   └──────────────────┘  TX2   └─────────┬─────────┘
                                                                                             │
                                                                                        HTTP POST /api/sensors/packet
                                                                                             ▼
                                                                                   ┌───────────────────┐
                                                                                   │ ECOSPHERE Web App │
                                                                                   └───────────────────┘
```

### Serial Packet Formats

The backend parser supports the standard serial packets:
- **Waste Node**:
  `WASTE,1,dry,organic,total,lastCategory,binStatus,irStatus,systemStatus`  
  *Example*: `WASTE,1,38,52,90,ORGANIC,NORMAL,CLEAR,ONLINE`
- **Irrigation Node**:
  `IRRIGATION,1,raw,moisture,pumpStatus`  
  *Example*: `IRRIGATION,1,580,46,OFF`
- **Air Quality Node**:
  `AIR,1,pollutionRaw,tempValue,humidityValue,pollutionLevel`  
  *Example*: `AIR,1,145,264,58,LOW` *(Note: `tempValue` is in tenths of °C; 264 = 26.4°C)*

---

## 🚀 Step-by-Step Setup & Developer Guide

### 1. How to Open the Website Locally
Clone or open the repository folder in your terminal:
```bash
cd ecosphere
```

### 2. How to Install Required Dependencies
Run `npm install` to populate `node_modules`:
```bash
npm install
```

### 3. How to Configure the Gemini API Key Securely
In Google AI Studio Build, the `GEMINI_API_KEY` is automatically injected at runtime via user secrets.
When running standalone locally outside AI Studio, create a `.env` file from `.env.example`:
```bash
cp .env.example .env
```
Open `.env` and set your key:
```env
GEMINI_API_KEY="AIzaSy..."
```
*(CityPulse AI includes an automated engineering fallback if no API key is set, ensuring seamless presentations even offline).*

### 4. How to Run the Backend & Dev Server
To start the unified development server (hosting both the Vite frontend and `/api/*` backend routes on port 3000):
```bash
npm run dev
```
Open your browser to `http://localhost:3000`.

### 5. How to Test CityPulse AI
1. Click the floating green **CityPulse AI** badge at the bottom right.
2. Click any of the suggested prompt pills (e.g., *"What is the current live condition of all subsystems?"*).
3. Switch scenario states on the dashboard (e.g. trigger **Dry Soil** or **Waste Bin Full**) and ask CityPulse AI for recommendations—notice how it grounds its advice in current telemetry!

### 6. How to Connect the NodeMCU ESP8266 Later
1. Open the Arduino IDE.
2. Install the `ESP8266` board package and `ESP8266HTTPClient` library.
3. Click the **Hardware Setup** button in the ECOSPHERE navigation bar to view and copy the pre-configured C++ Arduino sketch.
4. Replace `YOUR_WIFI_SSID` and `YOUR_WIFI_PASSWORD` with your local Wi-Fi credentials.
5. Set `serverEndpoint` to your computer's IP address: `"http://192.168.x.x:3000/api/sensors/packet"`.
6. Flash the sketch to the NodeMCU. Once powered, the website will automatically transition from `DEMONSTRATION VALUES` to `LIVE SENSOR DATA`!

### 7. How to Deploy the Website Online
To build and bundle for production:
```bash
npm run build
```
To run the production Express server:
```bash
npm start
```
The server will listen on port 3000 or the port assigned by your hosting provider (e.g. Google Cloud Run, Render, Railway).

---

## 📊 Scientific & Measurement Transparency

- **Air Quality Disclaimer**: MQ-2 gas sensor readings and project-defined pollution levels are experimental indicators developed for educational prototyping and demonstration, and are **NOT** official certified regulatory AQI measurements.
- **Financial & Impact Projections**: All cost savings (28–35%), water conservation targets (up to 40%), and organic compost yields (12–18 tons/year per ward) represent mathematical projections from the Blossoms Convent School Ideation 2.0 pitch deck.
