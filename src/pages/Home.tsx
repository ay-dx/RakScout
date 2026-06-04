import { SearchBar } from '../components/SearchBar';

export function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <div className="text-center mb-12">
        <div className="text-6xl mb-4">⚾</div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">RakScout</h1>
        <p className="text-lg text-gray-600">楽天市場をMLBAnalyticsで分析</p>
      </div>
      <SearchBar />
      <div className="mt-16 grid grid-cols-3 gap-6 max-w-lg">
        {[
          { label: 'WAR', sub: '総合貢献度', color: 'bg-red-100 text-red-600' },
          { label: 'ISO', sub: 'ポテンシャル', color: 'bg-blue-100 text-blue-600' },
          { label: 'FIP', sub: '安心スコア', color: 'bg-green-100 text-green-600' },
        ].map(({ label, sub, color }) => (
          <div key={label} className="text-center">
            <div className={`w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center ${color}`}>
              <span className="text-xl font-bold">{label}</span>
            </div>
            <p className="text-sm text-gray-600">{sub}</p>
          </div>
        ))}
      </div>
    </main>
  );
}