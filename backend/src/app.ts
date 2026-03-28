import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { resolve } from 'node:path';
import { env } from './config/env.js';
import { apiRoutes } from './routes/index.js';
import { httpLogger } from './utils/logger.js';
import { errorMiddleware, notFoundMiddleware } from './middlewares/error.middleware.js';
import { registerGraphql } from './graphql/server.js';
import { sanitizeBodyMiddleware } from './middlewares/sanitize.middleware.js';

const publicDir = resolve(process.cwd(), 'public');

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, curl, etc.)
        if (!origin) return callback(null, true);
        if (env.ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
        callback(new Error(`CORS: origin '${origin}' not allowed`));
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    }),
  );
  app.options('*', cors());
  app.use(express.json({ limit: '6mb' }));
  app.use(httpLogger);
  app.use(sanitizeBodyMiddleware);

  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  app.get('/', (_req, res) => {
    res.sendFile(resolve(publicDir, 'index.html'));
  });

  app.use('/api', apiRoutes);
  registerGraphql(app);

  app.use(notFoundMiddleware);
  app.use(errorMiddleware);

  return app;
}
