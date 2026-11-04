import React, { useState } from 'react';
import {
  Activity,
  Bot,
  Sparkles,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Cpu,
  Droplets,
  Layers,
  Radio,
  RefreshCw,
  Send,
  Sliders,
  Trash2,
  Wind,
  Wrench,
  XCircle
} from 'lucide-react';
import type { UnifiedTelemetry, ConnectionState } from '../types/telemetry';

interface IntegratedDashboardProps {
  telemetry: UnifiedTelemetry;
  onRunScenario: (scenario: 'nominal' | 'dry_soil' | 'bin_full' | 'air_spike' | 'disconnect' | 'reset') => void;
  onInjectPacket: (packet: string) => Promise<boolean>;
  onUpdateThreshold: (threshold: number) => void;
  onOpenHardwareModal: () => void;
}

export const IntegratedDashboard: React.FC<IntegratedDashboardProps> = ({
  telemetry,
  onRunScenario,
  onInjectPacket,
  onUpdateThreshold,
  onOpenHardwareModal,
}) => {
  const [customPacket, setCustomPacket] = useState('WASTE,1,45,60,105,ORGANIC,NORMAL,CLEAR,ONLINE');
  const [isInjecting, setIsInjecting] = useState(false);
  const [packetFeedback, setPacketFeedback] = useState<string | null>(null);

  const handleCustomPacketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPacket.trim()) return;
    setIsInjecting(true);
    setPacketFeedback(null);
    const success = await onInjectPacket(customPacket.trim());
    setIsInjecting(false);
    if (success) {
      setPacketFeedback('Packet successfully ingested into central bus.');
      setTimeout(() => setPacketFeedback(null), 3500);
    } else {
      setPacketFeedback('Error: Invalid packet format. Must be WASTE, IRRIGATION, or AIR format.');
    }
  };

  const getConnectionHeader = () => {
    switch (telemetry.connectionStatus) {
      case 'LIVE':
        return {
          title: 'LIVE SENSOR DATA',
          subtitle: 'Real-time telemetry stream active from NodeMCU ESP8266 Wi-Fi bridge',
          color: 'text-emerald-700 bg-emerald-50 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
        };
      case 'STALE':
        return {
          title: 'DATA STALE',
          subtitle: 'No updated packet received for over 15 seconds from hardware bus',
          color: 'text-amber-700 bg-amber-50 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800'
        };
      case 'DISCONNECTED':
        return {
          title: 'HARDWARE NOT CONNECTED',
          subtitle: 'Awaiting incoming NodeMCU Wi-Fi packets or serial stream',
          color: 'text-rose-700 bg-rose-50 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800'
        };
      default:
        return {
          title: 'DEMONSTRATION VALUES',
          subtitle: 'Interactive test simulation active. Real serial packet API endpoint is armed and ready.',
          color: 'text-sky-700 bg-sky-50 border-sky-300 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800'
        };
    }
  };

  const statusHeader = getConnectionHeader();

  return (
    <section id="dashboard" className="border-t border-emerald-500/10 bg-emerald-100/20 py-16 backdrop-blur-xs dark:border-emerald-900/30 dark:bg-emerald-950/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Dashboard Title & Top Bar */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              <Cpu className="h-4 w-4" />
              <span>Central IoT Command Center</span>
            </div>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
              ECOSPHERE Integrated Live Dashboard
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 max-w-2xl">
              Unified multi-sensor telemetry combining waste diversion counters, precision irrigation moisture levels, and atmospheric gas monitoring.
            </p>
          </div>

          {/* Quick Hardware Documentation Link */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenHardwareModal}
              className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 hover:text-emerald-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <Wrench className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>Connect Real NodeMCU ESP8266</span>
            </button>
          </div>
        </div>

        {/* System Connection State Banner */}
        <div className={`mt-8 rounded-2xl border p-5 shadow-sm transition-all ${statusHeader.color}`}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/80 dark:bg-slate-900/80 shadow-sm">
                <Radio className="h-5 w-5 animate-pulse text-current" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-extrabold tracking-wide">
                    {statusHeader.title}
                  </span>
                  <span className="text-xs opacity-75 font-mono">
                    [{telemetry.mode}]
                  </span>
                </div>
                <p className="text-xs opacity-90 mt-0.5">
                  {statusHeader.subtitle}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs font-medium">
              {/* Individual Subsystem Health Badges */}
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-bold ${
                  telemetry.subsystemStatus?.waste === 'ONLINE'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : telemetry.subsystemStatus?.waste === 'WAITING'
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                }`}>
                  <span className="h-1.5 w-1.5 rounded-full bg-current"></span>
                  Waste: {telemetry.subsystemStatus?.waste ?? 'ONLINE'}
                </span>

                <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-bold ${
                  telemetry.subsystemStatus?.irrigation === 'ONLINE'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : telemetry.subsystemStatus?.irrigation === 'WAITING'
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                }`}>
                  <span className="h-1.5 w-1.5 rounded-full bg-current"></span>
                  Irrigation: {telemetry.subsystemStatus?.irrigation ?? 'ONLINE'}
                </span>

                <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-bold ${
                  telemetry.subsystemStatus?.air === 'ONLINE'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : telemetry.subsystemStatus?.air === 'WAITING'
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                }`}>
                  <span className="h-1.5 w-1.5 rounded-full bg-current"></span>
                  Air: {telemetry.subsystemStatus?.air ?? 'ONLINE'}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                <span>Last Packet:</span>
                <span className="font-mono font-bold font-mono-tabular">
                  {telemetry.lastPacketTimestamp ? new Date(telemetry.lastPacketTimestamp).toLocaleTimeString() : 'None'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Unified Telemetry Overview Cards */}
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {/* Subsystem 1: Waste Segregation Overview */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800/80">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                  <Trash2 className="h-4 w-4" />
                </div>
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  Waste Segregation
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  telemetry.subsystemStatus?.waste === 'ONLINE'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                }`}>
                  {telemetry.subsystemStatus?.waste ?? 'ONLINE'}
                </span>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                  telemetry.waste.binStatus === 'FULL'
                    ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                }`}>
                  {telemetry.waste.binStatus}
                </span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div>
                <span className="text-xs text-slate-500 dark:text-slate-400">Dry Waste</span>
                <p className="text-2xl font-black text-sky-600 dark:text-sky-400 font-mono-tabular mt-0.5">
                  {telemetry.waste.dryCount}
                </p>
              </div>
              <div>
                <span className="text-xs text-slate-500 dark:text-slate-400">Organic Waste</span>
                <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono-tabular mt-0.5">
                  {telemetry.waste.organicCount}
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex justify-between">
                <span>Total Refuse Count:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 font-mono-tabular">{telemetry.waste.totalCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Last Deposited:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{telemetry.waste.lastCategory}</span>
              </div>
              <div className="flex justify-between">
                <span>IR Proximity:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{telemetry.waste.irStatus}</span>
              </div>
            </div>
          </div>

          {/* Subsystem 2: Irrigation Overview */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800/80">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                  <Droplets className="h-4 w-4" />
                </div>
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  Precision Irrigation
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  telemetry.subsystemStatus?.irrigation === 'ONLINE'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                }`}>
                  {telemetry.subsystemStatus?.irrigation ?? 'ONLINE'}
                </span>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                  telemetry.irrigation.pumpStatus === 'ON'
                    ? 'bg-emerald-600 text-white animate-pulse'
                    : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                }`}>
                  PUMP {telemetry.irrigation.pumpStatus}
                </span>
              </div>
            </div>

            <div className="mt-4 flex items-baseline justify-between">
              <div>
                <span className="text-xs text-slate-500 dark:text-slate-400">Soil Moisture</span>
                <p className="text-2xl font-black text-slate-900 dark:text-white font-mono-tabular mt-0.5">
                  {telemetry.irrigation.moisturePercent}%
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 dark:text-slate-400">Threshold</span>
                <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono-tabular mt-0.5">
                  {telemetry.irrigation.thresholdPercent}%
                </p>
              </div>
            </div>

            {/* Bar */}
            <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className={`h-full ${telemetry.irrigation.moisturePercent < telemetry.irrigation.thresholdPercent ? 'bg-amber-500' : 'bg-emerald-500'}`}
                style={{ width: `${Math.min(100, telemetry.irrigation.moisturePercent)}%` }}
              />
            </div>

            <div className="mt-4 space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex justify-between">
                <span>Analog Probe ADC:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 font-mono-tabular">{telemetry.irrigation.rawSensor} / 1023</span>
              </div>
              <div className="flex justify-between">
                <span>Relay Switch:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{telemetry.irrigation.pumpStatus === 'ON' ? 'Closed' : 'Open'}</span>
              </div>
              <div className="flex justify-between">
                <span>Water Conservation Target:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 font-mono-tabular">~40% Target</span>
              </div>
            </div>
          </div>

          {/* Subsystem 3: Air Monitoring Overview */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800/80">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300">
                  <Wind className="h-4 w-4" />
                </div>
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  Environmental Air
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  telemetry.subsystemStatus?.air === 'ONLINE'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                }`}>
                  {telemetry.subsystemStatus?.air ?? 'ONLINE'}
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  {telemetry.air.pollutionLevel}
                </span>
              </div>
            </div>

            <div className="mt-4 flex items-baseline justify-between">
              <div>
                <span className="text-xs text-slate-500 dark:text-slate-400">MQ-2 Gas Reading</span>
                <p className="text-2xl font-black text-slate-900 dark:text-white font-mono-tabular mt-0.5">
                  {telemetry.air.pollutionRaw}
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 dark:text-slate-400">Temp / Humid</span>
                <p className="text-sm font-bold text-slate-900 dark:text-white font-mono-tabular mt-0.5">
                  {telemetry.air.tempCelsius ?? 'N/A'}°C / {telemetry.air.humidityPercent ?? 'N/A'}%
                </p>
              </div>
            </div>

            <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className={`h-full ${telemetry.air.pollutionRaw > 400 ? 'bg-rose-500' : telemetry.air.pollutionRaw > 250 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                style={{ width: `${Math.min(100, (telemetry.air.pollutionRaw / 600) * 100)}%` }}
              />
            </div>

            <div className="mt-4 space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex justify-between">
                <span>Classification:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{telemetry.air.pollutionLevel} Level</span>
              </div>
              <div className="flex justify-between">
                <span>Standard Metric Type:</span>
                <span className="font-semibold text-amber-600 dark:text-amber-400">Non-AQI Project Scale</span>
              </div>
              <div className="flex justify-between">
                <span>Transmitted Temp Scale:</span>
                <span className="font-mono text-[11px]">Tenths (°C × 10)</span>
              </div>
            </div>
          </div>
        </div>

        {/* CityPulse AI analysis for the dashboard's current demonstration snapshot */}
        <CityPulseAnalysisPanel telemetry={telemetry} />

        {/* Interactive Scenario Simulator & Testing Panel */}
        <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <Sliders className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Interactive Telemetry Simulator & Test Suite
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Allows students, judges, and municipal evaluators to test hardware state handling, threshold triggers, and CityPulse AI telemetry ingestion.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onRunScenario('reset')}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <RefreshCw className="h-3 w-3" />
                <span>Reset Baseline</span>
              </button>
            </div>
          </div>

          {/* Preset Buttons */}
          <div className="mt-5">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Run Preset Subsystem Event:
            </span>
            <div className="mt-2.5 flex flex-wrap gap-2.5">
              <button
                onClick={() => onRunScenario('nominal')}
                className="rounded-lg border border-emerald-300 bg-emerald-50 px-3.5 py-2 text-xs font-semibold text-emerald-800 transition-colors hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
              >
                1. Baseline Nominal (All Green)
              </button>

              <button
                onClick={() => onRunScenario('dry_soil')}
                className="rounded-lg border border-amber-300 bg-amber-50 px-3.5 py-2 text-xs font-semibold text-amber-800 transition-colors hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300"
              >
                2. Dry Soil (Pump Auto-ON)
              </button>

              <button
                onClick={() => onRunScenario('bin_full')}
                className="rounded-lg border border-rose-300 bg-rose-50 px-3.5 py-2 text-xs font-semibold text-rose-800 transition-colors hover:bg-rose-100 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-300"
              >
                3. Waste Bin Full (Capacity Alert)
              </button>

              <button
                onClick={() => onRunScenario('air_spike')}
                className="rounded-lg border border-orange-300 bg-orange-50 px-3.5 py-2 text-xs font-semibold text-orange-800 transition-colors hover:bg-orange-100 dark:border-orange-800 dark:bg-orange-950/40 dark:text-orange-300"
              >
                4. Gas/Smoke Spike (MQ-2 Alert)
              </button>

              <button
                onClick={() => onRunScenario('disconnect')}
                className="rounded-lg border border-slate-300 bg-slate-100 px-3.5 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                5. Simulate Hardware Disconnect
              </button>
            </div>
          </div>

          {/* Manual Packet Ingestion Form */}
          <div className="mt-6 border-t border-slate-100 pt-5 dark:border-slate-800">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Manual Serial Packet Injector (Matches Arduino Serial Chain):
            </span>
            <form onSubmit={handleCustomPacketSubmit} className="mt-2.5 flex flex-col gap-2 sm:flex-row">
              <input
                type="text"
                value={customPacket}
                onChange={(e) => setCustomPacket(e.target.value)}
                placeholder="e.g. WASTE,1,25,40,65,DRY,NORMAL,CLEAR,ONLINE"
                className="flex-1 rounded-lg border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs font-mono text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              />
              <button
                type="submit"
                disabled={isInjecting}
                className="flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 active:scale-95 disabled:opacity-50"
              >
                <Send className="h-3.5 w-3.5" />
                <span>{isInjecting ? 'Ingesting...' : 'Inject Packet'}</span>
              </button>
            </form>

            {packetFeedback && (
              <p className={`mt-2 text-xs font-medium ${packetFeedback.includes('Error') ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                {packetFeedback}
              </p>
            )}

            <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Quick Test JSON:</span>
              <button
                type="button"
                onClick={() => setCustomPacket('{"subsystem":"WASTE","dryCount":35,"organicCount":48,"binStatus":"NORMAL"}')}
                className="hover:text-emerald-600 dark:hover:text-emerald-400 underline font-mono"
              >
                JSON: Waste
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => setCustomPacket('{"subsystem":"IRRIGATION","rawSensor":780,"moisturePercent":24,"pumpStatus":"ON"}')}
                className="hover:text-emerald-600 dark:hover:text-emerald-400 underline font-mono"
              >
                JSON: Irrigation
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => setCustomPacket('{"subsystem":"AIR","pollutionRaw":160,"tempCelsius":27.2,"humidityPercent":60,"pollutionLevel":"LOW"}')}
                className="hover:text-emerald-600 dark:hover:text-emerald-400 underline font-mono"
              >
                JSON: Air
              </button>
              <span className="ml-2 font-semibold text-slate-700 dark:text-slate-300">Raw Serial:</span>
              <button
                type="button"
                onClick={() => setCustomPacket('WASTE,1,32,48,80,ORGANIC,NORMAL,CLEAR,ONLINE')}
                className="hover:text-emerald-600 dark:hover:text-emerald-400 underline font-mono"
              >
                WASTE
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => setCustomPacket('IRRIGATION,1,720,28,ON')}
                className="hover:text-emerald-600 dark:hover:text-emerald-400 underline font-mono"
              >
                IRRIGATION
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => setCustomPacket('AIR,1,180,275,62,MODERATE')}
                className="hover:text-emerald-600 dark:hover:text-emerald-400 underline font-mono"
              >
                AIR
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Grid: Live Packet Feed & Alert Notifications */}
        <div className="mt-8 grid gap-6 lg:grid-cols-12">
          {/* Left: Incoming Data Log */}
          <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Incoming Serial Chain Data Log
                </h4>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                {telemetry.recentPackets.length} entries
              </span>
            </div>

            <div className="mt-3 max-h-64 overflow-y-auto space-y-2 pr-1 font-mono text-xs">
              {telemetry.recentPackets.length === 0 ? (
                <p className="py-8 text-center text-slate-400">Waiting for incoming telemetry packets...</p>
              ) : (
                telemetry.recentPackets.map((pkt) => (
                  <div
                    key={pkt.id}
                    className="flex items-start justify-between rounded-lg border border-slate-100 bg-slate-50 p-2.5 dark:border-slate-800/80 dark:bg-slate-950/60"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                          pkt.subsystem === 'WASTE'
                            ? 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300'
                            : pkt.subsystem === 'IRRIGATION'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300'
                        }`}>
                          {pkt.subsystem}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {pkt.source}
                        </span>
                      </div>
                      <p className="text-[11px] font-semibold text-slate-800 dark:text-slate-200">
                        {pkt.rawPacket}
                      </p>
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                      {new Date(pkt.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right: Real-Time Alerts Stream */}
          <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Active System Alerts & Diagnostics
                </h4>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                {telemetry.alerts.length} active
              </span>
            </div>

            <div className="mt-3 max-h-64 overflow-y-auto space-y-2 pr-1 text-xs">
              {telemetry.alerts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center text-slate-400">
                  <CheckCircle2 className="h-8 w-8 text-emerald-500 mb-1" />
                  <span>All municipal nodes operating nominally.</span>
                </div>
              ) : (
                telemetry.alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`rounded-lg border p-2.5 ${
                      alert.level === 'critical'
                        ? 'border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-200'
                        : alert.level === 'warning'
                        ? 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200'
                        : 'border-slate-200 bg-slate-50 text-slate-800 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between font-semibold">
                      <span className="uppercase text-[10px] tracking-wider">
                        {alert.subsystem} · {alert.level}
                      </span>
                      <span className="font-mono text-[10px] opacity-75">
                        {new Date(alert.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] leading-relaxed">
                      {alert.message}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};


interface CityPulseAnalysisPanelProps {
  telemetry: UnifiedTelemetry;
}

const CityPulseAnalysisPanel: React.FC<CityPulseAnalysisPanelProps> = ({ telemetry }) => {
  const [analysis, setAnalysis] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiStatus, setAiStatus] = useState<'idle' | 'gemini' | 'fallback' | 'error'>('idle');

  const runAnalysis = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setAiStatus('idle');
    setAnalysis('');
    const snapshot = {
      dataLabel: 'DEMO DATA — NOT LIVE HARDWARE DATA',
      mode: telemetry.mode,
      connectionStatus: telemetry.connectionStatus,
      isStale: telemetry.isStale,
      lastPacketTimestamp: telemetry.lastPacketTimestamp,
      subsystemStatus: telemetry.subsystemStatus,
      waste: telemetry.waste,
      irrigation: telemetry.irrigation,
      air: telemetry.air,
      alerts: telemetry.alerts,
    };
    const prompt = [
      'You are CityPulse AI. Analyse the following ECOSPHERE DEMONSTRATION/SIMULATOR data only.',
      'IMPORTANT: These are demo values, not real sensor measurements. State this clearly. Never describe them as live, real-world or measured environmental conditions.',
      'Give a detailed report: overall demo status; waste analysis with dry/organic percentages; irrigation against threshold and pump state; air sensor interpretation; alerts; three practical recommendations.',
      'MQ-2 raw values are not certified AQI. Soil moisture percentage is a project-mapped estimate. Do not invent missing data or claim real environmental impact.',
      'Use clear headings and plain language suitable for a school project demonstration.',
      'DEMO SNAPSHOT:',
      JSON.stringify(snapshot, null, 2)
    ].join('\n');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', content: prompt }] })
      });
      if (!response.ok) throw new Error('AI service returned HTTP ' + response.status);
      const data = await response.json();
      setAnalysis(data.reply || 'The AI service returned an empty response.');
      setAiStatus(data.isLiveAI ? 'gemini' : 'fallback');
    } catch (error) {
      setAnalysis('CityPulse AI could not reach the analysis service. Check the backend and Gemini API configuration, then try again. ' + (error instanceof Error ? error.message : ''));
      setAiStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="mt-8 rounded-2xl border border-emerald-300 bg-white p-6 shadow-sm dark:border-emerald-800 dark:bg-slate-900">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
            <Bot className="h-5 w-5" />
            <span className="text-xs font-extrabold uppercase tracking-wider">CityPulse AI · Dashboard Analysis</span>
          </div>
          <h3 className="mt-1 text-xl font-extrabold text-slate-900 dark:text-white">Understand the demonstration readings</h3>
          <p className="mt-1 max-w-2xl text-xs text-slate-600 dark:text-slate-300">Gemini analyses the current dashboard snapshot and gives explanations, findings and recommendations.</p>
        </div>
        <button onClick={runAnalysis} disabled={isLoading} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60">
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          {isLoading ? 'Analysing demo data…' : 'Analyse demo readings'}
        </button>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-sky-300 bg-sky-50 px-3 py-1 text-[11px] font-extrabold text-sky-800 dark:border-sky-800 dark:bg-sky-950/50 dark:text-sky-300">DEMO DATA · NOT LIVE HARDWARE</span>
        {aiStatus === 'gemini' && <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">Gemini AI response</span>}
        {aiStatus === 'fallback' && <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">Rule-based fallback · Gemini unavailable</span>}
        {aiStatus === 'error' && <span className="text-xs font-semibold text-rose-700 dark:text-rose-400">AI service unavailable</span>}
      </div>
      {analysis && <div className="mt-4 whitespace-pre-wrap rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-800 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200">{analysis}</div>}
      {!analysis && <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">Press “Analyse demo readings” to generate feedback from the values currently displayed above.</p>}
    </section>
  );
};
