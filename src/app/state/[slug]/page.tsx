import { notFound } from "next/navigation";
import Link from "next/link";
import {
  STATES,
  getStateBySlug,
  getJurisdictionsForState,
  SYSTEM_BY_ID,
} from "@/lib/data";
import { VVSGBadge } from "@/components/VVSGBadge";
import type { Metadata } from "next";
import type { VVSGVersion } from "@/lib/types";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return STATES.map((s) => ({ slug: s.abbreviation.toLowerCase() }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const state = getStateBySlug(slug);
  if (!state) return {};
  return { title: `${state.name} — Voting System Certification` };
}

export default async function StatePage({ params }: Props) {
  const { slug } = await params;
  const state = getStateBySlug(slug);
  if (!state) notFound();

  const jurisdictions = getJurisdictionsForState(state.abbreviation);
  const primarySystem = state.primary_system_id ? SYSTEM_BY_ID[state.primary_system_id] : null;
  const vvsg: VVSGVersion = primarySystem?.vvsg_version ?? "unknown";

  const systemsUsed = Array.from(
    new Set(jurisdictions.map((j) => j.system_id).filter(Boolean))
  ).map((id) => SYSTEM_BY_ID[id!]).filter(Boolean);

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-8">
        <Link href="/" className="font-mono text-xs text-mid hover:text-ink">HOME</Link>
        <span className="font-mono text-xs text-mid">/</span>
        <span className="font-mono text-xs text-ink uppercase">{state.name}</span>
      </div>

      {/* Header */}
      <div className="border-t border-ink pt-6 mb-8">
        <div className="flex items-start justify-between">
          <div>
            <p className="label mb-1">{state.abbreviation}</p>
            <h1 className="text-4xl font-sans font-medium text-ink">{state.name}</h1>
          </div>
          <VVSGBadge version={vvsg} />
        </div>

        <div className="grid grid-cols-3 gap-0 mt-6 border border-line">
          <div className="px-5 py-4 border-r border-line">
            <p className="label mb-1">Primary System</p>
            <p className="font-mono text-sm text-ink">
              {primarySystem ? (
                <Link href={`/system/${primarySystem.slug}`} className="hover:underline">
                  {primarySystem.name}
                </Link>
              ) : "—"}
            </p>
          </div>
          <div className="px-5 py-4 border-r border-line">
            <p className="label mb-1">Manufacturer</p>
            <p className="font-mono text-sm text-ink">{primarySystem?.manufacturer ?? "—"}</p>
          </div>
          <div className="px-5 py-4">
            <p className="label mb-1">Jurisdictions</p>
            <p className="font-mono text-sm text-ink">{state.jurisdiction_count}</p>
          </div>
        </div>

        {state.has_state_cert_requirement && (
          <div className="mt-4 border-l-2 border-ink pl-3 py-1">
            <p className="font-mono text-xs text-mid">
              This state has its own certification requirement in addition to EAC certification.
            </p>
          </div>
        )}
        {state.notes && (
          <p className="font-mono text-xs text-mid mt-3">{state.notes}</p>
        )}
      </div>

      {/* Systems in use */}
      {systemsUsed.length > 1 && (
        <div className="mb-8">
          <p className="label mb-3">All Systems in Use</p>
          <div className="flex flex-wrap gap-2">
            {systemsUsed.map((sys) => (
              <Link
                key={sys.id}
                href={`/system/${sys.slug}`}
                className="font-mono text-xs border border-line px-3 py-1.5 hover:border-ink transition-colors"
              >
                {sys.name} · {sys.manufacturer}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Jurisdiction table */}
      <div>
        <p className="label mb-3">
          {jurisdictions.length > 0
            ? `Sample jurisdictions · ${jurisdictions.length} shown`
            : "Jurisdictions"}
        </p>
        {jurisdictions.length === 0 ? (
          <p className="font-mono text-sm text-mid">No jurisdiction-level data available for this state.</p>
        ) : (
          <div className="border-t border-ink">
            <div className="grid grid-cols-[1fr_220px_80px] gap-0 border-b border-line py-2.5 px-2">
              <span className="label">Jurisdiction</span>
              <span className="label">System</span>
              <span className="label text-right">VVSG</span>
            </div>
            {jurisdictions.map((j) => {
              const sys = j.system_id ? SYSTEM_BY_ID[j.system_id] : null;
              const jVvsg: VVSGVersion = sys?.vvsg_version ?? "unknown";
              return (
                <div
                  key={j.fips_code}
                  className="grid grid-cols-[1fr_220px_80px] gap-0 border-b border-line py-3 px-2"
                >
                  <span className="font-sans text-sm text-ink">{j.name}</span>
                  <span className="font-mono text-sm text-mid">
                    {sys ? (
                      <Link href={`/system/${sys.slug}`} className="hover:underline text-ink">
                        {sys.name}
                      </Link>
                    ) : (
                      <span className="italic">{j.system_name_raw ?? "—"}</span>
                    )}
                  </span>
                  <div className="flex justify-end">
                    <VVSGBadge version={jVvsg} />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {state.jurisdiction_count > jurisdictions.length && (
          <p className="font-mono text-xs text-mid mt-3">
            Showing {jurisdictions.length} of {state.jurisdiction_count} jurisdictions. Full dataset available on the{" "}
            <Link href="/data" className="underline">data page</Link>.
          </p>
        )}
      </div>
    </div>
  );
}
