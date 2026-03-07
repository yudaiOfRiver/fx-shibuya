# 要件定義書 — 東京 外貨両替レート比較サイト

## 1. 概要

### 1.1 目的
東京主要エリアの外貨両替店のレートを一覧で比較できるWebサイトを提供する。訪日外国人および日本人が、最も有利なレートの店舗を素早く見つけられるようにする。

### 1.2 本番URL
https://fx-shibuya.vercel.app

### 1.3 ターゲットユーザー
- 東京で外貨両替をしたい訪日外国人（英語・中国語・韓国語話者）
- 東京で外貨を購入したい日本人旅行者

---

## 2. 機能要件

### 2.1 レート比較表示
- 対象10通貨のレートを通貨ごとのカードで一覧表示する
- 各カードに市場レート・各店舗のsell/buyレート・乖離率を表示する
- 乖離率は色分けバッジで視覚的に判断可能にする
  - 緑（< 2%）: お得
  - 黄（2〜4%）: 普通
  - 赤（> 4%）: 割高
- 最もお得な店舗にランキング1位 + BEST バッジを表示する

### 2.2 対象通貨
| コード | 通貨名 |
|--------|--------|
| USD | 米ドル |
| EUR | ユーロ |
| GBP | 英ポンド |
| AUD | 豪ドル |
| CNY | 中国元 |
| KRW | 韓国ウォン |
| HKD | 香港ドル |
| TWD | 台湾ドル |
| THB | タイバーツ |
| SGD | シンガポールドル |

### 2.3 対象エリア・店舗

#### エリア一覧（5エリア・23店舗）

| エリア | 店舗数 | オンラインレート取得可能なソース |
|--------|--------|-------------------------------|
| 渋谷 | 6 | Travelex, WCS, Shibuya Exchange |
| 新宿 | 6 | Travelex, WCS, Interbank, Dollar Ranger |
| 池袋 | 3 | Travelex, J-Market |
| 上野 | 4 | Travelex, WCS |
| 東京駅 | 4 | Travelex, WCS, J-Market |

#### レートソース（6ソース）

| ソース | データ取得方式 | 取得可能データ | 備考 |
|--------|-------------|-------------|------|
| Travelex | REST API (`api.travelex.net`) | sell のみ | buy レートはAPI非公開。全国共通レート |
| World Currency Shop (WCS) | HTMLスクレイピング (`tokyo-card.co.jp`) | sell / buy | KRWは100単位表示→1単位に正規化。999=取扱なし |
| Shibuya Exchange | HTMLスクレイピング (`shibuya.exchange`) | sell / buy | JS object (`var rates = {...}`) をパース |
| J-Market | HTMLスクレイピング (`j-market.co.jp/gaika`) | sell / buy | HTML table (`gaikatable__row`) をパース |
| Interbank | HTMLスクレイピング (`interbank.co.jp/ninja/`) | sell / buy | HTML dl/dd 構造をパース |
| Dollar Ranger | HTMLスクレイピング (`d-ranger.jp/en/shop/shinjuku/`) | sell / buy | SOLD OUT 判定あり。英語ページを使用 |

#### オンラインレート非対応の店舗
以下は各エリアに存在するがオンラインでレートを取得できない店舗:
- **大黒屋** — 渋谷・新宿・池袋・上野・東京 (5店舗)
- **さくらカレンシーサービス** — 渋谷・新宿・上野 (3店舗)
- **アクセスチケット** — 渋谷 (1店舗)

これらは「レートは店頭にてご確認ください」と表示し、Google Maps 経路リンクを提供する。

### 2.4 レート用語定義
- **sell（販売レート）**: 顧客が外貨を買う際のレート（日本円 → 外貨）。顧客が支払う円額。
- **buy（買取レート）**: 顧客が外貨を売る際のレート（外貨 → 日本円）。顧客が受け取る円額。
- **乖離率（スプレッド）**: 店舗レートと市場仲値レートの差をパーセントで表したもの。

