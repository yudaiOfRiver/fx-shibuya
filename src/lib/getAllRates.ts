import { AllRatesData, ShopRates } from "./types";
import { fetchMarketRates } from "./fetchers/marketRate";
import { fetchWorldCurrencyShopRates } from "./fetchers/worldCurrencyShop";
import { fetchTravelexRates } from "./fetchers/travelex";
import { fetchShibuyaExchangeRates } from "./fetchers/shibuyaExchange";
import { fetchJMarketRates } from "./fetchers/jmarket";
import { fetchInterbankRates } from "./fetchers/interbank";
import { fetchDollarRangerRates } from "./fetchers/dollarRanger";

export async function getAllRates(): Promise<AllRatesData> {
  const [marketResult, ...shopResults] = await Promise.allSettled([
    fetchMarketRates(),
    fetchTravelexRates(),
    fetchWorldCurrencyShopRates(),
    fetchShibuyaExchangeRates(),
    fetchJMarketRates(),
    fetchInterbankRates(),
    fetchDollarRangerRates(),
  ]);

  const market =
    marketResult.status === "fulfilled" ? marketResult.value : null;

  const shopIds: ShopRates["shopId"][] = [
    "travelex",
    "world_currency_shop",
    "shibuya_exchange",
    "jmarket",
    "interbank",
    "dollar_ranger",
  ];

  const shops: ShopRates[] = shopResults.map((result, i) => {
    if (result.status === "fulfilled") {
      return result.value;
    }
    return {
      shopId: shopIds[i],
      rates: {},
      fetchedAt: new Date().toISOString(),
      error: result.reason?.message || "Failed to fetch",
    };
  });

  return {
    market,
    shops,
    generatedAt: new Date().toISOString(),
  };
}
