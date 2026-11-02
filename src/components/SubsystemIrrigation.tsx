import React from 'react';
import { Droplets, Power, Gauge, Sprout } from 'lucide-react';
import type { IrrigationTelemetry } from '../types/telemetry';

interface SubsystemIrrigationProps {
  telemetry: IrrigationTelemetry;
  onUpdateThreshold: (newThreshold: number) => void;
}

export const SubsystemIrrigation: React.FC<SubsystemIrrigationProps> = ({
  telemetry,
  onUpdateThreshold,
}) => {
  const isPumpOn = telemetry.pumpStatus === 'ON';
  const isLowMoisture = telemetry.moisturePercent < telemetry.thresholdPercent;

  return (
    <section id="irrigation" className="border-t border-emerald-500/10 bg-emerald-50/40 py-16 backdrop-blur-xs dark:border-emerald-900/30 dark:bg-emerald-950/25">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Subsystem 02 · Precision Agritech
          </p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white" style={{ textWrap: 'balance' }}>
            Smart Farming & Automated Irrigation
          </h2>
          <p className="mt-3 text-base leading-relaxed text-slate-600 dark:text-slate-300">
            Closed-loop soil moisture regulation engineered to eliminate water waste in urban green belts, school botanical gardens, and community micro-farms.
          </p>
        </div>

        {/* 2-Column Split */}
        <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:items-center">
          {/* Left: Engineering Specifications & Water Conservation Targets */}
          <div className="space-y-6 lg:col-span-7">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800/80 dark:bg-slate-900">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Threshold-Driven Relay Actuation
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                A capacitive soil moisture probe continuously monitors volumetric water content in the root zone. When the measured moisture percentage drops below the configurable threshold (<strong>{telemetry.thresholdPercent}%</strong>), the <strong>Arduino Mega</strong> triggers a 5V optocoupled relay, powering the submersible irrigation pump until optimal saturation is achieved.
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-950/60">
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                    <Droplets className="h-4 w-4" />
                    <span>Target 40% Water Savings</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-normal">
                    Prevents over-irrigation runoff and evaporation losses inherent in fixed timer systems.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-950/60">
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                    <Sprout className="h-4 w-4" />
                    <span>Dry-Run Protection</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-normal">
                    Automated duty-cycle limits protect pump motors from overheating and prevent soil compaction.
                  </p>
                </div>
              </div>
            </div>

            {/* Generated Image Showcase */}
            <div className="overflow-hidden rounded-2xl border border-slate-200/80 shadow-sm dark:border-slate-800/80">
              <img
                src="/images/smart_agriculture_1793605180963.jpg"
                alt="ECOSPHERE Automated Precision Agriculture and Irrigation by Blossoms Convent School"
                referrerPolicy="no-referrer"
                className="h-64 w-full object-cover sm:h-72"
              />
            </div>
          </div>

          {/* Right: Live Telemetry Card */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-4 dark:border-slate-800/80">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                    <Droplets className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      Irrigation Controller Telemetry
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Arduino Mega Node #2
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    telemetry.onlineStatus === 'ONLINE'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : telemetry.onlineStatus === 'WAITING'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                  }`}>
                    {telemetry.onlineStatus ?? 'ONLINE'}
                  </span>
                  {/* Pump Status Badge */}
                  <div className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-bold ${
                    isPumpOn
                      ? 'bg-emerald-600 text-white shadow-sm animate-pulse'
                      : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}>
                    <Power className="h-3 w-3" />
                    <span>PUMP {telemetry.pumpStatus}</span>
                  </div>
                </div>
              </div>

              {/* Main Gauge / Moisture Level */}
              <div className="mt-6 rounded-xl border border-slate-200/80 bg-slate-50 p-5 dark:border-slate-800/80 dark:bg-slate-950/60">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                    Volumetric Soil Moisture
                  </span>
                  <span className={`text-xs font-bold ${isLowMoisture ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                    {isLowMoisture ? 'Below Threshold (Irrigating)' : 'Optimal Saturation'}
                  </span>
                </div>

                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-slate-900 dark:text-white font-mono-tabular">
                    {telemetry.moisturePercent}%
                  </span>
                  <span className="text-xs text-slate-400 dark:text-slate-500">
                    / Threshold {telemetry.thresholdPercent}%
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                  <div
                    className={`h-full transition-all duration-500 ${
                      isLowMoisture ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, telemetry.moisturePercent)}%` }}
                  />
                </div>
              </div>

              {/* Sub-Metrics Grid */}
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 dark:border-slate-800/80 dark:bg-slate-900">
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Raw Analog ADC
                  </span>
                  <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white font-mono-tabular">
                    {telemetry.rawSensor}
                  </p>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500">
                    Range: 0 – 1023
                  </span>
                </div>

                <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 dark:border-slate-800/80 dark:bg-slate-900">
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Relay State
                  </span>
                  <p className="mt-1 text-xl font-bold text-emerald-600 dark:text-emerald-400 font-mono-tabular">
                    {isPumpOn ? 'CLOSED (ACTIVE)' : 'OPEN (IDLE)'}
                  </p>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500">
                    5V Optocoupled
                  </span>
                </div>
              </div>

              {/* Interactive Threshold Slider */}
              <div className="mt-5 rounded-xl border border-slate-200/80 bg-slate-50/80 p-4 dark:border-slate-800/80 dark:bg-slate-950/60">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-200">
                    Configure Activation Threshold
                  </span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {telemetry.thresholdPercent}%
                  </span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="65"
                  value={telemetry.thresholdPercent}
                  onChange={(e) => onUpdateThreshold(parseInt(e.target.value, 10))}
                  className="mt-2.5 h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-emerald-600 dark:bg-slate-700"
                />
                <div className="mt-1 flex justify-between text-[10px] text-slate-400">
                  <span>Dry (15%)</span>
                  <span>Standard (35%)</span>
                  <span>Wet (65%)</span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
                <span>Last Telemetry Sync</span>
                <span className="font-mono text-[11px]">
                  {telemetry.lastUpdated ? new Date(telemetry.lastUpdated).toLocaleTimeString() : 'Awaiting packet'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
