import type { Item } from '../types';
import { MetricBar } from './MetricBar';

interface RareCardProps {
  item: Item;
}

export function RareCard({ item }: RareCardProps) {
  const imageUrl = item.mediumImageUrls?.[0]?.imageUrl;
  const warPct = Math.min((item.war / 10) * 100, 100);
  const isoVal = parseFloat(item.iso);
  const isoPct = (isoVal / 0.35) * 100;

  return (
    <article className="bg-white rounded-2xl shadow-lg p-6 max-w-md mx-auto">
      <div className="flex items-center justify-between mb-4">
        <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full">RARE CARD</span>
        <span className="text-sm text-gray-500">ID: {item.itemId}</span>
      </div>

      {imageUrl && (
        <div className="w-full h-48 mb-4 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">
          <img src={imageUrl} alt={item.itemName} className="max-h-full object-contain" loading="lazy" />
        </div>
      )}

      <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{item.itemName}</h2>

      <div className="flex items-center justify-between text-sm text-gray-600 mb-6">
        <span className="text-2xl font-bold text-red-600">¥{item.itemPrice.toLocaleString()}</span>
        <span className="truncate max-w-[150px]">{item.shopName}</span>
      </div>

      <div className="space-y-4 mb-6">
        <MetricBar label="WAR (総合貢献度)" value={item.war.toFixed(1)} pct={warPct} color="red" />
        <MetricBar label="ISO (ポテンシャル)" value={item.iso} pct={isoPct} color="blue" />
        <MetricBar label="FIP (安心スコア)" value={item.fip_value.toFixed(2)} pct={item.fip_pct} color="green" />
      </div>

      <div className="bg-cream rounded-xl p-4">
        <h3 className="text-sm font-bold text-gray-700 mb-2">🏏 SCOUTING REPORT</h3>
        <p className="text-sm text-gray-800 leading-relaxed">{item.scouting_report}</p>
      </div>

      <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
        <span className="text-yellow-500">★</span>
        <span>{item.reviewAverage.toFixed(1)}</span>
        <span>({item.reviewCount.toLocaleString()}件)</span>
      </div>
    </article>
  );
}