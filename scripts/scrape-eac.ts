import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { join, dirname } from "path";
import * as cheerio from "cheerio";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "../src/data");
const SYSTEMS_PATH = join(ROOT, "systems.json");
const CHANGES_PATH = join(ROOT, "changes.json");

const EAC_BASE = "https://www.eac.gov";
const EAC_LIST = `${EAC_BASE}/voting-equipment/certified-voting-systems`;

interface ScrapedSystem {
  name: string;
  manufacturer: string;
  vvsg_version: "2.0" | "1.0" | "1.1" | "unknown";
  cert_date: string;
  status: "active" | "terminated" | "withdrawn" | "decertified";
  eac_url: string;
  advisory_notices: { date: string; title: string; url?: string }[];
}

function slugify(name: string, manufacturer: string): string {
  const lowerManufacturer = manufacturer.toLowerCase();
  let mfrSlug = manufacturer
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  if (manufacturer === "ES&S") mfrSlug = "ess";
  else if (lowerManufacturer.includes("dominion")) mfrSlug = "dominion";
  else if (lowerManufacturer.includes("hart intercivic")) mfrSlug = "hart";
  else if (lowerManufacturer.includes("unisyn")) mfrSlug = "unisyn";
  else if (lowerManufacturer.includes("clear ballot")) mfrSlug = "clear-ballot";
  else if (lowerManufacturer.includes("microvote")) mfrSlug = "microvote";
  else if (lowerManufacturer.includes("premier")) mfrSlug = "premier";
  else if (lowerManufacturer.includes("smartmatic")) mfrSlug = "smartmatic";

  const nameSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return `${mfrSlug}-${nameSlug}`.replace(/-+/g, "-");
}

function parseVVSG(text: string): ScrapedSystem["vvsg_version"] {
  if (/vvsg\s*2\.0/i.test(text)) return "2.0";
  if (/vvsg\s*1\.1/i.test(text)) return "1.1";
  if (/vvsg\s*1\.0/i.test(text)) return "1.0";
  return "unknown";
}

function parseStatus(text: string): ScrapedSystem["status"] {
  const t = text.toLowerCase();
  if (t.includes("decertif")) return "decertified";
  if (t.includes("withdrawn")) return "withdrawn";
  if (t.includes("terminat")) return "terminated";
  return "active";
}

function parseDate(text: string): string {
  const cleaned = text.trim();
  if (!cleaned) return "unknown";
  const d = new Date(cleaned);
  return isNaN(d.getTime()) ? "unknown" : d.toISOString().split("T")[0];
}

