import { useState, useEffect, useMemo, useCallback } from 'react';
import type { SearchResponse, SortKey, SortOrder } from '../types';
import { processItems } from './analytics';

const RAKUTEN_API = 'https://app.rakuten.co.jp/services/api/IchibaItem/Search/20220622';
const APP_ID = import.meta.env.VITE_RAKUTEN_APP_ID || '';
const AFFILIATE_ID = import.meta.env.VITE_RAKUTEN_AFFILIATE_ID || '';

const VALID_SORT_KEYS: SortKey[] = ['war', 'iso', 'fip_pct'];
const VALID_ORDERS: SortOrder[] = ['desc', 'asc'];

interface RakutenResponse {
  Items: { Item: RakutenItemResponse }[];
}
interface RakutenItemResponse {
  itemId: string;
  itemName: string;
  itemPrice: number;
  itemUrl: string;
  mediumImageUrls: { imageUrl: string }[];
  reviewCount: number;
  reviewAverage: number;
  shopName: string;
}

export function useScoutSearch(keyword: string, sortKey: SortKey, sortOrder: SortOrder) {
  const [data, setData] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  const fetchData = useCallback(async () => {
    if (!keyword.trim()) {
      setData(null);
      return;
    }
    if (!APP_ID) {
      setError('API key not configured. Set VITE_RAKUTEN_APP_ID in .env');
      setData(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const url = new URL(RAKUTEN_API);
      url.searchParams.set('applicationId', APP_ID);
      url.searchParams.set('affiliateId', AFFILIATE_ID);
      url.searchParams.set('keyword', keyword);
      url.searchParams.set('hits', '30');
      url.searchParams.set('format', 'json');

      const resp = await fetch(url.toString());
      
      if (!resp.ok) {
        if (resp.status >= 500) throw new Error('サーバーエラーが発生しました');
        if (resp.status === 429) throw new Error('リクエストが多すぎます');
        throw new Error(`検索に失敗しました (${resp.status})`);
      }

      const json: RakutenResponse = await resp.json();
      const rawItems = json.Items?.map(i => i.Item) || [];
      
      if (!rawItems.length) {
        setData({ items: [], count: 0, keyword });
        return;
      }

      const items = processItems(rawItems);
      setData({ items, count: items.length, keyword });
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期しないエラー');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [keyword, retryKey, APP_ID, AFFILIATE_ID]);

  useEffect(() => {
    const timer = setTimeout(fetchData, 300);
    return () => clearTimeout(timer);
  }, [fetchData]);

  const retry = useCallback(() => setRetryKey(k => k + 1), []);

  const sortedItems = useMemo(() => {
    if (!data?.items) return [];
    return [...data.items].sort((a, b) => {
      const valA = sortKey === 'war' ? a.war : sortKey === 'iso' ? parseFloat(a.iso) : a.fip_pct;
      const valB = sortKey === 'war' ? b.war : sortKey === 'iso' ? parseFloat(b.iso) : b.fip_pct;
      return sortOrder === 'asc' ? valA - valB : valB - valA;
    });
  }, [data, sortKey, sortOrder]);

  return { data: sortedItems, loading, error, total: data?.count ?? 0, retry };
}

export function normalizeParams(params: URLSearchParams): { keyword: string; sortKey: SortKey; sortOrder: SortOrder } {
  const rawSort = params.get('sort') || 'war';
  const rawOrder = params.get('order') || 'desc';
  return {
    keyword: params.get('q') || '',
    sortKey: VALID_SORT_KEYS.includes(rawSort as SortKey) ? rawSort as SortKey : 'war',
    sortOrder: VALID_ORDERS.includes(rawOrder as SortOrder) ? rawOrder as SortOrder : 'desc',
  };
}