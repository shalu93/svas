import { Router } from "express";
import users from "../controllers/userController";

const authRouter=Router();

authRouter.get('/v1/users',users.getAll);
authRouter.post('/v1/auth/signup',users.SignupUser);
authRouter.post('/v1/auth/signin',users.SigninUser);

export default authRouter;