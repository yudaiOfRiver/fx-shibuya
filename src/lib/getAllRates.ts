import { AllRatesData, ShopRates } from "./types";
import { fetchMarketRates } from "./fetchers/marketRate";
import { fetchWorldCurrencyShopRates } from "./fetchers/worldCurrencyShop";
import { fetchTravelexRates } from "./fetchers/travelex";
import { fetchShibuyaExchangeRates } from "./fetchers/shibuyaExchange";

export async function getAllRates(): Promise<AllRatesData> {
  const [marketResult, wcsResult, travelexResult, shibuyaExResult] =
    await Promise.allSettled([
      fetchMarketRates(),
      fetchWorldCurrencyShopRates(),
      fetchTravelexRates(),
      fetchShibuyaExchangeRates(),
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

  if (shibuyaExResult.status === "fulfilled") {
    shops.push(shibuyaExResult.value);
  } else {
    shops.push({
      shopId: "shibuya_exchange",
      rates: {},
      fetchedAt: new Date().toISOString(),
      error: shibuyaExResult.reason?.message || "Failed to fetch",
    });
  }

  // オンラインレート取得不可の店舗
  shops.push({
    shopId: "daikokuya",
    rates: {},
    fetchedAt: new Date().toISOString(),
  });

  shops.push({
    shopId: "sakura_currency",
    rates: {},
    fetchedAt: new Date().toISOString(),
  });

  shops.push({
    shopId: "access_ticket",
    rates: {},
    fetchedAt: new Date().toISOString(),
  });

  return {
    market,
    shops,
    generatedAt: new Date().toISOString(),
  };
}