function cleanText(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function absoluteEacUrl(href: string): string {
  return href.startsWith("http") ? href : `${EAC_BASE}${href}`;
}

function normalizeManufacturer(manufacturer: string): string {
  const normalized = cleanText(manufacturer);
  const lower = normalized.toLowerCase();

  if (lower.includes("election systems") && lower.includes("es&s")) return "ES&S";
  if (lower.includes("dominion voting systems")) return "Dominion Voting Systems";
  if (lower.includes("hart intercivic")) return "Hart InterCivic";
  if (lower.includes("unisyn voting solutions")) return "Unisyn Voting Solutions";
  if (lower.includes("clear ballot")) return "Clear Ballot Group";
  if (lower.includes("microvote")) return "MicroVote General";
  if (lower.includes("premier election solutions")) return "Premier Election Solutions";

  return normalized;
}

function safeAdvisoryUrl(href: string): string | undefined {
  const full = absoluteEacUrl(href);
  try {
    new URL(full);
    return full;
  } catch {
    return undefined;
  }
}

async function fetchPage(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: { "User-Agent": "certmap-scraper/1.0 (certmap.org)" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`);
  return res.text();
}

async function scrapeAdvisories(systemUrl: string): Promise<ScrapedSystem["advisory_notices"]> {
  try {
    const html = await fetchPage(systemUrl);
    const $ = cheerio.load(html);
    const notices: ScrapedSystem["advisory_notices"] = [];

    $(".advisory, .field--name-field-advisory, [class*='advisory']").each((_, el) => {
      const title = $(el).find("h3, h4, .title, a").first().text().trim();
      const dateText = $(el).find(".date, time, [class*='date']").first().text().trim();
      const link = $(el).find("a").first().attr("href");
      if (title) {
        notices.push({
          date: dateText ? parseDate(dateText) : "unknown",
          title,
          url: link ? safeAdvisoryUrl(link) : undefined,
        });
      }
    });

    return notices;
  } catch (err) {
    console.warn(`Advisory scraping failed for ${systemUrl}:`, err instanceof Error ? err.message : String(err));
    return [];
  }
}

async function scrapeEAC(): Promise<ScrapedSystem[]> {
  console.log(`Fetching ${EAC_LIST}`);
  const html = await fetchPage(EAC_LIST);
  const $ = cheerio.load(html);

  const systems: ScrapedSystem[] = [];

  const tableRows = $("table tbody tr").filter((_, el) => {
    return $(el).find("td.views-field-title a").length > 0;
  });

  console.log(`Found ${tableRows.length} table system entries`);

  for (const el of tableRows.toArray()) {
    const $el = $(el);

    const nameEl = $el.find("td.views-field-title a").first();
    const name = cleanText(nameEl.text());
    const href = nameEl.attr("href") ?? "";

    if (!name) continue;

    const systemUrl = absoluteEacUrl(href);
    const manufacturer = normalizeManufacturer($el.find("td.views-field-field-manufacturer").first().text());
    const testingStandard = cleanText($el.find("td.views-field-field-testing-standard").first().text());
    const certDate = cleanText($el.find("td.views-field-field-certification-date").first().text());
    const advisories = href ? await scrapeAdvisories(systemUrl) : [];

    systems.push({
      name,
      manufacturer: manufacturer || "Unknown",
      vvsg_version: parseVVSG(testingStandard),
      cert_date: parseDate(certDate),
      status: "active",
      eac_url: systemUrl,
      advisory_notices: advisories,
    });
  }

  if (systems.length > 0) return systems;

  // Legacy Drupal card rendering, kept as a fallback in case EAC swaps views displays again.
  const rows = $(".views-row, .view-content .node, article.node--type-certified-voting-system");
  console.log(`Found ${rows.length} legacy system entries`);

  for (const el of rows.toArray()) {
    const $el = $(el);

    const nameEl = $el.find("h2 a, h3 a, .views-field-title a, .node__title a").first();
    const name = cleanText(nameEl.text());
    const href = nameEl.attr("href") ?? "";
    const systemUrl = absoluteEacUrl(href);

    if (!name) continue;

    const fullText = $el.text();
    const mfr =
      normalizeManufacturer($el.find(".views-field-field-manufacturer, [class*='manufacturer']").first().text()) ||
      normalizeManufacturer($el.find(".field--name-field-manufacturer").first().text());
    const dateText = $el
      .find(".views-field-field-certification-date, [class*='cert'], time")
      .first()
      .text();
    const statusText = cleanText($el.find(".views-field-field-status, [class*='status']").first().text());

    const advisories = href ? await scrapeAdvisories(systemUrl) : [];

    systems.push({
      name,
      manufacturer: mfr || "Unknown",
      vvsg_version: parseVVSG(fullText),
      cert_date: parseDate(dateText),
      status: parseStatus(statusText),
      eac_url: systemUrl,
      advisory_notices: advisories,
    });
  }

  return systems;
}

function diff(
  current: Record<string, unknown>[],
  scraped: ScrapedSystem[],
): { added: ScrapedSystem[]; changed: ScrapedSystem[]; statusChanged: ScrapedSystem[] } {
  const currentById = Object.fromEntries(current.map((s) => [s.id as string, s]));
  const currentByUrl = Object.fromEntries(current.map((s) => [s.eac_url as string, s]));
  const added: ScrapedSystem[] = [];
  const changed: ScrapedSystem[] = [];
  const statusChanged: ScrapedSystem[] = [];

  for (const s of scraped) {
    const id = slugify(s.name, s.manufacturer);
    const existing = currentById[id] ?? currentByUrl[s.eac_url];
    if (!existing) {
      added.push(s);
    } else {
      if (existing.status !== s.status) statusChanged.push(s);
      if (
        existing.vvsg_version !== s.vvsg_version ||
        (s.advisory_notices.length > 0 &&
          JSON.stringify(existing.advisory_notices) !== JSON.stringify(s.advisory_notices))
      ) {
        changed.push(s);
      }
    }
  }

  return { added, changed, statusChanged };
}

function buildChangeEntry(
  s: ScrapedSystem,
  kind: "certified" | "maintenance" | "advisory" | "decertified" | "revised",
  systemId = slugify(s.name, s.manufacturer),
): Record<string, unknown> {
  const today = new Date().toISOString().split("T")[0];
  const labels: Record<string, string> = {
    certified: `Newly certified VVSG ${s.vvsg_version} · ${today}`,
    maintenance: `Maintenance update · ${today}`,
    advisory: `Advisory notice issued · ${today}`,
    decertified: `Decertified · ${today}`,
    revised: `Status revised · ${today}`,
  };
  return {
    date: today,
    system_id: systemId,
    system_name: s.name,
    kind,
    detail: labels[kind],
  };
}

async function main() {
  const currentSystems = JSON.parse(readFileSync(SYSTEMS_PATH, "utf8")) as Record<string, unknown>[];
  const currentChanges = JSON.parse(readFileSync(CHANGES_PATH, "utf8")) as Record<string, unknown>[];

  let scraped: ScrapedSystem[];
  try {
    scraped = await scrapeEAC();
  } catch (err) {
    console.error("Scrape failed:", err);
    process.exit(1);
  }

  if (scraped.length === 0) {
    console.log("No systems found — EAC page structure may have changed. Aborting to avoid data loss.");
    process.exit(1);
  }

  const { added, changed, statusChanged } = diff(currentSystems, scraped);

  if (added.length === 0 && changed.length === 0 && statusChanged.length === 0) {
    console.log("No changes detected.");
    process.exit(0);
  }

  console.log(`Changes: +${added.length} new, ${changed.length} updated, ${statusChanged.length} status changes`);

  const newChangeEntries: Record<string, unknown>[] = [];
  const findCurrentSystemIndex = (s: ScrapedSystem): number => {
    const id = slugify(s.name, s.manufacturer);
    return currentSystems.findIndex((x) => x.id === id || x.eac_url === s.eac_url);
  };

  for (const s of added) {
    const id = slugify(s.name, s.manufacturer);
    currentSystems.push({ id, slug: id, ...s });
    newChangeEntries.push(buildChangeEntry(s, "certified"));
    console.log(`  + ${s.name} (${s.manufacturer})`);
  }

  for (const s of changed) {
    const idx = findCurrentSystemIndex(s);
    if (idx !== -1) {
      currentSystems[idx] = { ...currentSystems[idx], ...s };
      const kind = s.advisory_notices.length > 0 ? "advisory" : "maintenance";
      newChangeEntries.push(buildChangeEntry(s, kind, currentSystems[idx].id as string));
      console.log(`  ~ ${s.name} (${kind})`);
    }
  }

  for (const s of statusChanged) {
    const idx = findCurrentSystemIndex(s);
    if (idx !== -1) {
      currentSystems[idx] = { ...currentSystems[idx], status: s.status };
      const kind = s.status === "decertified" ? "decertified" : "revised";
      newChangeEntries.push(buildChangeEntry(s, kind, currentSystems[idx].id as string));
      console.log(`  ! ${s.name} → ${s.status}`);
    }
  }

  const updatedChanges = [...newChangeEntries, ...currentChanges].slice(0, 50);

  writeFileSync(SYSTEMS_PATH, JSON.stringify(currentSystems, null, 2) + "\n");
  writeFileSync(CHANGES_PATH, JSON.stringify(updatedChanges, null, 2) + "\n");

  console.log("Written: systems.json, changes.json");
}

main();
