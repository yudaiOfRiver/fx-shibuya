export default function StructuredData() {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Shibuya FX Rate Comparison",
    alternateName: "渋谷外貨両替レート比較",
    url: "https://fx-shibuya.vercel.app",
    description:
      "Compare real-time foreign currency exchange rates at money changers in Shibuya, Tokyo. Updated every 15 minutes.",
    inLanguage: ["ja", "en", "zh", "ko"],
  };

  const localBusinesses = [
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "@id": "https://fx-shibuya.vercel.app/#travelex-shibuya",
      name: "Travelex 渋谷店",
      address: {
        "@type": "PostalAddress",
        streetAddress: "道玄坂2-6-17 渋東シネタワー1F",
        addressLocality: "渋谷区",
        addressRegion: "東京都",
        addressCountry: "JP",
      },
      url: "https://www.travelex.co.jp/",
      openingHours: "Mo-Su 10:30-19:00",
      currenciesAccepted: "JPY,USD,EUR,GBP,AUD,CNY,KRW,HKD,TWD",
    },
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "@id": "https://fx-shibuya.vercel.app/#wcs",
      name: "ワールドカレンシーショップ 渋谷道玄坂店",
      address: {
        "@type": "PostalAddress",
        streetAddress: "道玄坂2-6-1",
        addressLocality: "渋谷区",
        addressRegion: "東京都",
        addressCountry: "JP",
      },
      url: "https://www.tokyo-card.co.jp/wcs/",
      openingHours: ["Mo-Fr 09:30-18:30", "Sa-Su 10:00-17:00"],
      currenciesAccepted: "JPY,USD,EUR,GBP,AUD,CNY,KRW,HKD,TWD",
    },
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "@id": "https://fx-shibuya.vercel.app/#daikokuya",
      name: "大黒屋 質渋谷店",
      address: {
        "@type": "PostalAddress",
        streetAddress: "宇田川町28-3",
        addressLocality: "渋谷区",
        addressRegion: "東京都",
        addressCountry: "JP",
      },
      url: "https://www.e-daikoku.com/",
      openingHours: "Mo-Su 10:00-19:30",
    },
  ];

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
