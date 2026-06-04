import { Router, Route, Switch } from 'wouter';
import { useHashLocation } from 'wouter/use-hash-location';
import { Header } from './components/Header';
import { Home } from './pages/Home';
import { List } from './pages/List';
import { Detail } from './pages/Detail';
import './index.css';

function ListPage() {
  const hash = window.location.hash || '';
  const queryString = hash.includes('?') ? hash.split('?')[1] : '';
  const params = new URLSearchParams(queryString);
  return <List params={params} />;
}

function DetailPage() {
  const hash = window.location.hash || '';
  const queryString = hash.includes('?') ? hash.split('?')[1] : '';
  const params = new URLSearchParams(queryString);
  return <Detail params={params} />;
}

export default function App() {
  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <Router hook={useHashLocation}>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/search" component={ListPage} />
          <Route path="/item/:id" component={DetailPage} />
        </Switch>
      </Router>
      <footer className="py-6 text-center text-sm text-gray-500 border-t border-warm-200">
        <p>RakScout ⚾ MLB Analytics for Rakuten</p>
      </footer>
    </div>
  );
}