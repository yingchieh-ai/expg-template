import cors, { type CorsOptions } from 'cors';

const isDev = process.env.NODE_ENV !== 'production';

const whitelist = process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : [];

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (isDev) {
      return callback(null, true);
    }
    if (!origin) {
      return callback(null, true);
    }

    if (whitelist.includes(origin)) {
      return callback(null, true);
    }

    return callback(null, false);
  },
  credentials: process.env.CORS_CREDENTIALS === 'true',
};

export default cors(corsOptions);
