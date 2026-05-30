import { Router, type IRouter, type CookieOptions, type Request, type Response } from 'express';
import { getGoogleAuthUrl, handleGoogleCallback } from '@/services/auth.service';
import { signToken } from '@/lib/jwt';

interface OAuthProvider {
  getAuthUrl: (state: string) => string;
  handleCallback: (code: string) => Promise<{ id: string; email: string }>;
}

const providers = {
  google: {
    getAuthUrl: getGoogleAuthUrl,
    handleCallback: handleGoogleCallback,
  },
} satisfies Record<string, OAuthProvider>;

type SupportedProvider = keyof typeof providers;

function parseDuration(value: string): number {
  const match = /^(\d+)(d|h|m|s)?$/.exec(value);
  if (!match) return 7 * 24 * 60 * 60 * 1000;
  const n = parseInt(match[1]!, 10);
  switch (match[2]) {
    case 'd':
      return n * 24 * 60 * 60 * 1000;
    case 'h':
      return n * 60 * 60 * 1000;
    case 'm':
      return n * 60 * 1000;
    case 's':
      return n * 1000;
    default:
      return n * 1000;
  }
}

const STATE_COOKIE = '__oauth_state';
const SESSION_COOKIE = 'session';

function stateCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 10 * 60 * 1000,
    path: '/auth',
  };
}

function sessionCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: parseDuration(process.env.JWT_EXPIRES_IN ?? '7d'),
    path: '/',
  };
}

const router: IRouter = Router();

router.get('/:provider', (req: Request, res: Response) => {
  const providerKey = req.params['provider'] as SupportedProvider;
  const provider = providers[providerKey];

  if (!provider) {
    res.status(404).json({ error: 'Unknown provider' });
    return;
  }

  const state = crypto.randomUUID();
  const url = provider.getAuthUrl(state);

  res.cookie(STATE_COOKIE, state, stateCookieOptions()).redirect(url);
});

router.get('/:provider/callback', async (req: Request, res: Response) => {
  const redirectBase = process.env.CLIENT_REDIRECT_URL ?? '/';
  const providerKey = req.params['provider'] as SupportedProvider;
  const provider = providers[providerKey];

  if (!provider) {
    res.status(404).json({ error: 'Unknown provider' });
    return;
  }

  try {
    const { code, state, error } = req.query as Record<string, string>;

    if (error) {
      res.redirect(`${redirectBase}?error=auth_failed`);
      return;
    }

    const savedState = req.cookies[STATE_COOKIE] as string | undefined;
    if (!state || !savedState || state !== savedState) {
      res.status(400).json({ error: 'Invalid state parameter' });
      return;
    }

    res.clearCookie(STATE_COOKIE, { path: '/auth' });

    const user = await provider.handleCallback(code!);
    const token = signToken({ sub: user.id, email: user.email });

    res.cookie(SESSION_COOKIE, token, sessionCookieOptions()).redirect(redirectBase);
  } catch (err) {
    console.error(`[auth/${providerKey}/callback]`, err);
    res.redirect(`${process.env.CLIENT_REDIRECT_URL ?? '/'}?error=auth_failed`);
  }
});

export default router;
