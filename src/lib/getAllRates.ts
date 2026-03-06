import { AllRatesData, ShopRates } from "./types";
import { fetchMarketRates } from "./fetchers/marketRate";
import { fetchWorldCurrencyShopRates } from "./fetchers/worldCurrencyShop";
import { fetchTravelexRates } from "./fetchers/travelex";
import { fetchShibuyaExchangeRates } from "./fetchers/shibuyaExchange";
import { fetchJMarketRates } from "./fetchers/jmarket";

export async function getAllRates(): Promise<AllRatesData> {
  const [marketResult, wcsResult, travelexResult, shibuyaExResult, jmarketResult] =
    await Promise.allSettled([
      fetchMarketRates(),
      fetchWorldCurrencyShopRates(),
      fetchTravelexRates(),
      fetchShibuyaExchangeRates(),
      fetchJMarketRates(),
    ]);

  const market =
    marketResult.status === "fulfilled" ? marketResult.value : null;

  const shops: ShopRates[] = [];

  const results: [PromiseSettledResult<ShopRates>, string][] = [
    [travelexResult, "travelex"],
    [wcsResult, "world_currency_shop"],
    [shibuyaExResult, "shibuya_exchange"],
    [jmarketResult, "jmarket"],
  ];

  for (const [result, shopId] of results) {
    if (result.status === "fulfilled") {
      shops.push(result.value);
    } else {
      shops.push({
        shopId: shopId as ShopRates["shopId"],
        rates: {},
        fetchedAt: new Date().toISOString(),
        error: result.reason?.message || "Failed to fetch",
      });
    }
  }

  return {
    market,
    shops,
    generatedAt: new Date().toISOString(),
  };
}
