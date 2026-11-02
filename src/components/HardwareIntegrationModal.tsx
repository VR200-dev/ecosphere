import React, { useState } from 'react';
import { X, Copy, Check, Terminal, Cpu, Wifi, Code2, Layers, Key, CheckCircle2, Shield } from 'lucide-react';

interface HardwareIntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HardwareIntegrationModal: React.FC<HardwareIntegrationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'json' | 'cpp' | 'curl'>('json');

  if (!isOpen) return null;

  const copyToClipboard = (text: string, sectionKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionKey);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  const jsonWasteExample = `{
  "subsystem": "WASTE",
  "dryCount": 24,
  "organicCount": 38,
  "totalCount": 62,
  "lastCategory": "ORGANIC",
  "binStatus": "NORMAL",
  "irStatus": "CLEAR",
  "systemStatus": "ONLINE"
}`;

  const jsonIrrigationExample = `{
  "subsystem": "IRRIGATION",
  "rawSensor": 620,
  "moisturePercent": 42,
  "pumpStatus": "OFF"
}`;

  const jsonAirExample = `{
  "subsystem": "AIR",
  "pollutionRaw": 145,
  "tempCelsius": 26.4,
  "humidityPercent": 58,
  "pollutionLevel": "LOW"
}`;

  const nodemcuJsonCode = `/**
 * ECOSPHERE - NodeMCU ESP8266 Live Hardware Connector
 * Blossoms Convent School - Student Innovation Project
 *
 * Receives serial packets from Air Mega (end of serial daisy chain):
 * Waste Mega -> Irrigation Mega -> Air Mega -> NodeMCU ESP8266
 *
 * Transmits structured JSON to POST /api/sensor-data
 */

#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>

// 1. Wi-Fi Configuration
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// 2. Server API Endpoint
// Local: "http://<LOCAL_IP>:3000/api/sensor-data"
// Cloud Run: "https://<YOUR_APP_URL>/api/sensor-data"
const char* serverUrl = "http://192.168.1.100:3000/api/sensor-data";

// 3. Optional Device Authentication Secret (set in server .env)
const char* deviceApiKey = "ecosphere-nodemcu-secret-key";

WiFiClient wifiClient;

void setup() {
  Serial.begin(9600); // Arduino Mega serial chain input
  delay(100);

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
  }
}

void loop() {
  if (Serial.available() > 0) {
    String packet = Serial.readStringUntil('\\n');
    packet.trim();

    if (packet.length() > 0) {
      // Option A: Forward raw serial packet wrapped in JSON
      String jsonPayload = "{\\"packet\\":\\"" + packet + "\\"}";
      sendJsonToServer(jsonPayload);
    }
  }
}

void sendJsonToServer(String jsonBody) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(wifiClient, serverUrl);
    http.addHeader("Content-Type", "application/json");
    http.addHeader("x-api-key", deviceApiKey); // Device auth secret

    int httpResponseCode = http.POST(jsonBody);
    http.end();
  }
}`;

  const curlTestCommands = `# 1. POST JSON WASTE Telemetry:
curl -X POST http://localhost:3000/api/sensor-data \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: ecosphere-nodemcu-secret-key" \\
  -d '{
    "subsystem": "WASTE",
    "dryCount": 24,
    "organicCount": 38,
    "totalCount": 62,
    "lastCategory": "ORGANIC",
    "binStatus": "NORMAL",
    "irStatus": "CLEAR",
    "systemStatus": "ONLINE"
  }'

# 2. POST JSON IRRIGATION Telemetry:
curl -X POST http://localhost:3000/api/sensor-data \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: ecosphere-nodemcu-secret-key" \\
  -d '{
    "subsystem": "IRRIGATION",
    "rawSensor": 620,
    "moisturePercent": 42,
    "pumpStatus": "OFF"
  }'

# 3. POST JSON AIR Telemetry:
curl -X POST http://localhost:3000/api/sensor-data \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: ecosphere-nodemcu-secret-key" \\
  -d '{
    "subsystem": "AIR",
    "pollutionRaw": 145,
    "tempCelsius": 26.4,
    "humidityPercent": 58,
    "pollutionLevel": "LOW"
  }'

# 4. GET /api/latest (Returns current state + online/offline statuses):
curl -s http://localhost:3000/api/latest`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-emerald-500/20 bg-white p-6 shadow-2xl dark:border-emerald-800/40 dark:bg-slate-900 sm:p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
            <Cpu className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Live Hardware Connectivity & NodeMCU Integration
              </h3>
              <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                Cloud Run Ready
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Blossoms Convent School · Serial Chain Bus & REST JSON Ingestion Protocol
            </p>
          </div>
        </div>

        {/* API Endpoint Summary Card */}
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3.5 dark:border-emerald-800/60 dark:bg-emerald-950/30">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                1. Hardware Ingestion Endpoint
              </span>
              <span className="rounded bg-emerald-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                POST
              </span>
            </div>
            <code className="mt-1 block font-mono text-xs font-bold text-slate-900 dark:text-white">
              /api/sensor-data
            </code>
            <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-300">
              Receives JSON telemetry from NodeMCU ESP8266. Updates live state instantly.
            </p>
          </div>

          <div className="rounded-xl border border-sky-200 bg-sky-50/60 p-3.5 dark:border-sky-800/60 dark:bg-sky-950/30">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-sky-800 dark:text-sky-300">
                2. Live Status & Readings Endpoint
              </span>
              <span className="rounded bg-sky-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                GET
              </span>
            </div>
            <code className="mt-1 block font-mono text-xs font-bold text-slate-900 dark:text-white">
              /api/latest
            </code>
            <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-300">
              Returns current readings and individual online/offline status for waste, irrigation, and air.
            </p>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="mt-6 flex items-center gap-1 border-b border-slate-200 dark:border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('json')}
            className={`border-b-2 px-4 py-2 font-semibold transition-colors ${
              activeTab === 'json'
                ? 'border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            NodeMCU JSON Format
          </button>
          <button
            onClick={() => setActiveTab('cpp')}
            className={`border-b-2 px-4 py-2 font-semibold transition-colors ${
              activeTab === 'cpp'
                ? 'border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            ESP8266 C++ Sketch
          </button>
          <button
            onClick={() => setActiveTab('curl')}
            className={`border-b-2 px-4 py-2 font-semibold transition-colors ${
              activeTab === 'curl'
                ? 'border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            cURL Terminal Test
          </button>
        </div>

        {/* TAB 1: JSON Formats */}
        {activeTab === 'json' && (
          <div className="mt-4 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  1. Waste Management JSON:
                </span>
                <button
                  onClick={() => copyToClipboard(jsonWasteExample, 'wasteJson')}
                  className="text-xs text-emerald-600 hover:underline flex items-center gap-1"
                >
                  {copiedSection === 'wasteJson' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  <span>{copiedSection === 'wasteJson' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="rounded-xl bg-slate-900 p-3.5 font-mono text-xs text-emerald-400">
                {jsonWasteExample}
              </pre>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  2. Irrigation & Soil Moisture JSON:
                </span>
                <button
                  onClick={() => copyToClipboard(jsonIrrigationExample, 'irrigJson')}
                  className="text-xs text-emerald-600 hover:underline flex items-center gap-1"
                >
                  {copiedSection === 'irrigJson' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  <span>{copiedSection === 'irrigJson' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="rounded-xl bg-slate-900 p-3.5 font-mono text-xs text-emerald-400">
                {jsonIrrigationExample}
              </pre>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  3. Air Quality & Atmospheric JSON:
                </span>
                <button
                  onClick={() => copyToClipboard(jsonAirExample, 'airJson')}
                  className="text-xs text-emerald-600 hover:underline flex items-center gap-1"
                >
                  {copiedSection === 'airJson' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  <span>{copiedSection === 'airJson' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="rounded-xl bg-slate-900 p-3.5 font-mono text-xs text-emerald-400">
                {jsonAirExample}
              </pre>
            </div>
          </div>
        )}

        {/* TAB 2: C++ Sketch */}
        {activeTab === 'cpp' && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                Flash onto NodeMCU ESP8266 via Arduino IDE (Uses HTTPClient):
              </span>
              <button
                onClick={() => copyToClipboard(nodemcuJsonCode, 'sketch')}
                className="flex items-center gap-1.5 rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                {copiedSection === 'sketch' ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                <span>{copiedSection === 'sketch' ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>
            <pre className="max-h-72 overflow-y-auto rounded-xl bg-slate-900 p-4 font-mono text-xs text-slate-100">
              {nodemcuJsonCode}
            </pre>
          </div>
        )}

        {/* TAB 3: cURL Terminal Test */}
        {activeTab === 'curl' && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                Test POST /api/sensor-data & GET /api/latest from your terminal:
              </span>
              <button
                onClick={() => copyToClipboard(curlTestCommands, 'curl')}
                className="flex items-center gap-1.5 rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                {copiedSection === 'curl' ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                <span>{copiedSection === 'curl' ? 'Copied!' : 'Copy cURL'}</span>
              </button>
            </div>
            <pre className="max-h-72 overflow-y-auto rounded-xl bg-slate-900 p-4 font-mono text-xs text-emerald-400">
              {curlTestCommands}
            </pre>
          </div>
        )}

        {/* Cloud Run & Security Note */}
        <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60 text-xs">
          <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
            <Shield className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>Google Cloud Run Deployment & Secret Integrity</span>
          </div>
          <p className="mt-1 text-slate-600 dark:text-slate-300 leading-relaxed">
            All secret tokens (Gemini API key and device authentication key) reside exclusively in server-side environment variables and are never sent to the browser bundle. When deploying to Google Cloud Run, set <code className="rounded bg-slate-200 px-1 py-0.5 dark:bg-slate-800">PORT=8080</code> (or 3000) and specify <code className="rounded bg-slate-200 px-1 py-0.5 dark:bg-slate-800">DEVICE_API_KEY</code> in Cloud Run environment configuration.
          </p>
        </div>

        {/* Footer info */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg bg-emerald-600 px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 active:scale-95"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
