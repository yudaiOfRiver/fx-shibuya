import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllRates } from "@/lib/getAllRates";
import { AREAS, AREA_IDS } from "@/lib/constants";
import { AreaId } from "@/lib/types";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LastUpdated from "@/components/LastUpdated";
import RateComparisonTable from "@/components/RateComparisonTable";
import StructuredData from "@/components/StructuredData";

const BASE_URL = "https://fx-shibuya.vercel.app";

export const revalidate = 900;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; area: string }>;
}): Promise<Metadata> {
  const { locale, area } = await params;

  if (!AREA_IDS.includes(area as AreaId)) return {};

  const t = await getTranslations({ locale, namespace: "area" });
  const tMeta = await getTranslations({ locale, namespace: "meta" });

  const areaName = t(area as AreaId);
  const title = `${areaName} ${tMeta("title")}`;
  const description = tMeta("description");
  const url = `${BASE_URL}/${locale}/${area}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        ja: `${BASE_URL}/ja/${area}`,
        en: `${BASE_URL}/en/${area}`,
        zh: `${BASE_URL}/zh/${area}`,
        ko: `${BASE_URL}/ko/${area}`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "Tokyo FX Rate Comparison",
      locale:
        locale === "zh"
          ? "zh_CN"
          : locale === "ko"
            ? "ko_KR"
            : locale === "en"
              ? "en_US"
              : "ja_JP",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function AreaPage({
  params,
}: {
  params: Promise<{ locale: string; area: string }>;
}) {
  const { locale, area } = await params;

  if (!AREA_IDS.includes(area as AreaId)) {
    notFound();
  }

  const areaId = area as AreaId;
  const tHero = await getTranslations({ locale, namespace: "hero" });
  const tArea = await getTranslations({ locale, namespace: "area" });
  const data = await getAllRates();
  const areaConfig = AREAS[areaId];

  return (
    <div className="min-h-screen flex flex-col">
      <StructuredData areaId={areaId} />
      <Header />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6">
        <section className="mb-8 text-center">
          <p className="text-sm font-medium text-cyan-400 mb-1">
            {tHero("realtime")}
          </p>
          <h2 className="text-lg sm:text-xl font-bold text-slate-50">
            {tArea(areaId)}{" "}
            <span className="text-slate-400 font-normal text-base">
              — {tHero("shopCount", { count: areaConfig.shops.length })}
            </span>
          </h2>
        </section>

        <div className="mb-6">
          <LastUpdated generatedAt={data.generatedAt} />
        </div>

        <RateComparisonTable data={data} defaultArea={areaId} />
      </main>

      <Footer />
    </div>
  );
}
