import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { SYSTEMS } from "../src/data/systems";
import { STATES } from "../src/data/states";
import { JURISDICTIONS } from "../src/data/jurisdictions";
import { SYSTEM_BY_ID } from "../src/data/systems";

const __dirname = dirname(fileURLToPath(import.meta.url));
const out = join(__dirname, "../public");

const dataset = {
  generated_at: new Date().toISOString(),
  systems: SYSTEMS,
  states: STATES.map((s) => ({
    ...s,
    primary_system: s.primary_system_id ? SYSTEM_BY_ID[s.primary_system_id] : null,
  })),
  jurisdictions: JURISDICTIONS.map((j) => ({
    ...j,
    system: j.system_id ? SYSTEM_BY_ID[j.system_id] : null,
  })),
};

writeFileSync(join(out, "certmap-data.json"), JSON.stringify(dataset, null, 2));

const csvRows = [
  "state_abbr,state_name,jurisdiction_fips,jurisdiction_name,system_id,system_name,manufacturer,vvsg_version,cert_date,status",
  ...JURISDICTIONS.map((j) => {
    const state = STATES.find((s) => s.abbreviation === j.state)!;
    const sys = j.system_id ? SYSTEM_BY_ID[j.system_id] : null;
    const csv = (v: string | null | undefined) =>
      v ? `"${v.replace(/"/g, '""')}"` : '""';
    return [
      csv(j.state),
      csv(state?.name),
      csv(j.fips_code),
      csv(j.name),
      csv(sys?.id),
      csv(sys?.name),
      csv(sys?.manufacturer),
      csv(sys?.vvsg_version),
      csv(sys?.cert_date),
      csv(sys?.status),
    ].join(",");
  }),
];

writeFileSync(join(out, "certmap-data.csv"), csvRows.join("\n"));

console.log(`✓ certmap-data.json  (${dataset.systems.length} systems, ${dataset.states.length} states, ${dataset.jurisdictions.length} jurisdictions)`);
console.log(`✓ certmap-data.csv   (${JURISDICTIONS.length} jurisdiction rows)`);
