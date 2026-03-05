import { useTranslations } from "next-intl";
import { ShopMeta } from "@/lib/types";

type Props = {
  shop: ShopMeta;
};

export default function ShopCard({ shop }: Props) {
  const t = useTranslations("shop");
  const tShops = useTranslations("shops");

  // Extract the shop key name from the nameKey
  let shopKey: string;
  switch (shop.id) {
    case "travelex":
      shopKey = "travelex_shibuya";
      break;
    case "world_currency_shop":
      shopKey = "world_currency_shop";
      break;
    case "daikokuya":
      shopKey = "daikokuya";
      break;
    default:
      shopKey = shop.id;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <h3 className="font-bold text-gray-900 mb-3">
        {tShops(`${shopKey}.name`)}
      </h3>
      <dl className="space-y-2 text-sm">
        <div className="flex gap-2">
          <dt className="text-gray-500 shrink-0 w-16">{t("address")}</dt>
          <dd className="text-gray-700">{tShops(`${shopKey}.address`)}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="text-gray-500 shrink-0 w-16">{t("hours")}</dt>
          <dd className="text-gray-700">{tShops(`${shopKey}.hours`)}</dd>
        </div>
        <div className="flex gap-3 mt-3">
          <a
            href={shop.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 text-sm underline"
          >
            {t("website")}
          </a>
          <a
            href={shop.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 text-sm underline"
          >
            {t("map")}
          </a>
        </div>
      </dl>
    </div>
  );
}
