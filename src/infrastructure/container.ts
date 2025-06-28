import { SupabaseWalletRepository } from './database/SupabaseWalletRepository';
import { CavosWalletProvider } from './external/CavosWalletProvider';
import { WalletService } from '../domain/services/WalletService';
import { CreateWalletUseCase } from '../application/use-cases/CreateWalletUseCase';
import { getAppConfig } from './config/app';
import { createSupabaseClient } from './database/supabase';

export class Container {
  private static instance: Container;
  private config: ReturnType<typeof getAppConfig>;
  private supabaseClient: any;
  private walletRepository!: SupabaseWalletRepository;
  private cavosWalletProvider!: CavosWalletProvider;
  private walletService!: WalletService;
  private createWalletUseCase!: CreateWalletUseCase;

  private constructor() {
    try {
      this.config = getAppConfig();
      this.validateConfig();
      this.initializeDependencies();
    } catch (error) {
      console.error('❌ Error initializing container:', error);
      throw error;
    }
  }

  public static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }

  private validateConfig(): void {
    if (!this.config.supabaseUrl || !this.config.supabaseKey) {
      throw new Error('Supabase configuration is missing');
    }
    
    if (!this.config.cavosApiKey) {
      throw new Error('CAVOS_API_KEY is missing');
    }
  }

  private initializeDependencies(): void {
    console.log('🔧 Initializing dependencies...');
    
    // Infrastructure - Supabase connection
    this.supabaseClient = createSupabaseClient(this.config.supabaseUrl, this.config.supabaseKey);
    
    // Repositories
    this.walletRepository = new SupabaseWalletRepository(this.supabaseClient);
    
    // External providers
    this.cavosWalletProvider = new CavosWalletProvider(this.config.cavosApiKey);
    
    // Domain services
    this.walletService = new WalletService(this.walletRepository, this.cavosWalletProvider);
    
    // Use cases
    this.createWalletUseCase = new CreateWalletUseCase(this.walletService);
    
    console.log('🎉 All dependencies initialized successfully');
  }

  public getConfig() {
    return this.config;
  }

  public getCreateWalletUseCase(): CreateWalletUseCase {
    return this.createWalletUseCase;
  }

  public getWalletService(): WalletService {
    return this.walletService;
  }
} 