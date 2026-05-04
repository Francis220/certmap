import { notFound } from "next/navigation";
import Link from "next/link";
import {
  SYSTEMS,
  getSystemBySlug,
  getJurisdictionsForSystem,
  STATE_BY_ABBR,
} from "@/lib/data";
import { VVSGBadge } from "@/components/VVSGBadge";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return SYSTEMS.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const sys = getSystemBySlug(slug);
  if (!sys) return {};
  return { title: `${sys.name} — ${sys.manufacturer}` };
}

export default async function SystemPage({ params }: Props) {
  const { slug } = await params;
  const sys = getSystemBySlug(slug);
  if (!sys) notFound();

  const jurisdictions = getJurisdictionsForSystem(sys.id);
  const stateCount = new Set(jurisdictions.map((j) => j.state)).size;

  const STATUS_LABEL: Record<string, string> = {
    active: "Active",
    terminated: "Terminated",
    withdrawn: "Withdrawn",
    decertified: "Decertified",
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex items-center gap-2 mb-8">
        <Link href="/system" className="font-mono text-xs text-mid hover:text-ink">SYSTEMS</Link>
        <span className="font-mono text-xs text-mid">/</span>
        <span className="font-mono text-xs text-ink">{sys.manufacturer}</span>
      </div>

      <div className="border-t border-ink pt-6 mb-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="label mb-1">{sys.manufacturer}</p>
            <h1 className="text-4xl font-sans font-medium text-ink">{sys.name}</h1>
          </div>
          <VVSGBadge version={sys.vvsg_version} />
        </div>

        <div className="grid grid-cols-4 gap-0 mt-6 border border-line">
          <div className="px-4 py-4 border-r border-line">
            <p className="label mb-1">VVSG Version</p>
            <p className="font-mono text-sm text-ink">VVSG {sys.vvsg_version}</p>
          </div>
          <div className="px-4 py-4 border-r border-line">
            <p className="label mb-1">Cert Date</p>
            <p className="font-mono text-sm text-ink">
              {new Date(sys.cert_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </p>
          </div>
          <div className="px-4 py-4 border-r border-line">
            <p className="label mb-1">Status</p>
            <p className={`font-mono text-sm ${sys.status === "active" ? "text-ink" : "text-decert"}`}>
              {STATUS_LABEL[sys.status]}
            </p>
          </div>
          <div className="px-4 py-4">
            <p className="label mb-1">Jurisdictions</p>
            <p className="font-mono text-sm text-ink">
              {jurisdictions.length} shown · {stateCount} state{stateCount !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <a
          href={sys.eac_url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-xs text-mid hover:text-ink underline mt-3 inline-block"
        >
          View on EAC website ↗
        </a>
      </div>

      {sys.advisory_notices.length > 0 && (
        <div className="mb-8 border border-decert/30 px-4 py-4">
          <p className="label text-decert mb-3">Advisory Notices</p>
          {sys.advisory_notices.map((notice, i) => (
            <div key={i} className="border-l-2 border-decert pl-3 mb-2">
              <p className="font-mono text-xs text-ink">{notice.title}</p>
              <p className="font-mono text-xs text-mid">{notice.date}</p>
            </div>
          ))}
        </div>
      )}

      <div>
        <p className="label mb-3">
          Jurisdictions using this system{" "}
          <span className="text-mid normal-case" style={{ letterSpacing: 0 }}>
            ({jurisdictions.length} in dataset)
          </span>
        </p>

        {jurisdictions.length === 0 ? (
          <p className="font-mono text-sm text-mid">No jurisdiction-level data in current dataset.</p>
        ) : (
          <div className="border-t border-ink">
            <div className="grid grid-cols-[1fr_100px] gap-0 border-b border-line py-2.5 px-2">
              <span className="label">Jurisdiction</span>
              <span className="label text-right">State</span>
            </div>
            {jurisdictions.map((j) => {
              const state = STATE_BY_ABBR[j.state];
              return (
                <div
                  key={j.fips_code}
                  className="grid grid-cols-[1fr_100px] gap-0 border-b border-line py-3 px-2"
                >
                  <span className="font-sans text-sm text-ink">{j.name}</span>
                  <div className="flex justify-end">
                    <Link
                      href={`/state/${j.state.toLowerCase()}`}
                      className="font-mono text-xs text-mid hover:text-ink"
                    >
                      {state?.name ?? j.state}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
