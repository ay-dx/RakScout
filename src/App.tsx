import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import List from './components/List';
import Detail from './components/Detail';
import Metrics from './components/Metrics';
import Faq from './components/Faq';

// GA4ページ遷移計測
function PageTracker() {
  const location = useLocation();

  useEffect(() => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'page_view',
      page_path: location.pathname + location.search,
      page_title: document.title,
      page_location: window.location.href,
    });
  }, [location]);

  return null;
}

export default function App() {
  return (
    <HashRouter>
      <div className="w-full max-w-[480px] h-[100dvh] mx-auto bg-cream relative overflow-hidden shadow-2xl flex flex-col">
        <Header />
        <div className="flex-1 overflow-y-auto">
          <PageTracker />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/list" element={<List />} />
            <Route path="/detail" element={<Detail />} />
            <Route path="/metrics" element={<Metrics />} />
            <Route path="/faq" element={<Faq />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </HashRouter>
  );
}
