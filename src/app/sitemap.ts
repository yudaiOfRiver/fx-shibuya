import type { MetadataRoute } from "next";

const BASE_URL = "https://fx-shibuya.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ["ja", "en", "zh", "ko"];

  return locales.map((locale) => ({
    url: `${BASE_URL}/${locale}`,
    lastModified: new Date(),
    changeFrequency: "hourly",
    priority: 1.0,
  }));
}
