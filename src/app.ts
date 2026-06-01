import cors from '@/middlewares/cors';
import csrf from '@/middlewares/csrf';
import cookieParser from 'cookie-parser';
import express, { type Express } from 'express';
import authRouter from '@/routes/auth';

const app: Express = express();

app.use(cors);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(csrf);

app.use('/auth', authRouter);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

export default app;
