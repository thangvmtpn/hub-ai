import bcrypt from 'bcryptjs';
import pkg from 'pg';
const { Client } = pkg;

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/hub_ai';

async function main() {
  console.log('Connecting to PostgreSQL...');
  const client = new Client({ connectionString });
  await client.connect();

  console.log('Creating database schema (table: users)...');
  await client.query(`
    CREATE TABLE IF NOT EXISTS users (
      username VARCHAR(100) PRIMARY KEY,
      password VARCHAR(255) NOT NULL,
      name VARCHAR(100) NOT NULL,
      role VARCHAR(50) NOT NULL,
      department VARCHAR(50) DEFAULT 'all',
      position VARCHAR(100) DEFAULT '',
      allowed_agents TEXT[] DEFAULT '{}'::TEXT[]
    );
  `);

  console.log('Seeding default users...');
  
  const users = [
    { username: 'admin', password: '123456', name: 'Admin', role: 'admin', department: 'all', position: 'Admin', allowed_agents: [] },
    { username: 'ke_toan', password: '123456', name: 'Kế Toán', role: 'user', department: 'finance', position: 'Kế Toán', allowed_agents: ['fin_workflow_designer'] },
  ];

  for (const u of users) {
    const hash = bcrypt.hashSync(u.password, 12);
    await client.query(`
      INSERT INTO users (username, password, name, role, department, position, allowed_agents)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (username) DO UPDATE
      SET password=$2, name=$3, role=$4, department=$5, position=$6, allowed_agents=$7
    `, [u.username, hash, u.name, u.role, u.department, u.position, u.allowed_agents]);
    console.log(`- Seeded: ${u.name} (${u.username}) with password: ${u.password}`);
  }

  await client.end();
  console.log('Database seeding completed successfully.');
}

main().catch(console.error);
