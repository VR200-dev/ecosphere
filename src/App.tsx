import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { SubsystemWaste } from './components/SubsystemWaste';
import { SubsystemIrrigation } from './components/SubsystemIrrigation';
import { SubsystemAir } from './components/SubsystemAir';
import { IntegratedDashboard } from './components/IntegratedDashboard';
import { ImpactAndFinancials } from './components/ImpactAndFinancials';
import { AboutProject } from './components/AboutProject';
import { CityPulseAI } from './components/CityPulseAI';
import { HardwareIntegrationModal } from './components/HardwareIntegrationModal';
import { Footer } from './components/Footer';
import type { UnifiedTelemetry } from './types/telemetry';

const INITIAL_TELEMETRY: UnifiedTelemetry = {
  connectionStatus: 'DEMO',
  lastPacketTimestamp: new Date().toISOString(),
  mode: 'SIMULATOR',
  isStale: false,
  subsystemStatus: {
    waste: 'ONLINE',
    irrigation: 'ONLINE',
    air: 'ONLINE'
  },
  waste: {
    dryCount: 38,
    organicCount: 52,
    totalCount: 90,
    lastCategory: 'ORGANIC',
    binStatus: 'NORMAL',
    irStatus: 'CLEAR',
    systemStatus: 'ONLINE',
    lastUpdated: new Date().toISOString()
  },
  irrigation: {
    rawSensor: 580,
    moisturePercent: 46,
    pumpStatus: 'OFF',
    thresholdPercent: 35,
    lastUpdated: new Date().toISOString()
  },
  air: {
    pollutionRaw: 145,
    tempCelsius: 26.4,
    humidityPercent: 58,
    pollutionLevel: 'LOW',
    lastUpdated: new Date().toISOString()
  },
  alerts: [
    {
      id: 'init-1',
      timestamp: new Date().toISOString(),
      level: 'info',
      subsystem: 'SYSTEM',
      message: 'ECOSPHERE central telemetry initialized. NodeMCU packet receiver ready.'
    }
  ],
  recentPackets: [
    {
      id: 'p-1',
      timestamp: new Date().toISOString(),
      subsystem: 'WASTE',
      rawPacket: 'WASTE,1,38,52,90,ORGANIC,NORMAL,CLEAR,ONLINE',
      source: 'SIMULATOR'
    },
    {
      id: 'p-2',
      timestamp: new Date().toISOString(),
      subsystem: 'IRRIGATION',
      rawPacket: 'IRRIGATION,1,580,46,OFF',
      source: 'SIMULATOR'
    },
    {
      id: 'p-3',
      timestamp: new Date().toISOString(),
      subsystem: 'AIR',
      rawPacket: 'AIR,1,145,264,58,LOW',
      source: 'SIMULATOR'
    }
  ]
};

export default function App() {
  const [telemetry, setTelemetry] = useState<UnifiedTelemetry>(INITIAL_TELEMETRY);
  const [isDark, setIsDark] = useState(false);
  const [isCityPulseOpen, setIsCityPulseOpen] = useState(false);
  const [isHardwareModalOpen, setIsHardwareModalOpen] = useState(false);

  // Sync dark class on <html>
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Telemetry Fetcher
  const fetchTelemetry = useCallback(async () => {
    try {
      const res = await fetch('/api/sensors/telemetry');
      if (res.ok) {
        const data = await res.json();
        setTelemetry(data);
      }
    } catch {
      // In purely offline client preview without active backend, keep local state
    }
  }, []);

  // Poll telemetry every 3 seconds for live streaming updates
  useEffect(() => {
    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 3000);
    return () => clearInterval(interval);
  }, [fetchTelemetry]);

  // Scenario Simulator Trigger
  const handleRunScenario = async (scenario: 'nominal' | 'dry_soil' | 'bin_full' | 'air_spike' | 'disconnect' | 'reset') => {
    try {
      const res = await fetch('/api/sensors/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.telemetry) {
          setTelemetry(data.telemetry);
        }
      }
    } catch (err) {
      console.error('Failed to trigger scenario:', err);
    }
  };

  // Packet & JSON Ingestion
  const handleInjectPacket = async (inputStr: string): Promise<boolean> => {
    try {
      const isJson = inputStr.trim().startsWith('{');
      const res = await fetch('/api/sensor-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: isJson ? inputStr : JSON.stringify({ packet: inputStr })
      });
      if (res.ok) {
        fetchTelemetry();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  // Moisture Threshold Updater
  const handleUpdateThreshold = async (threshold: number) => {
    try {
      const res = await fetch('/api/sensors/threshold', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ threshold })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.telemetry) {
          setTelemetry(data.telemetry);
        }
      }
    } catch (err) {
      console.error('Failed to update threshold:', err);
    }
  };

  const scrollToDashboard = () => {
    const el = document.getElementById('dashboard');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen eco-gradient-bg text-slate-900 transition-colors dark:text-slate-100 relative selection:bg-emerald-500/20 selection:text-emerald-900">
      <Navbar
        connectionStatus={telemetry.connectionStatus}
        isDark={isDark}
        onToggleDark={() => setIsDark(!isDark)}
        onOpenHardwareModal={() => setIsHardwareModalOpen(true)}
        onOpenDashboard={scrollToDashboard}
      />

      <main>
        <Hero
          onOpenDashboard={scrollToDashboard}
          onOpenCityPulse={() => setIsCityPulseOpen(true)}
        />

        <SubsystemWaste telemetry={telemetry.waste} />

        <SubsystemIrrigation
          telemetry={telemetry.irrigation}
          onUpdateThreshold={handleUpdateThreshold}
        />

        <SubsystemAir telemetry={telemetry.air} />

        <IntegratedDashboard
          telemetry={telemetry}
          onRunScenario={handleRunScenario}
          onInjectPacket={handleInjectPacket}
          onUpdateThreshold={handleUpdateThreshold}
          onOpenHardwareModal={() => setIsHardwareModalOpen(true)}
        />

        <ImpactAndFinancials />

        <AboutProject />
      </main>

      <Footer />

      {/* Floating CityPulse AI Widget */}
      <CityPulseAI
        isOpen={isCityPulseOpen}
        onToggle={() => setIsCityPulseOpen(!isCityPulseOpen)}
        telemetry={telemetry}
      />

      {/* NodeMCU ESP8266 Hardware Guide Modal */}
      <HardwareIntegrationModal
        isOpen={isHardwareModalOpen}
        onClose={() => setIsHardwareModalOpen(false)}
      />
    </div>
  );
}
