import { test } from "node:test";
import assert from "node:assert/strict";
import {
  slugify,
  parseVVSG,
  parseStatus,
  parseDate,
  normalizeManufacturer,
  diff,
} from "./scrape-eac.ts";

test("slugify combines manufacturer and name", () => {
  assert.equal(slugify("EVS 6.1.2.0", "ES&S"), "ess-evs-6-1-2-0");
  assert.equal(slugify("Verity 2.6", "Hart InterCivic"), "hart-verity-2-6");
});

test("slugify falls back to a generic manufacturer slug", () => {
  assert.equal(slugify("Widget", "Some New Vendor, Inc."), "some-new-vendor-inc-widget");
});

test("parseVVSG recognizes known standards", () => {
  assert.equal(parseVVSG("Tested to VVSG 2.0"), "2.0");
  assert.equal(parseVVSG("VVSG 1.1 certified"), "1.1");
  assert.equal(parseVVSG("VVSG 1.0"), "1.0");
  assert.equal(parseVVSG("no standard mentioned"), "unknown");
});

test("parseStatus maps text to a status", () => {
  assert.equal(parseStatus("Decertified by the state"), "decertified");
  assert.equal(parseStatus("Withdrawn by manufacturer"), "withdrawn");
  assert.equal(parseStatus("Certification terminated"), "terminated");
  assert.equal(parseStatus("Currently active"), "active");
});

test("parseDate normalizes to YYYY-MM-DD or unknown", () => {
  assert.equal(parseDate("January 5, 2024"), "2024-01-05");
  assert.equal(parseDate(""), "unknown");
  assert.equal(parseDate("not a date"), "unknown");
});

test("normalizeManufacturer canonicalizes known vendor names", () => {
  assert.equal(normalizeManufacturer("Election Systems & Software (ES&S)"), "ES&S");
  assert.equal(normalizeManufacturer("Dominion Voting Systems, Inc."), "Dominion Voting Systems");
  assert.equal(normalizeManufacturer("Some Other Vendor"), "Some Other Vendor");
});

test("diff detects newly added systems", () => {
  const current: Record<string, unknown>[] = [];
  const scraped = [
    {
      name: "EVS 6.1.2.0",
      manufacturer: "ES&S",
      vvsg_version: "2.0" as const,
      cert_date: "2024-01-01",
      status: "active" as const,
      eac_url: "https://www.eac.gov/system/ess-evs",
      advisory_notices: [],
    },
  ];

  const result = diff(current, scraped);
  assert.equal(result.added.length, 1);
  assert.equal(result.changed.length, 0);
  assert.equal(result.statusChanged.length, 0);
});

test("diff detects status changes for existing systems", () => {
  const current = [
    {
      id: "ess-evs-6-1-2-0",
      eac_url: "https://www.eac.gov/system/ess-evs",
      status: "active",
      vvsg_version: "2.0",
      advisory_notices: [],
    },
  ];
  const scraped = [
    {
      name: "EVS 6.1.2.0",
      manufacturer: "ES&S",
      vvsg_version: "2.0" as const,
      cert_date: "2024-01-01",
      status: "decertified" as const,
      eac_url: "https://www.eac.gov/system/ess-evs",
      advisory_notices: [],
    },
  ];

  const result = diff(current, scraped);
  assert.equal(result.added.length, 0);
  assert.equal(result.statusChanged.length, 1);
  assert.equal(result.statusChanged[0].status, "decertified");
});

test("diff detects a VVSG version change for an existing system", () => {
  const current = [
    {
      id: "ess-evs-6-1-2-0",
      eac_url: "https://www.eac.gov/system/ess-evs",
      status: "active",
      vvsg_version: "1.0",
      advisory_notices: [],
    },
  ];
  const scraped = [
    {
      name: "EVS 6.1.2.0",
      manufacturer: "ES&S",
      vvsg_version: "2.0" as const,
      cert_date: "2024-01-01",
      status: "active" as const,
      eac_url: "https://www.eac.gov/system/ess-evs",
      advisory_notices: [],
    },
  ];

  const result = diff(current, scraped);
  assert.equal(result.changed.length, 1);
  assert.equal(result.statusChanged.length, 0);
});

test("diff detects a new advisory notice", () => {
  const current = [
    {
      id: "ess-evs-6-1-2-0",
      eac_url: "https://www.eac.gov/system/ess-evs",
      status: "active",
      vvsg_version: "2.0",
      advisory_notices: [],
    },
  ];
  const scraped = [
    {
      name: "EVS 6.1.2.0",
      manufacturer: "ES&S",
      vvsg_version: "2.0" as const,
      cert_date: "2024-01-01",
      status: "active" as const,
      eac_url: "https://www.eac.gov/system/ess-evs",
      advisory_notices: [{ date: "2024-03-01", title: "Firmware update required" }],
    },
  ];

  const result = diff(current, scraped);
  assert.equal(result.changed.length, 1);
});

test("diff does not flag a change when advisory notices are removed", () => {
  // Current behavior: the advisory-notice comparison only fires when the
  // scraped list is non-empty, so a notice disappearing from the EAC page
  // is silently ignored rather than recorded as a change.
  const current = [
    {
      id: "ess-evs-6-1-2-0",
      eac_url: "https://www.eac.gov/system/ess-evs",
      status: "active",
      vvsg_version: "2.0",
      advisory_notices: [{ date: "2024-03-01", title: "Firmware update required" }],
    },
  ];
  const scraped = [
    {
      name: "EVS 6.1.2.0",
      manufacturer: "ES&S",
      vvsg_version: "2.0" as const,
      cert_date: "2024-01-01",
      status: "active" as const,
      eac_url: "https://www.eac.gov/system/ess-evs",
      advisory_notices: [],
    },
  ];

  const result = diff(current, scraped);
  assert.equal(result.changed.length, 0);
});

test("diff reports no changes when scraped data matches current data", () => {
  const current = [
    {
      id: "ess-evs-6-1-2-0",
      eac_url: "https://www.eac.gov/system/ess-evs",
      status: "active",
      vvsg_version: "2.0",
      advisory_notices: [],
    },
  ];
  const scraped = [
    {
      name: "EVS 6.1.2.0",
      manufacturer: "ES&S",
      vvsg_version: "2.0" as const,
      cert_date: "2024-01-01",
      status: "active" as const,
      eac_url: "https://www.eac.gov/system/ess-evs",
      advisory_notices: [],
    },
  ];

  const result = diff(current, scraped);
  assert.equal(result.added.length, 0);
  assert.equal(result.changed.length, 0);
  assert.equal(result.statusChanged.length, 0);
});
