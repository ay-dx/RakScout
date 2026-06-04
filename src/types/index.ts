// Types for RakScout
export interface Item {
  itemId: string;
  itemName: string;
  itemPrice: number;
  itemUrl: string;
  mediumImageUrls: { imageUrl: string }[];
  reviewCount: number;
  reviewAverage: number;
  shopName: string;
  // Calculated metrics
  war: number;
  iso: string;
  fip_value: number;
  fip_label: string;
  fip_pct: number;
  scouting_report: string;
}

export interface SearchResponse {
  items: Item[];
  count: number;
  keyword: string;
}

export type SortKey = 'war' | 'iso' | 'fip_pct';
export type SortOrder = 'desc' | 'asc';