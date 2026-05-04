# CertMap

A public tracking tool that shows which U.S. states and jurisdictions are running EAC-certified voting systems, and whether those systems meet the current VVSG 2.0 standard or the older VVSG 1.0.

Built for journalists, researchers, and election officials who need this information aggregated in one place.

**Live site:** [certmap.org](https://certmap.org)

---

## What it does

- **US tile map** — every state colored by VVSG certification status. Click any state for the county-level breakdown.
- **Filterable table** — all states with system name, manufacturer, and VVSG version. Filter by 2.0 / 1.0 / unknown.
- **System detail pages** — one page per certified voting system: cert date, status, advisory notices, and every jurisdiction using it.
- **Recent changes sidebar** — updated when EAC certification status changes. The bookmark hook for journalists.
- **Data downloads** — full dataset as CSV and JSON on the [data page](https://certmap.org/data).

## Data sources

| Source | What it provides | Update cadence |
|--------|-----------------|----------------|
| [EAC Certified Systems](https://www.eac.gov/voting-equipment/certified-voting-systems) | System names, manufacturers, VVSG versions, cert dates, status, advisory notices | Scraped nightly via GitHub Actions |
| [EAVS 2024](https://www.eac.gov/research-and-data/election-administration-voting-survey) | Jurisdiction-level equipment reports — which county uses which system | Biennial; next update after 2026 elections |

The two datasets are joined on system name. See [certmap.org/data](https://certmap.org/data) for full methodology and known gaps.

## Stack

- **[Next.js 15](https://nextjs.org)** (App Router, `output: "export"`) — all pages baked to static HTML at build time
- **[Tailwind CSS](https://tailwindcss.com)** — monochrome design system, IBM Plex Mono for data labels
- **[GitHub Actions](https://github.com/features/actions)** — nightly cron scrapes EAC, diffs against committed data, commits changes and triggers a Vercel redeploy if anything changed
- **[Vercel](https://vercel.com)** — static hosting

## Project structure

```
src/
├── app/                     # Next.js App Router pages
│   ├── page.tsx             # Homepage — hero, map, table
│   ├── state/[slug]/        # State detail (51 pages)
│   ├── system/[slug]/       # System detail (one per certified system)
│   ├── data/                # Downloads + methodology
│   └── about/               # FAQ
├── components/
│   ├── TileMap.tsx          # SVG US tile cartogram
│   ├── JurisdictionTable.tsx
│   ├── RecentChanges.tsx
│   └── VVSGBadge.tsx
├── data/                    # Source of truth — edited by scraper
│   ├── systems.json         # EAC-certified systems
│   ├── changes.json         # Recent certification changes
│   ├── states.ts            # State records + tile grid positions
│   └── jurisdictions.ts     # County-level equipment data (EAVS)
└── lib/
    ├── types.ts             # Shared TypeScript types
    └── data.ts              # Query helpers

scripts/
├── scrape-eac.ts            # Nightly EAC scraper
└── build-data.ts            # Generates public/certmap-data.csv + .json

.github/workflows/
└── scrape.yml               # Nightly GitHub Actions workflow
```

## Running locally

```bash
npm install
npm run dev        # http://localhost:3000
```

To regenerate the downloadable CSV/JSON:

```bash
npm run build:data
```

To run the EAC scraper manually:

```bash
npm run scrape
```

## How the nightly update works

1. GitHub Actions runs `npm run scrape` on a schedule
2. The scraper fetches the [EAC certified systems page](https://www.eac.gov/voting-equipment/certified-voting-systems) and diffs against `src/data/systems.json`
3. If anything changed: updates `systems.json` and `changes.json`, regenerates the CSV/JSON downloads, commits, and pushes
4. Vercel detects the push and redeploys — new static HTML live within ~60 seconds

The scraper exits with a non-zero code and logs a warning if the EAC page returns zero systems, to avoid silently corrupting data if the site is down or has been redesigned.

## Known limitations

- **EAVS data is biennial** — jurisdiction-level equipment data comes from the EAVS survey, which runs after each federal election. The site shows 2024 data until 2026 results are published.
- **State-only certified systems** — some states (Louisiana, Wyoming, others) use systems certified only at the state level, not by the EAC. These are noted but not counted toward EAC cert totals.
- **EAVS name matching** — EAVS system names are raw strings as reported by local officials, which often differ from EAC's formal product names. Matching is done via normalized string comparison with manual review.
- **Multi-system states** — where a state uses different systems across counties, the primary system shown is the most widely deployed. County-level breakdowns are on each state's detail page.

## Reporting errors

Data errors — wrong system attributed to a jurisdiction, stale cert status, a county missing — are the most useful things to report.

[Open an issue on GitHub](https://github.com/Francis220/certmap/issues/new) with the state/jurisdiction and what you believe the correct information is, plus a source if you have one.

## License

MIT — see [LICENSE](LICENSE).
