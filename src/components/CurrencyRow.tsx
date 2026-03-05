import { useTranslations } from "next-intl";
import { CurrencyCode, ShopRates, MarketRates } from "@/lib/types";
import { SHOPS, CURRENCY_SYMBOLS } from "@/lib/constants";
import { calculateSpread } from "@/lib/spread";
import SpreadBadge from "./SpreadBadge";

type Props = {
  currency: CurrencyCode;
  market: MarketRates | null;
  shops: ShopRates[];
};

function formatRate(rate: number | null | undefined): string {
  if (rate == null) return "—";
  // KRWは小数点なしの方が見やすい（100単位表示）
  if (rate < 1) return rate.toFixed(4);
  if (rate < 10) return rate.toFixed(2);
  return rate.toFixed(2);
}

export default function CurrencyRow({ currency, market, shops }: Props) {
  const t = useTranslations("table");
  const tCurrency = useTranslations("currency");
  const tShops = useTranslations("shops");

  const marketRate = market?.rates[currency] ?? null;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Currency header */}
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900">
              {CURRENCY_SYMBOLS[currency]} {currency}
            </span>
            <span className="text-sm text-gray-500">
              {tCurrency(currency)}
            </span>
          </div>
          {marketRate != null && (
            <div className="text-right">
              <span className="text-xs text-gray-400">{t("marketRate")}</span>
              <span className="ml-2 text-sm font-mono font-semibold text-gray-700">
                ¥{formatRate(marketRate)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Rates table */}
      <div className="divide-y divide-gray-100">
        {/* Table header - hidden on small screens, shown on md+ */}
        <div className="hidden sm:grid sm:grid-cols-4 gap-2 px-4 py-2 text-xs text-gray-400 font-medium">
          <div>{t("shop")}</div>
          <div className="text-right">
            {t("sell")}
            <span className="block text-[10px] font-normal">
              {t("sellDescription")}
            </span>
          </div>
          <div className="text-right">
            {t("buy")}
            <span className="block text-[10px] font-normal">
              {t("buyDescription")}
            </span>
          </div>
          <div className="text-right">{t("spread")}</div>
        </div>

        {shops.map((shop) => {
          const shopMeta = SHOPS.find((s) => s.id === shop.shopId);
          if (!shopMeta) return null;

          const rate = shop.rates[currency];
          const hasError = !!shop.error;
          const isNoOnlineRate = !shopMeta.hasOnlineRates;

          // Determine shop name key
          let shopNameKey: string;
          switch (shop.shopId) {
            case "travelex":
              shopNameKey = "travelex_shibuya";
              break;
            case "world_currency_shop":
              shopNameKey = "world_currency_shop";
              break;
            case "daikokuya":
              shopNameKey = "daikokuya";
              break;
            default:
              shopNameKey = shop.shopId;
          }

          if (isNoOnlineRate) {
            return (
              <div
                key={shop.shopId}
                className="grid grid-cols-1 sm:grid-cols-4 gap-1 sm:gap-2 px-4 py-3 items-center"
              >
                <div className="font-medium text-sm text-gray-700">
                  {tShops(`${shopNameKey}.name`)}
                </div>
                <div className="sm:col-span-3 text-sm text-gray-400 italic">
                  {t("checkInStore")}
                </div>
              </div>
            );
          }

          if (hasError || !rate) {
            return (
              <div
                key={shop.shopId}
                className="grid grid-cols-1 sm:grid-cols-4 gap-1 sm:gap-2 px-4 py-3 items-center"
              >
                <div className="font-medium text-sm text-gray-700">
                  {tShops(`${shopNameKey}.name`)}
                </div>
                <div className="sm:col-span-3 text-sm text-gray-400 italic">
                  {t("unavailable")}
                </div>
              </div>
            );
          }

          const sellSpread =
            rate.sell != null && marketRate != null
              ? calculateSpread(rate.sell, marketRate, "sell")
              : null;
          const buySpread =
            rate.buy != null && marketRate != null
              ? calculateSpread(rate.buy, marketRate, "buy")
              : null;

          return (
            <div
              key={shop.shopId}
              className="grid grid-cols-1 sm:grid-cols-4 gap-1 sm:gap-2 px-4 py-3 items-center"
            >
              <div className="font-medium text-sm text-gray-700">
                {tShops(`${shopNameKey}.name`)}
              </div>

              {/* Sell rate */}
              <div className="flex justify-between sm:block sm:text-right">
                <span className="text-xs text-gray-400 sm:hidden">
                  {t("sell")}:
                </span>
                <div>
                  <span className="font-mono text-sm">
                    {rate.sell != null ? `¥${formatRate(rate.sell)}` : t("noHandling")}
                  </span>
                </div>
              </div>

              {/* Buy rate */}
              <div className="flex justify-between sm:block sm:text-right">
                <span className="text-xs text-gray-400 sm:hidden">
                  {t("buy")}:
                </span>
                <div>
                  <span className="font-mono text-sm">
                    {rate.buy != null ? `¥${formatRate(rate.buy)}` : t("noHandling")}
                  </span>
                </div>
              </div>

              {/* Spread */}
              <div className="flex justify-between sm:block sm:text-right mt-1 sm:mt-0">
                <span className="text-xs text-gray-400 sm:hidden">
                  {t("spread")}:
                </span>
                <div className="flex flex-wrap gap-1 justify-end">
                  {sellSpread != null && <SpreadBadge spreadPercent={sellSpread} />}
                  {buySpread != null && <SpreadBadge spreadPercent={buySpread} />}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
