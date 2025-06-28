import { deployWallet } from 'cavos-service-sdk';
import { ExternalWalletProvider } from '../../domain/services/WalletService';

export class CavosWalletProvider implements ExternalWalletProvider {
  constructor(private apiKey: string) {}

  async createWallet(network: string): Promise<{
    publicKey: string;
    privateKey: string;
    address: string;
  }> {
    const wallet = await deployWallet(network, this.apiKey);
    return {
      publicKey: wallet.public_key, 
      privateKey: wallet.private_key, 
      address: wallet.address
    };
  }
} 