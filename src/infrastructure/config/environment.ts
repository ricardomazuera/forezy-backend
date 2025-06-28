import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

export interface Environment {
  NODE_ENV: string;
  PORT: number;
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  CAVOS_API_KEY: string;
}

export function loadEnvironment(): Environment {
  const requiredEnvVars = [
    'SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
    'CAVOS_API_KEY'
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    throw new Error(`Variables de entorno requeridas faltantes: ${missingVars.join(', ')}`);
  }

  return {
    NODE_ENV: process.env['NODE_ENV'] || 'development',
    PORT: parseInt(process.env['PORT'] || '3000', 10),
    SUPABASE_URL: process.env['SUPABASE_URL']!,
    SUPABASE_SERVICE_ROLE_KEY: process.env['SUPABASE_SERVICE_ROLE_KEY']!,
    CAVOS_API_KEY: process.env['CAVOS_API_KEY']!
  };
}

export function isDevelopment(): boolean {
  return process.env['NODE_ENV'] === 'development';
}

export function isProduction(): boolean {
  return process.env['NODE_ENV'] === 'production';
}

export function isTest(): boolean {
  return process.env['NODE_ENV'] === 'test';
} 