import { RakScoutItem } from '../types';

// パーセンタイル計算
const getPercentile = (val: number, list: number[], reverse: boolean = false): number => {
  if (list.length === 0) return 0;
  const count = reverse 
    ? list.filter(v => v >= val).length 
    : list.filter(v => v <= val).length;
  return (count / list.length) * 100;
};

// WAR: 選手の格（総合価値）
const getPlayerGrade = (warPct: number, revCount: number): string => {
  if (revCount >= 500 && warPct >= 85) return "殿堂入り確実のレジェンド";
  if (revCount >= 100 && warPct >= 70) return "チームを支える頼れるベテラン";
  if (warPct >= 80) return "規格外のスーパースター候補";
  if (warPct >= 65) return "一軍定着を狙う中堅選手";
  if (revCount <= 15 && warPct >= 60) return "他球団が注目するドラフト1位候補";
  return "まだ未知数のルーキー";
};

// ISO: 打力タイプ（一撃の価値・パワーの純度）
const getHitterType = (isoPct: number): string => {
  if (isoPct >= 90) return "一撃で流れを変えるパワーヒッター";
  if (isoPct >= 75) return "ロマンあふれるホームランアーティスト";
  if (isoPct >= 60) return "少ないチャンスでも存在感を放つ打力特化型";
  if (isoPct >= 40) return "状況に応じて長打も狙える万能タイプ";
  if (isoPct >= 20) return "バランス型のスタンダードモデル";
  return "一発より確実性を重視する堅実モデル";
};

// FIP: 投球内容の質（守備非依存評価）
const getPitchingQuality = (fipPct: number): string => {
  if (fipPct < 15) return "投球内容が安定しており、信頼性が高い";
  if (fipPct < 40) return "堅実な投球で本来の実力を発揮しやすい";
  if (fipPct < 70) return "安定感の向上によって、さらなる評価アップが期待される";
  return "本来の投球内容に課題を抱えており、調整による改善が期待される";
};

// スカウティングレポート生成
const generateScoutReport = (
  revCount: number,
  revAvg: number,
  war: number,
  warPct: number,
  meanWar: number,
  isoPct: number,
  fipPct: number
): string => {
  // サンプル不足だが期待大
  if (revCount > 0 && revCount < 5 && revAvg === 5.0) {
    return "【サンプル不足だが期待大】未知のポテンシャルを秘めたルーキーです。大化けか三振か、思い切ったスイングが必要です。";
  }

  const grade = getPlayerGrade(warPct, revCount);
  const hitter = getHitterType(isoPct);
  const quality = getPitchingQuality(fipPct);

  // WARリーグ平均対比
  let statNote = "";
  if (meanWar > 0) {
    const warDiff = Math.floor(((war / meanWar) - 1.0) * 100);
    if (warDiff > 20) {
      statNote = ` 特に勝利貢献度（WAR）はリーグ平均を${warDiff}%上回ります。`;
    }
  }

  return `この品物は、${grade}と評される${hitter}です。${quality}モデルです。${statNote}`;
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
    p.rawFip = (Math.log10(s.count + 1) * sAvg) * dev;

    warList.push(p.rawWar);
    isoList.push(p.rawIso);
    fipList.push(p.rawFip);
  });

  const meanWar = warList.reduce((a, b) => a + b, 0) / warList.length;
  const maxRawWar = Math.max(...warList, 1.0);
  const warScaleFactor = 9.5 / maxRawWar;

  return processed.map(p => {
    // WAR/ISO: 大きいほど上位（通常のパーセンタイル）
    const warPct = getPercentile(p.rawWar, warList);
    const isoPct = getPercentile(p.rawIso, isoList);

    // FIP: rawFipが高い=良い → fipPctを反転して「低い=優秀」に統一
    const rawFipPct = getPercentile(p.rawFip, fipList);
    const fipPct = 100 - rawFipPct;

    // MLBスケール換算
    const mlbWar = Math.min(10.0, p.rawWar * warScaleFactor);
    const mlbIso = p.rawIso / 10.0;
    const mlbFip = 2.00 + (fipPct / 100.0) * 3.50;

    // UIバー幅
    const warBarPct = Math.min(100, (mlbWar / 10.0) * 100);
    const isoBarPct = Math.min(100, (mlbIso / 0.350) * 100);
    const fipBarPct = Math.max(0, Math.min(100, ((5.50 - mlbFip) / 3.50) * 100));

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