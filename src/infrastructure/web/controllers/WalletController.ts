import { Request, Response } from 'express';
import { CreateWalletUseCase } from '../../../application/use-cases/CreateWalletUseCase';
import { CreateWalletRequestDto, CreateWalletResponseDto, WalletErrorResponseDto } from '../../../application/dto/WalletDto';

/**
 * @swagger
 * /v1/api/wallets/create:
 *   post:
 *     summary: Create a new wallet
 *     description: Creates a new wallet for a user.
 *     tags:
 *       - Wallets
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateWalletRequestDto'
 *     responses:
 *       200:
 *         description: Wallet created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateWalletResponseDto'
 *       400:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WalletErrorResponseDto'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WalletErrorResponseDto'
 */
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