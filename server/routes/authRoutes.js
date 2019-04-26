import { Router } from 'express';
import users from '../controllers/userController';
import auth from '../authorization/auth';

const authRouter=Router();

authRouter.get('/users',users.getAll);

authRouter.post('/auth/signup',users.SignupUser);
authRouter.post('/auth/signin',users.SigninUser);

authRouter.post('/auth/signup/AdminClient',auth.authorization,users.SignupAdminClient);

export default authRouter;