import { Request, Response } from 'express';
import { GetMarketsUseCase } from '../../../application/use-cases/GetMarketsUseCase';
import { GetMarketByIdUseCase } from '../../../application/use-cases/GetMarketByIdUseCase';
import { 
  MarketResponseDto, 
  MarketListResponseDto, 
  MarketErrorResponseDto,
  marketToDto,
  marketListToDto 
} from '../../../application/dto/MarketDto';
import { MarketFilters } from '../../../domain/entities/Market';
import { NotFoundError } from '../../../shared/errors/DomainError';

/**
 * @swagger
 * /v1/api/markets:
 *   get:
 *     summary: Get a list of markets
 *     description: Returns a list of markets with optional filters and pagination.
 *     tags:
 *       - Markets
 *     parameters:
 *       - in: query
 *         name: status
 *         required: false
 *         description: Filter by market status (open, closed, resolved, challenged)
 *         schema:
 *           type: string
 *           enum: [open, closed, resolved, challenged]
 *       - in: query
 *         name: creatorId
 *         required: false
 *         description: Filter by creator user ID
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         required: false
 *         description: Number of items per page (default 20)
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *       - in: query
 *         name: offset
 *         required: false
 *         description: Offset for pagination (default 0)
 *         schema:
 *           type: integer
 *           minimum: 0
 *       - in: query
 *         name: sortBy
 *         required: false
 *         description: Sort by field (createTms, resolutionTime)
 *         schema:
 *           type: string
 *           enum: [createTms, resolutionTime]
 *       - in: query
 *         name: sortOrder
 *         required: false
 *         description: Sort order (asc, desc)
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *     responses:
 *       200:
 *         description: List of markets
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 markets:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/MarketResponseDto'
 *                 total:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 offset:
 *                   type: integer
 *                 hasMore:
 *                   type: boolean
 *       400:
 *         description: Invalid status value
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MarketErrorResponseDto'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MarketErrorResponseDto'
 */
export class MarketController {
  constructor(
    private getMarketsUseCase: GetMarketsUseCase,
    private getMarketByIdUseCase: GetMarketByIdUseCase
  ) {}

  async getMarkets(req: Request, res: Response): Promise<void> {
    try {
      // Parse query parameters
      const filters: MarketFilters = {};
      const validStatuses = ['open', 'closed', 'resolved', 'challenged'];
      if (req.query['status']) {
        const status = req.query['status'] as string;
        if (!validStatuses.includes(status)) {
          res.status(400).json({ error: 'Invalid status value', message: `Valid values: ${validStatuses.join(', ')}` });
          return;
        }
        filters['status'] = status;
      }
      
      if (req.query['creatorId']) {
        filters['creatorId'] = req.query['creatorId'] as string;
      }
      
      if (req.query['limit']) {
        filters['limit'] = parseInt(req.query['limit'] as string);
      }
      
      if (req.query['offset']) {
        filters['offset'] = parseInt(req.query['offset'] as string);
      }
      
      if (req.query['sortBy']) {
        const sortBy = req.query['sortBy'] as string;
        if (sortBy === 'createTms' || sortBy === 'resolutionTime') {
          filters['sortBy'] = sortBy;
        }
      }
      
      if (req.query['sortOrder']) {
        const sortOrder = req.query['sortOrder'] as string;
        if (sortOrder === 'asc' || sortOrder === 'desc') {
          filters['sortOrder'] = sortOrder;
        }
      }

      // Execute use case
      const result = await this.getMarketsUseCase.execute(filters);

      // Convert to DTO and return response
      const response: MarketListResponseDto = marketListToDto(result);
      res.status(200).json(response);
    } catch (error) {
      console.error('Error fetching markets:', error);
      
      const errorResponse: MarketErrorResponseDto = {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      };
      
      res.status(500).json(errorResponse);
    }
  }

  /**
   * @swagger
   * /v1/api/markets/{market_id}:
   *   get:
   *     summary: Get market by ID
   *     description: Returns a market by its ID.
   *     tags:
   *       - Markets
   *     parameters:
   *       - in: path
   *         name: market_id
   *         required: true
   *         schema:
   *           type: string
   *         description: The market ID
   *     responses:
   *       200:
   *         description: Market found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/MarketResponseDto'
   *       400:
   *         description: Market ID is required
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/MarketErrorResponseDto'
   *       404:
   *         description: Market not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/MarketErrorResponseDto'
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/MarketErrorResponseDto'
   */
  async getMarketById(req: Request, res: Response): Promise<void> {
    try {
      const { market_id } = req.params;

      // Validate market ID
      if (!market_id) {
        const errorResponse: MarketErrorResponseDto = {
          error: 'Market ID is required'
        };
        res.status(400).json(errorResponse);
        return;
      }

      // Execute use case
      const result = await this.getMarketByIdUseCase.execute(market_id);

      // Convert to DTO and return response
      const response: MarketResponseDto = marketToDto(result);
      res.status(200).json(response);
    } catch (error) {
      console.error('Error fetching market by ID:', error);
      
      if (error instanceof NotFoundError) {
        const errorResponse: MarketErrorResponseDto = {
          error: 'Market not found',
          message: error.message
        };
        res.status(404).json(errorResponse);
        return;
      }
      
      const errorResponse: MarketErrorResponseDto = {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      };
      
      res.status(500).json(errorResponse);
    }
  }
} 