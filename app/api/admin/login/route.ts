import { NextResponse } from 'next/server';

import {
  ADMIN_COOKIE,
  adminCookieOptions,
  authConfigured,
  createAdminSessionCookie,
  verifyAdminPassword,
} from '@/lib/admin-auth';

export const runtime = 'nodejs';

/** Задержка при неверном пароле (timing + антибрут). */
async function delayFail(): Promise<void> {
  await new Promise((r) => setTimeout(r, 450 + Math.floor(Math.random() * 350)));
}

export async function POST(request: Request) {
  try {
    if (!authConfigured()) {
      return NextResponse.json(
        {
          ok: false,
          error:
            'Админка не настроена: задайте AUTH_SECRET (≥16 символов) и ADMIN_PASSWORD_HASH (bcrypt).',
        },
        { status: 503 },
      );
    }

    const raw = await request.text();
    if (raw.length > 12_000) {
      return NextResponse.json({ ok: false, error: 'Body too large' }, { status: 413 });
    }
    let body: { password?: string };
    try {
      body = JSON.parse(raw) as { password?: string };
    } catch {
      await delayFail();
      return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 });
    }

    const password =
      typeof body.password === 'string' ? body.password : '';
    const ok = verifyAdminPassword(password);

    if (!ok) {
      await delayFail();
      return NextResponse.json({ ok: false, error: 'Неверный пароль' }, { status: 401 });
    }

    const token = await createAdminSessionCookie();
    const res = NextResponse.json({ ok: true });
    res.cookies.set(ADMIN_COOKIE, token, adminCookieOptions());
    return res;
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Ошибка входа';
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
