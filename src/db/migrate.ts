import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';
import { getDatabaseUrl } from './config';

const pool = new Pool({ connectionString: getDatabaseUrl() });
const db = drizzle({ client: pool });

await migrate(db, { migrationsFolder: './migrations' });
await pool.end();
