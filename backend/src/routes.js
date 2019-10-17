import { Router } from 'express';

import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentContoller';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/students', authMiddleware, StudentController.store);

routes.post('/sessions', SessionController.store);

routes.put('/students', authMiddleware, StudentController.update);

export default routes;
