/**
 * 乖離率を計算する
 * sell（顧客が外貨を買う）の場合: 店舗レートが市場レートより高い → 顧客に不利
 * buy（顧客が外貨を売る）の場合: 店舗レートが市場レートより低い → 顧客に不利
 */
export function calculateSpread(
  shopRate: number,
  marketRate: number,
  type: "sell" | "buy"
): number {
  if (marketRate === 0) return 0;

  if (type === "sell") {
    // sell: 店舗は市場より高い値段で外貨を売る（顧客が買う）
    return ((shopRate - marketRate) / marketRate) * 100;
  } else {
    // buy: 店舗は市場より低い値段で外貨を買う（顧客が売る）
    return ((marketRate - shopRate) / marketRate) * 100;
  }
}

export type SpreadLevel = "good" | "normal" | "expensive";

export function getSpreadLevel(spreadPercent: number): SpreadLevel {
  const abs = Math.abs(spreadPercent);
  if (abs < 2) return "good";
  if (abs < 4) return "normal";
  return "expensive";
}
