export const getDatabaseUrl = () => {
  const user = process.env.DATABASE_USER ?? 'postgres';
  const password = process.env.DATABASE_PASSWORD ?? 'postgres';
  const host = process.env.DATABASE_HOST ?? 'localhost';
  const port = process.env.DATABASE_PORT ?? '5432';
  const db = process.env.DATABASE_DB ?? 'postgres';

  return `postgresql://${user}:${password}@${host}:${port}/${db}`;
};
