import { CurrencyCode, CurrencyRate, ShopRates } from "../types";
import { CURRENCIES } from "../constants";

const SHIBUYA_EXCHANGE_URL = "https://shibuya.exchange/";

// ページ内の var rates = { ... }; をパース
// sell_rate = 店舗の販売レート（顧客が外貨を買う時に払う円）→ 我々の sell
// buy_rate = 店舗の買取レート（顧客が外貨を売る時に受け取る円）→ 我々の buy
export async function fetchShibuyaExchangeRates(): Promise<ShopRates> {
  const res = await fetch(SHIBUYA_EXCHANGE_URL, {
    next: { revalidate: 900 },
  });

  if (!res.ok) {
    throw new Error(`Shibuya Exchange returned ${res.status}`);
  }

  const html = await res.text();
  const rates: Partial<Record<CurrencyCode, CurrencyRate>> = {};

  // var rates = { "USD": { ... }, "EUR": { ... }, ... };
  const ratesMatch = html.match(/var\s+rates\s*=\s*(\{[\s\S]*?\});/);
  if (!ratesMatch) {
    throw new Error("Could not find rates data in Shibuya Exchange page");
  }

  let parsed: Record<string, { buy_rate: string; sell_rate: string }>;
  try {
    parsed = JSON.parse(ratesMatch[1]);
  } catch {
    throw new Error("Failed to parse Shibuya Exchange rates JSON");
  }

  for (const code of CURRENCIES) {
    const entry = parsed[code];
    if (!entry) continue;

    const sellRate = parseFloat(entry.sell_rate);
    const buyRate = parseFloat(entry.buy_rate);

    rates[code] = {
      sell: !isNaN(sellRate) && sellRate > 0 ? sellRate : null,
      buy: !isNaN(buyRate) && buyRate > 0 ? buyRate : null,
    };
  }

  return {
    shopId: "shibuya_exchange",
    rates,
    fetchedAt: new Date().toISOString(),
  };
}
