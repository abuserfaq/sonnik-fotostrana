#!/usr/bin/env node
/**
 * Гарантия что в production-сборке присутствуют админ-маршруты.
 * Если отсутствуют — падаем с ошибкой (CI / Vercel увидят failed build).
 */
const fs = require('fs');
const path = require('path');

const manifestPath = path.join(
  __dirname,
  '..',
  '.next',
  'server',
  'app-paths-manifest.json',
);

const requiredPaths = [
  '/admin/page',
  '/admin/login/page',
  '/api/admin/login/route',
  '/api/admin/articles/route',
];

try {
  const raw = fs.readFileSync(manifestPath, 'utf8');
  const manifest = JSON.parse(raw);
  const routes = typeof manifest === 'object' && manifest !== null ? manifest : {};
  const missing = requiredPaths.filter((p) => !Object.prototype.hasOwnProperty.call(routes, p));

  if (missing.length > 0) {
    console.error(
      '[assert-admin-build] В сборке отсутствуют админ-маршруты:',
      missing.join(', '),
    );
    console.error('[assert-admin-build] Проверьте: Root Directory на Vercel = корень Next-проекта.');
    process.exit(1);
  }

  console.log('[assert-admin-build] OK:', requiredPaths.join(', '));
} catch (e) {
  console.error(
    '[assert-admin-build] Не удалось прочитать manifest. Сначала выполните npm run build.',
    e.message,
  );
  process.exit(1);
}
