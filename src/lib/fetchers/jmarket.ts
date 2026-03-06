import { CurrencyCode, CurrencyRate, ShopRates } from "../types";
import { CURRENCIES } from "../constants";

const JMARKET_URL = "https://j-market.co.jp/gaika";

// HTML table format:
// <tr class="gaikatable__row">
//   <td><img ...></td>
//   <td>USD</td>
//   <td>アメリカドル</td>
//   <td>159.36</td>   ← sell (円→外貨)
//   <td>150.66</td>   ← buy (外貨→円)
// </tr>
export async function fetchJMarketRates(): Promise<ShopRates> {
  const res = await fetch(JMARKET_URL, {
    next: { revalidate: 900 },
  });

  if (!res.ok) {
    throw new Error(`J-Market returned ${res.status}`);
  }

  const html = await res.text();
  const rates: Partial<Record<CurrencyCode, CurrencyRate>> = {};

  const rowPattern = new RegExp(
    '<tr\\s+class="gaikatable__row">\\s*<td>[\\s\\S]*?<\\/td>\\s*<td>(\\w+)<\\/td>\\s*<td>[\\s\\S]*?<\\/td>\\s*<td>([\\d.]+)<\\/td>\\s*<td>([\\d.]+)<\\/td>\\s*<\\/tr>',
    'g'
  );

  let match;
  while ((match = rowPattern.exec(html)) !== null) {
    const code = match[1] as string;
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
    shopId: "jmarket",
    rates,
    fetchedAt: new Date().toISOString(),
  };
}
