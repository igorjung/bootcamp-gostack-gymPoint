import { Router } from 'express';

import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentContoller';
import PlanController from './app/controllers/PlanController';
import RegistrationController from './app/controllers/RegistrationController';
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

routes.post(
  '/students/:id/registrations',
  authMiddleware,
  RegistrationController.store
);

routes.put(
  '/students/:id/registrations',
  authMiddleware,
  RegistrationController.update
);

routes.delete(
  '/registrations/:id',
  authMiddleware,
  RegistrationController.delete
);

routes.get('/registrations', authMiddleware, RegistrationController.index);

routes.get('/registrations/:id', authMiddleware, RegistrationController.show);

routes.get('/students', StudentController.index);

routes.get('/students/:id', authMiddleware, StudentController.show);

routes.get('/students/:id/checkins', CheckinController.index);

routes.post('/students/:id/checkins', CheckinController.store);

routes.get('/help-orders', HelpController.index);

routes.post('/students/:id/help-orders', HelpController.store);

routes.get('/help-orders', authMiddleware, AnswerController.index);

routes.get('/help-orders/:id', authMiddleware, HelpController.show);

routes.post('/help-orders/:id/answer', authMiddleware, AnswerController.store);

routes.delete('/students/:id', authMiddleware, StudentController.delete);

export default routes;
