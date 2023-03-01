import dotenv from 'dotenv';
import express, {Express} from 'express';
import cookieParser from 'cookie-parser';
import cors, { CorsOptions } from 'cors';

dotenv.config();

export const app: Express = express();

const options: CorsOptions = {
  origin: process.env.APP_URL,
  credentials: true
};
app.use(cors(options));

app.use(cookieParser());

app.use(express.urlencoded({
  extended: true
}));

app.use(express.json());

import usuarioRouter from '../src/domains/Usuario/controllers/index';
app.use('/api/usuario', usuarioRouter);

import contratoRouter from '../src/domains/Contrato/controllers/index';
app.use('/api/contrato', contratoRouter);

import projetoRouter from '../src/domains/Projetos/controllers/index';
app.use('/api/projeto', projetoRouter);

import { errorHandler } from '../src/middlewares/errorHandler';
app.use(errorHandler);

export default app;
