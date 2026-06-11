import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Helmet } from 'react-helmet-async';
import { RakScoutItem } from '../types';
import MetricBar from './MetricBar';

const STORAGE_KEY = 'rakScoutSearchParams';

export default function Detail() {
  const [, setLocation] = useLocation();
  const [item, setItem] = useState<RakScoutItem | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const detailId = params.get('detail');
    
    // 商品データ取得
    const itemStr = sessionStorage.getItem('rakScoutSelectedItem');
    if (itemStr) {
      const parsed = JSON.parse(itemStr);
      if (parsed.id === detailId) {
        setItem(parsed);
      }
    }
    
    // detail パラメータを除去して検索条件を保存（他の商品を見る用）
    params.delete('detail');
    sessionStorage.setItem(STORAGE_KEY, params.toString());
  }, []);

  const handleToResults = () => {
    const savedParams = sessionStorage.getItem(STORAGE_KEY);
    if (savedParams) {
      setLocation(`/list?${savedParams}`);
    } else {
      setLocation('/');
    }
  };

  if (!item) {
    return (
      <>
        <Helmet>
          <title>商品詳細 - RakScout</title>
          <meta name="description" content="楽天市場のお宝商品詳細ページ" />
        </Helmet>
        <div className="flex items-center justify-center h-full bg-cream">
          <p className="text-stone-500 font-bold">読み込み中...</p>
        </div>
      </>
    );
  }

  const canonicalUrl = `https://ay-dx.github.io/RakScout/detail?id=${item.id}`;

  return (
    <>
      <Helmet>
        <title>{`${item.name} - RakScout`}</title>
        <meta name="description" content={`${item.name}の価格は${item.price.toLocaleString()}円。WAR${item.metrics.WAR.value}・ISO${item.metrics.ISO.value}・FIP${item.metrics.FIP.value}のスコアで評価。`} />
        <meta property="og:title" content={`${item.name} - RakScout`} />
        <meta property="og:description" content={`WAR${item.metrics.WAR.value}の高評価商品。${item.report}`} />
        <meta property="og:image" content={item.image} />
        <meta property="og:type" content="product" />
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>
      
      {/* 構造化データ */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          "name": item.name,
          "image": item.image,
          "offers": {
            "@type": "Offer",
            "price": item.price,
            "priceCurrency": "JPY",
            "url": item.affiliateUrl
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": item.metrics.WAR.value,
            "bestRating": "10"
          }
        })}
      </script>

      <div className="flex flex-col h-full bg-cream p-5 overflow-y-auto">
        {/* 他の商品を見るボタン */}
        <button 
          onClick={handleToResults}
          className="flex items-center gap-2 w-fit mb-5 px-4 py-3 bg-white/80 backdrop-blur rounded-full border border-stone-200 active:scale-90 z-20 shadow-lg shrink-0 text-stone-600 focus:outline-none focus:ring-2 focus:ring-stone-400"
          aria-label="他の商品を見る"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
          <span className="font-black text-sm tracking-wider">他の商品を見る</span>
        </button>

        <div className="flex-1 flex flex-col items-center">
          {/* レアカード外枠 */}
          <div className="w-full relative shadow-[0_30px_60px_rgba(0,0,0,0.12)] p-1 bg-[linear-gradient(135deg,#ffffff_0%,#e7e5e4_20%,#a8a29e_50%,#e7e5e4_80%,#ffffff_100%)]" style={{ clipPath: 'polygon(4% 0%, 96% 0%, 100% 100%, 0% 100%)' }}>
            
            <div className="w-full pt-8 pb-10 px-6 bg-carbon relative" style={{ clipPath: 'polygon(4% 0%, 96% 0%, 100% 100%, 0% 100%)' }}>
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-black/20 pointer-events-none z-0"></div>
              
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="flex-1 pr-4">
                  <h4 className="text-[10px] font-black text-stone-400 tracking-[0.4em] uppercase mb-1">Scouted Item</h4>
                  <h2 className="line-clamp-2 text-[20px] font-black italic tracking-tighter leading-tight text-white drop-shadow-md">
                    {item.name}
                  </h2>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-[10px] font-black text-stone-400 tracking-widest uppercase mb-1">価格</div>
                  <div className="font-oswald text-yellow-500 font-black italic text-[32px] leading-none drop-shadow-[2px_2px_0_#92400e]">
                    ¥{item.price.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="w-[60%] mx-auto aspect-square rounded-2xl bg-white border border-stone-200 overflow-hidden mb-8 shadow-[inset_0_0_20px_rgba(0,0,0,0.05)] relative z-10 flex items-center justify-center p-2">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-xl" />
              </div>

              {/* 指標バー */}
              <div className="space-y-4 mb-10 relative z-10">
                <MetricBar label="WAR" value={item.metrics.WAR.value} pct={item.metrics.WAR.pct} colorClass="bg-gradient-to-r from-red-900 to-red-500" />
                <MetricBar label="ISO" value={item.metrics.ISO.value} pct={item.metrics.ISO.pct} colorClass="bg-gradient-to-r from-blue-900 to-blue-500" />
                <MetricBar label="FIP" value={item.metrics.FIP.value} pct={item.metrics.FIP.pct} colorClass="bg-gradient-to-r from-green-900 to-green-500" />
              </div>

              {/* スカウティングレポート */}
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
                className="block w-full py-5 rounded-md text-white font-black italic text-2xl tracking-tighter text-center transition-all z-10 relative bg-gradient-to-b from-orange-500 to-red-600 shadow-[0_6px_0_#991b1b,0_10px_20px_rgba(0,0,0,0.5)] active:translate-y-[6px] active:shadow-[0_0px_0_#991b1b,0_4px_6px_rgba(0,0,0,0.5)] focus:outline-none focus:ring-4 focus:ring-orange-400"
              >
                今すぐチェック！
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}