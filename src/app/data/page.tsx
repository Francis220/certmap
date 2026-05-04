import type { Metadata } from "next";

export const metadata: Metadata = { title: "Data Downloads" };

const SOURCES = [
  {
    name: "EAC Certified Systems",
    url: "https://www.eac.gov/voting-equipment/certified-voting-systems",
    description: "Master list of all EAC-certified systems with cert dates, versions, and status.",
    cadence: "Scraped nightly — changes rare but reflected within 24 hours.",
  },
  {
    name: "EAVS 2024 Equipment Reports",
    url: "https://www.eac.gov/research-and-data/election-administration-voting-survey",
    description: "Election Administration and Voting Survey equipment module — jurisdiction-level equipment names as reported by election officials.",
    cadence: "Biennial. Next update after the 2026 elections.",
  },
];

const GAPS = [
  "State-only certified systems (Louisiana, Wyoming, others) are noted but not counted toward EAC cert totals.",
  "Jurisdictions that did not return equipment data in EAVS 2024 are excluded from jurisdiction counts.",
  "Where a county uses multiple systems, only the primary optical-scan tabulation system is shown.",
  "EAVS system names are raw strings matched to EAC cert records via fuzzy name matching — some joins may be incorrect.",
];

export default function DataPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="border-t border-ink pt-6 mb-10">
        <p className="label mb-1">Dataset</p>
        <h1 className="text-4xl font-sans font-medium text-ink">Download the data</h1>
      </div>

      {/* Downloads */}
      <div className="grid grid-cols-2 gap-0 mb-12 border border-line">
        <a
          href="/certmap-data.csv"
          download
          className="flex flex-col px-6 py-6 border-r border-line hover:bg-white transition-colors group"
        >
          <span className="font-mono text-xs tracking-label text-mid mb-2 uppercase">CSV</span>
          <span className="font-mono text-xl font-semibold text-ink group-hover:underline">certmap-data.csv</span>
          <span className="font-mono text-xs text-mid mt-2">
            Joined dataset: systems + states + jurisdiction counts. Machine-readable.
          </span>
        </a>
        <a
          href="/certmap-data.json"
          download
          className="flex flex-col px-6 py-6 hover:bg-white transition-colors group"
        >
          <span className="font-mono text-xs tracking-label text-mid mb-2 uppercase">JSON</span>
          <span className="font-mono text-xl font-semibold text-ink group-hover:underline">certmap-data.json</span>
          <span className="font-mono text-xs text-mid mt-2">
            Full nested structure: systems array, states array, jurisdictions array.
          </span>
        </a>
      </div>

      {/* Methodology */}
      <div className="mb-10">
        <p className="label mb-4">Methodology</p>
        <div className="border-t border-line">
          <p className="font-sans text-sm text-ink/80 leading-relaxed py-4">
            EAC certification records list each certified voting system with its VVSG version, certification date,
            and current status. EAVS 2024 equipment reports list the voting system name as reported by each
            local election office. These two datasets are joined on system name — EAC uses the manufacturer&apos;s
            formal product name; EAVS uses whatever the jurisdiction reported, which often differs.
          </p>
          <p className="font-sans text-sm text-ink/80 leading-relaxed pb-4">
            Matching is done via normalized string comparison, with manual review of common mismatches.
            A state&apos;s VVSG status reflects its primary tabulation system as reported in EAVS 2024.
            States using multiple systems across counties are noted; the primary system is the most
            widely deployed based on jurisdiction count.
          </p>
        </div>
      </div>

      {/* Known gaps */}
      <div className="mb-10">
        <p className="label mb-4">Known gaps</p>
        <div className="border-t border-ink">
          {GAPS.map((gap, i) => (
            <div key={i} className="border-b border-line py-3 flex gap-3">
              <span className="font-mono text-xs text-mid mt-0.5 flex-shrink-0">{String(i + 1).padStart(2, "0")}</span>
              <p className="font-sans text-sm text-ink/80">{gap}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Sources */}
      <div>
        <p className="label mb-4">Sources</p>
        <div className="border-t border-ink space-y-0">
          {SOURCES.map((src) => (
            <div key={src.name} className="border-b border-line py-5">
              <a
                href={src.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-sm font-semibold text-ink hover:underline"
              >
                {src.name} ↗
              </a>
              <p className="font-sans text-sm text-ink/70 mt-1">{src.description}</p>
              <p className="font-mono text-xs text-mid mt-2">{src.cadence}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
