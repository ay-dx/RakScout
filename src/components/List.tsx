import { useEffect, useState, useMemo, useId } from 'react';
import { useLocation } from 'wouter';
import { useScoutSearch } from '../hooks/useScoutSearch';
import { RakScoutItem } from '../types';

type SortKey = 'WAR' | 'ISO' | 'FIP';

const STORAGE_KEY = 'rakScoutSearchParams';

// ハッシュルーティング用：URLSearchParamsを取得（search と hash の両方をマージ）
function getHashParams(): URLSearchParams {
  const hash = window.location.hash;
  const queryIndex = hash.indexOf('?');
  const hashQuery = queryIndex >= 0 ? hash.slice(queryIndex + 1) : '';

  const search = window.location.search;
  const searchQuery = search.startsWith('?') ? search.slice(1) : '';

  // search をベースに、hash で上書き（hash を優先）
  const merged = new URLSearchParams(searchQuery);
  const hashParams = new URLSearchParams(hashQuery);
  hashParams.forEach((val, key) => merged.set(key, val));

  return merged;
}

export default function List() {
  const [, setLocation] = useLocation();
  const searchInputId = useId();

  const [keyword, setKeyword] = useState('');
  const [isFurusato, setIsFurusato] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>('WAR');

  useEffect(() => {
    // Detailページの残骸（?id=xxx）が残っている場合は除去
    if (window.location.search.includes('id=') || window.location.search.includes('detail=')) {
      const cleanUrl = window.location.pathname + window.location.hash;
      window.history.replaceState(null, '', cleanUrl);
    }

    const params = getHashParams();

    // URLに検索パラメータがない → sessionStorageから復元
    if (!params.has('q')) {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved && saved.length > 0) {
        window.location.hash = `#/list?${saved}`;
        return;
      }
    }

    setKeyword(params.get('q') || '');
    setIsFurusato(params.get('furusato') === '1');
    const sort = params.get('sort') as SortKey;
    if (sort && ['WAR', 'ISO', 'FIP'].includes(sort)) {
      setSortKey(sort);
    }
  }, []);

  const { data: apiData, isLoading, error } = useScoutSearch(keyword, isFurusato);

  const sortedData = useMemo(() => {
    if (!apiData) return [];
    return [...apiData].sort((a, b) => {
      const valA = parseFloat(a.metrics[sortKey].value);
      const valB = parseFloat(b.metrics[sortKey].value);
      // FIPは低いほど良い → 昇順、WAR/ISOは高いほど良い → 降順
      return sortKey === 'FIP' ? valA - valB : valB - valA;
    });
  }, [apiData, sortKey]);

  const handleSortChange = (newSort: SortKey) => {
    const params = getHashParams();
    params.set('sort', newSort);
    sessionStorage.setItem(STORAGE_KEY, params.toString());
    window.location.hash = `#/list?${params.toString()}`;
    setSortKey(newSort);
  };

  const handleCardClick = (item: RakScoutItem) => {
    // 商品データを保存
    sessionStorage.setItem('rakScoutSelectedItem', JSON.stringify(item));

    // 現在の検索条件を取得
    const currentParams = getHashParams();
    const hashParams = new URLSearchParams();

    // 検索条件を引き継ぐ
    if (currentParams.get('q')) hashParams.set('q', currentParams.get('q')!);
    if (currentParams.get('sort')) hashParams.set('sort', currentParams.get('sort')!);
    if (currentParams.get('furusato')) hashParams.set('furusato', currentParams.get('furusato')!);

    // detailパラメータを追加
    hashParams.set('id', item.id);

    // hash を直接書き換え（wouterのsetLocationの代わり）
    window.location.hash = `#/detail?${hashParams.toString()}`;
  };

  return (
    <div className="flex flex-col h-full bg-cream">
      <header className="p-5 bg-white/80 backdrop-blur-md border-b-2 border-stone-200 shrink-0 z-20 shadow-[0_4px_20px_rgba(0,0,0,0.06)] relative">
        <div className="flex items-center gap-3 mb-5">
          <button 
            onClick={() => { window.location.hash = '#/'; }}
            className="p-3 bg-stone-100 rounded-full border border-stone-200 active:scale-90 transition-transform text-stone-600 focus:outline-none focus:ring-2 focus:ring-stone-400"
            aria-label="ホームに戻る"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"/></svg>
          </button>

          <div className="relative flex items-center w-full bg-white/80 border border-stone-200 rounded-xl focus-within:border-stone-400 transition-all">
            <label htmlFor={searchInputId} className="absolute left-3 text-stone-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </label>
            <input 
              id={searchInputId}
              type="search" 
              value={keyword}
              readOnly
              onClick={() => { window.location.hash = '#/'; }}
              className="w-full pl-10 pr-4 py-3 bg-transparent text-lg font-black outline-none text-stone-800" 
            />
          </div>
        </div>

        <div className="flex gap-1 h-12">
          {(['WAR', 'ISO', 'FIP'] as SortKey[]).map((tab) => {
            const isActive = sortKey === tab;
            let activeColor = 'bg-stone-100 text-stone-400';
            if (isActive) {
               if (tab === 'WAR') activeColor = 'bg-red-500 text-white shadow-[0_4px_10px_rgba(239,68,68,0.4)]';
               if (tab === 'ISO') activeColor = 'bg-blue-500 text-white shadow-[0_4px_10px_rgba(59,130,246,0.4)]';
               if (tab === 'FIP') activeColor = 'bg-green-500 text-white shadow-[0_4px_10px_rgba(34,197,94,0.4)]';
            }
            return (
              <button
                key={tab}
                onClick={() => handleSortChange(tab)}
                aria-pressed={isActive}
                className={`flex-1 font-black italic text-[14px] tracking-widest transition-all focus:outline-none focus:ring-2 focus:ring-stone-400 ${activeColor}`}
                style={isActive ? { clipPath: 'polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)' } : {}}
              >
                {tab} MODE
              </button>
            );
          })}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-5 space-y-6 pb-24 z-10 relative">
        {error && <div className="text-red-500 font-bold text-center">{error}</div>}

        {isLoading && (
          <div className="bg-white border border-stone-200 rounded-[2.5rem] p-6 animate-pulse h-48"></div>
        )}

        {!isLoading && sortedData.map((item) => (
          <div
            key={item.id}
            onClick={() => handleCardClick(item)}
            className="block bg-white border border-stone-200 rounded-[2.5rem] p-6 shadow-sm active:scale-[0.98] transition-all focus:outline-none focus:ring-4 focus:ring-stone-400 cursor-pointer"
            role="link"
            tabIndex={0}
            aria-label={`${item.name}の詳細を見る。価格 ${item.price}円`}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleCardClick(item); }}
          >
            <div className="flex gap-5 mb-5">
              <img src={item.image} className="w-20 h-20 rounded-2xl object-cover border border-stone-200 grayscale-[0.1]" alt="" aria-hidden="true" />
              <div className="flex-1 overflow-hidden">
                <h2 className="text-lg font-black italic leading-tight text-stone-800 line-clamp-2">{item.name}</h2>
                <p className="text-[28px] font-black text-stone-500 mt-1 leading-none drop-shadow-sm">¥{item.price.toLocaleString()}</p>
              </div>
            </div>

            <div className="space-y-3 bg-stone-50 p-4 rounded-2xl border border-stone-100">
              <div className={`flex items-center gap-3 ${sortKey === 'WAR' ? '' : 'opacity-40 grayscale'}`}>
                <span className="w-10 text-[14px] font-black italic text-red-500">WAR</span>
                <div className="flex-1 h-1.5 bg-stone-200 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500" style={{ width: `${item.metrics.WAR.pct}%` }}></div>
                </div>
                <span className="text-[16px] font-black text-stone-700 w-12 text-right">{item.metrics.WAR.value}</span>
              </div>
              <div className={`flex items-center gap-3 ${sortKey === 'ISO' ? '' : 'opacity-40 grayscale'}`}>
                <span className="w-10 text-[14px] font-black italic text-blue-500">ISO</span>
                <div className="flex-1 h-1.5 bg-stone-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: `${item.metrics.ISO.pct}%` }}></div>
                </div>
                <span className="text-[16px] font-black text-stone-700 w-12 text-right">{item.metrics.ISO.value}</span>
              </div>
              <div className={`flex items-center gap-3 ${sortKey === 'FIP' ? '' : 'opacity-40 grayscale'}`}>
                <span className="w-10 text-[14px] font-black italic text-green-500">FIP</span>
                <div className="flex-1 h-1.5 bg-stone-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500" style={{ width: `${item.metrics.FIP.pct}%` }}></div>
                </div>
                <span className="text-[16px] font-black text-stone-700 w-12 text-right">{item.metrics.FIP.value}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
