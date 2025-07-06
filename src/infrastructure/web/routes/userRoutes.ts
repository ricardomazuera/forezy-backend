import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { Container } from '../../container';
import { getUserBalance, getUserShares } from '../controllers/UserController';


const router = Router();

// Get dependencies from container
const container = Container.getInstance();
const registerUserUseCase = container.getRegisterUserUseCase();
const loginUserUseCase = container.getLoginUserUseCase();
const userController = new UserController(registerUserUseCase, loginUserUseCase);

// POST /api/users/register
router.post('/register', (req, res) => userController.registerUser(req, res));
// POST /api/users/login
router.post('/login', (req, res) => userController.loginUser(req, res));
// GET /api/users/:address/balance
router.get('/:address/balance', getUserBalance);

// GET /api/users/:address/shares
router.get('/:address/shares', getUserShares);

export default router; 