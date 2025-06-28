import { Wallet } from '../entities/Wallet';

export interface WalletRepository {
  findByAuthUid(authUid: string): Promise<Wallet | null>;
  create(wallet: Wallet): Promise<Wallet>;
} 