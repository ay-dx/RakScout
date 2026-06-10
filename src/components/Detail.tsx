import { useMemo } from 'react';
import { useLocation } from 'wouter';
import { useScoutSearch } from '../hooks/useScoutSearch';
import MetricBar from './MetricBar';

export default function Detail() {
  const [, setLocation] = useLocation();
  const [location] = useLocation();
  
  // URLから全パラメータを取得
  const params = useMemo(() => {
    const search = location.split('?')[1] || '';
    return new URLSearchParams(search);
  }, [location]);

  const id = params.get('id') || '';
  const keyword = params.get('q') || '';
  const isFurusato = params.get('furusato') === '1';

  // APIから直接取得（sessionStorage不要）
  const { data: apiData, isLoading, error } = useScoutSearch(keyword, isFurusato);
  
  const item = useMemo(() => {
    return apiData?.find(i => i.id === id);
  }, [apiData, id]);

  // 戻るURL（検索条件を維持）
  const backUrl = useMemo(() => {
    const next = new URLSearchParams(params);
    next.delete('id');
    return `/list?${next.toString()}`;
  }, [params]);

  if (isLoading) {
    return (
      <div className="flex flex-col h-full bg-cream p-5 items-center justify-center">
        <div className="bg-white border border-stone-200 rounded-2xl p-8 animate-pulse">
          <div className="h-8 w-48 bg-stone-200 rounded mb-4"></div>
          <div className="h-64 w-64 bg-stone-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="flex flex-col h-full bg-cream p-5 items-center justify-center">
        <p className="text-red-500 font-bold text-center mb-4">{error || '商品が見つかりません'}</p>
        <button 
          onClick={() => setLocation('/')}
          className="px-6 py-3 bg-stone-800 text-white rounded-xl font-black"
        >
          ホームに戻る
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-cream p-5 overflow-y-auto">
      <button 
        onClick={() => setLocation(backUrl)}
        className="w-12 h-12 mb-5 flex items-center justify-center bg-white/80 backdrop-blur rounded-full border border-stone-200 active:scale-90 z-20 shadow-lg shrink-0 text-stone-600"
        aria-label="リストに戻る"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"/></svg>
      </button>

      <div className="flex-1 flex flex-col items-center">
        <div className="w-full relative shadow-[0_30px_60px_rgba(0,0,0,0.12)] p-1 bg-[linear-gradient(135deg,#ffffff_0%,#e7e5e4_20%,#a8a29e_50%,#e7e5e4_80%,#ffffff_100%)]" style={{ clipPath: 'polygon(4% 0%, 96% 0%, 100% 100%, 0% 100%)' }}>
          
          <div className="w-full pt-8 pb-10 px-6 bg-stone-900 relative" style={{ clipPath: 'polygon(4% 0%, 96% 0%, 100% 100%, 0% 100%)' }}>
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-black/20 pointer-events-none z-0"></div>
            
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className="flex-1 pr-4">
                <h4 className="text-[10px] font-black text-stone-400 tracking-[0.4em] uppercase mb-1">Scouted Item</h4>
                <h2 className="line-clamp-2 text-[20px] font-black italic tracking-tighter leading-tight text-white drop-shadow-md">
                  {item.name}
                </h2>
              </div>
              <div className="text-right shrink-0">
                <div className="text-[10px] font-black text-stone-400 tracking-widest uppercase mb-1">年俸</div>
                <div className="font-oswald text-yellow-500 font-black italic text-[32px] leading-none drop-shadow-[2px_2px_0_#92400e]">
                  ¥{item.price.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="w-[60%] mx-auto aspect-square rounded-2xl bg-white border border-stone-200 overflow-hidden mb-8 shadow-[inset_0_0_20px_rgba(0,0,0,0.05)] relative z-10 flex items-center justify-center p-2">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-xl" />
            </div>

            <div className="space-y-4 mb-10 relative z-10">
              <MetricBar label="WAR" value={item.metrics.WAR.value} pct={item.metrics.WAR.pct} colorClass="bg-gradient-to-r from-red-900 to-red-500" />
              <MetricBar label="ISO" value={item.metrics.ISO.value} pct={item.metrics.ISO.pct} colorClass="bg-gradient-to-r from-blue-900 to-blue-500" />
              <MetricBar label="FIP" value={item.metrics.FIP.value} pct={item.metrics.FIP.pct} colorClass="bg-gradient-to-r from-green-900 to-green-500" />
            </div>

            <div className="relative mb-10 z-10">
              <div className="flex items-center gap-2 mb-2 ml-1">
                <div className="w-1.5 h-4 bg-stone-400"></div>
                <span className="text-[12px] font-black text-stone-400 tracking-[0.3em] uppercase">Scouting Report</span>
              </div>
              <div className="bg-[linear-gradient(135deg,#f5f5f4_0%,#e7e5e4_40%,#d6d3d1_50%,#a8a29e_100%)] border-l-[5px] border-[#78716c] p-5 rounded-lg shadow-inner">
                <p className="text-stone-800 font-black italic text-[14px] leading-relaxed">
                  {item.report}
                </p>
              </div>
            </div>

            <a 
              href={item.affiliateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-5 rounded-md text-white font-black italic text-2xl tracking-tighter text-center transition-all z-10 relative bg-gradient-to-b from-orange-500 to-red-600 shadow-[0_6px_0_#991b1b,0_10px_20px_rgba(0,0,0,0.5)] active:translate-y-[6px] active:shadow-[0_0px_0_#991b1b,0_4px_6px_rgba(0,0,0,0.5)]"
            >
              今すぐチェック！
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}