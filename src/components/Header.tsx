import { useNavigate, useLocation } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;

  return (
    <header className="shrink-0 bg-white/90 backdrop-blur-md border-b border-stone-200 z-30">
      <div className="flex items-center justify-between px-5 py-3">
        {/* ロゴ */}
        <button
          onClick={() => navigate('/')}
          className="font-black italic text-xl tracking-tighter text-stone-800 focus:outline-none"
          aria-label="トップページへ"
        >
          RakScout
        </button>

        {/* ナビリンク */}
        <nav className="flex items-center gap-1">
          <button
            onClick={() => navigate('/metrics')}
            className={`px-3 py-1.5 rounded-full text-[11px] font-black tracking-wider transition-colors focus:outline-none ${
              isActive('/metrics')
                ? 'bg-stone-800 text-white'
                : 'text-stone-500 hover:bg-stone-100'
            }`}
          >
            指標について
          </button>
          <button
            onClick={() => navigate('/faq')}
            className={`px-3 py-1.5 rounded-full text-[11px] font-black tracking-wider transition-colors focus:outline-none ${
              isActive('/faq')
                ? 'bg-stone-800 text-white'
                : 'text-stone-500 hover:bg-stone-100'
            }`}
          >
            FAQ
          </button>
        </nav>
      </div>
    </header>
  );
}
