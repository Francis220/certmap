import { STATES, CHANGES, getStats } from "@/lib/data";
import { TileMap } from "@/components/TileMap";
import { RecentChanges } from "@/components/RecentChanges";
import { JurisdictionTable } from "@/components/JurisdictionTable";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CertMap — U.S. Voting System Certification Tracker",
};

function StatCounter({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="border border-line px-6 py-5 flex-1">
      <p className="font-mono text-3xl font-semibold text-ink">
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
      <p className="label mt-1">{label}</p>
    </div>
  );
}

export default function Home() {
  const stats = getStats();

  return (
    <>
      {/* Hero */}
      <section className="border-b border-line">
        <div className="max-w-7xl mx-auto px-6 pt-12 pb-10">
          <p className="label mb-4">VVSG 2.0 Compliance Tracker — Updated May 2026</p>
          <h1 className="text-5xl font-sans font-medium text-ink leading-tight max-w-2xl">
            Which states are running certified voting systems?
          </h1>
          <p className="text-base text-ink/70 mt-4 max-w-lg leading-relaxed">
            EAC certification data joined to jurisdiction-level equipment reports. Updated when certifications change.
          </p>
          <div className="flex gap-0 mt-8 max-w-2xl">
            <StatCounter value={stats.vvsg20Count} label="VVSG 2.0 certified" />
            <StatCounter value={stats.vvsg10Count} label="VVSG 1.0 certified" />
            <StatCounter value={stats.totalJurisdictions} label="jurisdictions tracked" />
          </div>
        </div>
      </section>

      {/* Map + Sidebar */}
      <section className="border-b border-line">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-0">
            <div className="flex-1 py-8 pr-8 border-r border-line">
              <TileMap states={STATES} />
            </div>

            <div className="w-72 py-8 pl-8 flex flex-col gap-8">
              {/* Legend */}
              <div>
                <p className="label mb-4">Legend</p>
                <div className="space-y-3">
                  {[
                    { fill: "#1a1a1a", label: "VVSG 2.0 certified" },
                    { fill: "#888888", label: "VVSG 1.0 certified" },
                    { fill: "#e8e8e8", border: true, label: "No EAC cert / unknown" },
                  ].map(({ fill, border, label }) => (
                    <div key={label} className="flex items-center gap-3">
                      <div
                        className="w-5 h-5 flex-shrink-0"
                        style={{
                          backgroundColor: fill,
                          border: border ? "1px solid #d0cfc9" : "none",
                        }}
                      />
                      <span className="font-mono text-xs text-ink">{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-line pt-6">
                <RecentChanges changes={CHANGES} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scroll indicator */}
      <div className="flex justify-center py-4 border-b border-line">
        <a href="#table" aria-label="Scroll to jurisdictions table" className="w-9 h-9 rounded-full border border-line flex items-center justify-center hover:border-ink focus:outline-none focus:border-ink transition-colors">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 2v10M2 7l5 5 5-5" stroke="#888" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </div>

      {/* Table */}
      <section className="max-w-7xl mx-auto px-6 py-10" id="table">
        <JurisdictionTable states={STATES} />
      </section>
    </>
  );
}
