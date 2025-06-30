import { SupabaseWalletRepository } from './database/SupabaseWalletRepository';
import { SupabaseMarketRepository } from './database/SupabaseMarketRepository';
import { CavosWalletProvider } from './external/CavosWalletProvider';
import { WalletService } from '../domain/services/WalletService';
import { MarketService } from '../domain/services/MarketService';
import { CreateWalletUseCase } from '../application/use-cases/CreateWalletUseCase';
import { GetMarketsUseCase } from '../application/use-cases/GetMarketsUseCase';
import { GetMarketByIdUseCase } from '../application/use-cases/GetMarketByIdUseCase';
import { getAppConfig } from './config/app';
import { createSupabaseClient } from './database/supabase';

export class Container {
  private static instance: Container;
  private config: ReturnType<typeof getAppConfig>;
  private supabaseClient: any;
  private walletRepository!: SupabaseWalletRepository;
  private marketRepository!: SupabaseMarketRepository;
  private cavosWalletProvider!: CavosWalletProvider;
  private walletService!: WalletService;
  private marketService!: MarketService;
  private createWalletUseCase!: CreateWalletUseCase;
  private getMarketsUseCase!: GetMarketsUseCase;
  private getMarketByIdUseCase!: GetMarketByIdUseCase;

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
    this.marketRepository = new SupabaseMarketRepository(this.supabaseClient);
    
    // External providers
    this.cavosWalletProvider = new CavosWalletProvider(this.config.cavosApiKey);
    
    // Domain services
    this.walletService = new WalletService(this.walletRepository, this.cavosWalletProvider);
    this.marketService = new MarketService(this.marketRepository);
    
    // Use cases
    this.createWalletUseCase = new CreateWalletUseCase(this.walletService);
    this.getMarketsUseCase = new GetMarketsUseCase(this.marketService);
    this.getMarketByIdUseCase = new GetMarketByIdUseCase(this.marketService);
    
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

  public getGetMarketsUseCase(): GetMarketsUseCase {
    return this.getMarketsUseCase;
  }

  public getGetMarketByIdUseCase(): GetMarketByIdUseCase {
    return this.getMarketByIdUseCase;
  }
} 