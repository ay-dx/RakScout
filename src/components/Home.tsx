import { useState, useId } from 'react';
import { useLocation } from 'wouter';
import Footer from './Footer';

const STORAGE_KEY = 'rakScoutSearchParams';

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
    sessionStorage.setItem(STORAGE_KEY, params.toString());
    setLocation(`/list?${params.toString()}`);
  };

  const setSampleKeyword = (sample: string) => {
    setKeyword(sample);
  };

  return (
    <main className="flex flex-col h-full relative bg-cream">
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-cream/30 via-cream/80 to-cream pointer-events-none"></div>

      <div className="relative z-10 flex flex-col h-full p-8 pt-12 overflow-y-auto">
        <header className="font-black italic text-2xl tracking-tighter text-stone-500">
          RakScout
        </header>

        {/* ファーストビュー */}
        <section className="mt-6 text-center">
          <h1 className="sr-only">楽天市場のお宝商品＆ふるさと納税を一括検索 | RakScout</h1>
          <h2 className="text-6xl font-black italic leading-[0.85] tracking-tighter text-stone-800 drop-shadow-[0_4px_12px_rgba(0,0,0,0.08)]" aria-hidden="true">
            お宝を<br/>探せ！
          </h2>
          <p className="mt-4 text-lg text-stone-600 max-w-md mx-auto leading-relaxed">
            楽天市場とふるさと納税から<br/>
            <span className="font-bold text-stone-800">コスパ最強のお宝</span>を<br/>
            セイバーメトリクスで発掘します
          </p>
        </section>

        {/* 3指標カード */}
        <div className="grid grid-cols-3 gap-3 mt-6 px-1">
          <div className="bg-white/60 backdrop-blur border border-stone-200 rounded-2xl p-3 text-center">
            <div className="text-xl mb-1">🏆</div>
            <div className="text-[10px] font-black text-red-500 tracking-wider">WAR</div>
            <div className="text-[9px] text-stone-500 mt-0.5 leading-tight">総合<br/>勝利価値</div>
          </div>
          <div className="bg-white/60 backdrop-blur border border-stone-200 rounded-2xl p-3 text-center">
            <div className="text-xl mb-1">🚀</div>
            <div className="text-[10px] font-black text-blue-500 tracking-wider">ISO</div>
            <div className="text-[9px] text-stone-500 mt-0.5 leading-tight">純粋<br/>長打力</div>
          </div>
          <div className="bg-white/60 backdrop-blur border border-stone-200 rounded-2xl p-3 text-center">
            <div className="text-xl mb-1">🎯</div>
            <div className="text-[10px] font-black text-green-500 tracking-wider">FIP</div>
            <div className="text-[9px] text-stone-500 mt-0.5 leading-tight">守備<br/>非依存評価</div>
          </div>
        </div>

        {/* 検索前価値提示 */}
        <section className="mt-6 mb-2">
          <h2 className="sr-only">RakScoutの特徴</h2>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[12px] text-stone-600">
              <span className="w-5 h-5 rounded-full bg-stone-200 flex items-center justify-center text-[10px] font-black shrink-0">1</span>
              <span>通常ランキングでは埋もれる<span className="font-bold text-stone-800">隠れた名品</span>を発見</span>
            </div>
            <div className="flex items-center gap-2 text-[12px] text-stone-600">
              <span className="w-5 h-5 rounded-full bg-stone-200 flex items-center justify-center text-[10px] font-black shrink-0">2</span>
              <span>レビュー評価と価格のバランスで<span className="font-bold text-stone-800">損しない選択</span></span>
            </div>
            <div className="flex items-center gap-2 text-[12px] text-stone-600">
              <span className="w-5 h-5 rounded-full bg-stone-200 flex items-center justify-center text-[10px] font-black shrink-0">3</span>
              <span><span className="font-bold text-stone-800">WARスコア</span>で客観的に比較</span>
            </div>
          </div>
        </section>

        {/* 検索フォーム */}
        <section className="mt-auto mb-[2vh]">
          <h2 className="sr-only">商品検索フォーム</h2>
          
          <div className="mb-4">
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
          
          <div className="bg-white/80 border border-stone-200 shadow-inner flex items-center rounded-2xl px-5 py-4 mb-4 focus-within:border-stone-400 focus-within:bg-white transition-all duration-300">
            <label htmlFor={searchInputId} className="sr-only">検索キーワード</label>
            <svg className="w-6 h-6 mr-4 text-stone-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
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
            className="w-full py-5 bg-gradient-to-b from-stone-700 to-stone-900 rounded-2xl text-white font-black text-2xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] active:translate-y-1 transition-transform tracking-widest focus:outline-none focus:ring-4 focus:ring-stone-400"
          >
            検索を開始する
          </button>

          {/* サンプルキーワード */}
          <div className="mt-4">
            <h3 className="text-[10px] font-black text-stone-400 tracking-widest uppercase mb-2">おすすめ検索</h3>
            <div className="flex flex-wrap gap-2">
              {['黒毛和牛', '北海道 蟹', '米 20kg', 'ハンバーグ', 'りんご'].map((sample) => (
                <button
                  key={sample}
                  onClick={() => setSampleKeyword(sample)}
                  className="px-3 py-1.5 bg-white/50 border border-stone-200 rounded-full text-[11px] font-bold text-stone-600 active:scale-95 transition-transform hover:bg-white"
                >
                  {sample}
                </button>
              ))}
            </div>
          </div>

          {/* ふるさと納税モード時のヒント */}
          {isFurusato && (
            <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl">
              <p className="text-[11px] text-amber-800 font-bold leading-relaxed">
                💡 限度額目安: 所得に応じた寄付上限額を確認しましょう
              </p>
            </div>
          )}

          {/* 空検索時のメッセージ */}
          {!keyword.trim() && (
            <p className="mt-3 text-center text-[11px] text-stone-400">
              キーワードを入力して検索を開始してください
            </p>
          )}
        </section>
        <Footer />
      </div>
    </main>
  );
}