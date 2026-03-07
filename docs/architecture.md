# アーキテクチャ設計書

## 1. システム構成

```
+----------------+     +--------------------------------------+
|   ブラウザ       |------>| Vercel (Next.js 16)                  |
|  (ja/en/zh/ko) |<------| ISR: 15分間隔で静的再生成              |
+----------------+     +----------+---------------------------+
                                  | ビルド/リクエスト時にfetch
                  +-------+-------+-------+-------+-------+-------+
                  v       v       v       v       v       v       v
              Travelex   WCS   Shibuya  J-Market  Inter-  Dollar  Exchange
              salt API   HTML  Exchange  HTML     bank    Ranger  Rate API
              (sell)   (sell+buy) (sell+buy) (sell+buy) (sell+buy) (sell+buy) (市場仲値)
```

## 2. 技術スタック

| レイヤー | 技術 | バージョン |
|---------|------|-----------|
| フレームワーク | Next.js (App Router) | 16.1.6 |
| 言語 | TypeScript | 5.x |
| スタイリング | Tailwind CSS | 4.x |
| 多言語 | next-intl | 4.8.x |
| ランタイム | React | 19.2.3 |
| ホスティング | Vercel | Hobby プラン |
| アナリティクス | Vercel Web Analytics | - |

## 3. ディレクトリ構成と責務

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # ルートレイアウト（children パススルー）
│   ├── robots.ts                 # robots.txt 生成
│   ├── sitemap.ts                # sitemap.xml 生成 (4 locale x 5 area + 4 landing)
│   └── [locale]/
│       ├── layout.tsx            # ロケール別レイアウト
│       │                         #   - フォント設定 (Geist Sans)
│       │                         #   - NextIntlClientProvider
│       │                         #   - <html lang={locale}>
│       ├── page.tsx              # ランディングページ (Server Component)
│       │                         #   - エリア選択カードを表示
│       │                         #   - revalidate: 900 (ISR 15分)
│       ├── [area]/
│       │   └── page.tsx          # エリア別レートページ (Server Component)
│       │                         #   - getAllRates() でデータ取得
│       │                         #   - generateMetadata() でエリア名含むSEO
│       │                         #   - AREA_IDS でバリデーション、不正なら notFound()
│       ├── error.tsx             # エラーバウンダリ (Client Component)
│       └── loading.tsx           # ローディングUI
│
├── components/                   # UIコンポーネント
│   ├── Header.tsx                # タイトル + LanguageSwitcher (sticky)
│   ├── Footer.tsx                # 免責事項 + コピーライト
│   ├── LanguageSwitcher.tsx      # 言語切替ボタン群 (Client Component)
│   ├── LastUpdated.tsx           # 最終更新時刻表示 (JST)
│   ├── RateComparisonTable.tsx   # エリア切替タブ + sell/buyピル + 通貨カード群 (Client)
│   ├── CurrencyRow.tsx           # 通貨別カード（ランキング + BEST バッジ + 経路リンク）
│   ├── SpreadBadge.tsx           # 乖離率バッジ（緑/黄/赤）
│   ├── ShopCard.tsx              # 店舗情報カード（住所・営業時間・リンク）
│   └── StructuredData.tsx        # JSON-LD schema.org データ
│
├── lib/                          # ビジネスロジック
│   ├── types.ts                  # 型定義 (CurrencyCode, ShopId, AreaId, AreaConfig 等)
│   ├── constants.ts              # 通貨リスト, AREA_IDS, AREAS (5エリア x 店舗定義)
│   ├── spread.ts                 # 乖離率計算 + レベル判定
│   ├── getAllRates.ts            # 7ソース並列取得オーケストレーター
│   └── fetchers/
│       ├── marketRate.ts         # ExchangeRate-API (revalidate: 3600)
│       ├── travelex.ts           # Travelex salt API (revalidate: 900)
│       ├── worldCurrencyShop.ts  # WCS HTMLスクレイピング (revalidate: 900)
│       ├── shibuyaExchange.ts    # Shibuya Exchange JSパース (revalidate: 900)
│       ├── jmarket.ts            # J-Market HTMLスクレイピング (revalidate: 900)
│       ├── interbank.ts          # Interbank HTMLスクレイピング (revalidate: 900)
│       └── dollarRanger.ts       # Dollar Ranger HTMLスクレイピング (revalidate: 900)
│
└── i18n/                         # 多言語設定
    ├── routing.ts                # ロケール定義 (ja/en/zh/ko)
    ├── request.ts                # getRequestConfig
    └── navigation.ts             # createNavigation (Link, useRouter等)

