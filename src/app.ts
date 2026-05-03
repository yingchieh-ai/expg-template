import express, { type Express } from 'express';
import cors from '@/middlewares/cors';

const app: Express = express();

app.use(cors);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

export default app;
