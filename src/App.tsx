import { HashRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import List from './pages/List';
import Detail from './pages/Detail';

export default function App() {
  return (
    <HashRouter>
      <div className="w-full max-w-[480px] h-[100dvh] mx-auto bg-cream relative overflow-hidden shadow-2xl flex flex-col">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/list" element={<List />} />
          <Route path="/detail" element={<Detail />} />
        </Routes>
      </div>
    </HashRouter>
  );
}
