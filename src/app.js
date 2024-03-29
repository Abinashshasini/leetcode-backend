import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  })
);
app.use(express.json({ limit: '16kb' }));
app.use(
  express.urlencoded({
    extended: true,
    limit: '16kb',
  })
);
app.use(express.static('public'));
app.use(cookieParser());

/** import routes */
import userRouter from './routes/user.routes.js';
import problemRoutes from './routes/problem.routes.js';
import problemsRoutes from './routes/problems.routes.js';

/** Routes declaration
 * User routes
 */
app.use('/api/v1/users', userRouter);

/** Problem routes */
app.use('/api/v1/problem', problemRoutes);

/** Questions routes */
app.use('/api/v1/problems', problemsRoutes);

export { app };
