import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "About CertMap" };

const FAQ: { q: string; a: React.ReactNode }[] = [
  {
    q: "What is this?",
    a: "A public tracking tool that shows which U.S. states and jurisdictions are running EAC-certified voting systems, and whether those systems meet the current VVSG 2.0 standard or the older VVSG 1.0. Built for journalists, researchers, and election officials who need this information aggregated in one place.",
  },
  {
    q: "Where does the data come from?",
    a: "Two sources: the EAC certified systems list (scraped nightly) and the EAVS 2024 equipment survey (biennial, updated after each federal election). The two datasets are joined on system name — see the data page for full methodology.",
  },
  {
    q: "How often is it updated?",
    a: "The EAC cert list is checked nightly. When a certification changes — new cert, maintenance revision, advisory notice, or decertification — the site rebuilds automatically within 24 hours. EAVS jurisdiction data updates after each federal election cycle; next update after November 2026.",
  },
  {
    q: "What's VVSG 2.0?",
    a: "The Voluntary Voting System Guidelines 2.0, adopted by the EAC in February 2021. VVSG 2.0 is a significant update to the prior 1.0/1.1 standards — stronger security and accessibility requirements, modular architecture requirements, and new software independence mandates. As of 2026, only one system (Hart Verity Voting 2.6) has been certified to VVSG 2.0; the vast majority of deployed systems remain certified to 1.0 or 1.1.",
  },
  {
    q: "I found an error. How do I report it?",
    a: (
      <>
        <a
          href="https://github.com/Francis220/certmap/issues/new"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-ink"
        >
          Open an issue on GitHub
        </a>
        {" — data errors are the most useful to report. Wrong system attributed to a jurisdiction, stale cert status, a county missing. Include the state or jurisdiction and a source if you have one."}
      </>
    ),
  },
];

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="border-t border-ink pt-6 mb-10">
        <p className="label mb-1">About</p>
        <h1 className="text-4xl font-sans font-medium text-ink">CertMap</h1>
      </div>

      <div className="space-y-0">
        {FAQ.map(({ q, a }) => (
          <div key={q} className="border-b border-line py-6">
            <p className="font-sans font-medium text-sm text-ink mb-2">{q}</p>
            <p className="font-sans text-sm text-ink/70 leading-relaxed">{a}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 pt-6 border-t border-line">
        <p className="font-mono text-xs text-mid">
          Data:{" "}
          <a
            href="https://www.eac.gov/voting-equipment/certified-voting-systems"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-ink underline"
          >
            EAC Certified Systems
          </a>
          {" · "}
          <a
            href="https://www.eac.gov/research-and-data/election-administration-voting-survey"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-ink underline"
          >
            EAVS 2024
          </a>
          {" · "}
          <Link href="/data" className="hover:text-ink underline">
            Download dataset
          </Link>
        </p>
      </div>
    </div>
  );
}
