import { CurrencyCode, CurrencyRate, ShopRates } from "../types";
import { CURRENCIES } from "../constants";

const WCS_URL = "https://www.tokyo-card.co.jp/wcs/rate.php";

export async function fetchWorldCurrencyShopRates(): Promise<ShopRates> {
  const res = await fetch(WCS_URL, {
    next: { revalidate: 900 },
  });

  if (!res.ok) {
    throw new Error(`WCS page returned ${res.status}`);
  }

  const html = await res.text();
  const rates: Partial<Record<CurrencyCode, CurrencyRate>> = {};

  for (const code of CURRENCIES) {
    // 実際のHTML形式（動作確認済み）:
    // window.context.rate[ 'USD' ] = { currencyName: 'ドル', ..., sell: { cash: 159.60, tc: 157.60 }, buy: { cash: 153.10, tc: 155.20 }, ... };
    const entryPattern = new RegExp(
      `window\\.context\\.rate\\[\\s*'${code}'\\s*\\]\\s*=[^;]+;`
    );
    const entry = html.match(entryPattern);
    if (!entry) continue;

    const block = entry[0];

    const sellMatch = block.match(/sell\s*:\s*\{\s*cash:\s*([\d.]+)/);
    const buyMatch = block.match(/buy\s*:\s*\{\s*cash:\s*([\d.]+)/);
    const annotationMatch = block.match(/annotationFlg:\s*(\d)/);

    if (sellMatch || buyMatch) {
      let sell = sellMatch ? parseFloat(sellMatch[1]) : null;
      let buy = buyMatch ? parseFloat(buyMatch[1]) : null;

      // annotationFlg: 1 は100単位表示（例: KRW 12.25 = 100ウォンあたり）
      // 1通貨単位に正規化
      if (annotationMatch && annotationMatch[1] === "1") {
        if (sell !== null) sell = sell / 100;
        if (buy !== null) buy = buy / 100;
      }

      // 999.00 は「取扱なし」
      rates[code] = {
        sell: sell !== null && !isNaN(sell) && sell !== 999 && sell !== 9.99 ? sell : null,
        buy: buy !== null && !isNaN(buy) && buy !== 999 && buy !== 9.99 ? buy : null,
      };
    }
  }

  return {
    shopId: "world_currency_shop",
    rates,
    fetchedAt: new Date().toISOString(),
  };
}
