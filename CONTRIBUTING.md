# Contributing to CertMap

Thanks for helping make election data more accessible.

## What's most useful

- **Data corrections** — wrong system attributed to a jurisdiction, stale cert status, a county that's missing. [Open an issue](https://github.com/Francis220/certmap/issues/new) with the jurisdiction, what you believe is correct, and a source.
- **Scraper fixes** — if the EAC site has been redesigned and the nightly scraper is broken, a PR fixing the selectors in `scripts/scrape-eac.ts` is very welcome.
- **EAVS data improvements** — the jurisdiction dataset in `src/data/jurisdictions.ts` is a sample. PRs that expand it toward full EAVS 2024 coverage are useful.

## What's out of scope for v1

- User accounts or authentication
- Historical trend views
- State-level certification data beyond what EAC publishes
- An API (the CSV/JSON downloads on the data page are the intended interface)

## Running locally

```bash
npm install
npm run dev
```

## Making a change

1. Fork the repo and create a branch
2. Make your change
3. Run `npm run build` to confirm nothing is broken
4. Open a PR with a brief description of what changed and why

## Data PRs

If you're correcting jurisdiction data, link to the source (EAC cert page, EAVS report, official state SOS page). Data changes without a source won't be merged.
