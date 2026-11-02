import React from 'react';
import { Trash2, Recycle, Activity, ShieldCheck, AlertCircle } from 'lucide-react';
import type { WasteTelemetry } from '../types/telemetry';

interface SubsystemWasteProps {
  telemetry: WasteTelemetry;
}

export const SubsystemWaste: React.FC<SubsystemWasteProps> = ({ telemetry }) => {
  const isFull = telemetry.binStatus === 'FULL';
  const isNearFull = telemetry.binStatus === 'NEAR_FULL';

  return (
    <section id="waste" className="border-t border-emerald-500/10 bg-white/50 py-16 backdrop-blur-xs dark:border-emerald-900/30 dark:bg-emerald-950/15">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Subsystem 01 · Municipal Ecology
          </p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white" style={{ textWrap: 'balance' }}>
            Smart Waste Management & Segregation
          </h2>
          <p className="mt-3 text-base leading-relaxed text-slate-600 dark:text-slate-300">
            An automated segregation terminal engineered to eliminate landfill cross-contamination, empower urban composting, and log recycling throughput in real time.
          </p>
        </div>

        {/* 2-Column Split: Explanatory Content & Live Dashboard Card */}
        <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:items-center">
          {/* Left: Engineering Specifications & Composting Lifecycle */}
          <div className="space-y-6 lg:col-span-7">
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-6 dark:border-slate-800/80 dark:bg-slate-900/40">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Mechanical & Embedded Architecture
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                Incoming municipal refuse is introduced into the intake funnel where an optical IR proximity sensor triggers the classification cycle. An <strong>Arduino Mega</strong> actuates a bi-directional servo flap mechanism, deflecting dry recyclables to the left chamber and organic kitchen matter to the right chamber.
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                    <Recycle className="h-4 w-4" />
                    <span>Dry Recyclables Stream</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-normal">
                    Bottles, cans, plastic containers, cardboard, and metals diverted for municipal material recovery facilities (MRF).
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                    <Trash2 className="h-4 w-4" />
                    <span>Organic Waste Composting</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-normal">
                    Food scraps and organic matter are directed to decentralized aerated compost pits to cultivate nutrient-rich community fertilizer.
                  </p>
                </div>
              </div>
            </div>

            {/* Generated Image Showcase */}
            <div className="overflow-hidden rounded-2xl border border-slate-200/80 shadow-sm dark:border-slate-800/80">
              <img
                src="/src/assets/images/smart_waste_system_1793605179205.jpg"
                alt="ECOSPHERE Smart Waste Segregation Machine by Blossoms Convent School"
                referrerPolicy="no-referrer"
                className="h-64 w-full object-cover sm:h-72"
              />
            </div>
          </div>

          {/* Right: Live Subsystem Telemetry Card */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-4 dark:border-slate-800/80">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                    <Activity className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      Waste Node Live Telemetry
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Arduino Mega Node #1
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
                  {/* Bin Status Badge */}
                  <div className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-bold ${
                    isFull
                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300'
                      : isNearFull
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
                      : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                  }`}>
                    {isFull ? <AlertCircle className="h-3 w-3" /> : <ShieldCheck className="h-3 w-3" />}
                    <span>{telemetry.binStatus}</span>
                  </div>
                </div>
              </div>

              {/* Counters Grid */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-slate-200/80 bg-slate-50 p-4 dark:border-slate-800/80 dark:bg-slate-950/60">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Dry Recyclables
                  </span>
                  <p className="mt-1 text-3xl font-extrabold text-sky-600 dark:text-sky-400 font-mono-tabular">
                    {telemetry.dryCount}
                  </p>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500">
                    Optical Pulse Count
                  </span>
                </div>

                <div className="rounded-xl border border-slate-200/80 bg-slate-50 p-4 dark:border-slate-800/80 dark:bg-slate-950/60">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Organic Compost
                  </span>
                  <p className="mt-1 text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono-tabular">
                    {telemetry.organicCount}
                  </p>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500">
                    Optical Pulse Count
                  </span>
                </div>
              </div>

              {/* Total Aggregate */}
              <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-200/80 bg-emerald-50/60 p-4 dark:border-slate-800/80 dark:bg-emerald-950/20">
                <div>
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                    Total Registered Refuse Deposits
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Dry + Organic Cumulative Sum
                  </p>
                </div>
                <span className="text-2xl font-black text-emerald-700 dark:text-emerald-300 font-mono-tabular">
                  {telemetry.totalCount}
                </span>
              </div>

              {/* Telemetry Detail Rows */}
              <div className="mt-5 space-y-2.5 text-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800/60">
                  <span className="text-slate-500 dark:text-slate-400">Last Classified Category</span>
                  <span className="font-semibold text-slate-900 dark:text-white font-mono-tabular">
                    {telemetry.lastCategory}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800/60">
                  <span className="text-slate-500 dark:text-slate-400">IR Proximity Beam</span>
                  <span className="font-semibold text-slate-900 dark:text-white font-mono-tabular">
                    {telemetry.irStatus}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800/60">
                  <span className="text-slate-500 dark:text-slate-400">Subsystem Controller Status</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400 font-mono-tabular">
                    {telemetry.systemStatus}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1">
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
