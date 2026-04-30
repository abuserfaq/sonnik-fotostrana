import { jwtVerify } from 'jose';
import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';

import { ADMIN_COOKIE_NAME } from '@/lib/admin-constants';

const COOKIE = ADMIN_COOKIE_NAME;
const MIN_LEN = 16;

function secretKey(): Uint8Array | null {
  const s = process.env.AUTH_SECRET ?? '';
  if (s.length < MIN_LEN) return null;
  return new TextEncoder().encode(s);
}

async function validSession(request: NextRequest): Promise<boolean> {
  const key = secretKey();
  const token = request.cookies.get(COOKIE)?.value;
  if (!key || !token) return false;
  try {
    await jwtVerify(token, key);
    return true;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (path.startsWith('/admin/login')) {
    return NextResponse.next();
  }

  if (path.startsWith('/admin') || path.startsWith('/api/admin')) {
    if (
      path === '/api/admin/login' ||
      path.startsWith('/api/admin/login/')
    ) {
      return NextResponse.next();
    }

    const ok = await validSession(request);
    if (!ok) {
      if (path.startsWith('/api/admin')) {
        return NextResponse.json(
          { ok: false, error: 'Unauthorized' },
          { status: 401 },
        );
      }
      const login = new URL('/admin/login', request.url);
      login.searchParams.set(
        'next',
        `${request.nextUrl.pathname}${request.nextUrl.search}`,
      );
      return NextResponse.redirect(login);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/:path*', '/api/admin/:path*'],
};
