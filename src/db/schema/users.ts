import { sql } from 'drizzle-orm';
import { boolean, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users', {
  id: uuid().primaryKey().defaultRandom(),
  email: text().notNull().unique(),
  email_verified: boolean().notNull().default(false),
  first_name: text(),
  last_name: text(),
  is_active: boolean().notNull().default(true),
  provider: text(),
  provider_id: text(),
  provider_data: jsonb().default(sql`'{}'::jsonb`),
  last_login_at: timestamp({ withTimezone: true }),
  created_at: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp({ withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});
