import { Market, MarketListResponse } from '../../domain/entities/Market';

// Response DTOs
export interface MarketResponseDto {
  id: string;
  question: string;
  description: string;
  creatorId: string;
  status: string;
  resolutionTime: string;
  sourceOfTruth: string | null;
  resultOption: string | null;
  onchainAddress: string | null;
  createTms: string;
}

export interface MarketListResponseDto {
  markets: MarketResponseDto[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

export interface MarketErrorResponseDto {
  error: string;
  message?: string;
}

// Query DTOs
export interface MarketFiltersDto {
  status?: 'active' | 'resolved' | 'cancelled';
  category?: string;
  createdBy?: string;
  limit?: number;
  offset?: number;
  sortBy?: 'createdAt' | 'resolutionTime' | 'totalVolume';
  sortOrder?: 'asc' | 'desc';
}

// Utility functions to convert domain entities to DTOs
export function marketToDto(market: Market): MarketResponseDto {
  return {
    id: market.id,
    question: market.question,
    description: market.description,
    creatorId: market.creatorId,
    status: market.status,
    resolutionTime: market.resolutionTime.toISOString(),
    sourceOfTruth: market.sourceOfTruth,
    resultOption: market.resultOption,
    onchainAddress: market.onchainAddress,
    createTms: market.createTms.toISOString()
  };
}

export function marketListToDto(marketList: MarketListResponse): MarketListResponseDto {
  return {
    markets: marketList.markets.map(marketToDto),
    total: marketList.total,
    limit: marketList.limit,
    offset: marketList.offset,
    hasMore: marketList.hasMore
  };
} 