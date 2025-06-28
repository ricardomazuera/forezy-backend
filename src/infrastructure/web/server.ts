import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { ApiResponse } from '../../shared/types/ApiResponse';
import walletRoutes from './routes/walletRoutes';

export function createServer(): Express {
  const app: Express = express();

  // Middleware
  app.use(helmet());
  app.use(cors());
  app.use(morgan('combined'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Basic routes
  app.get('/', (_req: Request, res: Response) => {
    const response: ApiResponse = {
      message: 'Welcome to Forezy Backend API',
      version: '1.0.0',
      status: 'running',
      timestamp: new Date().toISOString()
    };
    res.json(response);
  });

  app.get('/health', (_req: Request, res: Response) => {
    const response: ApiResponse = {
      status: 'OK',
      timestamp: new Date().toISOString()
    };
    res.json(response);
  });

  // API routes with v1/api prefix
  app.use('/v1/api/wallets', walletRoutes);

  // Error handling
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err.stack);
    const response: ApiResponse = {
      error: 'Something went wrong!',
      message: err.message,
      timestamp: new Date().toISOString()
    };
    res.status(500).json(response);
  });

  // 404 route
  app.use('*', (_req: Request, res: Response) => {
    const response: ApiResponse = {
      error: 'Route not found',
      timestamp: new Date().toISOString()
    };
    res.status(404).json(response);
  });

  return app;
} 