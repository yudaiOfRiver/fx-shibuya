import { CurrencyCode, MarketRates } from "../types";
import { CURRENCIES } from "../constants";

const MARKET_API_URL = "https://open.er-api.com/v6/latest/JPY";

export async function fetchMarketRates(): Promise<MarketRates> {
  const res = await fetch(MARKET_API_URL, {
    next: { revalidate: 3600 }, // 1時間キャッシュ
  });

  if (!res.ok) {
    throw new Error(`Market rate API returned ${res.status}`);
  }

  const data = await res.json();

  // data.rates は JPYベース (1 JPY = x 外貨)
  // 逆数にして「1外貨 = ○円」に変換
  const rates = {} as Record<CurrencyCode, number>;

  for (const code of CURRENCIES) {
    const jpyToForeign = data.rates[code];
    if (jpyToForeign && jpyToForeign > 0) {
      rates[code] = 1 / jpyToForeign;
    }
  }

  return {
    rates,
    fetchedAt: new Date().toISOString(),
  };
}
