import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dogrulaRouter from './routes/dogrula.js';
import morgan from 'morgan';

const PORT = Number(process.env.PORT ?? 5000);

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use((request: Request, response: Response, next: NextFunction) => {
  response.removeHeader('X-Powered-By');
  next();
});
app.use(express.urlencoded({ extended: false }));

// Set Port
app.set('port', PORT);

// Logger
app.use(morgan('dev'));

// Routes
app.use(dogrulaRouter);

export default app;
