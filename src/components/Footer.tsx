import React from 'react';
import { Leaf, School, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200/80 bg-slate-900 text-slate-400 dark:border-slate-800 dark:bg-black py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-12">
          {/* Brand Info */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
                <Leaf className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                ECOSPHERE
              </span>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-slate-400 max-w-sm">
              An integrated smart-city platform combining intelligent waste segregation, precision agricultural irrigation, and atmospheric monitoring into an interconnected municipal IoT framework.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
              <School className="h-4 w-4 text-emerald-400" />
              <span>Innovated at <strong>Blossoms Convent School</strong></span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Navigation
            </h4>
            <ul className="mt-3 space-y-2 text-xs">
              <li>
                <a href="#home" className="hover:text-emerald-400 transition-colors">
                  Overview & Mission
                </a>
              </li>
              <li>
                <a href="#waste" className="hover:text-emerald-400 transition-colors">
                  Smart Waste Segregation
                </a>
              </li>
              <li>
                <a href="#irrigation" className="hover:text-emerald-400 transition-colors">
                  Automated Irrigation
                </a>
              </li>
              <li>
                <a href="#air" className="hover:text-emerald-400 transition-colors">
                  Air Quality Monitoring
                </a>
              </li>
              <li>
                <a href="#dashboard" className="hover:text-emerald-400 transition-colors">
                  Central Live Dashboard
                </a>
              </li>
              <li>
                <a href="#impact" className="hover:text-emerald-400 transition-colors">
                  Impact & Financial Feasibility
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-emerald-400 transition-colors">
                  About Team & School
                </a>
              </li>
            </ul>
          </div>

          {/* Standards & Disclaimers */}
          <div className="md:col-span-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Technical Standards & Transparency
            </h4>
            <p className="mt-3 text-xs leading-relaxed text-slate-400">
              <strong>Sensor Calibration Note:</strong> MQ-2 gas sensor values and project levels are experimental demonstration indicators and are not certified regulatory AQI measurements.
            </p>
            <p className="mt-2 text-xs leading-relaxed text-slate-400">
              <strong>Financial Projections:</strong> All economic returns, composting tonnage, and municipal cost-savings represent calculations from the Blossoms Convent School Ideation 2.0 pitch deck.
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between border-t border-slate-800 pt-8 sm:flex-row text-xs text-slate-500">
          <p>© {new Date().getFullYear()} ECOSPHERE. Blossoms Convent School Student Innovation Project.</p>
          <div className="mt-3 sm:mt-0 flex items-center gap-1">
            <span>Smarter Systems. Cleaner Tomorrow.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
