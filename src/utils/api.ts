<<<<<<< HEAD
const APP_ID = import.meta.env.VITE_RAKUTEN_APP_ID;
const ACCESS_KEY = import.meta.env.VITE_RAKUTEN_ACCESS_KEY;
const AFFILIATE_ID = import.meta.env.VITE_RAKUTEN_AFFILIATE_ID;

export const fetchRakutenItems = async (keyword: string, isFurusato: boolean = false) => {
  if (!APP_ID || !ACCESS_KEY) {
    throw new Error("環境変数 VITE_RAKUTEN_APP_ID または VITE_RAKUTEN_ACCESS_KEY が設定されていません。");
  }

  const endpoint = "https://openapi.rakuten.co.jp/ichibams/api/IchibaItem/Search/20260401";
  const searchKeyword = isFurusato ? `ふるさと納税 ${keyword}`.trim() : keyword;

  const params = new URLSearchParams({
    applicationId: APP_ID,
    accessKey: ACCESS_KEY,
    keyword: searchKeyword,
    format: "json",
    hits: "30",
  });

  if (AFFILIATE_ID) {
    params.append("affiliateId", AFFILIATE_ID);
  }

  const response = await fetch(`${endpoint}?${params.toString()}`);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`楽天API通信エラー: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  if (!data.Items) {
    throw new Error("レスポンスに 'Items' が存在しません。");
  }

  return data.Items;
=======
const APP_ID = import.meta.env.VITE_RAKUTEN_APP_ID;
const ACCESS_KEY = import.meta.env.VITE_RAKUTEN_ACCESS_KEY;
const AFFILIATE_ID = import.meta.env.VITE_RAKUTEN_AFFILIATE_ID;

export const fetchRakutenItems = async (keyword: string, isFurusato: boolean = false) => {
  if (!APP_ID || !ACCESS_KEY) {
    throw new Error("環境変数 VITE_RAKUTEN_APP_ID または VITE_RAKUTEN_ACCESS_KEY が設定されていません。");
  }

  const endpoint = "https://openapi.rakuten.co.jp/ichibams/api/IchibaItem/Search/20260401";
  const searchKeyword = isFurusato ? `ふるさと納税 ${keyword}`.trim() : keyword;

  const params = new URLSearchParams({
    applicationId: APP_ID,
    accessKey: ACCESS_KEY,
    keyword: searchKeyword,
    format: "json",
    hits: "30",
  });

  if (AFFILIATE_ID) {
    params.append("affiliateId", AFFILIATE_ID);
  }

  const response = await fetch(`${endpoint}?${params.toString()}`);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`楽天API通信エラー: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  if (!data.Items) {
    throw new Error("レスポンスに 'Items' が存在しません。");
  }

  return data.Items;
>>>>>>> 461d78fc5660fe535b8ec07f4d89c054dec52300
};