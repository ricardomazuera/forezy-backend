import { MarketService } from '../../domain/services/MarketService';
import { Market } from '../../domain/entities/Market';

export class GetMarketByIdUseCase {
  constructor(private marketService: MarketService) {}

  async execute(id: string): Promise<Market> {
    return await this.marketService.getMarketById(id);
  }
} 