import { useState, useId } from 'react';
import { useLocation } from 'wouter';
import Footer from './Footer';

export default function Home() {
  const [, setLocation] = useLocation();
  const [keyword, setKeyword] = useState('');
  const [isFurusato, setIsFurusato] = useState(false);
  const searchInputId = useId();

  const handleSearch = () => {
    if (!keyword.trim()) return;
    const params = new URLSearchParams();
    params.set('q', keyword);
    if (isFurusato) params.set('furusato', '1');
    params.set('sort', 'WAR');
    setLocation(`/list?${params.toString()}`);
  };

  return (
    <div className="flex flex-col h-full relative bg-cream">
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-cream/30 via-cream/80 to-cream pointer-events-none"></div>

      <div className="relative z-10 flex flex-col h-full p-8 pt-16">
        <header className="font-black italic text-2xl tracking-tighter text-stone-500">
          RakScout
        </header>

        <div className="mt-16">
          <h1 className="text-7xl font-black italic leading-[0.85] tracking-tighter text-stone-800 drop-shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
            お宝を<br/>探せ！
          </h1>
        </div>

        <div className="mt-auto mb-[2vh]">
          <div className="mb-6">
            <div className="flex bg-white/70 border border-stone-200 shadow-inner h-14 p-1 rounded-2xl relative">
              <div 
                className={`absolute top-1 left-1 w-[calc(50%-4px)] h-[calc(100%-8px)] bg-gradient-to-br from-stone-200 to-stone-300 rounded-xl transition-transform duration-300 shadow-sm ${isFurusato ? 'translate-x-full' : ''}`} 
              />
              <button 
                onClick={() => setIsFurusato(false)} 
                className={`flex-1 z-10 font-black italic text-[13px] tracking-widest transition-colors duration-300 ${!isFurusato ? 'text-stone-700' : 'text-stone-400'}`}
                aria-pressed={!isFurusato}
              >
                通常検索
              </button>
              <button 
                onClick={() => setIsFurusato(true)} 
                className={`flex-1 z-10 font-black italic text-[13px] tracking-widest transition-colors duration-300 ${isFurusato ? 'text-stone-700' : 'text-stone-400'}`}
                aria-pressed={isFurusato}
              >
                ふるさと納税
              </button>
            </div>
          </div>
          
          <div className="bg-white/80 border border-stone-200 shadow-inner flex items-center rounded-2xl px-5 py-5 mb-5 focus-within:border-stone-400 focus-within:bg-white transition-all duration-300">
            <label htmlFor={searchInputId} className="sr-only">検索キーワード</label>
            <svg className="w-6 h-6 mr-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            <input 
              id={searchInputId}
              type="search" 
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="ブランドやアイテム名..." 
              className="bg-transparent w-full font-black outline-none placeholder:text-stone-400 text-xl text-stone-800" 
            />
          </div>
          
          <button 
            onClick={handleSearch} 
            className="w-full py-6 bg-gradient-to-b from-stone-700 to-stone-900 rounded-2xl text-white font-black text-2xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] active:translate-y-1 transition-transform tracking-widest focus:outline-none focus:ring-4 focus:ring-stone-400"
          >
            検索を開始する
          </button>
        </div>
        <Footer />
      </div>
    </div>
  );
}