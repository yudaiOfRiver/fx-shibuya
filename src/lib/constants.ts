import { CurrencyCode, AreaId, AreaConfig } from "./types";

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

export const AREA_IDS: AreaId[] = ["shibuya", "shinjuku", "ikebukuro", "ueno", "tokyo_station"];

export const AREAS: Record<AreaId, AreaConfig> = {
  shibuya: {
    id: "shibuya",
    shops: [
      {
        shopKey: "travelex_shibuya",
        rateSourceId: "travelex",
        mapUrl: "https://maps.google.com/?q=Travelex+渋谷店",
        website: "https://www.travelex.co.jp/",
      },
      {
        shopKey: "wcs_shibuya",
        rateSourceId: "world_currency_shop",
        mapUrl: "https://maps.google.com/?q=ワールドカレンシーショップ+渋谷道玄坂",
        website: "https://www.tokyo-card.co.jp/wcs/",
      },
      {
        shopKey: "shibuya_exchange",
        rateSourceId: "shibuya_exchange",
        mapUrl: "https://maps.google.com/?q=渋谷エクスチェンジ+宇田川町13-8",
        website: "https://shibuya.exchange/",
      },
      {
        shopKey: "daikokuya_shibuya",
        rateSourceId: null,
        mapUrl: "https://maps.google.com/?q=大黒屋+質渋谷店",
        website: "https://www.e-daikoku.com/",
      },
      {
        shopKey: "sakura_currency_shibuya",
        rateSourceId: null,
        mapUrl: "https://maps.google.com/?q=さくらカレンシーサービス+渋谷センター街",
        website: "https://sakura-currency.co.jp/shibuya/",
      },
      {
        shopKey: "access_ticket_shibuya",
        rateSourceId: null,
        mapUrl: "https://maps.google.com/?q=アクセスチケット+渋谷地下街",
        website: "https://www.access-ticket.com/",
      },
    ],
  },
  shinjuku: {
    id: "shinjuku",
    shops: [
      {
        shopKey: "travelex_shinjuku",
        rateSourceId: "travelex",
        mapUrl: "https://maps.google.com/?q=トラベレックス+小田急新宿",
        website: "https://www.travelex.co.jp/",
      },
      {
        shopKey: "wcs_shinjuku",
        rateSourceId: "world_currency_shop",
        mapUrl: "https://maps.google.com/?q=ワールドカレンシーショップ+新宿西口店",
        website: "https://www.tokyo-card.co.jp/wcs/",
      },
      {
        shopKey: "interbank_shinjuku",
        rateSourceId: "interbank",
        mapUrl: "https://maps.google.com/?q=インターバンク+忍者両替+新宿西口",
        website: "https://www.interbank.co.jp/ninja/",
      },
      {
        shopKey: "dollar_ranger_shinjuku",
        rateSourceId: "dollar_ranger",
        mapUrl: "https://maps.google.com/?q=ドルレンジャー+新宿西口店",
        website: "https://d-ranger.jp/",
      },
      {
        shopKey: "sakura_currency_shinjuku",
        rateSourceId: null,
        mapUrl: "https://maps.google.com/?q=さくらカレンシーサービス+新宿",
        website: "https://sakura-currency.co.jp/shinjuku/",
      },
      {
        shopKey: "daikokuya_shinjuku",
        rateSourceId: null,
        mapUrl: "https://maps.google.com/?q=大黒屋+新宿思い出横丁",
        website: "https://gaika.e-daikoku.com/",
      },
    ],
  },
  ikebukuro: {
    id: "ikebukuro",
    shops: [
      {
        shopKey: "travelex_ikebukuro",
        rateSourceId: "travelex",
        mapUrl: "https://maps.google.com/?q=トラベレックス+池袋西口店",
        website: "https://www.travelex.co.jp/",
      },
      {
        shopKey: "jmarket_ikebukuro",
        rateSourceId: "jmarket",
        mapUrl: "https://maps.google.com/?q=Cマーケット+池袋東武ホープセンター",
        website: "https://j-market.co.jp/",
      },
      {
        shopKey: "daikokuya_ikebukuro",
        rateSourceId: null,
        mapUrl: "https://maps.google.com/?q=大黒屋+池袋東口買取センター",
        website: "https://www.e-daikoku.com/",
      },
    ],
  },
  ueno: {
    id: "ueno",
    shops: [
      {
        shopKey: "travelex_ueno",
        rateSourceId: "travelex",
        mapUrl: "https://maps.google.com/?q=トラベレックス+京成上野店",
        website: "https://www.travelex.co.jp/",
      },
      {
        shopKey: "wcs_ueno",
        rateSourceId: "world_currency_shop",
        mapUrl: "https://maps.google.com/?q=ワールドカレンシーショップ+上野マルイ",
        website: "https://www.tokyo-card.co.jp/wcs/",
      },
      {
        shopKey: "daikokuya_ueno",
        rateSourceId: null,
        mapUrl: "https://maps.google.com/?q=大黒屋+上野アメ横店",
        website: "https://gaika.e-daikoku.com/",
      },
      {
        shopKey: "sakura_currency_ueno",
        rateSourceId: null,
        mapUrl: "https://maps.google.com/?q=さくらカレンシーサービス+上野アメ横",
        website: "https://sakura-currency.co.jp/ameyoko/",
      },
    ],
  },
  tokyo_station: {
    id: "tokyo_station",
    shops: [
      {
        shopKey: "travelex_tokyo",
        rateSourceId: "travelex",
        mapUrl: "https://maps.google.com/?q=トラベレックス+東京駅+JR+EAST+Travel+Service+Center",
        website: "https://www.travelex.co.jp/",
      },
      {
        shopKey: "wcs_tokyo",
        rateSourceId: "world_currency_shop",
        mapUrl: "https://maps.google.com/?q=ワールドカレンシーショップ+丸の内店",
        website: "https://www.tokyo-card.co.jp/wcs/",
      },
      {
        shopKey: "jmarket_tokyo",
        rateSourceId: "jmarket",
        mapUrl: "https://maps.google.com/?q=Jマーケット+ヤエチカ+八重洲地下街",
        website: "https://j-market.co.jp/",
      },
      {
        shopKey: "daikokuya_tokyo",
        rateSourceId: null,
        mapUrl: "https://maps.google.com/?q=大黒屋+東京駅前店+八重洲",
        website: "https://gaika.e-daikoku.com/",
      },
    ],
  },
};
