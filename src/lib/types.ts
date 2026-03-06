export type CurrencyCode = "USD" | "EUR" | "GBP" | "AUD" | "CNY" | "KRW" | "HKD" | "TWD";

// Rate source IDs (data fetchers)
export type ShopId =
  | "travelex"
  | "world_currency_shop"
  | "shibuya_exchange"
  | "jmarket"
  | "interbank"
  | "dollar_ranger";

export type CurrencyRate = {
  sell: number | null; // 外貨を買う（日本円→外貨）：顧客が払う円
  buy: number | null;  // 外貨を売る（外貨→日本円）：顧客が受け取る円
};

export type ShopRates = {
  shopId: ShopId;
  rates: Partial<Record<CurrencyCode, CurrencyRate>>;
  fetchedAt: string; // ISO 8601
  error?: string;
};

export type MarketRates = {
  rates: Record<CurrencyCode, number>; // 1外貨 = ○円
  fetchedAt: string;
};

export type AllRatesData = {
  market: MarketRates | null;
  shops: ShopRates[];
  generatedAt: string;
};

// Area system
export type AreaId = "shibuya" | "shinjuku" | "ikebukuro" | "ueno" | "tokyo_station";

export type AreaShop = {
  shopKey: string;              // i18n key under "shops" namespace
  rateSourceId: ShopId | null;  // null = no online rates
  mapUrl: string;
  website: string;
};

export type AreaConfig = {
  id: AreaId;
  shops: AreaShop[];
};
