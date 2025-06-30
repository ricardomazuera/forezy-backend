import { Request, Response } from 'express';
import { CreateWalletUseCase } from '../../../application/use-cases/CreateWalletUseCase';
import { CreateWalletRequestDto, CreateWalletResponseDto, WalletErrorResponseDto } from '../../../application/dto/WalletDto';

export class WalletController {
  constructor(private createWalletUseCase: CreateWalletUseCase) {}

  async createWallet(req: Request, res: Response): Promise<void> {
    try {
      const requestData: CreateWalletRequestDto = req.body;

      // Validate required fields
      if (!requestData.auth_uid) {
        const errorResponse: WalletErrorResponseDto = {
          error: 'auth_uid is required'
        };
        res.status(400).json(errorResponse);
        return;
      }

      // Execute use case
      const result: CreateWalletResponseDto = await this.createWalletUseCase.execute(requestData);

      // Return success response
      res.status(200).json(result);
    } catch (error) {
      console.error('Error creating wallet:', error);
      
      const errorResponse: WalletErrorResponseDto = {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      };
      
      res.status(500).json(errorResponse);
    }
  }
} 