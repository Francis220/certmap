import { SYSTEMS, SYSTEM_BY_ID } from "@/data/systems";
import { STATES, STATE_BY_ABBR, STATE_LAYOUT, stateSlug } from "@/data/states";
import { JURISDICTIONS } from "@/data/jurisdictions";
import { CHANGES } from "@/data/changes";
import type { VotingSystem, StateRecord, Jurisdiction, VVSGVersion } from "@/lib/types";

export { SYSTEMS, SYSTEM_BY_ID, STATES, STATE_BY_ABBR, STATE_LAYOUT, JURISDICTIONS, CHANGES, stateSlug };

export function getStateBySlug(slug: string): StateRecord | undefined {
  return STATES.find((s) => stateSlug(s.abbreviation) === slug);
}

export function getSystemBySlug(slug: string): VotingSystem | undefined {
  return SYSTEMS.find((s) => s.slug === slug);
}

export function getJurisdictionsForState(abbr: string): Jurisdiction[] {
  return JURISDICTIONS.filter((j) => j.state === abbr);
}

export function getJurisdictionsForSystem(systemId: string): Jurisdiction[] {
  return JURISDICTIONS.filter((j) => j.system_id === systemId);
}

export function getStateVVSG(abbr: string): VVSGVersion {
  const state = STATE_BY_ABBR[abbr];
  if (!state?.primary_system_id) return "unknown";
  const system = SYSTEM_BY_ID[state.primary_system_id];
  return system?.vvsg_version ?? "unknown";
}

export function getStats() {
  const vvsg20States = STATES.filter((s) => {
    if (!s.primary_system_id) return false;
    return SYSTEM_BY_ID[s.primary_system_id]?.vvsg_version === "2.0";
  });
  const vvsg10States = STATES.filter((s) => {
    if (!s.primary_system_id) return false;
    const v = SYSTEM_BY_ID[s.primary_system_id]?.vvsg_version;
    return v === "1.0" || v === "1.1";
  });
  const totalJurisdictions = STATES.reduce((sum, s) => sum + s.jurisdiction_count, 0);
  return {
    vvsg20Count: vvsg20States.length,
    vvsg10Count: vvsg10States.length,
    totalJurisdictions,
  };
}
