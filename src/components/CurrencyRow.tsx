import { useTranslations } from "next-intl";
import { CurrencyCode, ShopRates, MarketRates } from "@/lib/types";
import { SHOPS, CURRENCY_SYMBOLS } from "@/lib/constants";
import { calculateSpread } from "@/lib/spread";
import SpreadBadge from "./SpreadBadge";
import type { ActiveTab } from "./RateComparisonTable";

type Props = {
  currency: CurrencyCode;
  market: MarketRates | null;
  shops: ShopRates[];
  activeTab: ActiveTab;
};

function formatRate(rate: number | null | undefined): string {
  if (rate == null) return "—";
  if (rate < 1) return rate.toFixed(4);
  if (rate < 10) return rate.toFixed(2);
  return rate.toFixed(2);
}

function getShopNameKey(shopId: string): string {
  switch (shopId) {
    case "travelex":
      return "travelex_shibuya";
    case "world_currency_shop":
      return "world_currency_shop";
    case "daikokuya":
      return "daikokuya";
    default:
      return shopId;
  }
}

type RankedShop = {
  shopId: string;
  shopNameKey: string;
  rate: number | null;
  spread: number | null;
  status: "ranked" | "no_handling" | "check_in_store" | "unavailable";
  rank: number | null;
};

export default function CurrencyRow({ currency, market, shops, activeTab }: Props) {
  const t = useTranslations("table");
  const tCurrency = useTranslations("currency");
  const tShops = useTranslations("shops");
  const tRanking = useTranslations("ranking");

  const marketRate = market?.rates[currency] ?? null;

  // Build ranked list
  const ranked: RankedShop[] = shops.map((shop) => {
    const shopMeta = SHOPS.find((s) => s.id === shop.shopId);
    const shopNameKey = getShopNameKey(shop.shopId);

    if (!shopMeta) {
      return { shopId: shop.shopId, shopNameKey, rate: null, spread: null, status: "unavailable" as const, rank: null };
    }

    // No online rates (e.g. daikokuya)
    if (!shopMeta.hasOnlineRates) {
      return { shopId: shop.shopId, shopNameKey, rate: null, spread: null, status: "check_in_store" as const, rank: null };
    }

    // Error fetching
    if (shop.error || !shop.rates[currency]) {
      return { shopId: shop.shopId, shopNameKey, rate: null, spread: null, status: "unavailable" as const, rank: null };
    }

    const currencyRate = shop.rates[currency]!;
    const rateValue = activeTab === "sell" ? currencyRate.sell : currencyRate.buy;

    if (rateValue == null) {
      return { shopId: shop.shopId, shopNameKey, rate: null, spread: null, status: "no_handling" as const, rank: null };
    }

    const spread = marketRate != null ? calculateSpread(rateValue, marketRate, activeTab) : null;

    return { shopId: shop.shopId, shopNameKey, rate: rateValue, spread, status: "ranked" as const, rank: null };
  });

  // Sort: ranked shops first (sell=ascending, buy=descending), then no_handling, then check_in_store/unavailable
  const statusOrder = { ranked: 0, no_handling: 1, unavailable: 2, check_in_store: 3 };
  ranked.sort((a, b) => {
    if (a.status !== b.status) return statusOrder[a.status] - statusOrder[b.status];
    if (a.status === "ranked" && b.status === "ranked" && a.rate != null && b.rate != null) {
      return activeTab === "sell" ? a.rate - b.rate : b.rate - a.rate;
    }
    return 0;
  });

  // Assign ranks to ranked shops
  let rankCounter = 1;
  for (const item of ranked) {
    if (item.status === "ranked") {
      item.rank = rankCounter++;
    }
  }

  return (
    <div className="bg-[#1E293B] rounded-lg border border-slate-700 overflow-hidden">
      {/* Currency header */}
      <div className="bg-slate-800/50 px-4 py-3 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-slate-50">
              {CURRENCY_SYMBOLS[currency]} {currency}
            </span>
            <span className="text-sm text-slate-400">
              {tCurrency(currency)}
            </span>
          </div>
          {marketRate != null && (
            <div className="text-right">
              <span className="text-xs text-slate-500">{t("marketRate")}</span>
              <span className="ml-2 text-sm font-mono font-semibold text-slate-300">
                ¥{formatRate(marketRate)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Ranked rows */}
      <div className="divide-y divide-slate-700/50">
        {ranked.map((item) => {
          const isBest = item.rank === 1;

          if (item.status === "check_in_store") {
            return (
              <div
                key={item.shopId}
                className="flex items-center justify-between px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-mono text-slate-600 w-8">—</span>
                  <span className="text-sm text-slate-500">
                    {tShops(`${item.shopNameKey}.name`)}
                  </span>
                </div>
                <span className="text-sm text-slate-500 italic">
                  {tRanking("checkInStore")}
                </span>
              </div>
            );
          }

          if (item.status === "no_handling" || item.status === "unavailable") {
            return (
              <div
                key={item.shopId}
                className="flex items-center justify-between px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-mono text-slate-600 w-8">—</span>
                  <span className="text-sm text-slate-500">
                    {tShops(`${item.shopNameKey}.name`)}
                  </span>
                </div>
                <span className="text-sm text-slate-500 italic">
                  {tRanking("noHandling")}
                </span>
              </div>
            );
          }

          // Ranked shop
          return (
            <div
              key={item.shopId}
              className={`px-4 py-3 ${
                isBest ? "bg-emerald-500/10" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className={`text-sm font-mono font-bold w-8 ${
                      isBest ? "text-emerald-400" : "text-slate-400"
                    }`}
                  >
                    #{item.rank}
                  </span>
                  <span
                    className={`text-sm font-medium ${
                      isBest ? "text-emerald-300" : "text-slate-200"
                    }`}
                  >
                    {tShops(`${item.shopNameKey}.name`)}
                  </span>
                  {isBest && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-400 rounded">
                      {tRanking("best")}
                    </span>
                  )}
                </div>
                <span
                  className={`text-sm font-mono font-semibold ${
                    isBest ? "text-emerald-300" : "text-slate-200"
                  }`}
                >
                  ¥{formatRate(item.rate)}
                </span>
              </div>
              {item.spread != null && (
                <div className="mt-1 ml-11">
                  <SpreadBadge spreadPercent={item.spread} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
