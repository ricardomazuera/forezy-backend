import { Router } from 'express';
import { MarketController } from '../controllers/MarketController';
import { Container } from '../../container';

const router = Router();

// Get dependencies from container
const container = Container.getInstance();
const getMarketsUseCase = container.getGetMarketsUseCase();
const getMarketByIdUseCase = container.getGetMarketByIdUseCase();
const marketController = new MarketController(getMarketsUseCase, getMarketByIdUseCase);

// GET /api/markets
router.get('/', (req, res) => marketController.getMarkets(req, res));

// GET /api/markets/:id
router.get('/:market_id', (req, res) => marketController.getMarketById(req, res));

export default router; 