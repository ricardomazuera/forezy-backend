import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { Container } from '../../container';

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

export default router; 