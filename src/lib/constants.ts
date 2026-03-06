import { CurrencyCode, ShopMeta } from "./types";

export const CURRENCIES: CurrencyCode[] = [
  "USD",
  "EUR",
  "GBP",
  "AUD",
  "CNY",
  "KRW",
  "HKD",
  "TWD",
];

export const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  AUD: "A$",
  CNY: "¥",
  KRW: "₩",
  HKD: "HK$",
  TWD: "NT$",
};

export const SHOPS: ShopMeta[] = [
  {
    id: "travelex",
    nameKey: "shops.travelex_shibuya",
    addressKey: "shops.travelex_shibuya.address",
    hoursKey: "shops.travelex_shibuya.hours",
    website: "https://www.travelex.co.jp/",
    mapUrl: "https://maps.google.com/?q=Travelex+渋谷店",
    hasOnlineRates: true,
  },
  {
    id: "world_currency_shop",
    nameKey: "shops.world_currency_shop",
    addressKey: "shops.world_currency_shop.address",
    hoursKey: "shops.world_currency_shop.hours",
    website: "https://www.tokyo-card.co.jp/wcs/",
    mapUrl: "https://maps.google.com/?q=ワールドカレンシーショップ+渋谷",
    hasOnlineRates: true,
  },
  {
    id: "daikokuya",
    nameKey: "shops.daikokuya",
    addressKey: "shops.daikokuya.address",
    hoursKey: "shops.daikokuya.hours",
    website: "https://www.e-daikoku.com/",
    mapUrl: "https://maps.google.com/?q=大黒屋+質渋谷店",
    hasOnlineRates: false,
  },
  {
    id: "shibuya_exchange",
    nameKey: "shops.shibuya_exchange",
    addressKey: "shops.shibuya_exchange.address",
    hoursKey: "shops.shibuya_exchange.hours",
    website: "https://shibuya.exchange/",
    mapUrl: "https://maps.google.com/?q=渋谷エクスチェンジ+宇田川町13-8",
    hasOnlineRates: true,
  },
  {
    id: "sakura_currency",
    nameKey: "shops.sakura_currency",
    addressKey: "shops.sakura_currency.address",
    hoursKey: "shops.sakura_currency.hours",
    website: "https://sakura-currency.co.jp/shibuya/",
    mapUrl: "https://maps.google.com/?q=さくらカレンシーサービス+渋谷センター街",
    hasOnlineRates: false,
  },
  {
    id: "access_ticket",
    nameKey: "shops.access_ticket",
    addressKey: "shops.access_ticket.address",
    hoursKey: "shops.access_ticket.hours",
    website: "https://www.access-ticket.com/",
    mapUrl: "https://maps.google.com/?q=アクセスチケット+渋谷地下街",
    hasOnlineRates: false,
  },
];

// WCS uses these currency codes in their HTML
export const WCS_CURRENCY_MAP: Record<string, CurrencyCode> = {
  USD: "USD",
  EUR: "EUR",
  GBP: "GBP",
  AUD: "AUD",
  CNY: "CNY",
  KRW: "KRW",
  HKD: "HKD",
  TWD: "TWD",
};
