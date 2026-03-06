import { CurrencyCode, CurrencyRate, ShopRates } from "../types";
import { CURRENCIES } from "../constants";

const INTERBANK_URL = "https://www.interbank.co.jp/ninja/";

// HTML structure (ninja page):
// <dt>USD</dt>
// <dd class="sell">
//   <p class="rate">157.58</p>
//   <p class="ttl">we sell</p>
// </dd>
// <dd class="buy">
//   <p class="rate">155.25</p>
//   <p class="ttl">we buy</p>
// </dd>
export async function fetchInterbankRates(): Promise<ShopRates> {
  const res = await fetch(INTERBANK_URL, {
    next: { revalidate: 900 },
  });

  if (!res.ok) {
    throw new Error(`Interbank returned ${res.status}`);
  }

  const html = await res.text();
  const rates: Partial<Record<CurrencyCode, CurrencyRate>> = {};

  // Match: <dt>CODE</dt> ... <dd class="sell"> ... <p class="rate">VALUE</p> ... <dd class="buy"> ... <p class="rate">VALUE</p>
  const pattern = new RegExp(
    '<dt>\\s*(\\w+)\\s*</dt>\\s*<dd class="sell">\\s*<p class="rate">\\s*([\\d.]+)\\s*</p>[\\s\\S]*?<dd class="buy">\\s*<p class="rate">\\s*([\\d.]+)\\s*</p>',
    'g'
  );

  let match;
  while ((match = pattern.exec(html)) !== null) {
    const code = match[1].trim();
    const sellValue = parseFloat(match[2]);
    const buyValue = parseFloat(match[3]);

    if (CURRENCIES.includes(code as CurrencyCode)) {
      rates[code as CurrencyCode] = {
        sell: !isNaN(sellValue) && sellValue > 0 ? sellValue : null,
        buy: !isNaN(buyValue) && buyValue > 0 ? buyValue : null,
      };
    }
  }

  return {
    shopId: "interbank",
    rates,
    fetchedAt: new Date().toISOString(),
  };
}
