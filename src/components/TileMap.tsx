"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { STATE_LAYOUT } from "@/data/states";
import { SYSTEM_BY_ID } from "@/data/systems";
import type { StateRecord } from "@/lib/types";
import type { VVSGVersion } from "@/lib/types";

interface TooltipState {
  abbr: string;
  name: string;
  systemName: string | null;
  manufacturer: string | null;
  vvsg: VVSGVersion;
  jurisdictions: number;
  x: number;
  y: number;
}

interface Props {
  states: StateRecord[];
}

function tileColor(vvsg: VVSGVersion): string {
  if (vvsg === "2.0") return "#1a1a1a";
  if (vvsg === "1.0" || vvsg === "1.1") return "#888888";
  return "#e8e8e8";
}

function tileTextColor(vvsg: VVSGVersion): string {
  if (vvsg === "2.0") return "#ffffff";
  return "#1a1a1a";
}

function getVVSG(state: StateRecord): VVSGVersion {
  if (!state.primary_system_id) return "unknown";
  const sys = SYSTEM_BY_ID[state.primary_system_id];
  return sys?.vvsg_version ?? "unknown";
}

const GRID_COLS = 12;
const GRID_ROWS = 8;
const TILE = 54;
const GAP = 4;

export function TileMap({ states }: Props) {
  const router = useRouter();
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  const stateByAbbr = Object.fromEntries(states.map((s) => [s.abbreviation, s]));
  const layoutByAbbr = Object.fromEntries(STATE_LAYOUT.map((l) => [l.abbreviation, l]));

  const totalW = GRID_COLS * TILE + (GRID_COLS - 1) * GAP;
  const totalH = GRID_ROWS * TILE + (GRID_ROWS - 1) * GAP;

  function handleEnter(e: React.MouseEvent<SVGGElement>, abbr: string) {
    const state = stateByAbbr[abbr];
    if (!state) return;
    const vvsg = getVVSG(state);
    const sys = state.primary_system_id ? SYSTEM_BY_ID[state.primary_system_id] : null;
    const rect = (e.currentTarget.closest("svg") as SVGSVGElement).getBoundingClientRect();
    const layout = layoutByAbbr[abbr];
    const cx = layout.col * (TILE + GAP) + TILE / 2;
    const cy = layout.row * (TILE + GAP) + TILE / 2;
    setTooltip({
      abbr,
      name: state.name,
      systemName: sys?.name ?? null,
      manufacturer: sys?.manufacturer ?? null,
      vvsg,
      jurisdictions: state.jurisdiction_count,
      x: cx / totalW,
      y: cy / totalH,
    });
  }

  function handleLeave() {
    setTooltip(null);
  }

  function handleClick(abbr: string) {
    router.push(`/state/${abbr.toLowerCase()}`);
  }

  return (
    <div className="relative w-full" id="map">
      <svg
        viewBox={`0 0 ${totalW} ${totalH}`}
        className="w-full h-auto"
        style={{ maxHeight: 440 }}
        aria-label="US state voting system certification map"
      >
        {STATE_LAYOUT.map(({ abbreviation, col, row }) => {
          const state = stateByAbbr[abbreviation];
          if (!state) return null;
          const vvsg = getVVSG(state);
          const x = col * (TILE + GAP);
          const y = row * (TILE + GAP);
          const fill = tileColor(vvsg);
          const textFill = tileTextColor(vvsg);

          return (
            <g
              key={abbreviation}
              onClick={() => handleClick(abbreviation)}
              onMouseEnter={(e) => handleEnter(e, abbreviation)}
              onMouseLeave={handleLeave}
              style={{ cursor: "pointer" }}
              role="button"
              aria-label={`${state.name} — VVSG ${vvsg}`}
            >
              <rect
                x={x}
                y={y}
                width={TILE}
                height={TILE}
                fill={fill}
                stroke={vvsg === "unknown" ? "#d0cfc9" : "none"}
                strokeWidth={1}
              />
              <text
                x={x + TILE / 2}
                y={y + TILE / 2 + 4}
                textAnchor="middle"
                fontSize={10}
                fontFamily="var(--font-mono)"
                fontWeight={500}
                fill={textFill}
                style={{ userSelect: "none", pointerEvents: "none" }}
              >
                {abbreviation}
              </text>
            </g>
          );
        })}
      </svg>

      {tooltip && (
        <div
          className="absolute z-10 bg-bone border border-ink px-3 py-2 pointer-events-none"
          style={{
            left: `calc(${tooltip.x * 100}% + 12px)`,
            top: `calc(${tooltip.y * 100}% - 20px)`,
            transform: tooltip.x > 0.7 ? "translateX(-110%)" : undefined,
            minWidth: 180,
          }}
        >
          <p className="font-mono text-xs font-semibold tracking-label uppercase mb-1">
            {tooltip.name}
          </p>
          {tooltip.systemName ? (
            <p className="font-mono text-xs text-ink">{tooltip.systemName}</p>
          ) : (
            <p className="font-mono text-xs text-mid italic">No EAC cert</p>
          )}
          {tooltip.manufacturer && (
            <p className="font-mono text-xs text-mid">{tooltip.manufacturer}</p>
          )}
          <p className="font-mono text-xs text-mid mt-1">
            VVSG {tooltip.vvsg === "unknown" ? "—" : tooltip.vvsg} · {tooltip.jurisdictions} jurisdictions
          </p>
        </div>
      )}
    </div>
  );
}
