export interface MetricData {
  value: string; // 表示用（MLBスケール）
  pct: number;   // UIバー用（0~100）
}

export interface RakScoutItem {
  id: string;
  name: string;
  price: number;
  image: string;
  affiliateUrl: string;
  metrics: {
    WAR: MetricData;
    ISO: MetricData;
    FIP: MetricData;
  };
  report: string;
}