import AuthController from '@controllers/auth';
import Router from '.';

const authRouter = new Router().init();
const authController = new AuthController();

authRouter.post('/login', authController.login);
authRouter.post('/register', authController.register);
authRouter.get('/profile', authController.needAuth(), authController.profile);

export default authRouter;
