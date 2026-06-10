import { useMemo } from 'react';
import { useLocation, useSearch } from 'wouter';
import { useScoutSearch } from '../hooks/useScoutSearch';
import { SortKey } from '../types';
import MetricBar from './MetricBar';

export default function Detail() {
  const [, setLocation] = useLocation();
  const search = useSearch();
  const params = new URLSearchParams(search);

  const id = params.get('id') || '';
  const keyword = params.get('q') || '';
  const isFurusato = params.get('furusato') === '1';

  // APIから直接取得（sessionStorage不要）
  const { data } = useScoutSearch(keyword, isFurusato);
  const item = useMemo(() => data?.find(i => i.id === id), [data, id]);

  const backUrl = useMemo(() => {
    const next = new URLSearchParams(search);
    next.delete('id');                  // ← idだけ削除、検索条件は残す
    return `/list?${next}`;
  }, [search]);

  if (!item) return null;

  return (
    <div className="flex flex-col h-full bg-cream p-5 overflow-y-auto">
      <button onClick={() => setLocation(backUrl)} aria-label="リストに戻る"
        className="w-12 h-12 mb-5 flex items-center justify-center bg-white/80 backdrop-blur rounded-full border border-stone-200 active:scale-90 z-20 shadow-lg text-stone-600">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"/></svg>
      </button>

      <div className="flex-1 flex flex-col items-center">
        <div className="w-full relative shadow-[0_30px_60px_rgba(0,0,0,0.12)] p-1 bg-gradient-to-br from-white via-stone-300 to-stone-400" style={{ clipPath: 'polygon(4% 0%, 96% 0%, 100% 100%, 0% 100%)' }}>
          <div className="w-full pt-8 pb-10 px-6 bg-stone-900 relative" style={{ clipPath: 'polygon(4% 0%, 96% 0%, 100% 100%, 0% 100%)' }}>
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-black/20 pointer-events-none z-0" />
            
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className="flex-1 pr-4">
                <h4 className="text-[10px] font-black text-stone-400 tracking-[0.4em] uppercase mb-1">Scouted Item</h4>
                <h2 className="line-clamp-2 text-[20px] font-black italic tracking-tighter leading-tight text-white drop-shadow-md">{item.name}</h2>
              </div>
              <div className="text-right shrink-0">
                <div className="text-[10px] font-black text-stone-400 tracking-widest uppercase mb-1">年俸</div>
                <div className="font-oswald text-yellow-500 font-black italic text-[32px] leading-none drop-shadow-[2px_2px_0_#92400e]">
                  ¥{item.price.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="w-[60%] mx-auto aspect-square rounded-2xl bg-white border border-stone-200 overflow-hidden mb-8 shadow-inner relative z-10 flex items-center justify-center p-2">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-xl" />
            </div>

            <div className="space-y-4 mb-10 relative z-10">
              <MetricBar label="WAR" value={item.metrics.WAR.value} pct={item.metrics.WAR.pct} colorClass="bg-gradient-to-r from-red-900 to-red-500" />
              <MetricBar label="ISO" value={item.metrics.ISO.value} pct={item.metrics.ISO.pct} colorClass="bg-gradient-to-r from-blue-900 to-blue-500" />
              <MetricBar label="FIP" value={item.metrics.FIP.value} pct={item.metrics.FIP.pct} colorClass="bg-gradient-to-r from-green-900 to-green-500" />
            </div>

            <div className="relative mb-10 z-10">
              <div className="flex items-center gap-2 mb-2 ml-1">
                <div className="w-1.5 h-4 bg-stone-400" />
                <span className="text-[12px] font-black text-stone-400 tracking-[0.3em] uppercase">Scouting Report</span>
              </div>
              <div className="bg-gradient-to-br from-stone-100 via-stone-200 to-stone-400 border-l-[5px] border-stone-500 p-5 rounded-lg shadow-inner">
                <p className="text-stone-800 font-black italic text-[14px] leading-relaxed">{item.report}</p>
              </div>
            </div>

            <a href={item.affiliateUrl} target="_blank" rel="noopener noreferrer"
              className="block w-full py-5 rounded-md text-white font-black italic text-2xl tracking-tighter text-center bg-gradient-to-b from-orange-500 to-red-600 shadow-[0_6px_0_#991b1b,0_10px_20px_rgba(0,0,0,0.5)] active:translate-y-[6px] active:shadow-[0_0_0_#991b1b,0_4px_6px_rgba(0,0,0,0.5)]">
              今すぐチェック！
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}