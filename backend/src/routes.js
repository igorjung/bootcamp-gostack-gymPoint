import { Router } from 'express';

import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentContoller';
import PlanController from './app/controllers/PlanController';
import EnrollmentController from './app/controllers/EnrollmentController.js';
import CheckinController from './app/controllers/CheckinController';
import HelpController from './app/controllers/HelpController';
import AnswerController from './app/controllers/AnswerController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/students', authMiddleware, StudentController.store);

routes.post('/sessions', SessionController.store);

routes.put('/students/:id', authMiddleware, StudentController.update);

routes.post('/plans', authMiddleware, PlanController.store);

routes.put('/plans/:id', authMiddleware, PlanController.update);

routes.delete('/plans/:id', authMiddleware, PlanController.delete);

routes.get('/plans', authMiddleware, PlanController.index);

routes.get('/plans/:id', authMiddleware, PlanController.show);

routes.post('/enrollments', authMiddleware, EnrollmentController.store);

routes.put('/enrollments/:id', authMiddleware, EnrollmentController.update);

routes.delete('/enrollments/:id', authMiddleware, EnrollmentController.delete);

routes.get('/enrollments', authMiddleware, EnrollmentController.index);

routes.get('/enrollments/:id', authMiddleware, EnrollmentController.show);

routes.get('/students', StudentController.index);

routes.get('/students/:id', StudentController.show);

routes.get('/students/:id/checkins', CheckinController.index);

routes.post('/students/:id/checkins', CheckinController.store);

routes.get('/help-orders', HelpController.index);

routes.post('/students/:id/help-orders', HelpController.store);

routes.get('/help-orders/:id', authMiddleware, HelpController.show);

routes.post('/help-orders/:id/answer', authMiddleware, AnswerController.store);

routes.delete('/students/:id', authMiddleware, StudentController.delete);

export default routes;
