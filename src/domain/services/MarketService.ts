import { MarketRepository } from '../repositories/MarketRepository';
import { Market, MarketFilters, MarketListResponse } from '../entities/Market';
import { DomainError, NotFoundError } from '../../shared/errors/DomainError';

export class MarketService {
  constructor(private marketRepository: MarketRepository) {}

  async getAllMarkets(filters?: MarketFilters): Promise<MarketListResponse> {
    try {
      return await this.marketRepository.findAll(filters);
    } catch (error) {
      throw new DomainError('Error fetching markets');
    }
  }

  async getMarketById(id: string): Promise<Market> {
    try {
      const market = await this.marketRepository.findById(id);
      
      if (!market) {
        throw new NotFoundError(`Market with ID ${id} does not exist`);
      }
      
      return market;
    } catch (error) {
      if (error instanceof DomainError || error instanceof NotFoundError) {
        throw error;
      }
      throw new DomainError('Error fetching market');
    }
  }

  async getActiveMarkets(): Promise<Market[]> {
    try {
      return await this.marketRepository.findByStatus('active');
    } catch (error) {
      throw new DomainError('Error fetching active markets');
    }
  }

  async getMarketsByCategory(category: string): Promise<Market[]> {
    try {
      return await this.marketRepository.findByCategory(category);
    } catch (error) {
      throw new DomainError('Error fetching markets by category');
    }
  }
} 