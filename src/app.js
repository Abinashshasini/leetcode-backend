import express from 'express';
import cors from 'cors';

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

/** import routes */
import userRouter from './routes/user.routes.js';
import problemRoutes from './routes/problem.routes.js';

/** Routes declaration
 * user routes
 */
app.use('/api/v1/users', userRouter);

/** problem routes */
app.use('/api/v1/problem', problemRoutes);

export { app };
