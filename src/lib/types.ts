export type VVSGVersion = "2.0" | "1.0" | "1.1" | "unknown";
export type SystemStatus = "active" | "terminated" | "withdrawn" | "decertified";

export interface AdvisoryNotice {
  date: string;
  title: string;
  url?: string;
}

export interface VotingSystem {
  id: string;
  slug: string;
  name: string;
  manufacturer: string;
  vvsg_version: VVSGVersion;
  cert_date: string;
  status: SystemStatus;
  eac_url: string;
  advisory_notices: AdvisoryNotice[];
}

export interface Jurisdiction {
  fips_code: string;
  name: string;
  state: string;
  system_id: string | null;
  system_name_raw: string | null;
  source: "eavs_2024" | "manual" | "state_certified";
}

export interface StateRecord {
  abbreviation: string;
  name: string;
  has_state_cert_requirement: boolean;
  primary_system_id: string | null;
  jurisdiction_count: number;
  notes?: string;
}

export interface CertChange {
  date: string;
  system_id: string;
  system_name: string;
  kind: "certified" | "maintenance" | "advisory" | "decertified" | "revised";
  detail: string;
}

export interface Dataset {
  systems: VotingSystem[];
  jurisdictions: Jurisdiction[];
  states: StateRecord[];
  changes: CertChange[];
  generated_at: string;
}
