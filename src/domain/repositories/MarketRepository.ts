import { Market, MarketFilters, MarketListResponse } from '../entities/Market';

export interface MarketRepository {
  findAll(filters?: MarketFilters): Promise<MarketListResponse>;
  findById(id: string): Promise<Market | null>;
  findByStatus(status: 'active' | 'resolved' | 'cancelled'): Promise<Market[]>;
  findByCategory(category: string): Promise<Market[]>;
} 