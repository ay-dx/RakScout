import { Link } from 'wouter';

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-cream/95 backdrop-blur-sm border-b border-warm-200">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="#/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <span className="text-2xl">⚾</span>
          <span className="text-xl font-bold text-gray-900">RakScout</span>
        </Link>
        <Link href="#/" className="p-2 rounded-full hover:bg-warm-200 transition-colors" aria-label="検索">
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </Link>
      </div>
    </header>
  );
}