import React from 'react';
import { Award, School, Cpu, Users, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const AboutProject: React.FC = () => {
  return (
    <section id="about" className="border-t border-emerald-500/10 bg-emerald-50/40 py-16 backdrop-blur-xs dark:border-emerald-900/30 dark:bg-emerald-950/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Student Innovation Initiative
          </p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white" style={{ textWrap: 'balance' }}>
            About ECOSPHERE & The Blossoms Convent School Team
          </h2>
          <p className="mt-3 text-base leading-relaxed text-slate-600 dark:text-slate-300">
            Conceived and engineered by secondary school innovators at Blossoms Convent School to address modern urban ecology through accessible open hardware and intelligent software.
          </p>
        </div>

        {/* 3 Pillars: Problem, Solution, Innovation */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
              The Urban Challenge
            </span>
            <h3 className="mt-2 text-lg font-bold text-slate-900 dark:text-white">
              Siloed & Wasteful Municipal Systems
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              Over 80% of municipal refuse is dumped unsegregated into open landfills, causing fires and toxic leachate. Simultaneously, conventional scheduled irrigation wastes over 40% of fresh municipal water on already-saturated soil, while localized microclimate air pollution goes unmonitored.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              The ECOSPHERE Solution
            </span>
            <h3 className="mt-2 text-lg font-bold text-slate-900 dark:text-white">
              Unified Modular IoT Network
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              A distributed multi-sensor node that mechanically segregates waste at deposit, automates drip irrigation only when soil moisture requires hydration, and monitors ambient air metrics—all linked via a serial chain bus to a central telemetry dashboard and AI advisor.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
              The Innovation
            </span>
            <h3 className="mt-2 text-lg font-bold text-slate-900 dark:text-white">
              Serial Daisy-Chain & CityPulse AI
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              Connecting multiple microcontrollers through hardware serial links (`Waste Mega → Irrigation Mega → Air Mega → NodeMCU`) eliminates expensive multi-Wi-Fi chips while keeping code modular. Paired with Gemini AI, it provides prescriptive municipal recommendations.
            </p>
          </div>
        </div>

        {/* School & Team Spotlight */}
        <div className="mt-12 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between border-b border-slate-100 pb-8 dark:border-slate-800">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 shadow-sm">
                <School className="h-7 w-7" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Institution of Origin
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Blossoms Convent School
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Student Innovation Lab & Sustainable Engineering Division
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-300">
              <Award className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>Ideation 2.0 State-Level Innovation Showcase Finalist</span>
            </div>
          </div>

          {/* Student Roles */}
          <div className="mt-8">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
              Project Engineering Divisions & Student Roles
            </h4>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 dark:border-slate-800/80 dark:bg-slate-950/60">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Lead System Architect</span>
                </div>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Overall subsystem coordination, serial protocol design, and pitch deck development.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 dark:border-slate-800/80 dark:bg-slate-950/60">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Embedded Hardware Engineer</span>
                </div>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Arduino Mega circuit prototyping, servo mechanical linkages, and relay driver isolation.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 dark:border-slate-800/80 dark:bg-slate-950/60">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span>IoT & Cloud Communications</span>
                </div>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  NodeMCU ESP8266 HTTP packet bridging, REST sensor endpoints, and live telemetry synchronization.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 dark:border-slate-800/80 dark:bg-slate-950/60">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Agritech & Environmental Lead</span>
                </div>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Soil saturation thresholds, organic composting feasibility models, and gas calibration research.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
