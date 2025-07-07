import { SupabaseClient } from '@supabase/supabase-js';
import { User } from '../../domain/entities/User';

export class SupabaseUserRepository {
  constructor(private supabase: SupabaseClient) {}

  async findByUserId(email: string): Promise<User | null> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (error) {
      throw new Error(`Error fetching user: ${error.message}`);
    }

    if (!data) {
      return null;
    }

    return {
      id: data.id,
      email: data.email,
      address: data.address,
      ...(data.created_at && { createdAt: new Date(data.created_at) })
    };
  }

  async createUser(user: User, publicKey: string, privateKey: string): Promise<User> {
    const { data, error } = await this.supabase
      .from('users')
      .insert({
        public_key: publicKey,
        encripted_private_key: privateKey,
        user_id_cavos: user.userId,
        email: user.email,
        address: user.address,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Error creating user: ${error.message}`);
    }

    return {
      id: data.id,
      ...(data.created_at && { createdAt: new Date(data.created_at) })
    };
  }
}

export * from './SupabaseUserRepository';
