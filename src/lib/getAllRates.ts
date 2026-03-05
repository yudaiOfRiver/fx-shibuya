import { AllRatesData, ShopRates } from "./types";
import { fetchMarketRates } from "./fetchers/marketRate";
import { fetchWorldCurrencyShopRates } from "./fetchers/worldCurrencyShop";
import { fetchTravelexRates } from "./fetchers/travelex";

export async function getAllRates(): Promise<AllRatesData> {
  const [marketResult, wcsResult, travelexResult] = await Promise.allSettled([
    fetchMarketRates(),
    fetchWorldCurrencyShopRates(),
    fetchTravelexRates(),
  ]);

  const market =
    marketResult.status === "fulfilled" ? marketResult.value : null;

  const shops: ShopRates[] = [];

  if (travelexResult.status === "fulfilled") {
    shops.push(travelexResult.value);
  } else {
    shops.push({
      shopId: "travelex",
      rates: {},
      fetchedAt: new Date().toISOString(),
      error: travelexResult.reason?.message || "Failed to fetch",
    });
  }

  if (wcsResult.status === "fulfilled") {
    shops.push(wcsResult.value);
  } else {
    shops.push({
      shopId: "world_currency_shop",
      rates: {},
      fetchedAt: new Date().toISOString(),
      error: wcsResult.reason?.message || "Failed to fetch",
    });
  }

  // 大黒屋はオンラインレート取得不可
  shops.push({
    shopId: "daikokuya",
    rates: {},
    fetchedAt: new Date().toISOString(),
  });

  return {
    market,
    shops,
    generatedAt: new Date().toISOString(),
  };
}
