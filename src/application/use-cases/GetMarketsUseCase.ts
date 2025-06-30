import { MarketService } from '../../domain/services/MarketService';
import { MarketFilters, MarketListResponse } from '../../domain/entities/Market';

export class GetMarketsUseCase {
  constructor(private marketService: MarketService) {}

  async execute(filters?: MarketFilters): Promise<MarketListResponse> {
    return await this.marketService.getAllMarkets(filters);
  }
} 