import { useNavigate } from 'react-router-dom';

export default function Footer() {
  const navigate = useNavigate();
  const year = new Date().getFullYear();

  return (
    <footer className="shrink-0 bg-white/80 backdrop-blur border-t border-stone-200 py-4 px-5">
      <nav className="flex justify-center gap-4 mb-3">
        <button
          onClick={() => navigate('/')}
          className="text-[11px] font-bold text-stone-500 hover:text-stone-800 transition-colors focus:outline-none"
        >
          ホーム
        </button>
        <button
          onClick={() => navigate('/list')}
          className="text-[11px] font-bold text-stone-500 hover:text-stone-800 transition-colors focus:outline-none"
        >
          検索結果
        </button>
        <button
          onClick={() => navigate('/metrics')}
          className="text-[11px] font-bold text-stone-500 hover:text-stone-800 transition-colors focus:outline-none"
        >
          指標について
        </button>
        <button
          onClick={() => navigate('/faq')}
          className="text-[11px] font-bold text-stone-500 hover:text-stone-800 transition-colors focus:outline-none"
        >
          FAQ
        </button>
      </nav>
      <p className="text-center text-[10px] font-bold text-stone-400">
        &copy; {year} RakScout. All rights reserved.
      </p>
    </footer>
  );
}