messages/                         # 翻訳ファイル (4 locale)
├── ja.json                       # 日本語 (23店舗分の名前・住所・営業時間)
├── en.json                       # 英語
├── zh.json                       # 中国語
└── ko.json                       # 韓国語
```

## 4. データフロー

### 4.1 レート取得フロー
```
[locale]/[area]/page.tsx (Server Component)
  └──> getAllRates()
         ├──> Promise.allSettled([
         │      fetchMarketRates(),              // market rate
         │      fetchTravelexRates(),             // shop: travelex
         │      fetchWorldCurrencyShopRates(),    // shop: world_currency_shop
         │      fetchShibuyaExchangeRates(),      // shop: shibuya_exchange
         │      fetchJMarketRates(),              // shop: jmarket
         │      fetchInterbankRates(),            // shop: interbank
         │      fetchDollarRangerRates(),         // shop: dollar_ranger
         │    ])
         └──> AllRatesData { market, shops[6], generatedAt }

RateComparisonTable (Client Component)
  └──> AREAS[areaId].shops  → エリアに属する店舗のみフィルタ
       └──> shop.rateSourceId → AllRatesData.shops から該当レートを取得
       └──> shop.rateSourceId === null → 「店頭確認」表示
```

### 4.2 エリア ↔ レートソースの対応

各エリアの店舗は `rateSourceId` で6つのレートソースのいずれかに紐付くか、`null`（オンラインレートなし）。
同じレートソース（例: Travelex）が複数エリアの異なる店舗に共有される設計。

### 4.3 乖離率計算
```typescript
// sell（顧客が外貨を買う）: 店舗は市場より高い → スプレッド正
spread_sell = (shopRate - marketRate) / marketRate * 100

// buy（顧客が外貨を売る）: 店舗は市場より低い → スプレッド正
spread_buy = (marketRate - shopRate) / marketRate * 100
```

### 4.4 レベル判定
| 乖離率（絶対値） | レベル | 色 |
|-----------------|--------|-----|
| < 2% | good | 緑 (emerald) |
| 2〜4% | normal | 黄 (yellow) |
| > 4% | expensive | 赤 (red) |

## 5. キャッシュ戦略

| データソース | revalidate | 理由 |
|------------|-----------|------|
| 市場レート | 3600秒（1時間） | 仲値は頻繁に変わらない。API無料枠の節約 |
| 店舗レート（6ソース） | 900秒（15分） | 店舗レートは日中に数回変更される |
| ページ全体（ISR） | 900秒（15分） | データソースと同期 |

## 6. 多言語アーキテクチャ

```
middleware.ts
  └──> Accept-Language ヘッダーからロケール判定
  └──> /ja, /en, /zh, /ko にルーティング

[locale]/layout.tsx
  └──> getMessages() で messages/{locale}.json を読み込み
  └──> NextIntlClientProvider に注入

コンポーネント
  └──> useTranslations() / getTranslations() でアクセス
```

## 7. 型システム

```typescript
// レートソース ID (fetcher と 1:1)
type ShopId = "travelex" | "world_currency_shop" | "shibuya_exchange"
             | "jmarket" | "interbank" | "dollar_ranger";

// エリア ID
type AreaId = "shibuya" | "shinjuku" | "ikebukuro" | "ueno" | "tokyo_station";

// エリア内の各店舗定義
type AreaShop = {
  shopKey: string;              // i18n key under "shops" namespace
  rateSourceId: ShopId | null;  // null = no online rates
  mapUrl: string;
  website: string;
};

// エリア設定
type AreaConfig = {
  id: AreaId;
  shops: AreaShop[];
};
```

## 8. エラーハンドリング

| 障害パターン | 挙動 |
|------------|------|
| 1ソースのみ失敗 | 残りのデータで描画。失敗した店舗は「取得不可」表示 |
| 全ソース失敗 | `error.tsx` でエラーページ表示 + リトライボタン |
| レート値が異常（999等） | `null` に変換し「取扱なし」表示 |
| HTMLフォーマット変更 | 正規表現マッチ失敗 → 該当通貨のデータなし |
| 不正なエリアID | `notFound()` で 404 |

## 9. ビルド時の注意事項

- `npm run build` → sandbox モードでは `dangerouslyDisableSandbox: true` が必要（PostCSS）
- tsconfig ES2017 → regex `s` flag 不可、`[\s\S]` + `new RegExp()` で代替
- `generateStaticParams` + next-intl = DYNAMIC_SERVER_USAGE エラー → 使わない（動的ルートのまま ISR）
