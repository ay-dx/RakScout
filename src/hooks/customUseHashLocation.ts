import { useState, useEffect, useCallback } from 'react';

/**
 * wouterのuseHashLocationのカスタム版
 * window.location.search の影響を完全に排除する
 */
export function customUseHashLocation() {
  const [location, setLocation] = useState(() => {
    // hash のみを参照。search は完全に無視
    const hash = window.location.hash.replace(/^#/, '') || '/';
    return hash;
  });

  useEffect(() => {
    const handler = () => {
      const hash = window.location.hash.replace(/^#/, '') || '/';
      setLocation(hash);
    };
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);

  const navigate = useCallback((to: string) => {
    // search をクリアしてから hash を書き換え
    if (window.location.search) {
      window.history.replaceState(null, '', window.location.pathname);
    }
    window.location.hash = to;
  }, []);

  return [location, navigate] as const;
}
