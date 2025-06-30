import { loadEnvironment } from './environment';

export interface AppConfig {
  port: number;
  nodeEnv: string;
  supabaseUrl: string;
  supabaseKey: string;
  cavosApiKey: string;
}

export function getAppConfig(): AppConfig {
  const env = loadEnvironment();

  return {
    port: env.PORT,
    nodeEnv: env.NODE_ENV,
    supabaseUrl: env.SUPABASE_URL,
    supabaseKey: env.SUPABASE_SERVICE_ROLE_KEY,
    cavosApiKey: env.CAVOS_API_KEY
  };
} 