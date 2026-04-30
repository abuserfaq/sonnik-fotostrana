import { SignJWT } from 'jose';

import bcrypt from 'bcryptjs';

import { ADMIN_COOKIE_NAME } from './admin-constants';

/** Имя httpOnly cookie сессии админки */
export const ADMIN_COOKIE = ADMIN_COOKIE_NAME;

/** Минимальная длина AUTH_SECRET на проде */
const MIN_SECRET_LEN = 16;

function getJwtSecret(): Uint8Array {
  const s = process.env.AUTH_SECRET ?? '';
  if (s.length < MIN_SECRET_LEN) {
    throw new Error('AUTH_SECRET слишком короткий (нужно ≥16 символов)');
  }
  return new TextEncoder().encode(s);
}

export async function createAdminSessionCookie(): Promise<string> {
  const token = await new SignJWT({ sub: 'sonnik-admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('8h')
    .sign(getJwtSecret());
  return token;
}

export function adminCookieOptions(): {
  httpOnly: true;
  secure: boolean;
  sameSite: 'lax';
  path: string;
  maxAge: number;
} {
  const secure = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 8,
  };
}

/** Проверка пароля: только bcrypt-хеш из env. */
export function verifyAdminPassword(plain: string): boolean {
  const hash = process.env.ADMIN_PASSWORD_HASH?.trim();
  if (!plain || !hash || !hash.startsWith('$2')) {
    return false;
  }
  return bcrypt.compareSync(plain.slice(0, 500), hash);
}

export function authConfigured(): boolean {
  const secretOk = (process.env.AUTH_SECRET ?? '').length >= MIN_SECRET_LEN;
  const hash = process.env.ADMIN_PASSWORD_HASH?.trim() ?? '';
  const hashOk = hash.startsWith('$2');
  return secretOk && hashOk;
}
