import { WalletService } from '../../domain/services/WalletService';
import { CreateWalletRequestDto, CreateWalletResponseDto } from '../dto/WalletDto';

export class CreateWalletUseCase {
  constructor(private walletService: WalletService) {}

  async execute(request: CreateWalletRequestDto): Promise<CreateWalletResponseDto> {
    const result = await this.walletService.createOrFetchWallet({
      authUid: request.auth_uid,
      network: request.network || 'sepolia'
    });

    return {
      public_key: result.publicKey,
      private_key: result.privateKey,
      address: result.address,
    };
  }
} 