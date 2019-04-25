import { Router } from 'express';
import users from '../controllers/userController';
import auth from '../authorization/auth';

const authRouter=Router();

authRouter.get('/v1/users',users.getAll);

authRouter.post('/v1/auth/signup',users.SignupUser);
authRouter.post('/v1/auth/signin',users.SigninUser);

authRouter.post('/v2/auth/signup/AdminClient',auth.authorization,users.SignupAdminClient);

export default authRouter;