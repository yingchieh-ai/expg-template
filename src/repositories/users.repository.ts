import { db } from '@/db/index';
import { usersTable } from '@/db/schema/users';

export async function upsertUserFromGoogle(params: {
  email: string;
  emailVerified: boolean;
  firstName: string | null;
  lastName: string | null;
  providerId: string;
  providerData: Record<string, unknown>;
}): Promise<{ id: string; email: string }> {
  const now = new Date();

  const [user] = await db
    .insert(usersTable)
    .values({
      email: params.email,
      email_verified: params.emailVerified,
      first_name: params.firstName,
      last_name: params.lastName,
      provider: 'google',
      provider_id: params.providerId,
      provider_data: params.providerData,
      last_login_at: now,
    })
    .onConflictDoUpdate({
      target: usersTable.email,
      set: {
        email_verified: params.emailVerified,
        first_name: params.firstName,
        last_name: params.lastName,
        provider: 'google',
        provider_id: params.providerId,
        provider_data: params.providerData,
        last_login_at: now,
        updated_at: now,
      },
    })
    .returning({ id: usersTable.id, email: usersTable.email });

  return user!;
}
