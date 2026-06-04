import { RareCard } from '../components/RareCard';
import type { Item } from '../types';

interface DetailProps {
  params: URLSearchParams;
}

export function Detail({ params }: DetailProps) {
  let item: Item | null = null;
  try {
    const dataStr = params.get('data');
    if (dataStr) item = JSON.parse(decodeURIComponent(dataStr));
  } catch { item = null; }

  if (!item) {
    return (
      <main className="max-w-md mx-auto text-center py-20">
        <p className="text-gray-600 mb-4">商品情報が見つかりません</p>
        <a href="#/" className="text-red-600 hover:underline">ホームに戻る</a>
      </main>
    );
  }

  return (
    <main className="px-4 py-6 max-w-2xl mx-auto">
      <a href="#/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        戻る
      </a>

      <RareCard item={item} />

      <div className="mt-8 flex flex-col gap-3">
        <a href={item.itemUrl} target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          楽天市場で確認
        </a>
        <button className="flex items-center justify-center gap-2 w-full py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          カートに追加
        </button>
      </div>

      <div className="mt-8 p-4 bg-white rounded-xl">
        <h3 className="font-medium text-gray-900 mb-2">店舗情報</h3>
        <p className="text-gray-600">{item.shopName}</p>
      </div>
    </main>
  );
}