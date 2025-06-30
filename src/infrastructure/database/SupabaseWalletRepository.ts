import { SupabaseClient } from '@supabase/supabase-js';
import { Wallet } from '../../domain/entities/Wallet';
import { WalletRepository } from '../../domain/repositories/WalletRepository';

export class SupabaseWalletRepository implements WalletRepository {
  constructor(private supabase: SupabaseClient) {}

  async findByAuthUid(authUid: string): Promise<Wallet | null> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('auth_uid', authUid)
      .maybeSingle();

    if (error) {
      throw new Error(`Error fetching wallet: ${error.message}`);
    }

    if (!data) {
      return null;
    }

    return {
      id: data.id,
      authUid: data.auth_uid,
      publicKey: data.public_key,
      encryptedPrivateKey: data.encripted_private_key,
      address: data.address,
      ...(data.created_at && { createdAt: new Date(data.created_at) })
    };
  }

  async create(wallet: Wallet): Promise<Wallet> {
    const { data, error } = await this.supabase
      .from('users')
      .insert({
        auth_uid: wallet.authUid,
        public_key: wallet.publicKey,
        encripted_private_key: wallet.encryptedPrivateKey,
        address: wallet.address,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Error creating wallet: ${error.message}`);
    }

    return {
      id: data.id,
      authUid: data.auth_uid,
      publicKey: data.public_key,
      encryptedPrivateKey: data.encripted_private_key,
      address: data.address,
      ...(data.created_at && { createdAt: new Date(data.created_at) })
    };
  }
} 