### 2.5 多言語対応
- 対応言語: 日本語（デフォルト）、英語、中国語（簡体字）、韓国語
- URL構造: `/{locale}` (ランディング) / `/{locale}/{area}` (エリア別レート)
- ブラウザ言語による自動リダイレクト
- 翻訳対象: UI全文、通貨名、エリア名、店舗情報（名前・住所・営業時間）、免責事項

### 2.6 レート更新
- ISR（Incremental Static Regeneration）により15分間隔で自動更新
- 市場レートは1時間キャッシュ
- 最終更新時刻をページ上部に表示（JST）

### 2.7 エラーハンドリング
- 一部データソースが失敗しても残りのデータで描画する（グレースフルデグラデーション）
- 全失敗時はエラーページを表示し、リトライボタンを提供する
- 取得不可の店舗/通貨は「取得不可」または「取扱なし」と表示する

---

## 3. 画面構成

### 3.1 ランディングページ (`/[locale]`)
- エリア選択カード（5エリア）をグリッド表示
- 各カードにエリア名と店舗数を表示
- クリックでエリア別レートページへ遷移

### 3.2 エリア別レートページ (`/[locale]/[area]`)
```
+-------------------------------------+
| Header: タイトル + 言語切替ボタン      |
+-------------------------------------+
| エリア名 — N店舗のレートを比較         |
+-------------------------------------+
| 最終更新時刻                          |
+-------------------------------------+
| [エリア切替タブ] 渋谷 新宿 池袋 ...    |
| [sell/buy 切替ピル] ¥→$ / $→¥        |
+-------------------------------------+
| 通貨カード x 8                        |
|  +-- USD -------------------------+  |
|  | 市場: ¥157.13                  |  |
|  | #1 BEST WCS: ¥155.60 (-1.0%)  |  |
|  | #2 Interbank: ¥157.58 (+0.3%) |  |
|  | #3 Travelex: ¥161.22 (+2.6%)  |  |
|  | 大黒屋: 店頭確認 [経路]         |  |
|  +--------------------------------+  |
+-------------------------------------+
| Footer: 免責事項 + コピーライト       |
+-------------------------------------+
```

---

## 4. 非機能要件

### 4.1 パフォーマンス
- ISRによる静的生成で高速な初期表示
- Turbopackによるビルド最適化

### 4.2 レスポンシブデザイン
- モバイルファースト設計
- ダークフィンテーマ（bg:#0F172A, card:#1E293B, accent:cyan-400, best:emerald-500）

### 4.3 SEO
- `generateMetadata` による動的メタデータ生成（エリア名を含む）
- `hreflang` による多言語ページ相互参照
- `robots.ts` / `sitemap.ts` でクローラー対応（4 locale x 5 area = 20ページ + 4ランディング）
- JSON-LD 構造化データ（WebSite + LocalBusiness）
- Vercel Web Analytics 導入済み

### 4.4 ホスティング
- Vercel（無料Hobbyプラン）
- GitHub連携による自動デプロイ（main ブランチ）

### 4.5 依存サービス
| サービス | 用途 | 費用 | 制限 |
|---------|------|------|------|
| ExchangeRate-API (`open.er-api.com`) | 市場レート | 無料 | 1,500回/月 |
| Travelex salt API | 店舗レート（sell） | 無料（公開API） | レート制限不明 |
| tokyo-card.co.jp | WCS レート | 無料（HTMLスクレイピング） | HTML構造変更リスク |
| shibuya.exchange | 渋谷エクスチェンジ レート | 無料（HTMLスクレイピング） | JS構造変更リスク |
| j-market.co.jp | J-Market レート | 無料（HTMLスクレイピング） | HTML構造変更リスク |
| interbank.co.jp | インターバンク レート | 無料（HTMLスクレイピング） | HTML構造変更リスク |
| d-ranger.jp | ドルレンジャー レート | 無料（HTMLスクレイピング） | HTML構造変更リスク |

