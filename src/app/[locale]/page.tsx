import { getTranslations } from "next-intl/server";
import { getAllRates } from "@/lib/getAllRates";
import { SHOPS } from "@/lib/constants";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LastUpdated from "@/components/LastUpdated";
import RateComparisonTable from "@/components/RateComparisonTable";
import ShopCard from "@/components/ShopCard";

export const revalidate = 900; // 15分

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      languages: {
        ja: "/ja",
        en: "/en",
        zh: "/zh",
        ko: "/ko",
      },
    },
  };
}

export default async function HomePage() {
  const t = await getTranslations("shop");
  const data = await getAllRates();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6">
        <div className="mb-6">
          <LastUpdated generatedAt={data.generatedAt} />
        </div>

        <RateComparisonTable data={data} />

        <section className="mt-10">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
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
