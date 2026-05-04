import type { VVSGVersion } from "@/lib/types";

export function VVSGBadge({ version }: { version: VVSGVersion }) {
  if (version === "2.0") return <span className="badge-20">2.0</span>;
  if (version === "1.0" || version === "1.1")
    return <span className="badge-10">{version}</span>;
  return <span className="badge-unknown">—</span>;
}
