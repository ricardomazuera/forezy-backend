import { Router } from 'express';
import { WalletController } from '../controllers/WalletController';
import { Container } from '../../container';

const router = Router();

// Get dependencies from container
const container = Container.getInstance();
const createWalletUseCase = container.getCreateWalletUseCase();
const walletController = new WalletController(createWalletUseCase);

// POST /api/wallets/create
router.post('/create', (req, res) => walletController.createWallet(req, res));

export default router; 