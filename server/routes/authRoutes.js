import { Router } from 'express';
import users from '../controllers/userController';

const authRouter=Router();

authRouter.get('/users',users.getAll);

authRouter.post('/auth/signup',users.SignupUser);
authRouter.post('/auth/signin',users.SigninUser);
authRouter.post('/auth/signup/AdminClient',users.SignupAdminClient);

export default authRouter;