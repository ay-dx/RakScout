import { useState, useId } from 'react';
import { useLocation } from 'wouter';

export function SearchBar() {
  const [keyword, setKeyword] = useState('');
  const inputId = useId();
  const labelId = useId();
  const [, navigate] = useLocation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`#/search?q=${encodeURIComponent(keyword.trim())}&sort=war&order=desc`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto" role="search">
      <label htmlFor={inputId} id={labelId} className="sr-only">商品を検索</label>
      <div className="relative">
        <input
          id={inputId}
          type="search"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="探したい商品 Keyword..."
          aria-labelledby={labelId}
          className="w-full px-4 py-3 pr-12 bg-white border-2 border-warm-200 rounded-full text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-500 transition-colors"
        />
        <button
          type="submit"
          aria-label="検索"
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>
    </form>
  );
}