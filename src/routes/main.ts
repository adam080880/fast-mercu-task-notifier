import Router from '.';
import authRouter from './auth';

const mainRoute = new Router().init();

mainRoute.use('/auth', authRouter);

export default mainRoute;
