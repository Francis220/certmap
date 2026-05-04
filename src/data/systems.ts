import type { VotingSystem } from "@/lib/types";
import raw from "./systems.json";

export const SYSTEMS: VotingSystem[] = raw as VotingSystem[];

export const SYSTEM_BY_ID = Object.fromEntries(
  SYSTEMS.map((s) => [s.id, s]),
) as Record<string, VotingSystem>;
