import { CurrencyCode, CurrencyRate, ShopRates } from "../types";
import { CURRENCIES } from "../constants";

// 実際に動作確認済みのAPI
// レスポンス: { foreignCurrencyAsBase: true, rates: { USD: 161.22, EUR: 188.18, ... }, lastModified: "..." }
// rates は「1外貨 = ○円」の販売レート(sell)。買取レート(buy)はAPI非公開。
const TRAVELEX_API_URL =
  "https://api.travelex.net/salt/rates/current?key=Travelex&site=%2FJAJP";

export async function fetchTravelexRates(): Promise<ShopRates> {
  const res = await fetch(TRAVELEX_API_URL, {
    next: { revalidate: 900 },
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    throw new Error(`Travelex API returned ${res.status}`);
  }

  const data = await res.json();
  const rates: Partial<Record<CurrencyCode, CurrencyRate>> = {};

  if (data.rates && typeof data.rates === "object") {
    for (const code of CURRENCIES) {
      const sellRate = data.rates[code];
      if (typeof sellRate === "number" && sellRate > 0) {
        rates[code] = {
          sell: sellRate,
          buy: null, // 買取レートはAPI非公開
        };
      }
    }
  }

  return {
    shopId: "travelex",
    rates,
    fetchedAt: new Date().toISOString(),
  };
}
