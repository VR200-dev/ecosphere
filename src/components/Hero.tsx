import React from 'react';
import { ArrowRight, Bot, Cpu, Sparkles } from 'lucide-react';

interface HeroProps {
  onOpenDashboard: () => void;
  onOpenCityPulse: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenDashboard, onOpenCityPulse }) => {
  return (
    <section id="home" className="relative overflow-hidden bg-gradient-to-b from-emerald-100/35 via-emerald-50/20 to-transparent py-14 lg:py-20 dark:from-emerald-950/40 dark:via-emerald-950/20 dark:to-transparent">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Left Column: Core Value Proposition */}
          <div className="lg:col-span-7">
            {/* School Attribution */}
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/80 px-3 py-1 text-xs font-semibold text-emerald-800 dark:border-emerald-800/60 dark:bg-emerald-950/50 dark:text-emerald-300">
              <Sparkles className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Blossoms Convent School · Student Innovation Project</span>
            </div>

            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl dark:text-white" style={{ textWrap: 'balance' }}>
              ECOSPHERE
              <span className="block text-2xl sm:text-3xl lg:text-4xl font-semibold text-emerald-600 dark:text-emerald-400 mt-2">
                Smarter Systems. Cleaner Tomorrow.
              </span>
            </h1>

            <p className="mt-5 text-lg leading-relaxed text-slate-600 dark:text-slate-300 max-w-2xl">
              An integrated smart-city solution combining intelligent waste management, smart farming, and environmental monitoring into a unified IoT command network.
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <button
                onClick={onOpenDashboard}
                className="flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 hover:shadow-md active:scale-95 whitespace-nowrap"
              >
                <span>Open Live Dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={onOpenCityPulse}
                className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:text-emerald-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 whitespace-nowrap"
              >
                <Bot className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span>Meet CityPulse AI</span>
              </button>

              <a
                href="#waste"
                className="rounded-lg px-4 py-3 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white whitespace-nowrap"
              >
                Explore ECOSPHERE
              </a>
            </div>

            {/* Highlights Grid (Verified & Projected Specifications) */}
            <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4 border-t border-slate-200/80 pt-8 dark:border-slate-800/80">
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white font-mono-tabular">
                  2-Stream
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Dry & Organic Waste Sorting
                </p>
              </div>

              <div>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-mono-tabular">
                  ~40%*
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Target Water Savings (Projected)
                </p>
              </div>

              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white font-mono-tabular">
                  3 Mega
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Arduino Serial Chain Nodes
                </p>
              </div>

              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white font-mono-tabular">
                  ESP8266
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  NodeMCU Wi-Fi Gateway
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Asset */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-100 shadow-xl dark:border-slate-800 dark:bg-slate-900">
                <img
                  src="/src/assets/images/hero_smart_city_1793605178815.jpg"
                  alt="ECOSPHERE Smart City Architectural Model by Blossoms Convent School"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.02]"
                />
              </div>

              {/* Floating Architectural Callout */}
              <div className="mt-4 rounded-xl border border-slate-200 bg-white/95 p-4 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
                  <span className="font-semibold text-slate-700 dark:text-slate-200">System Interconnect Bus</span>
                  <span>Serial Chain v1.0</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-slate-700 dark:text-slate-300">
                  <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">Waste Mega</span>
                  <span>→</span>
                  <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">Irrig Mega</span>
                  <span>→</span>
                  <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">Air Mega</span>
                  <span>→</span>
                  <span className="rounded bg-sky-100 px-1.5 py-0.5 text-sky-800 dark:bg-sky-950 dark:text-sky-300">ESP8266</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
