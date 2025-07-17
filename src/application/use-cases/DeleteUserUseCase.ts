import { CavosWalletProvider } from '../../infrastructure/external/CavosWalletProvider';
import { UserRepository } from '../../domain/repositories/UserRepository';

export class DeleteUserUseCase {
  constructor(
    private cavosWalletProvider: CavosWalletProvider,
    private userRepository: UserRepository
  ) {}

  async execute(id: string, userId: string): Promise<{ message: string }> {
    console.log('Deleting user', id, userId);
    const cavosResult = await this.cavosWalletProvider.deleteUser(userId);
    console.log('Cavos result', cavosResult);
    await this.userRepository.deleteUserById(id);
    console.log('User deleted from database');
    return {
      message: 'User deleted from Forezy',
    };
  }
} 