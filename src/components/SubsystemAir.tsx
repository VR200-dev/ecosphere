import React from 'react';
import { Wind, Thermometer, Droplet, AlertTriangle, ShieldCheck, Info } from 'lucide-react';
import type { AirTelemetry, AirPollutionLevel } from '../types/telemetry';

interface SubsystemAirProps {
  telemetry: AirTelemetry;
}

export const SubsystemAir: React.FC<SubsystemAirProps> = ({ telemetry }) => {
  const getLevelBadge = (level: AirPollutionLevel) => {
    switch (level) {
      case 'CLEAN':
      case 'LOW':
        return { text: 'Nominal Quality', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' };
      case 'MODERATE':
        return { text: 'Moderate Elevation', color: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' };
      case 'HIGH':
      case 'ALERT':
        return { text: 'High Particulate Alert', color: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' };
      default:
        return { text: 'Monitoring', color: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300' };
    }
  };

  const badge = getLevelBadge(telemetry.pollutionLevel);

  return (
    <section id="air" className="border-t border-emerald-500/10 bg-white/50 py-16 backdrop-blur-xs dark:border-emerald-900/30 dark:bg-emerald-950/15">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Subsystem 03 · Atmospheric Sensing
          </p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white" style={{ textWrap: 'balance' }}>
            Environmental & Air Quality Monitoring
          </h2>
          <p className="mt-3 text-base leading-relaxed text-slate-600 dark:text-slate-300">
            Continuous atmospheric telemetrics providing localized microclimate monitoring, smoke threshold detection, and real-time environmental data streaming.
          </p>
        </div>

        {/* 2-Column Split */}
        <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:items-center">
          {/* Left: Engineering Specifications */}
          <div className="space-y-6 lg:col-span-7">
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-6 dark:border-slate-800/80 dark:bg-slate-900/40">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Multi-Gas Sensing & Microclimate Suite
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                Operating on <strong>Arduino Mega Node #3</strong>, an analog <strong>MQ-2 semiconductor gas sensor</strong> detects airborne combustible gases, LPG, and smoke particles. Paired with a digital <strong>DHT11 sensor</strong>, the unit records ambient temperature and relative humidity, rendering status messages onto a 16x2 I2C LCD before passing packets through the serial chain to the NodeMCU ESP8266.
              </p>

              {/* Crucial Regulatory & Calibration Disclaimer */}
              <div className="mt-4 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50/70 p-4 text-xs text-amber-900 dark:border-amber-800/60 dark:bg-amber-950/40 dark:text-amber-200">
                <Info className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
                <div>
                  <span className="font-bold">Important Calibration & Measurement Note:</span>
                  <p className="mt-0.5 leading-relaxed">
                    MQ-2 raw readings (0–1023 ADC) and project-defined pollution categories are experimental indicators engineered for demonstration purposes. They reflect localized relative changes and are <strong>NOT official certified regulatory AQI measurements</strong>.
                  </p>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-900">
                  <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                    MQ-2 Gas Sensor Array
                  </span>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-normal">
                    Heated tin-dioxide (SnO2) ceramic surface sensitive to methane, butane, LPG, and particulate smoke.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-900">
                  <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                    DHT11 Thermo-Hygrometer
                  </span>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-normal">
                    Precision resistive temperature and capacitive humidity element transmitting formatted serial packets.
                  </p>
                </div>
              </div>
            </div>

            {/* Generated Image Showcase */}
            <div className="overflow-hidden rounded-2xl border border-slate-200/80 shadow-sm dark:border-slate-800/80">
              <img
                src="/src/assets/images/smart_air_monitoring_1793605180566.jpg"
                alt="ECOSPHERE Urban Environmental Air Quality Monitoring Node by Blossoms Convent School"
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
                    <Wind className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      Atmospheric Sensor Telemetry
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Arduino Mega Node #3 · MQ-2 & DHT11
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
                  <span className={`rounded-md px-2.5 py-1 text-xs font-bold ${badge.color}`}>
                    {telemetry.pollutionLevel}
                  </span>
                </div>
              </div>

              {/* Main Gauge: MQ-2 Gas Reading */}
              <div className="mt-6 rounded-xl border border-slate-200/80 bg-slate-50 p-5 dark:border-slate-800/80 dark:bg-slate-950/60">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                    MQ-2 Raw Gas ADC Value
                  </span>
                  <span className="text-xs font-medium text-slate-400">
                    Demonstration Index
                  </span>
                </div>

                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-slate-900 dark:text-white font-mono-tabular">
                    {telemetry.pollutionRaw}
                  </span>
                  <span className="text-xs text-slate-400">
                    / 1023 ADC Max
                  </span>
                </div>

                {/* Pollution Threshold Scale */}
                <div className="mt-3.5">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                    <div
                      className={`h-full transition-all duration-500 ${
                        telemetry.pollutionRaw > 400
                          ? 'bg-rose-500'
                          : telemetry.pollutionRaw > 250
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, (telemetry.pollutionRaw / 700) * 100)}%` }}
                    />
                  </div>
                  <div className="mt-1 flex justify-between text-[10px] text-slate-400">
                    <span>Clean (&lt;180)</span>
                    <span>Moderate (180–350)</span>
                    <span>Elevated (&gt;350)</span>
                  </div>
                </div>
              </div>

              {/* Weather & Microclimate DHT11 Grid */}
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-slate-200/80 bg-white p-4 dark:border-slate-800/80 dark:bg-slate-900">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <Thermometer className="h-4 w-4 text-rose-500" />
                    <span>Temperature</span>
                  </div>
                  <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white font-mono-tabular">
                    {telemetry.tempCelsius !== null ? `${telemetry.tempCelsius} °C` : 'FAULT (-999)'}
                  </p>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500">
                    DHT11 Transmitted /10
                  </span>
                </div>

                <div className="rounded-xl border border-slate-200/80 bg-white p-4 dark:border-slate-800/80 dark:bg-slate-900">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <Droplet className="h-4 w-4 text-sky-500" />
                    <span>Relative Humidity</span>
                  </div>
                  <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white font-mono-tabular">
                    {telemetry.humidityPercent !== null ? `${telemetry.humidityPercent} %` : 'FAULT (-1)'}
                  </p>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500">
                    Capacitive Hygrometer
                  </span>
                </div>
              </div>

              {/* Status footer */}
              <div className="mt-5 space-y-2 border-t border-slate-100 pt-3 text-xs dark:border-slate-800/60">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Hardware Packet Structure</span>
                  <span className="font-mono text-[11px] text-slate-600 dark:text-slate-300">
                    AIR,1,raw,temp/10,hum,level
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Last Telemetry Timestamp</span>
                  <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500">
                    {telemetry.lastUpdated ? new Date(telemetry.lastUpdated).toLocaleTimeString() : 'Awaiting packet'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
