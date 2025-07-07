import { Request, Response } from 'express';
import { RegisterUserUseCase } from '../../../application/use-cases/RegisterUserUseCase';
import { RegisterUserRequestDto, RegisterUserResponseDto, RegisterUserErrorResponseDto } from '../../../application/dto/UserDto';
import { LoginUserUseCase } from '../../../application/use-cases/LoginUserUseCase';
import { LoginUserRequestDto } from '../../../application/dto/UserDto';


export class UserController {
  constructor(
    private registerUserUseCase: RegisterUserUseCase,
    private loginUserUseCase: LoginUserUseCase
  ) {}

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

  /**
   * @swagger
   * /v1/api/users/login:
   *   post:
   *     summary: Login user with Cavos
   *     description: Authenticates a user using Cavos and returns user and wallet info.
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
   *         description: User authenticated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 userId:
   *                   type: string
   *                 email:
   *                   type: string
   *                 accessToken:
   *                   type: string
   *                 address:
   *                   type: string
   *       400:
   *         description: Missing required fields
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *       401:
   *         description: Invalid credentials
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                 message:
   *                   type: string
   */
  async loginUser(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400).json({ error: 'email and password are required' });
        return;
      }
      const requestData: LoginUserRequestDto = { email, password };
      const result = await this.loginUserUseCase.execute(requestData);
      res.status(200).json(result);
    } catch (error: any) {
      if (error?.status === 404) {
        res.status(404).json({ error: 'User not found in the database' });
        return;
      }
      if (error?.response?.status === 401) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }
      console.error('Error logging in user:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
} 