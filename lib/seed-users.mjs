import bcrypt from 'bcryptjs';
import { writeFileSync } from 'fs';
import { createInterface } from 'readline';

const rl = createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise((r) => rl.question(q, r));

const DEPARTMENTS = [
  'all', 'sales', 'marketing', 'accounting', 'hr', 'admin', 'support', 'management'
];

async function main() {
  console.log('\n╔══════════════════════════════════════╗');
  console.log('║   AI Agent Hub - Tạo tài khoản       ║');
  console.log('╚══════════════════════════════════════╝\n');

  const users = [];
  let addMore = true;

  while (addMore) {
    const username = await ask('Username: ');
    const password = await ask('Password: ');
    const name = await ask('Tên hiển thị: ');
    const role = await ask('Role (admin/user): ') || 'user';
    console.log('Departments: ' + DEPARTMENTS.join(', '));
    const department = await ask('Department (all = truy cập tất cả): ') || 'all';

    const hash = await bcrypt.hash(password, 12);
    users.push({ username, password: hash, name, role, department });
    console.log(`✓ Đã thêm: ${name} (${username})\n`);

    const more = await ask('Thêm user khác? (y/n): ');
    addMore = more.toLowerCase() === 'y';
  }

  writeFileSync('users.json', JSON.stringify(users, null, 2));
  console.log(`\n✓ Đã lưu ${users.length} user vào users.json`);
  console.log('  Copy file này lên server cùng thư mục với app.\n');
  rl.close();
}

main().catch(console.error);
