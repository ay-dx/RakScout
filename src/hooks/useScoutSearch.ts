import { useState, useEffect } from 'react';
import { RakScoutItem } from '../types';
import { fetchRakutenItems } from '../utils/api';
import { processRakutenData } from '../utils/scoutLogic';

export function useScoutSearch(keyword: string | null, isFurusato: boolean) {
  const [data, setData] = useState<RakScoutItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!keyword) {
      setData([]);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const rawItems = await fetchRakutenItems(keyword, isFurusato);
        const processedItems = processRakutenData(rawItems);
        setData(processedItems);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "データ取得中にエラーが発生しました。");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [keyword, isFurusato]);

  return { data, isLoading, error };
}