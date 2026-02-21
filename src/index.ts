import express from 'express';
import { userRouter } from './routes/users.routes';
import { healthRouter } from './routes/health';
import { initDb } from './db';

const app = express();
app.use(express.json());

const port = process.env.PORT ?? 3002;

app.use('/health', healthRouter);
app.use('/users', userRouter);

initDb()
  .then(() => {
    app.listen(port, () => {
      console.log(`User service listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('DB init failed:', err);
    process.exit(1);
  });
