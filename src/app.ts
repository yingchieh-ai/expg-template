import cors from '@/middlewares/cors';
import cookieParser from 'cookie-parser';
import express, { type Express } from 'express';

const app: Express = express();

app.use(cors);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

export default app;
