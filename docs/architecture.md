# アーキテクチャ設計書

## 1. システム構成

```
┌──────────────┐     ┌──────────────────────────────┐
│   ブラウザ     │────▶│ Vercel (Next.js 16)          │
│  (ja/en/zh/ko)│◀────│  ISR: 15分間隔で静的再生成      │
└──────────────┘     └──────────┬───────────────────┘
                                │ ビルド/リクエスト時にfetch
                    ┌───────────┼───────────────┐
                    ▼           ▼               ▼
             ┌────────────┐ ┌──────────┐ ┌──────────────┐
             │ Travelex   │ │ WCS      │ │ ExchangeRate │
             │ salt API   │ │ HTML     │ │ API          │
             │ (sell のみ) │ │ (sell+buy)│ │ (市場仲値)    │
             └────────────┘ └──────────┘ └──────────────┘
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

## 3. ディレクトリ構成と責務

```
src/
├── app/                      # Next.js App Router
│   ├── layout.tsx            # ルートレイアウト（children パススルー）
│   └── [locale]/
│       ├── layout.tsx        # ロケール別レイアウト
│       │                     #   - フォント設定 (Geist Sans)
│       │                     #   - NextIntlClientProvider
│       │                     #   - <html lang={locale}>
│       ├── page.tsx          # メインページ (Server Component)
│       │                     #   - revalidate: 900 (ISR 15分)
│       │                     #   - getAllRates() でデータ取得
│       │                     #   - generateMetadata() でSEO
│       ├── error.tsx         # エラーバウンダリ (Client Component)
│       └── loading.tsx       # ローディングUI
│
├── components/               # UIコンポーネント
│   ├── Header.tsx            # タイトル + LanguageSwitcher
│   ├── Footer.tsx            # 免責事項
│   ├── LanguageSwitcher.tsx  # 言語切替ボタン群 (Client Component)
│   ├── LastUpdated.tsx       # 最終更新時刻表示
│   ├── RateComparisonTable.tsx # 8通貨カードのコンテナ
│   ├── CurrencyRow.tsx       # 通貨別カード（市場レート・各店舗レート・乖離率）
│   ├── SpreadBadge.tsx       # 乖離率バッジ（緑/黄/赤）
│   └── ShopCard.tsx          # 店舗情報カード
│
├── lib/                      # ビジネスロジック
│   ├── types.ts              # 型定義
│   ├── constants.ts          # 通貨リスト、店舗メタデータ
│   ├── spread.ts             # 乖離率計算 + レベル判定
│   ├── getAllRates.ts        # 並列取得オーケストレーター
│   └── fetchers/
│       ├── marketRate.ts     # ExchangeRate-API (revalidate: 3600)
│       ├── travelex.ts       # Travelex salt API (revalidate: 900)
│       └── worldCurrencyShop.ts # WCS HTMLスクレイピング (revalidate: 900)
│
└── i18n/                     # 多言語設定
    ├── routing.ts            # ロケール定義 (ja/en/zh/ko)
    ├── request.ts            # getRequestConfig
    └── navigation.ts         # createNavigation (Link, useRouter等)
```

## 4. データフロー

### 4.1 レート取得フロー
```
page.tsx (Server Component)
  └─▶ getAllRates()
        ├─▶ Promise.allSettled([
        │     fetchMarketRates(),       // open.er-api.com → 1/rate で円換算
        │     fetchTravelexRates(),     // api.travelex.net → sell のみ
        │     fetchWorldCurrencyShopRates() // HTML → regex → sell+buy
        │   ])
        └─▶ AllRatesData { market, shops[], generatedAt }
```

### 4.2 乖離率計算
```typescript
// sell（顧客が外貨を買う）: 店舗は市場より高い → スプレッド正
spread_sell = (shopRate - marketRate) / marketRate * 100

// buy（顧客が外貨を売る）: 店舗は市場より低い → スプレッド正
spread_buy = (marketRate - shopRate) / marketRate * 100
```

### 4.3 レベル判定
| 乖離率（絶対値） | レベル | 色 |
|-----------------|--------|-----|
| < 2% | good | 緑 |
| 2〜4% | normal | 黄 |
| > 4% | expensive | 赤 |

## 5. キャッシュ戦略

| データソース | revalidate | 理由 |
|------------|-----------|------|
| 市場レート | 3600秒（1時間） | 仲値は頻繁に変わらない。API無料枠の節約 |
| Travelex | 900秒（15分） | 店舗レートは日中に数回変更される |
| WCS | 900秒（15分） | 同上 |
| ページ全体（ISR） | 900秒（15分） | データソースと同期 |

## 6. 多言語アーキテクチャ

```
middleware.ts
  └─▶ Accept-Language ヘッダーからロケール判定
  └─▶ /ja, /en, /zh, /ko にルーティング

[locale]/layout.tsx
  └─▶ getMessages() で messages/{locale}.json を読み込み
  └─▶ NextIntlClientProvider に注入

コンポーネント
  └─▶ useTranslations() / getTranslations() でアクセス
```

## 7. WCSスクレイピング仕様

### HTML内のデータ形式
```javascript
window.context.rate[ 'USD' ] = {
  currencyName: 'ドル',
  annotationFlg: 0,        // 0: 1通貨単位, 1: 100通貨単位
  countryName: 'アメリカ',
  sell: { cash: 159.60, tc: 157.60 },
  buy: { cash: 153.10, tc: 155.20 },
  currencyNameEnglish: 'U.S Dollar'
};
```

### パース手順
1. `window.context.rate[ '{CODE}' ] = ...;` を正規表現で抽出
2. `sell: { cash: (数値) }` と `buy: { cash: (数値) }` を取得
3. `annotationFlg: 1` の場合 → 値を100で割って1通貨単位に正規化
4. `999.00` → 取扱なしとして `null` に変換

### 現在のannotationFlg状況
- KRW のみ `annotationFlg: 1`（100ウォン単位表示）
- 他の7通貨はすべて `0`（1通貨単位）

## 8. エラーハンドリング

| 障害パターン | 挙動 |
|------------|------|
| 1ソースのみ失敗 | 残りのデータで描画。失敗した店舗は「取得不可」表示 |
| 全ソース失敗 | `error.tsx` でエラーページ表示 + リトライボタン |
| レート値が異常（999等） | `null` に変換し「取扱なし」表示 |
| HTMLフォーマット変更 | 正規表現マッチ失敗 → 該当通貨のデータなし |
