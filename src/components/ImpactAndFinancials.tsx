import React from 'react';
import { TrendingUp, DollarSign, Sprout, Droplets, Info, Award, ArrowUpRight } from 'lucide-react';

export const ImpactAndFinancials: React.FC = () => {
  return (
    <section id="impact" className="border-t border-emerald-500/10 bg-white/50 py-16 backdrop-blur-xs dark:border-emerald-900/30 dark:bg-emerald-950/15">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Ideation 2.0 · Feasibility & Economic Model
          </p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white" style={{ textWrap: 'balance' }}>
            Smart City Impact & Financial Projections
          </h2>
          <p className="mt-3 text-base leading-relaxed text-slate-600 dark:text-slate-300">
            A sustainable municipal financial model driven by source-level segregation, decentralized organic composting, and automated agricultural water conservation.
          </p>
        </div>

        {/* Prominent Mandatory Projections Disclaimer */}
        <div className="mt-8 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 text-xs text-emerald-900 dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-200">
          <Info className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
          <div>
            <span className="font-bold">Project Feasibility & Projections Notice:</span>
            <p className="mt-0.5 leading-relaxed">
              All financial figures, revenue estimates, and resource-saving percentages in this section represent mathematical projections and feasibility calculations from the <strong>Blossoms Convent School ECOSPHERE Ideation 2.0 pitch deck</strong>. They are modeled for municipal implementation and do not represent verified historical earnings.
            </p>
          </div>
        </div>

        {/* 4 Key Projected Impact Cards */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-5 dark:border-slate-800/80 dark:bg-slate-900/40">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              <TrendingUp className="h-5 w-5" />
            </div>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Municipal Waste Savings
            </p>
            <p className="mt-1 text-3xl font-extrabold text-slate-900 dark:text-white font-mono-tabular">
              28% – 35%
            </p>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
              Projected reduction in secondary sorting and landfill hauling expenditures.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-5 dark:border-slate-800/80 dark:bg-slate-900/40">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
              <Droplets className="h-5 w-5" />
            </div>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Water Conservation
            </p>
            <p className="mt-1 text-3xl font-extrabold text-sky-600 dark:text-sky-400 font-mono-tabular">
              Up to 40%
            </p>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
              Projected reduction in water usage across urban gardens and landscaping.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-5 dark:border-slate-800/80 dark:bg-slate-900/40">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              <Sprout className="h-5 w-5" />
            </div>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Decentralized Compost
            </p>
            <p className="mt-1 text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono-tabular">
              12 – 18 Tons
            </p>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
              Projected annual organic fertilizer generation per municipal ward node.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-5 dark:border-slate-800/80 dark:bg-slate-900/40">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
              <DollarSign className="h-5 w-5" />
            </div>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Hardware Payback
            </p>
            <p className="mt-1 text-3xl font-extrabold text-amber-600 dark:text-amber-400 font-mono-tabular">
              7 – 9 Months
            </p>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
              Projected return on capital through recovered recyclables and fertilizer sales.
            </p>
          </div>
        </div>

        {/* Detailed Breakdown: Revenue Model & Future Scope */}
        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {/* Revenue Model Breakdown */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Projected Revenue Streams & Cost Offsets
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Estimated economic returns per municipal deployment cluster (10 nodes)
            </p>

            <div className="mt-6 space-y-4">
              <div className="flex items-start justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                    1. High-Grade Organic Fertilizer Offtake
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Sold to community urban farms and local nurseries or utilized to offset municipal park fertilizer budgets.
                  </p>
                </div>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm whitespace-nowrap ml-4">
                  ~$18,000 / yr*
                </span>
              </div>

              <div className="flex items-start justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                    2. Clean Dry Recyclable Scrap Sales
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Uncontaminated segregated plastics, aluminum cans, and paper fetch up to 35% higher prices at certified recycling aggregators.
                  </p>
                </div>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm whitespace-nowrap ml-4">
                  ~$9,500 / yr*
                </span>
              </div>

              <div className="flex items-start justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                    3. Landfill Tipping Fee Reductions
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Diverting heavy organic waste significantly lowers municipal tipping fees charged per ton at central landfill facilities.
                  </p>
                </div>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm whitespace-nowrap ml-4">
                  ~$14,200 / yr*
                </span>
              </div>

              <div className="flex items-start justify-between pt-1">
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                    4. Municipal Irrigation Water Utility Savings
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Elimination of over-irrigation schedules across public green belts.
                  </p>
                </div>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm whitespace-nowrap ml-4">
                  ~$6,800 / yr*
                </span>
              </div>
            </div>

            <p className="mt-6 text-[11px] text-slate-400 dark:text-slate-500 border-t border-slate-100 pt-3 dark:border-slate-800">
              *Projections based on a 10-node deployment model serving approximately 3,500 residents.
            </p>
          </div>

          {/* Environmental Benefits & Future Expansion */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Environmental Impact & Future Expansion
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Roadmap from student innovation prototype to citywide deployment
            </p>

            <div className="mt-6 space-y-4">
              <div className="rounded-xl border border-slate-200/80 bg-slate-50 p-4 dark:border-slate-800/80 dark:bg-slate-950/60">
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                  Methane Abatement via Aerated Composting
                </span>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  When organic waste decomposes anaerobically in landfills, it releases potent methane gas (CH4). Localized aerobic composting in ECOSPHERE turns that waste into oxygenated organic soil amendments instead.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200/80 bg-slate-50 p-4 dark:border-slate-800/80 dark:bg-slate-950/60">
                <span className="text-xs font-bold text-sky-700 dark:text-sky-400">
                  Phase 2: Long-Range LoRaWAN Mesh Networking
                </span>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Upgrading the transmission gateway from standard Wi-Fi (ESP8266) to 868/915 MHz LoRaWAN to provide kilometers of wireless coverage across parks and rural farming plots without cellular SIM overhead.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200/80 bg-slate-50 p-4 dark:border-slate-800/80 dark:bg-slate-950/60">
                <span className="text-xs font-bold text-amber-700 dark:text-amber-400">
                  Phase 3: Autonomous Solar Micro-Harvesting
                </span>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Equipping each 3-Mega node with a 20W photovoltaic panel and LiFePO4 battery pack, enabling 100% off-grid operation throughout monsoon and power outage conditions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
