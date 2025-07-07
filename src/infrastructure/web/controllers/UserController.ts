import { Request, Response } from 'express';
import { RegisterUserUseCase } from '../../../application/use-cases/RegisterUserUseCase';
import { RegisterUserRequestDto, RegisterUserResponseDto, RegisterUserErrorResponseDto } from '../../../application/dto/UserDto';


export class UserController {
  constructor(private registerUserUseCase: RegisterUserUseCase) {}

  /**
 * @swagger
 * /v1/api/users/register:
 *   post:
 *     summary: Register a new user and wallet
 *     description: Registers a new user and deploys a wallet.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: securePassword123
 *     responses:
 *       200:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                   example: "user_123"
 *                 email:
 *                   type: string
 *                   example: "user@example.com"
 *                 address:
 *                   type: string
 *                   example: "0x123..."

 *       400:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             schema:
*               type: object
*               properties:
*                 error:
*                   type: string
*                   example: "email and password are required"
*                 message:
*                   type: string
*                   example: "Missing required fields"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 *                 message:
 *                   type: string
 *                   example: "Unknown error"
 */
  async registerUser(req: Request, res: Response): Promise<void> {
    try {
      const requestData: RegisterUserRequestDto = req.body;

      // Validate required fields
      if (!requestData.email || !requestData.password) {
        const errorResponse: RegisterUserErrorResponseDto = {
          error: 'email and password are required'
        };
        res.status(400).json(errorResponse);
        return;
      }

      // Execute use case
      const result: RegisterUserResponseDto = await this.registerUserUseCase.execute(requestData);

      // Return success response
      res.status(200).json(result);
    } catch (error) {
      console.error('Error registering user:', error);
      const errorResponse: RegisterUserErrorResponseDto = {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      };
      res.status(500).json(errorResponse);
    }
  }
} 