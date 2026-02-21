import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { userRouter } from './routes/users.routes';
import { healthRouter } from './routes/health';
import { initDb } from './db';
import { openApiSpec } from './swagger';
import { requestLogger } from './middleware/requestLogger';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './logger';

const app = express();
app.use(express.json());

const port = process.env.PORT ?? 3002;

app.use(requestLogger);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiSpec));
app.use('/health', healthRouter);
app.use('/users', userRouter);
app.use(errorHandler);

initDb()
  .then(() => {
    app.listen(port, () => {
      logger.info({ port }, 'User service listening');
    });
  })
  .catch((err) => {
    logger.fatal({ err }, 'DB init failed');
    process.exit(1);
  });
