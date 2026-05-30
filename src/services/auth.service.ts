import { OAuth2Client } from 'google-auth-library';
import { upsertUserFromGoogle } from '@/repositories/users.repository';

let client: OAuth2Client | null = null;

function getOAuthClient(): OAuth2Client {
  if (!client) {
    client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
  }
  return client;
}

export function getGoogleAuthUrl(state: string): string {
  return getOAuthClient().generateAuthUrl({
    access_type: 'offline',
    scope: ['openid', 'email', 'profile'],
    state,
    prompt: 'select_account',
  });
}

export async function handleGoogleCallback(code: string): Promise<{ id: string; email: string }> {
  const oauthClient = getOAuthClient();

  const { tokens } = await oauthClient.getToken(code);
  oauthClient.setCredentials(tokens);

  const ticket = await oauthClient.verifyIdToken({
    idToken: tokens.id_token!,
    audience: process.env.GOOGLE_CLIENT_ID!,
  });
  const payload = ticket.getPayload()!;

  return upsertUserFromGoogle({
    email: payload.email!,
    emailVerified: payload.email_verified ?? false,
    firstName: payload.given_name ?? null,
    lastName: payload.family_name ?? null,
    providerId: payload.sub,
    providerData: payload as unknown as Record<string, unknown>,
  });
}
