import Link from "next/link";
import { SYSTEMS } from "@/lib/data";
import { VVSGBadge } from "@/components/VVSGBadge";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Certified Systems" };

export default function SystemsPage() {
  const byManufacturer = SYSTEMS.reduce<Record<string, typeof SYSTEMS>>((acc, s) => {
    if (!acc[s.manufacturer]) acc[s.manufacturer] = [];
    acc[s.manufacturer].push(s);
    return acc;
  }, {});

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="border-t border-ink pt-6 mb-8">
        <p className="label mb-1">EAC-Certified Systems</p>
        <h1 className="text-4xl font-sans font-medium text-ink">All certified voting systems</h1>
      </div>

      {Object.entries(byManufacturer).map(([mfr, systems]) => (
        <div key={mfr} className="mb-8">
          <p className="label mb-3">{mfr}</p>
          <div className="border-t border-ink">
            {systems.map((sys) => (
              <Link
                key={sys.id}
                href={`/system/${sys.slug}`}
                className="flex items-center justify-between py-3 px-2 border-b border-line hover:bg-white transition-colors group"
              >
                <div>
                  <p className="font-mono text-sm text-ink group-hover:underline">{sys.name}</p>
                  <p className="font-mono text-xs text-mid mt-0.5">
                    Certified {new Date(sys.cert_date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                    {sys.advisory_notices.length > 0 && (
                      <span className="ml-2 text-decert">{sys.advisory_notices.length} advisory notice{sys.advisory_notices.length > 1 ? "s" : ""}</span>
                    )}
                  </p>
                </div>
                <VVSGBadge version={sys.vvsg_version} />
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
