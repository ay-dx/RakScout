import { RakScoutItem } from '../types';

// パーセンタイル計算
const getPercentile = (val: number, list: number[], reverse: boolean = false): number => {
  if (list.length === 0) return 0;
  const count = reverse 
    ? list.filter(v => v >= val).length 
    : list.filter(v => v <= val).length;
  return (count / list.length) * 100;
};

// スカウティングレポートの完全生成ロジック（FIP哲学修正版）
const generateScoutReport = (
  revCount: number, revAvg: number, war: number, warPct: number, meanWar: number, isoPct: number, fipPct: number
): string => {
  // 1. プロスペクトの罠（最優先）
  if (revCount > 0 && revCount < 5 && revAvg === 5.0) {
    return "【サンプル不足だが期待大】未知のポテンシャルを秘めたルーキーです。大化けか三振か、思い切ったスイングが必要です。";
  }

  // 2. プレースタイル（WAR, ISOに基づく攻撃力）
  let hitterType = "シュアな打撃が光るユーティリティプレイヤー";
  if (warPct >= 85) hitterType = "リーグを代表するMVP級の強打者";
  else if (isoPct >= 80) hitterType = "一振りでスタンドに運ぶ生粋の長距離砲";
  else if (warPct >= 75) hitterType = "確実性と破壊力を兼ね備えた中軸打者";
  else if (warPct >= 60) hitterType = "コンスタントに出塁を重ねるアベレージヒッター";

  // 3. キャリア・格（実績・レビュー数に基づく）
  let style = "レギュラー定着を狙う期待の若手";
  if (revCount >= 500) style = "殿堂入り確実のレジェンド";
  else if (revCount >= 100) style = "実績十分な頼れるベテラン";
  else if (revCount <= 15 && isoPct >= 70) style = "ドラフト目玉級の超プロスペクト";

  // 4. 安定感・完成度の評価（FIPに基づく独立した評価）
  let fipNote = "";
  if (fipPct >= 80) {
    fipNote = " 投球内容（品質）は極めて高く、どんな局面でも大崩れしない絶対的な安定感を誇ります。";
  } else if (fipPct >= 50) {
    fipNote = " パフォーマンスの波が少なく、ローテーションを守り抜く計算の立つ完成度です。";
  } else if (fipPct < 30) {
    fipNote = " 現状は制球難（安定性）に課題を残しており、真価を発揮するには環境や使い方の調整が求められる荒れ球タイプです。";
  }

  // 5. リーグ平均対比
  let statNote = "";
  if (meanWar > 0) {
    const warDiff = Math.floor(((war / meanWar) - 1.0) * 100);
    if (warDiff > 20) {
      statNote = ` 特に総合貢献度（WAR）はリーグ平均を${warDiff}%上回ります。`;
    }
  }

  // 6. 最終テキスト組み立て
  return `この品物は、${style}と言える${hitterType}です。${fipNote}${statNote}`;
};

export const processRakutenData = (items: any[]): RakScoutItem[] => {
  if (!items || items.length === 0) return [];

  const processed = items.map((item: any) => {
    const i = item.Item;
    const price = parseFloat(i.itemPrice || 0);
    const revAvg = parseFloat(i.reviewAverage || 0);
    const revCount = parseInt(i.reviewCount || 0, 10);
    const shopCode = i.shopCode || "unknown";

    // 生スコア計算
    const rawWar = price > 0 ? ((Math.log10(revCount + 1) * 5000) / price) * Math.pow(revAvg / 5.0, 3) : 0;
    const rawIso = revCount >= 2 ? Math.pow(revAvg, 2) / Math.log2(revCount + 2) : 0;
    
    return { raw: i, rawWar, rawIso, revAvg, revCount, shopCode };
  });

  // ショップ集計 (FIP用)
  const shopData: Record<string, { count: number; sumRev: number }> = {};
  processed.forEach(p => {
    if (!shopData[p.shopCode]) shopData[p.shopCode] = { count: 0, sumRev: 0 };
    shopData[p.shopCode].count += 1;
    shopData[p.shopCode].sumRev += p.revAvg;
  });

  // FIP生スコア算出とリスト構築
  const warList: number[] = [];
  const isoList: number[] = [];
  const fipList: number[] = [];

  processed.forEach(p => {
    const s = shopData[p.shopCode];
    const sAvg = s.count > 0 ? s.sumRev / s.count : 0;
    const dev = (s.count <= 1 || sAvg === 0) ? 1.0 : p.revAvg / sAvg;
    p.rawFip = (Math.log10(s.count + 1) * sAvg) * dev; // 高いほど安心（計算用）

    warList.push(p.rawWar);
    isoList.push(p.rawIso);
    fipList.push(p.rawFip);
  });

  const meanWar = warList.reduce((a, b) => a + b, 0) / warList.length;
  const maxRawWar = Math.max(...warList, 1.0);
  const warScaleFactor = 9.5 / maxRawWar;

  return processed.map(p => {
    // 優秀さのパーセンタイル (0〜100%)
    const warPct = getPercentile(p.rawWar, warList);
    const isoPct = getPercentile(p.rawIso, isoList);
    const fipPct = getPercentile(p.rawFip, fipList); // rawFipは高いほど優秀

    // MLBスケールとUIバーの幅(width %)を算出
    const mlbWar = Math.min(10.0, p.rawWar * warScaleFactor);
    const mlbIso = p.rawIso / 10.0;
    const mlbFip = 5.50 - (fipPct / 100.0) * 3.50;

    const warBarPct = Math.min(100, (mlbWar / 10.0) * 100);
    const isoBarPct = Math.min(100, (mlbIso / 0.350) * 100);
    const fipBarPct = Math.max(0, Math.min(100, ((5.50 - mlbFip) / (5.50 - 2.00)) * 100));

    return {
      id: p.raw.itemCode,
      name: p.raw.itemName,
      price: p.raw.itemPrice,
      image: p.raw.mediumImageUrls?.[0]?.imageUrl?.replace('?_ex=128x128', '') || '',
      affiliateUrl: p.raw.affiliateUrl || p.raw.itemUrl,
      metrics: {
        WAR: { value: mlbWar.toFixed(1), pct: warBarPct },
        ISO: { value: mlbIso.toFixed(3).replace(/^0\./, '.'), pct: isoBarPct },
        FIP: { value: mlbFip.toFixed(2), pct: fipBarPct }
      },
      report: generateScoutReport(p.revCount, p.revAvg, p.rawWar, warPct, meanWar, isoPct, fipPct)
    };
  });
};