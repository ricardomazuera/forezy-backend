import { CavosWalletProvider } from '../../infrastructure/external/CavosWalletProvider';
import { LoginUserRequestDto, LoginUserResponseDto } from '../dto/UserDto';
import { UserRepository } from '../../domain/repositories/UserRepository';

export class LoginUserUseCase {
  constructor(
    private cavosWalletProvider: CavosWalletProvider, 
    private userRepository: UserRepository
  ) {}

  async execute(request: LoginUserRequestDto): Promise<LoginUserResponseDto> {
    const authData = await this.cavosWalletProvider.loginUser(request.email, request.password);
    const user = await this.userRepository.findByUserId(authData.userId);
    if (!user) {
      throw { status: 404, message: 'User not found in the database' };
    }
    return {
      user_id_cavos: authData.userId,
      email: authData.email,
      access_token: authData.accessToken,
      address: authData.wallet.address
    };
  }
} 