import { AreaId } from "@/lib/types";
import { AREAS } from "@/lib/constants";

type Props = {
  areaId: AreaId;
};

export default function StructuredData({ areaId }: Props) {
  const areaConfig = AREAS[areaId];

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Tokyo FX Rate Comparison",
    alternateName: "東京外貨両替レート比較",
    url: "https://fx-shibuya.vercel.app",
    description:
      "Compare real-time foreign currency exchange rates at money changers across Tokyo. Updated every 15 minutes.",
    inLanguage: ["ja", "en", "zh", "ko"],
  };

  const localBusinesses = areaConfig.shops.map((shop) => ({
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `https://fx-shibuya.vercel.app/#${shop.shopKey}`,
    name: shop.shopKey,
    url: shop.website,
    currenciesAccepted: "JPY,USD,EUR,GBP,AUD,CNY,KRW,HKD,TWD",
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      {localBusinesses.map((biz) => (
        <script
          key={biz["@id"]}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(biz) }}
        />
      ))}
    </>
  );
}
