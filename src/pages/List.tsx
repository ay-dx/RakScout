import { useScoutSearch, normalizeParams } from '../hooks/useScoutSearch';
import type { SortKey } from '../types';

interface ListProps {
  params: URLSearchParams;
}

export function List({ params }: ListProps) {
  const { keyword, sortKey, sortOrder } = normalizeParams(params);
  const { data: items, loading, error, total, retry } = useScoutSearch(keyword, sortKey, sortOrder);

  const updateSort = (key: SortKey) => {
    const newOrder = sortKey === key && sortOrder === 'desc' ? 'asc' : 'desc';
    window.location.hash = `#/search?q=${encodeURIComponent(keyword)}&sort=${key}&order=${newOrder}`;
  };

  return (
    <main className="px-4 py-6">
      <div className="max-w-4xl mx-auto mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          🔍 "{keyword}" の検索結果
          {total > 0 && <span className="text-gray-500 text-lg ml-2">({total}件)</span>}
        </h1>
        <div className="flex gap-2 flex-wrap" role="tablist" aria-label="ソート">
          {(['war', 'iso', 'fip_pct'] as SortKey[]).map(key => (
            <button
              key={key}
              onClick={() => updateSort(key)}
              role="tab"
              aria-selected={sortKey === key}
              aria-pressed={sortKey === key}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                sortKey === key ? 'bg-gray-900 text-white' : 'bg-white text-gray-700 border border-gray-200'
              }`}
            >
              {key.toUpperCase()} {sortKey === key && (sortOrder === 'desc' ? '↓' : '↑')}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-gray-600">分析中...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <button onClick={retry} className="px-6 py-2 bg-red-600 text-white rounded-full font-medium hover:bg-red-700">
              再試行
            </button>
          </div>
        )}

        {!loading && !error && items?.length === 0 && (
          <div className="text-center py-12">
            <span className="text-4xl">📭</span>
            <p className="mt-4 text-gray-600">結果が見つかりませんでした</p>
          </div>
        )}

        {!loading && !error && items?.length! > 0 && (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" role="list">
            {items!.map(item => (
              <li key={item.itemId}>
                <a
                  href={`#/item/${item.itemId}?data=${encodeURIComponent(JSON.stringify(item))}`}
                  className="block bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="w-full h-40 bg-gray-100 flex items-center justify-center p-4">
                    {item.mediumImageUrls?.[0]?.imageUrl ? (
                      <img src={item.mediumImageUrls[0].imageUrl} alt={item.itemName} className="max-h-full object-contain" loading="lazy" />
                    ) : (
                      <span className="text-4xl text-gray-300">📦</span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 line-clamp-2 mb-2">{item.itemName}</h3>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xl font-bold text-red-600">¥{item.itemPrice.toLocaleString()}</span>
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <span className="text-yellow-500">★</span> {item.reviewAverage.toFixed(1)}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded">WAR {item.war.toFixed(1)}</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded">ISO {item.iso}</span>
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">FIP {item.fip_value.toFixed(2)}</span>
                    </div>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}