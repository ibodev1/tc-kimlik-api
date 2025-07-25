import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';

import { logger } from 'hono/logger';
import { requestId } from 'hono/request-id';
import { secureHeaders } from 'hono/secure-headers';
import { getConnInfo, handle } from 'hono/vercel';
import { rateLimiter } from 'hono-rate-limiter';
import dogrulaRouter from '../routes/dogrula';
import type { Respond } from '../types/respond';

export const config = {
  runtime: 'edge',
};

const app = new Hono().basePath('/api');

// Setup Middlewares
app.use(
  '*',
  // Logger
  logger(),
  // Secure Headers
  secureHeaders(),
  // Request ID
  requestId(),
  // Rate Limiter
  rateLimiter({
    windowMs: 60 * 1000, // 1 dakika
    limit: 100,
    standardHeaders: 'draft-6',
    keyGenerator: (c) => {
      const info = getConnInfo(c);
      return info.remote.address || c.get('requestId');
    },
  }),
);

// Routes
app.route('/dogrula', dogrulaRouter);

// Error handler
app.onError((err, c) => {
  console.error('Error occurred:', err);

  if (err instanceof HTTPException) {
    return err.getResponse();
  }

  const errRes: Respond = {
    status: 'error',
    message: err instanceof Error ? err.message : 'An unexpected error occurred.',
    error: err instanceof Error ? err : 'Unknown error',
  };
  return c.json(errRes, 500);
});

// Not Found handler
app.notFound((c) => {
  const notFoundResponse: Respond = {
    status: 'error',
    message: 'Resource not found.',
    error: 'The requested resource could not be found.',
  };
  return c.json(notFoundResponse, 404);
});

const handler = handle(app);

export const GET = handler;
export const POST = handler;
export const PATCH = handler;
export const PUT = handler;
export const OPTIONS = handler;
export default handler;
