import { CurrencyCode, CurrencyRate, ShopRates } from "../types";
import { CURRENCIES } from "../constants";

const DOLLAR_RANGER_URL = "https://d-ranger.jp/en/shop/shinjuku/";

// HTML table structure:
// <p class="shoprate-name">US dollar<br>USD</p>
// <td class="cell-buy">182.79<span>yen</span></td>        ← JPY→外貨 (our sell)
// <td class="cell-sell">179.65<span>yen</span></td>       ← 外貨→JPY (our buy)
//
// SOLD OUT case:
// <td class="cell-buy" ...>
//   <p class="soldout-top" ...>SOLD OUT</p>
//   <p class="soldout-bottom">(156.99<span>yen)</span></p>
// </td>
export async function fetchDollarRangerRates(): Promise<ShopRates> {
  const res = await fetch(DOLLAR_RANGER_URL, {
    next: { revalidate: 900 },
  });

  if (!res.ok) {
    throw new Error(`Dollar Ranger returned ${res.status}`);
  }

  const html = await res.text();
  const rates: Partial<Record<CurrencyCode, CurrencyRate>> = {};

  // Match each table row: currency code from shoprate-name, then cell-buy and cell-sell
  const rowPattern = new RegExp(
    '<p class="shoprate-name">[\\s\\S]*?<br[^>]*>\\s*(\\w+)\\s*</p>[\\s\\S]*?<td class="cell-buy"[^>]*>([\\s\\S]*?)</td>\\s*<td class="cell-sell"[^>]*>([\\s\\S]*?)</td>',
    'g'
  );

  let match;
  while ((match = rowPattern.exec(html)) !== null) {
    const code = match[1].trim();
    const buyCell = match[2]; // "BUY (JPY to Foreign)" = our sell
    const sellCell = match[3]; // "SELL (Foreign to JPY)" = our buy

    if (!CURRENCIES.includes(code as CurrencyCode)) continue;

    // Extract rate from cell, handling SOLD OUT
    const sellValue = extractRate(buyCell); // Dollar Ranger "BUY" = our sell
    const buyValue = extractRate(sellCell); // Dollar Ranger "SELL" = our buy

    rates[code as CurrencyCode] = {
      sell: sellValue,
      buy: buyValue,
    };
  }

  return {
    shopId: "dollar_ranger",
    rates,
    fetchedAt: new Date().toISOString(),
  };
}

function extractRate(cellHtml: string): number | null {
  // Check for SOLD OUT
  if (cellHtml.includes("SOLD OUT") || cellHtml.includes("soldout")) {
    return null;
  }
  // Extract number: "182.79<span>yen</span>" or "0.10570<span>yen</span>"
  const numMatch = cellHtml.match(/([\d.]+)\s*<span/);
  if (!numMatch) return null;
  const value = parseFloat(numMatch[1]);
  return !isNaN(value) && value > 0 ? value : null;
}
