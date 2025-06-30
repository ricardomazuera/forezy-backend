export interface Market {
  id: string;
  question: string;
  description: string;
  creatorId: string;
  status: string;
  resolutionTime: Date;
  sourceOfTruth: string | null;
  resultOption: string | null;
  onchainAddress: string | null;
  createTms: Date;
}

export interface MarketFilters {
  status?: string;
  creatorId?: string;
  limit?: number;
  offset?: number;
  sortBy?: 'createTms' | 'resolutionTime';
  sortOrder?: 'asc' | 'desc';
}

export interface MarketListResponse {
  markets: Market[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
} 