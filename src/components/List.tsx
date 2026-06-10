import { useMemo } from 'react';
import { useLocation, useSearch, Link } from 'wouter';
import { useScoutSearch } from '../hooks/useScoutSearch';
import { RakScoutItem, SortKey } from '../types';

const TABS: SortKey[] = ['WAR', 'ISO', 'FIP'];

export default function List() {
  const [, setLocation] = useLocation();
  const search = useSearch();           // ← URLから常時読む（useEffect不要）
  const params = new URLSearchParams(search);

  const keyword = params.get('q') || '';
  const isFurusato = params.get('furusato') === '1';
  const sortKey = (params.get('sort') as SortKey) || 'WAR';

  const { data, isLoading, error } = useScoutSearch(keyword, isFurusato);

  const sorted = useMemo(() => {
    if (!data) return [];
    return [...data].sort((a, b) => parseFloat(b.metrics[sortKey].value) - parseFloat(a.metrics[sortKey].value));
  }, [data, sortKey]);

  const changeSort = (tab: SortKey) => {
    const next = new URLSearchParams(search);
    next.set('sort', tab);
    setLocation(`/list?${next}`);       // ← URL書き換えだけ、state不要
  };

  const buildDetailUrl = (id: string) => {
    const next = new URLSearchParams(search);
    next.set('id', id);
    return `/detail?${next}`;           // ← 検索条件を引き継ぐ
  };

  return (
    <div className="flex flex-col h-full bg-cream">
      <header className="p-5 bg-white/80 backdrop-blur-md border-b-2 border-stone-200 shrink-0 z-20 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
        <div className="flex items-center gap-3 mb-5">
          <button onClick={() => setLocation('/')} aria-label="ホームに戻る"
            className="p-3 bg-stone-100 rounded-full border border-stone-200 active:scale-90 transition-transform text-stone-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"/></svg>
          </button>
          
          <button onClick={() => setLocation('/')} className="flex-1 text-left bg-white/80 border border-stone-200 rounded-xl px-4 py-3 text-stone-800 font-black">
            {keyword || '検索キーワード...'}
          </button>
        </div>

        <div className="flex gap-1 h-12" role="tablist">
          {TABS.map(tab => {
            const active = sortKey === tab;
            const color = active
              ? tab === 'WAR' ? 'bg-red-500 shadow-[0_4px_10px_rgba(239,68,68,0.4)]'
              : tab === 'ISO' ? 'bg-blue-500 shadow-[0_4px_10px_rgba(59,130,246,0.4)]'
              : 'bg-green-500 shadow-[0_4px_10px_rgba(34,197,94,0.4)]'
              : 'bg-stone-100 text-stone-400';
            return (
              <button key={tab} role="tab" aria-selected={active} onClick={() => changeSort(tab)}
                className={`flex-1 font-black italic text-[14px] tracking-widest transition-all text-white ${color}`}
                style={active ? { clipPath: 'polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)' } : {}}>
                {tab} MODE
              </button>
            );
          })}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-5 space-y-6 pb-24">
        {error && <div className="text-red-500 font-bold text-center">{error}</div>}
        {isLoading && <div className="bg-white border border-stone-200 rounded-[2.5rem] p-6 animate-pulse h-48" />}
        
        {sorted.map(item => (
          <Link key={item.id} href={buildDetailUrl(item.id)}   // ← 検索条件付きURL
            className="block bg-white border border-stone-200 rounded-[2.5rem] p-6 shadow-sm active:scale-[0.98] transition-all"
            aria-label={`${item.name}、¥${item.price.toLocaleString()}`}>
            <div className="flex gap-5 mb-5">
              <img src={item.image} alt="" className="w-20 h-20 rounded-2xl object-cover border border-stone-200 grayscale-[0.1]" />
              <div className="flex-1">
                <h2 className="text-lg font-black italic leading-tight text-stone-800 line-clamp-2">{item.name}</h2>
                <p className="text-[28px] font-black text-stone-500 mt-1">¥{item.price.toLocaleString()}</p>
              </div>
            </div>
            <div className="space-y-3 bg-stone-50 p-4 rounded-2xl border border-stone-100">
              {TABS.map(m => (
                <div key={m} className={`flex items-center gap-3 ${sortKey === m ? '' : 'opacity-40 grayscale'}`}>
                  <span className={`w-10 text-[14px] font-black italic ${m === 'WAR' ? 'text-red-500' : m === 'ISO' ? 'text-blue-500' : 'text-green-500'}`}>{m}</span>
                  <div className="flex-1 h-1.5 bg-stone-200 rounded-full overflow-hidden">
                    <div className={`h-full ${m === 'WAR' ? 'bg-red-500' : m === 'ISO' ? 'bg-blue-500' : 'bg-green-500'}`} style={{ width: `${item.metrics[m].pct}%` }} />
                  </div>
                  <span className="text-[16px] font-black text-stone-700 w-12 text-right">{item.metrics[m].value}</span>
                </div>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}