import Link from "next/link";
import type { CertChange } from "@/lib/types";

interface Props {
  changes: CertChange[];
}

const KIND_LABEL: Record<CertChange["kind"], string> = {
  certified: "Certified",
  maintenance: "Maintenance update",
  advisory: "Advisory notice",
  decertified: "Decertified",
  revised: "Revised",
};

export function RecentChanges({ changes }: Props) {
  return (
    <div>
      <p className="label mb-4">Recent Changes</p>
      <div className="space-y-0">
        {changes.slice(0, 6).map((change, i) => (
          <div key={i} className="border-l-2 border-ink pl-3 py-2 mb-3">
            <Link
              href={`/system/${change.system_id}`}
              className="font-mono text-xs font-semibold text-ink hover:underline block"
            >
              {change.system_name}
            </Link>
            <p className="font-mono text-xs text-mid mt-0.5">{change.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
