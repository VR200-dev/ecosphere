import React from 'react';
import { Leaf, Sun, Moon, Radio, Wrench } from 'lucide-react';
import type { ConnectionState } from '../types/telemetry';

interface NavbarProps {
  connectionStatus: ConnectionState;
  isDark: boolean;
  onToggleDark: () => void;
  onOpenHardwareModal: () => void;
  onOpenDashboard: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  connectionStatus,
  isDark,
  onToggleDark,
  onOpenHardwareModal,
  onOpenDashboard,
}) => {
  const getStatusBadge = () => {
    switch (connectionStatus) {
      case 'LIVE':
        return { label: 'LIVE SENSOR DATA', color: 'text-emerald-700 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800' };
      case 'STALE':
        return { label: 'DATA STALE', color: 'text-amber-700 bg-amber-50 dark:text-amber-300 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800' };
      case 'DISCONNECTED':
        return { label: 'HARDWARE NOT CONNECTED', color: 'text-rose-700 bg-rose-50 dark:text-rose-300 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800' };
      default:
        return { label: 'DEMONSTRATION MODE', color: 'text-sky-700 bg-sky-50 dark:text-sky-300 dark:bg-sky-950/60 border-sky-300 dark:border-sky-800' };
    }
  };

  const status = getStatusBadge();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-emerald-500/10 bg-[#f0f8f3]/90 backdrop-blur-md dark:border-emerald-900/30 dark:bg-[#06180f]/90">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Brand Wordmark */}
        <a href="#home" className="group flex items-center gap-2.5 whitespace-nowrap shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-sm transition-transform group-hover:scale-105">
            <Leaf className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              ECOSPHERE
            </span>
          </div>
        </a>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600 dark:text-slate-300">
          <a href="#home" className="transition-colors hover:text-emerald-600 dark:hover:text-emerald-400 whitespace-nowrap shrink-0">
            Overview
          </a>
          <a href="#waste" className="transition-colors hover:text-emerald-600 dark:hover:text-emerald-400 whitespace-nowrap shrink-0">
            Waste Segregation
          </a>
          <a href="#irrigation" className="transition-colors hover:text-emerald-600 dark:hover:text-emerald-400 whitespace-nowrap shrink-0">
            Smart Irrigation
          </a>
          <a href="#air" className="transition-colors hover:text-emerald-600 dark:hover:text-emerald-400 whitespace-nowrap shrink-0">
            Air Quality
          </a>
          <a href="#dashboard" className="transition-colors hover:text-emerald-600 dark:hover:text-emerald-400 whitespace-nowrap shrink-0 font-semibold text-emerald-700 dark:text-emerald-400">
            Live Dashboard
          </a>
          <a href="#impact" className="transition-colors hover:text-emerald-600 dark:hover:text-emerald-400 whitespace-nowrap shrink-0">
            Impact & Feasibility
          </a>
          <a href="#about" className="transition-colors hover:text-emerald-600 dark:hover:text-emerald-400 whitespace-nowrap shrink-0">
            About Team
          </a>
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Status Indicator Pill */}
          <div className={`hidden lg:flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${status.color}`}>
            <Radio className="h-3 w-3 animate-pulse" />
            <span>{status.label}</span>
          </div>

          {/* Hardware Code Docs Button */}
          <button
            onClick={onOpenHardwareModal}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900 whitespace-nowrap"
            title="NodeMCU ESP8266 Setup & Packet Protocol"
          >
            <Wrench className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden sm:inline">Hardware Setup</span>
          </button>

          {/* Theme Switcher */}
          <button
            onClick={onToggleDark}
            aria-label="Toggle color theme"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
          >
            {isDark ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* Primary CTA */}
          <button
            onClick={onOpenDashboard}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 hover:shadow whitespace-nowrap active:scale-95"
          >
            Live Dashboard
          </button>
        </div>
      </div>
    </header>
  );
};
