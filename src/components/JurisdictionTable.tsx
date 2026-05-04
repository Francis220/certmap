"use client";

import { useState } from "react";
import Link from "next/link";
import { SYSTEM_BY_ID } from "@/data/systems";
import { STATE_BY_ABBR } from "@/data/states";
import { VVSGBadge } from "@/components/VVSGBadge";
import type { StateRecord } from "@/lib/types";
import type { VVSGVersion } from "@/lib/types";

type Filter = "ALL" | "2.0" | "1.0" | "UNKNOWN";

interface Props {
  states: StateRecord[];
}

function getVVSG(state: StateRecord): VVSGVersion {
  if (!state.primary_system_id) return "unknown";
  return SYSTEM_BY_ID[state.primary_system_id]?.vvsg_version ?? "unknown";
}

export function JurisdictionTable({ states }: Props) {
  const [filter, setFilter] = useState<Filter>("ALL");

  const filtered = states.filter((s) => {
    if (filter === "ALL") return true;
    const v = getVVSG(s);
    if (filter === "2.0") return v === "2.0";
    if (filter === "1.0") return v === "1.0" || v === "1.1";
    return v === "unknown";
  });

  const FILTERS: Filter[] = ["ALL", "2.0", "1.0", "UNKNOWN"];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="label">All Jurisdictions</span>
        <div className="flex items-center gap-1">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`font-mono text-xs px-3 py-1.5 border transition-colors ${
                filter === f
                  ? "bg-ink text-white border-ink"
                  : "bg-bone text-ink border-line hover:border-ink"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-ink">
        <div className="grid grid-cols-[180px_1fr_200px_80px] gap-0 border-b border-line py-2.5 px-2">
          <span className="label">State</span>
          <span className="label">System</span>
          <span className="label">Manufacturer</span>
          <span className="label text-right">VVSG</span>
        </div>

        {filtered.map((state) => {
          const vvsg = getVVSG(state);
          const sys = state.primary_system_id ? SYSTEM_BY_ID[state.primary_system_id] : null;
          return (
            <div
              key={state.abbreviation}
              className="grid grid-cols-[180px_1fr_200px_80px] gap-0 border-b border-line py-3 px-2 hover:bg-white transition-colors"
            >
              <Link
                href={`/state/${state.abbreviation.toLowerCase()}`}
                className="font-sans font-medium text-sm text-ink hover:underline"
              >
                {state.name}
              </Link>
              <span className="font-mono text-sm text-ink">
                {sys ? (
                  <Link href={`/system/${sys.slug}`} className="hover:underline">
                    {sys.name}
                  </Link>
                ) : (
                  <span className="text-mid">—</span>
                )}
              </span>
              <span className="font-mono text-sm text-mid">
                {sys?.manufacturer ?? (state.notes ? "State-certified only" : "—")}
              </span>
              <div className="flex justify-end">
                <VVSGBadge version={vvsg} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
