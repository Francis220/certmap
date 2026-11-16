import type { MetadataRoute } from "next";
import { STATES, SYSTEMS, stateSlug } from "@/lib/data";

const BASE_URL = "https://certmap.vercel.app";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["/", "/about/", "/data/", "/system/"].map((path) => ({
    url: `${BASE_URL}${path}`,
  }));

  const stateRoutes = STATES.map((s) => ({
    url: `${BASE_URL}/state/${stateSlug(s.abbreviation)}/`,
  }));

  const systemRoutes = SYSTEMS.map((s) => ({
    url: `${BASE_URL}/system/${s.slug}/`,
  }));

  return [...staticRoutes, ...stateRoutes, ...systemRoutes];
}
