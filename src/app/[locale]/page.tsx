import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { AREAS, AREA_IDS } from "@/lib/constants";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const BASE_URL = "https://fx-shibuya.vercel.app";

export const revalidate = 900;

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

export default async function HomePage() {
  const tHero = await getTranslations("hero");
  const tArea = await getTranslations("area");

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6">
        <section className="mb-10 text-center pt-8">
          <p className="text-sm font-medium text-cyan-400 mb-2">
            {tHero("realtime")}
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-50 mb-8">
            {tHero("headline")}
          </h2>

          <p className="text-sm text-slate-400 mb-4">
            {tHero("chooseArea")}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-lg mx-auto">
            {AREA_IDS.map((areaId) => {
              const shopCount = AREAS[areaId].shops.length;
              return (
                <Link
                  key={areaId}
                  href={`/${areaId}`}
                  className="group bg-[#1E293B] border border-slate-700 rounded-xl p-5 hover:border-cyan-400/50 hover:bg-slate-800/80 transition-all"
                >
                  <div className="text-lg font-bold text-slate-50 group-hover:text-cyan-400 transition-colors">
                    {tArea(areaId)}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {tHero("shopCount", { count: shopCount })}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
