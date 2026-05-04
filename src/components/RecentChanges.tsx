import Link from "next/link";
import type { CertChange } from "@/lib/types";

interface Props {
  changes: CertChange[];
}

export function RecentChanges({ changes }: Props) {
  return (
    <div>
      <p className="label mb-4">Recent Changes</p>
      <div className="space-y-0">
        {changes.slice(0, 6).map((change) => (
          <div key={`${change.date}-${change.system_id}`} className="border-l-2 border-ink pl-3 py-2 mb-3">
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
