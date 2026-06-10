import { Router, Route, Switch } from 'wouter';
import { useHashLocation } from 'wouter/use-hash-location';
import Home from './components/Home';
import List from './components/List';
import Detail from './components/Detail';

export default function App() {
  return (
    // GitHub Pages向けのハッシュルーターを適用
    <Router hook={useHashLocation}>
      <div className="w-full max-w-[480px] h-[100dvh] mx-auto bg-cream relative overflow-hidden shadow-2xl flex flex-col">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/list" component={List} />
          <Route path="/detail" component={Detail} />
          {/* 404フォールバック */}
          <Route>
            <div className="flex-1 flex items-center justify-center font-bold text-stone-500">
              404 - Not Found
            </div>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}