---

## 5. データ取得仕様

### 5.1 市場レート（ExchangeRate-API）
- エンドポイント: `GET https://open.er-api.com/v6/latest/JPY`
- レスポンス: JPYベースの為替レート（1 JPY = x 外貨）
- 変換: 逆数をとって「1外貨 = ○円」に変換
- キャッシュ: `revalidate: 3600`（1時間）

### 5.2 Travelex（REST API）
- エンドポイント: `GET https://api.travelex.net/salt/rates/current?key=Travelex&site=%2FJAJP`
- ratesの値は「1外貨 = ○円」の販売レート（sell）
- 買取レート（buy）はAPI非公開のため `null`
- キャッシュ: `revalidate: 900`（15分）

### 5.3 World Currency Shop（HTMLスクレイピング）
- URL: `GET https://www.tokyo-card.co.jp/wcs/rate.php`
- 抽出対象: HTML内の `window.context.rate['通貨コード']` JavaScript変数
- `annotationFlg: 1` の場合（KRW）: 100で割って1通貨単位に正規化
- `999.00` は「取扱なし」として除外
- キャッシュ: `revalidate: 900`

### 5.4 Shibuya Exchange（HTMLスクレイピング）
- URL: `GET https://shibuya.exchange/`
- 抽出対象: `var rates = { "USD": { sell_rate: "...", buy_rate: "..." }, ... };`
- JSON.parse でパース、sell_rate / buy_rate をそれぞれ取得
- キャッシュ: `revalidate: 900`

### 5.5 J-Market（HTMLスクレイピング）
- URL: `GET https://j-market.co.jp/gaika`
- 抽出対象: `<tr class="gaikatable__row">` 内の通貨コード・sell・buy
- キャッシュ: `revalidate: 900`

### 5.6 Interbank（HTMLスクレイピング）
- URL: `GET https://www.interbank.co.jp/ninja/`
- 抽出対象: `<dt>CODE</dt>` → `<dd class="sell">` / `<dd class="buy">` 内の `<p class="rate">`
- キャッシュ: `revalidate: 900`

### 5.7 Dollar Ranger（HTMLスクレイピング）
- URL: `GET https://d-ranger.jp/en/shop/shinjuku/`
- 抽出対象: `shoprate-name` 内の通貨コード → `cell-buy`（= our sell）/ `cell-sell`（= our buy）
- SOLD OUT 判定: `soldout` クラスを検出し `null` に変換
- 注意: Dollar Ranger の BUY/SELL 表記は店舗視点のため、顧客視点と逆
- キャッシュ: `revalidate: 900`

### 5.8 オーケストレーション
- `getAllRates()` で `Promise.allSettled` により7ソース（market + 6 shops）を並列取得
- 一部失敗時: 成功したデータのみで描画、失敗したソースは `error` フィールド付きで返却
- 全失敗時: エラーページ表示

---

## 6. リスクと対策

| リスク | 影響 | 対策 | 現状 |
|--------|------|------|------|
| Travelex APIの仕様変更・停止 | sell レート取得不可 | エラー時は「取得不可」表示 | 稼働中 |
| WCSのHTML構造変更 | sell/buy レート取得不可 | 正規表現を修正 | 稼働中 |
| ExchangeRate-API無料枠超過 | 市場レート取得不可 | 1時間キャッシュで実質消費削減 | 稼働中 |
| 各スクレイピング対象のHTML変更 | 該当ソースのレート取得不可 | グレースフルデグラデーション + 正規表現修正で対応 | 稼働中 |
| Travelex buyレートが非公開 | buy比較で Travelex 表示不可 | sell のみ表示 | 既知の制約 |

---

## 7. 今後の拡張候補

- レート変動の履歴グラフ表示
- プッシュ通知（レートが閾値を下回った場合）
- 追加エリアの対応（成田空港、羽田空港 等）
- マーケティング素材の展開（note記事、Reddit投稿、小紅書等）
