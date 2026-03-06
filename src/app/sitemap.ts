import type { MetadataRoute } from "next";
import { AREA_IDS } from "@/lib/constants";

const BASE_URL = "https://fx-shibuya.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ["ja", "en", "zh", "ko"];

  const entries: MetadataRoute.Sitemap = [];

  // Landing pages
  for (const locale of locales) {
    entries.push({
      url: `${BASE_URL}/${locale}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    });
  }

  // Area pages
  for (const locale of locales) {
    for (const area of AREA_IDS) {
      entries.push({
        url: `${BASE_URL}/${locale}/${area}`,
        lastModified: new Date(),
        changeFrequency: "hourly",
        priority: 0.9,
      });
    }
  }

  return entries;
}
