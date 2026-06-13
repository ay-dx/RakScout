import { useState, useId } from 'react';
import { useNavigate } from 'react-router-dom';

const STORAGE_KEY = 'rakScoutSearchParams';

export default function Home() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [isFurusato, setIsFurusato] = useState(false);
  const searchInputId = useId();

  const handleSearch = () => {
    if (!keyword.trim()) return;
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'search', {
        search_term: keyword,
        search_mode: isFurusato ? 'furusato' : 'normal',
      });
    }
    const params = new URLSearchParams();
    params.set('q', keyword);
    if (isFurusato) params.set('furusato', '1');
    params.set('sort', 'WAR');
    sessionStorage.setItem(STORAGE_KEY, params.toString());
    navigate(`/list?${params.toString()}`);
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

        <section className="mt-8 text-center">
          <h1 className="text-4xl font-black italic leading-[0.9] tracking-tighter text-stone-800 drop-shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
            <span className="sr-only">RakScout - </span>
            ランキングに載らない、<br/>本当のお得を。
          </h1>
          <p className="mt-4 text-sm text-stone-600 max-w-sm mx-auto leading-relaxed">
            楽天市場の商品を独自分析。<br/>
            価格だけでは見えないコスパや<br/>
            ショップの安定性を比較できます。
          </p>

          <div className="flex justify-center gap-4 mt-4 text-[11px] text-stone-500 font-bold">
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
              完全無料
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
              登録不要
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
              楽天アカウント不要
            </span>
          </div>

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

          <div className="mt-3 text-center">
            <button
              onClick={() => navigate('/metrics')}
              className="text-[11px] font-black text-stone-500 hover:text-stone-800 transition-colors tracking-wider focus:outline-none"
            >
              指標について詳しく見る →
            </button>
          </div>

          <button
            onClick={() => document.getElementById('search-form')?.scrollIntoView({ behavior: 'smooth' })}
            className="mt-6 inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-b from-stone-700 to-stone-900 rounded-2xl text-white font-black text-lg shadow-[0_10px_30px_rgba(0,0,0,0.15)] active:translate-y-1 transition-transform tracking-widest focus:outline-none focus:ring-4 focus:ring-stone-400"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            商品を探す
          </button>
        </section>

        <section id="search-form" className="mt-6 mb-[2vh]">
          <h2 className="sr-only">商品検索フォーム</h2>

          <div className="mb-4">
            <div className="flex bg-white/70 border border-stone-200 shadow-inner h-14 p-1 rounded-2xl relative">
              <div 
                className={`absolute top-1 left-1 w-[calc(50%-4px)] h-[calc(100%-8px)] bg-gradient-to-br from-stone-200 to-stone-300 rounded-xl transition-transform duration-300 shadow-sm ${isFurusato ? 'translate-x-full' : ''}`} 
              />
              <button 
                onClick={() => {
                setIsFurusato(false);
                if (typeof window.gtag === 'function') {
                  window.gtag('event', 'tab_click', { tab_name: 'normal' });
                }
              }} 
                className={`flex-1 z-10 font-black italic text-[13px] tracking-widest transition-colors duration-300 ${!isFurusato ? 'text-stone-700' : 'text-stone-400'}`}
                aria-pressed={!isFurusato}
              >
                通常検索
              </button>
              <button 
                onClick={() => {
                setIsFurusato(true);
                if (typeof window.gtag === 'function') {
                  window.gtag('event', 'tab_click', { tab_name: 'furusato' });
                }
              }} 
                className={`flex-1 z-10 font-black italic text-[13px] tracking-widest transition-colors duration-300 ${isFurusato ? 'text-stone-700' : 'text-stone-400'}`}
                aria-pressed={isFurusato}
              >
                ふるさと納税
              </button>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-[10px] font-black text-stone-400 tracking-widest uppercase mb-2">
              {isFurusato ? 'おすすめ返礼品' : 'おすすめ検索'}
            </h3>
            <div className="flex flex-wrap gap-2">
              {(isFurusato
                ? ['黒毛和牛', 'ジェラート', '冷麺', '米 20kg', 'りんご']
                : ['ネッククーラー', '水冷ベスト', '避暑着', '酸辣湯麺', 'アイス梅']
              ).map((sample) => (
                <button
                  key={sample}
                  onClick={() => {
                    setSampleKeyword(sample);
                    if (typeof window.gtag === 'function') {
                      window.gtag('event', 'select_keyword', {
                        keyword: sample,
                        search_mode: isFurusato ? 'furusato' : 'normal',
                      });
                    }
                    const params = new URLSearchParams();
                    params.set('q', sample);
                    if (isFurusato) params.set('furusato', '1');
                    params.set('sort', 'WAR');
                    sessionStorage.setItem(STORAGE_KEY, params.toString());
                    navigate(`/list?${params.toString()}`);
                  }}
                  className="px-3 py-1.5 bg-white/50 border border-stone-200 rounded-full text-[11px] font-bold text-stone-600 active:scale-95 transition-transform hover:bg-white"
                >
                  {sample}
                </button>
              ))}
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

          {isFurusato && (
            <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl">
              <p className="text-[11px] text-amber-800 font-bold leading-relaxed">
                💡 限度額目安: 所得に応じた寄付上限額を確認しましょう
              </p>
            </div>
          )}

          {!keyword.trim() && (
            <p className="mt-3 text-center text-[11px] text-stone-400">
              キーワードを入力して検索を開始してください
            </p>
          )}
        </section>

        {/* SEOコンテンツセクション */}
        <section className="mt-8 mb-4">
          <h2 className="text-xl font-black italic tracking-tighter text-stone-800 mb-3">
            ランキングに載らない、本当のお得を見つける
          </h2>
          <p className="text-sm text-stone-600 leading-relaxed mb-4">
            RakScoutは、楽天市場とふるさと納税サイトから「本当にお得な商品」を発見する検索ツールです。
            通常のランキングでは上位に表示されにくい、隠れた名品やコスパ最強の商品を独自のアルゴリズムで抽出します。
            価格だけでは見えない商品の本質的な価値を、WAR・ISO・FIPの3つの指標で多角的に評価します。
          </p>

          <h2 className="text-xl font-black italic tracking-tighter text-stone-800 mb-3 mt-6">
            3つの独自指標で商品を徹底分析
          </h2>

          <h3 className="text-lg font-black text-stone-700 mb-2 mt-4">
            WAR（総合コストパフォーマンス）
          </h3>
          <p className="text-sm text-stone-600 leading-relaxed mb-3">
            価格・評価・レビュー品質などを総合的に分析し、商品全体のコスパを数値化します。
            WARが高い商品は、支払った価格以上の価値が期待できる「お宝」です。
            楽天市場の膨大な商品の中から、本当に買い得なアイテムを客観的に選別できます。
          </p>

          <h3 className="text-lg font-black text-stone-700 mb-2 mt-4">
            ISO（商品の個性・インパクト）
          </h3>
          <p className="text-sm text-stone-600 leading-relaxed mb-3">
            レビュー件数だけでは見えない商品の個性や存在感を評価します。
            ISOが高い商品は、特徴や魅力が際立つ「隠れた名品」です。
            知名度は低いものの、実際に購入したユーザーの満足度が高い商品を発掘できます。
          </p>

          <h3 className="text-lg font-black text-stone-700 mb-2 mt-4">
            FIP（ショップの安定性）
          </h3>
          <p className="text-sm text-stone-600 leading-relaxed mb-4">
            商品そのものではなく、ショップ対応や配送面など購入体験の安定性を評価します。
            FIPが低いほど、配送の速さや梱包品質、問い合わせ対応などが安定していることを示します。
            商品は良くてもショップの対応で失敗、というリスクを事前に回避できます。
          </p>

          <h2 className="text-xl font-black italic tracking-tighter text-stone-800 mb-3 mt-6">
            その商品は買いか？3つの指標で判断
          </h2>
          <p className="text-sm text-stone-600 leading-relaxed mb-4">
            RakScoutの使い方はシンプルです。検索キーワードを入力し、WAR・ISO・FIPのいずれかでソートするだけ。
            通常検索では楽天市場の商品を、ふるさと納税タブでは返礼品を対象に検索できます。
            気になる商品をタップすると、詳細ページで3指標のスコアとスカウティングレポートを確認できます。
            複数の指標を組み合わせることで、「商品自体は良いがショップに不安がある」「知名度は低いが満足度が高い」
            といった、通常のランキングでは気付きにくい特徴も把握できます。
          </p>

          <h2 className="text-xl font-black italic tracking-tighter text-stone-800 mb-3 mt-6">
            ふるさと納税の返礼品も対象
          </h2>
          <p className="text-sm text-stone-600 leading-relaxed mb-4">
            ふるさと納税の返礼品選びにもRakScoutを活用できます。
            寄付上限額の範囲内で、コスパ最強の返礼品を効率的に探せます。
            WARスコアで総合的な価値を比較し、自分に最適な返礼品を見つけましょう。
            限度額目安は所得に応じて異なるため、事前に確認することをおすすめします。
          </p>

          <h2 className="text-xl font-black italic tracking-tighter text-stone-800 mb-3 mt-6">
            よくある質問
          </h2>

          <h3 className="text-base font-black text-stone-700 mb-1 mt-3">
            RakScoutの検索は無料ですか？
          </h3>
          <p className="text-sm text-stone-600 leading-relaxed mb-3">
            はい、完全無料でご利用いただけます。登録や楽天アカウントも不要です。
          </p>

          <h3 className="text-base font-black text-stone-700 mb-1 mt-3">
            なぜ野球の指標を商品分析に使うのですか？
          </h3>
          <p className="text-sm text-stone-600 leading-relaxed mb-3">
            セイバーメトリクスは、表面的な数字だけでは見えない価値を発見するために発展した分析手法です。
            RakScoutでは、その考え方を参考に、商品の強みやリスクを多角的に分析しています。
          </p>

          <h3 className="text-base font-black text-stone-700 mb-1 mt-3">
            FIPは数値が高いほど良いのですか？
          </h3>
          <p className="text-sm text-stone-600 leading-relaxed mb-3">
            いいえ。FIPは数値が低いほど、ショップ対応や配送の安定性が高いことを示します。
          </p>

          <h3 className="text-base font-black text-stone-700 mb-1 mt-3">
            検索結果はどのようにソートされますか？
          </h3>
          <p className="text-sm text-stone-600 leading-relaxed mb-4">
            デフォルトではWAR（総合コストパフォーマンス）の高い順に表示されます。
            ISOモード、FIPモードに切り替えることで、それぞれの指標でソートできます。
          </p>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/faq')}
              className="text-sm font-black text-stone-500 hover:text-stone-800 transition-colors tracking-wider focus:outline-none"
            >
              その他の質問はFAQを見る →
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
