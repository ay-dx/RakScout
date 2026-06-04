/**
 * MLB-style Analytics - WAR, ISO, FIP calculations
 * All logic moved from backend/indicators.py
 */
import type { Item } from '../types';

// ─── WAR (Wins Above Replacement) ───────────────────────────────────────
export function calcWar(reviewCount: number, itemPrice: number, reviewAverage: number): number {
  const base = (Math.log10(reviewCount + 1) * 5000) / Math.max(itemPrice, 1);
  const exponent = Math.pow(reviewAverage / 5.0, 3);
  const raw = base * exponent * 10;
  return Math.min(Math.round(raw * 10) / 10, 10.0);
}

// ─── ISO (Isolated Power) ───────────────────────────────────────────────
export function calcIso(reviewAverage: number, reviewCount: number): string {
  const raw = (Math.pow(reviewAverage, 2)) / Math.log2(reviewCount + 2);
  const capped = Math.min(raw, 0.350);
  const formatted = capped.toFixed(3);
  return formatted.startsWith('0.') ? formatted.slice(1) : formatted;
}

// ─── FIP (Fielding Independent Pitching) ───────────────────────────────
function calcShopPower(reviewCount: number, reviewAverage: number): number {
  return Math.log2(reviewCount + 1) * (reviewAverage / 5.0);
}

function calcItemDeviation(itemPrice: number, avgPrice: number): number {
  if (avgPrice <= 0) return 1.0;
  const ratio = itemPrice / avgPrice;
  return 1.0 / (1.0 + Math.abs(Math.log2(ratio)));
}

function percentile(scores: number[], value: number): number {
  const sorted = [...scores].sort((a, b) => a - b);
  const rank = sorted.filter(s => s <= value).length;
  return (rank / sorted.length) * 100;
}

function reverseMapToFipScale(pct: number): { value: number; label: string } {
  const fipRaw = 5.50 - (pct / 100) * 3.50;
  const fip = Math.round(fipRaw * 100) / 100;
  let label: string;
  if (fip <= 2.50) label = 'elite';
  else if (fip <= 3.00) label = 'good';
  else if (fip <= 3.50) label = 'average';
  else if (fip <= 4.00) label = 'below avg';
  else label = 'concern';
  return { value: fip, label };
}

export function calculateFip(items: Item[]): { fip_value: number; fip_label: string; fip_pct: number } {
  if (!items.length) return { fip_value: 5.50, fip_label: 'concern', fip_pct: 0 };

  const prices = items.map(i => i.itemPrice).filter(p => p > 0);
  const avgPrice = prices.length ? prices.reduce((a, b) => a + b, 0) / prices.length : 1;

  const rawScores = items.map(item => {
    const sp = calcShopPower(item.reviewCount, item.reviewAverage);
    const dev = calcItemDeviation(item.itemPrice, avgPrice);
    return sp * dev;
  });

  // Apply FIP to all items based on percentile ranking
  const result = items.map(item => {
    const idx = items.indexOf(item);
    const pct = percentile(rawScores, rawScores[idx]);
    return reverseMapToFipScale(pct);
  });

  return {
    fip_value: result[0].value,
    fip_label: result[0].label,
    fip_pct: Math.round(percentile(rawScores, rawScores[0]) * 10) / 10,
  };
}

// ─── Scouting Report Generator ──────────────────────────────────────────
export function generateScoutingReport(war: number, iso: string, fip: number, _itemName: string): string {
  // WAR tier
  let warTier: string;
  if (war >= 8.0) warTier = 'MVP级别的逸品';
  else if (war >= 6.0) warTier = '全场瞩目的精英';
  else if (war >= 4.0) warTier = '实力的十分ある一品';
  else if (war >= 2.5) warTier = '稳健发挥的实力派';
  else if (war >= 1.5) warTier = 'ポテンシャル秘めた存在';
  else warTier = '草野球级别的日常品';

  // ISO tier
  const isoVal = parseFloat(iso);
  let isoTier: string;
  if (isoVal >= 0.300) isoTier = 'ホームランバッター';
  else if (isoVal >= 0.250) isoTier = 'クリーンアップ级';
  else if (isoVal >= 0.200) isoTier = 'センター级';
  else if (isoVal >= 0.150) isoTier = 'ライト级アベレージヒッター';
  else isoTier = '代打级的潜伏者';

  let report = `この品物は、${warTier}、${isoTier}です。`;

  // Weakness note based on FIP
  if (fip >= 4.50) {
    report += ' 荒削りで安定感には課題を残しますが、价格面でのリフレッシュは可能です。';
  } else if (fip >= 4.00) {
    report += ' 安定感にはやや不安がありますが、期待値は十分あります。';
  }

  return report;
}

// ─── Process Rakuten API Response ──────────────────────────────────────
export interface RakutenItem {
  itemId: string;
  itemName: string;
  itemPrice: number;
  itemUrl: string;
  mediumImageUrls: { imageUrl: string }[];
  reviewCount: number;
  reviewAverage: number;
  shopName: string;
}

export function processItems(rawItems: RakutenItem[]): Item[] {
  if (!rawItems.length) return [];

  // Calculate WAR and ISO for each item
  const items: Item[] = rawItems.map(raw => ({
    ...raw,
    war: calcWar(raw.reviewCount, raw.itemPrice, raw.reviewAverage),
    iso: calcIso(raw.reviewAverage, raw.reviewCount),
    fip_value: 0, fip_label: '', fip_pct: 0, scouting_report: '',
  }));

  // Calculate FIP (needs all items for percentile)
  const fipResults = calculateFip(items);
  
  // Generate scouting reports
  return items.map(item => ({
    ...item,
    fip_value: fipResults.fip_value,
    fip_label: fipResults.fip_label,
    fip_pct: fipResults.fip_pct,
    scouting_report: generateScoutingReport(item.war, item.iso, fipResults.fip_value, item.itemName),
  }));
}