# fx-shibuya

渋谷エリアの外貨両替店のレートを一覧で比較できるWebサイト。
訪日外国人・日本人の両方が利用できるよう4言語対応。

**本番URL**: https://fx-shibuya.vercel.app

## 機能

- 渋谷の両替店3店舗のレートをリアルタイム比較
- 市場レートとの乖離率（スプレッド）を色分け表示
- 4言語対応（日本語 / English / 中文 / 한국어）
- 15分間隔の自動更新（ISR）
- モバイルファーストのレスポンシブUI

## 対象店舗

| 店舗 | データ取得方法 | sell | buy |
|------|-------------|------|-----|
| Travelex | REST API (`api.travelex.net`) | ✅ | ❌（API非公開） |
| World Currency Shop | HTMLスクレイピング (`tokyo-card.co.jp`) | ✅ | ✅ |
| 大黒屋 | 取得不可 | — | — |

## 対象通貨

USD, EUR, GBP, AUD, CNY, KRW, HKD, TWD（8通貨）

## 技術スタック

| 技術 | バージョン | 用途 |
|------|-----------|------|
| Next.js | 16.1.6 | フレームワーク（App Router, ISR） |
| TypeScript | 5.x | 型安全 |
| Tailwind CSS | 4.x | スタイリング |
| next-intl | 4.8.x | 多言語対応 |
| Vercel | — | ホスティング |

## 開発

```bash
# 依存関係のインストール
npm install

# 開発サーバー起動
npm run dev

# ビルド
npm run build

# プロダクションサーバー起動
npm start
```

開発サーバー起動後、以下のURLでアクセス:
- http://localhost:3000/ja （日本語）
- http://localhost:3000/en （English）
- http://localhost:3000/zh （中文）
- http://localhost:3000/ko （한국어）

## プロジェクト構成

```
├── messages/                 # 翻訳ファイル (ja/en/zh/ko)
├── middleware.ts              # next-intl ロケールルーティング
├── src/
│   ├── app/
│   │   ├── layout.tsx        # ルートレイアウト
│   │   └── [locale]/
│   │       ├── layout.tsx    # ロケール別レイアウト
│   │       ├── page.tsx      # メインページ (ISR: 15分)
│   │       ├── error.tsx     # エラーバウンダリ
│   │       └── loading.tsx   # ローディング状態
│   ├── components/           # UIコンポーネント
│   ├── lib/
│   │   ├── types.ts          # 型定義
│   │   ├── constants.ts      # 通貨・店舗メタデータ
│   │   ├── spread.ts         # 乖離率計算
│   │   ├── getAllRates.ts    # 全ソース並列取得
│   │   └── fetchers/        # データ取得
│   │       ├── travelex.ts
│   │       ├── worldCurrencyShop.ts
│   │       └── marketRate.ts
│   └── i18n/                 # next-intl設定
├── docs/                     # ドキュメント
│   ├── requirements.md       # 要件定義書
│   └── architecture.md       # アーキテクチャ設計書
└── .claude/agents/           # Claude Code サブエージェント
```
