"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { STATE_LAYOUT } from "@/data/states";
import { SYSTEM_BY_ID } from "@/data/systems";
import type { StateRecord, VVSGVersion } from "@/lib/types";

interface TooltipState {
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
  return vvsg === "2.0" ? "#ffffff" : "#1a1a1a";
}

function getVVSG(state: StateRecord): VVSGVersion {
  if (!state.primary_system_id) return "unknown";
  return SYSTEM_BY_ID[state.primary_system_id]?.vvsg_version ?? "unknown";
}

const TILE = 54;
const GAP = 4;
const GRID_COLS = 12;
const GRID_ROWS = 8;
const TOTAL_W = GRID_COLS * TILE + (GRID_COLS - 1) * GAP;
const TOTAL_H = GRID_ROWS * TILE + (GRID_ROWS - 1) * GAP;

export function TileMap({ states }: Props) {
  const router = useRouter();
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  const stateByAbbr = useMemo(
    () => Object.fromEntries(states.map((s) => [s.abbreviation, s])),
    [states],
  );

  const layoutByAbbr = useMemo(
    () => Object.fromEntries(STATE_LAYOUT.map((l) => [l.abbreviation, l])),
    [],
  );

  function handleEnter(abbr: string) {
    const state = stateByAbbr[abbr];
    if (!state) return;
    const vvsg = getVVSG(state);
    const sys = state.primary_system_id ? SYSTEM_BY_ID[state.primary_system_id] : null;
    const layout = layoutByAbbr[abbr];
    const cx = layout.col * (TILE + GAP) + TILE / 2;
    const cy = layout.row * (TILE + GAP) + TILE / 2;
    setTooltip({
      name: state.name,
      systemName: sys?.name ?? null,
      manufacturer: sys?.manufacturer ?? null,
      vvsg,
      jurisdictions: state.jurisdiction_count,
      x: cx / TOTAL_W,
      y: cy / TOTAL_H,
    });
  }

  function handleClick(abbr: string) {
    router.push(`/state/${abbr.toLowerCase()}`);
  }

  return (
    <div className="relative w-full" id="map">
      <svg
        viewBox={`0 0 ${TOTAL_W} ${TOTAL_H}`}
        className="w-full h-auto"
        style={{ maxHeight: 440 }}
        aria-label="US state voting system certification map"
        role="img"
      >
        {STATE_LAYOUT.map(({ abbreviation, col, row }) => {
          const state = stateByAbbr[abbreviation];
          if (!state) return null;
          const vvsg = getVVSG(state);
          const x = col * (TILE + GAP);
          const y = row * (TILE + GAP);

          return (
            <g
              key={abbreviation}
              onClick={() => handleClick(abbreviation)}
              onMouseEnter={() => handleEnter(abbreviation)}
              onMouseLeave={() => setTooltip(null)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") handleClick(abbreviation);
              }}
              tabIndex={0}
              role="button"
              aria-label={`${state.name} — VVSG ${vvsg === "unknown" ? "unknown" : vvsg}`}
              style={{ cursor: "pointer", outline: "none" }}
            >
              <rect
                x={x}
                y={y}
                width={TILE}
                height={TILE}
                fill={tileColor(vvsg)}
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
                fill={tileTextColor(vvsg)}
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
