import { SupabaseClient } from '@supabase/supabase-js';

export class SupabaseBetRepository {
  constructor(private supabase: SupabaseClient) {}

  async findSharesByUserId(userId: string, limit = 20, offset = 0) {
    const { data, error, count } = await this.supabase
      .from('bets')
      .select('market_id, selected_option, amount', { count: 'exact' })
      .eq('user_id', userId)
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error(`Error fetching shares: ${error.message}`);
    }

    return { data: data || [], total: count || 0 };
  }
} 