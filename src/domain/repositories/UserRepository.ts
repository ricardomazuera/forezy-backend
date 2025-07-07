import { User } from '../entities/User';

export interface UserRepository {
  findByUserId(userId: string): Promise<User | null>;
  createUser(user: User, publicKey: string, privateKey: string): Promise<User>;
} 