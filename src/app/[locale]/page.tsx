import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { getAllRates } from "@/lib/getAllRates";
import { SHOPS } from "@/lib/constants";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LastUpdated from "@/components/LastUpdated";
import RateComparisonTable from "@/components/RateComparisonTable";
import ShopCard from "@/components/ShopCard";
import StructuredData from "@/components/StructuredData";

const BASE_URL = "https://fx-shibuya.vercel.app";

export const revalidate = 900; // 15分

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  const title = t("title");
  const description = t("description");
  const url = `${BASE_URL}/${locale}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        ja: `${BASE_URL}/ja`,
        en: `${BASE_URL}/en`,
        zh: `${BASE_URL}/zh`,
        ko: `${BASE_URL}/ko`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "Shibuya FX Rate Comparison",
      locale: locale === "zh" ? "zh_CN" : locale === "ko" ? "ko_KR" : locale === "en" ? "en_US" : "ja_JP",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function HomePage() {
  const t = await getTranslations("shop");
  const tHero = await getTranslations("hero");
  const data = await getAllRates();

  return (
    <div className="min-h-screen flex flex-col">
      <StructuredData />
      <Header />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6">
        {/* Hero section */}
        <section className="mb-8 text-center">
          <p className="text-sm font-medium text-cyan-400 mb-1">
            {tHero("realtime")}
          </p>
          <h2 className="text-lg sm:text-xl font-bold text-slate-50">
            {tHero("headline")}
          </h2>
        </section>

        <div className="mb-6">
          <LastUpdated generatedAt={data.generatedAt} />
        </div>

        <RateComparisonTable data={data} />

        <section className="mt-10">
          <h2 className="text-lg font-bold text-slate-50 mb-4">
            {t("info")}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {SHOPS.map((shop) => (
              <ShopCard key={shop.id} shop={shop} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
