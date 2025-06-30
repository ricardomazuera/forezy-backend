import { SupabaseClient } from '@supabase/supabase-js';
import { MarketRepository } from '../../domain/repositories/MarketRepository';
import { Market, MarketFilters, MarketListResponse } from '../../domain/entities/Market';

export class SupabaseMarketRepository implements MarketRepository {
  constructor(private supabaseClient: SupabaseClient) {}

  async findAll(filters?: MarketFilters): Promise<MarketListResponse> {
    try {
      let query = this.supabaseClient
        .from('markets')
        .select('*', { count: 'exact' });

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.creatorId) {
        query = query.eq('creator_id', filters.creatorId);
      }
      const sortBy = filters?.sortBy === 'resolutionTime' ? 'resolution_time' : 'create_tms';
      const sortOrder = filters?.sortOrder || 'desc';
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });
      const limit = filters?.limit || 20;
      const offset = filters?.offset || 0;
      query = query.range(offset, offset + limit - 1);
      const { data, error, count } = await query;
      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }
      const markets: Market[] = (data || []).map((row: any) => ({
        id: row.id,
        question: row.question,
        description: row.description,
        creatorId: row.creator_id,
        status: row.status,
        resolutionTime: new Date(row.resolution_time),
        sourceOfTruth: row.source_of_truth,
        resultOption: row.result_option,
        onchainAddress: row.onchain_address,
        createTms: new Date(row.create_tms)
      }));
      return {
        markets,
        total: count || 0,
        limit,
        offset,
        hasMore: (offset + limit) < (count || 0)
      };
    } catch (error) {
      throw new Error(`Error fetching markets: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async findById(id: string): Promise<Market | null> {
    try {
      const { data, error } = await this.supabaseClient
        .from('markets')
        .select('*')
        .eq('id', id)
        .single();
      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw new Error(`Database error: ${error.message}`);
      }
      if (!data) {
        return null;
      }
      return {
        id: data.id,
        question: data.question,
        description: data.description,
        creatorId: data.creator_id,
        status: data.status,
        resolutionTime: new Date(data.resolution_time),
        sourceOfTruth: data.source_of_truth,
        resultOption: data.result_option,
        onchainAddress: data.onchain_address,
        createTms: new Date(data.create_tms)
      };
    } catch (error) {
      throw new Error(`Error fetching market by ID: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async findByStatus(status: string): Promise<Market[]> {
    try {
      const { data, error } = await this.supabaseClient
        .from('markets')
        .select('*')
        .eq('status', status)
        .order('create_tms', { ascending: false });
      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }
      return (data || []).map((row: any) => ({
        id: row.id,
        question: row.question,
        description: row.description,
        creatorId: row.creator_id,
        status: row.status,
        resolutionTime: new Date(row.resolution_time),
        sourceOfTruth: row.source_of_truth,
        resultOption: row.result_option,
        onchainAddress: row.onchain_address,
        createTms: new Date(row.create_tms)
      }));
    } catch (error) {
      throw new Error(`Error fetching markets by status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async findByCategory(_category: string): Promise<Market[]> {
    // No category field in schema, return []
    return [];
  }
} 