import { CavosWalletProvider } from '../../infrastructure/external/CavosWalletProvider';
import { RegisterUserRequestDto, RegisterUserResponseDto } from '../dto/UserDto';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { User } from '../../domain/entities/User';

export class RegisterUserUseCase {
  constructor(
    private cavosWalletProvider: CavosWalletProvider,
    private userRepository: UserRepository
  ) {}

  async execute(request: RegisterUserRequestDto): Promise<RegisterUserResponseDto> {
    const network = process.env['CAVOS_DEFAULT_NETWORK'] || 'sepolia';
    const user = await this.cavosWalletProvider.registerUser(
      request.email,
      request.password,
      network
    );
    const userEntity: User = {
      userId: user.userId,
      email: user.email,
      address: user.wallet.address,
    };
    await this.userRepository.createUser(userEntity, user.wallet.publicKey, user.wallet.privateKey);
    return {
      user_id: user.userId,
      email: user.email,
      address: user.wallet.address
    };
  }
} 