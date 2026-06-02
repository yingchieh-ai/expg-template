/// <reference types="node" />
import { defineConfig } from 'drizzle-kit';
import { getDatabaseUrl } from './src/db/config';

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/db/schema/*',
  out: './migrations',
  dbCredentials: {
    url: getDatabaseUrl(),
  },
  verbose: true,
  strict: true,
});
