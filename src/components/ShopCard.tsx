import { useTranslations } from "next-intl";
import { ShopMeta } from "@/lib/types";

type Props = {
  shop: ShopMeta;
};

export default function ShopCard({ shop }: Props) {
  const t = useTranslations("shop");
  const tShops = useTranslations("shops");

  const shopKey = shop.id === "travelex" ? "travelex_shibuya" : shop.id;

  return (
    <div className="bg-[#1E293B] rounded-lg border border-slate-700 p-4">
      <h3 className="font-bold text-slate-50 mb-3">
        {tShops(`${shopKey}.name`)}
      </h3>
      <dl className="space-y-2 text-sm">
        <div className="flex gap-2">
          <dt className="text-slate-500 shrink-0 w-16">{t("address")}</dt>
          <dd className="text-slate-300">{tShops(`${shopKey}.address`)}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="text-slate-500 shrink-0 w-16">{t("hours")}</dt>
          <dd className="text-slate-300">{tShops(`${shopKey}.hours`)}</dd>
        </div>
        <div className="flex gap-3 mt-3">
          <a
            href={shop.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:text-cyan-300 text-sm underline"
          >
            {t("website")}
          </a>
          <a
            href={shop.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:text-cyan-300 text-sm underline"
          >
            {t("map")}
          </a>
        </div>
      </dl>
    </div>
  );
}
