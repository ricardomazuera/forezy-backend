import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { Container } from '../../container';

const router = Router();

// Get dependencies from container
const container = Container.getInstance();
const registerUserUseCase = container.getRegisterUserUseCase();
const userController = new UserController(registerUserUseCase);

// POST /api/users/register
router.post('/register', (req, res) => userController.registerUser(req, res));

export default router; 