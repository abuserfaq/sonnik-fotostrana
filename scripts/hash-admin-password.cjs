'use strict';

const bcrypt = require('bcryptjs');

const plain =
  process.argv[2] || process.env.ADMIN_PLAIN || '';

if (!plain || plain.length < 8) {
  console.error(
    'Задайте пароль: node scripts/hash-admin-password.cjs "надёжный-пароль"',
  );
  process.exit(1);
}

const hash = bcrypt.hashSync(plain, 12);
console.log('ADMIN_PASSWORD_HASH=' + hash);
