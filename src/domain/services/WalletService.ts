import { Wallet, WalletCreationRequest, WalletCreationResponse } from '../entities/Wallet';
import { WalletRepository } from '../repositories/WalletRepository';

export interface ExternalWalletProvider {
  createWallet(network: string): Promise<{
    publicKey: string;
    privateKey: string;
    address: string;
  }>;
}

export class WalletService {
  constructor(
    private walletRepository: WalletRepository,
    private externalWalletProvider: ExternalWalletProvider
  ) {}

  async createOrFetchWallet(request: WalletCreationRequest): Promise<WalletCreationResponse> {
    // Check if wallet already exists for this user
    const existingWallet = await this.walletRepository.findByAuthUid(request.authUid);
    
    if (existingWallet) {
      return {
        publicKey: existingWallet.publicKey,
        privateKey: existingWallet.encryptedPrivateKey, // Note: This is encrypted in DB
        address: existingWallet.address,
      };
    }

    // Create new wallet using external provider
    const network = request.network || 'sepolia';
    const walletData = await this.externalWalletProvider.createWallet(network);

    // Save wallet to database
    const newWallet: Wallet = {
      authUid: request.authUid,
      publicKey: walletData.publicKey,
      encryptedPrivateKey: walletData.privateKey, 
      address: walletData.address,
    };

    await this.walletRepository.create(newWallet);

    return {
      publicKey: walletData.publicKey,
      privateKey: walletData.privateKey,
      address: walletData.address,
    };
  }
} 