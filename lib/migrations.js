import { query } from './db.js';
import { readFileSync } from 'fs';
import { join } from 'path';

const MIGRATIONS = [
  // Knowledge documents table
  `CREATE TABLE IF NOT EXISTS knowledge_documents (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    category VARCHAR(100) NOT NULL DEFAULT 'general',
    content TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    agent_ids TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  )`,

  // FAQs table
  `CREATE TABLE IF NOT EXISTS faqs (
    id SERIAL PRIMARY KEY,
    category VARCHAR(100) NOT NULL,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
  )`,

  // Agent training table
  `CREATE TABLE IF NOT EXISTS agent_training (
    id SERIAL PRIMARY KEY,
    agent_id VARCHAR(100) UNIQUE NOT NULL,
    system_prompt TEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW()
  )`,

  // Full-text search index for knowledge documents
  `DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_knowledge_search') THEN
      CREATE INDEX idx_knowledge_search ON knowledge_documents USING gin(to_tsvector('simple', title || ' ' || content));
    END IF;
  END $$`,

  // Index for FAQ search
  `DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_faq_search') THEN
      CREATE INDEX idx_faq_search ON faqs USING gin(to_tsvector('simple', question || ' ' || answer));
    END IF;
  END $$`,
];

export async function runMigrations() {
  console.log('[DB] Running migrations...');
  for (const sql of MIGRATIONS) {
    try {
      await query(sql);
    } catch (err) {
      console.error('[DB] Migration error:', err.message);
    }
  }
  console.log('[DB] Migrations complete.');
}

export async function seedFromJson() {
  try {
    // Check if FAQ table is empty
    const faqCount = await query('SELECT COUNT(*) as count FROM faqs');
    if (parseInt(faqCount.rows[0].count) === 0) {
      console.log('[DB] Seeding FAQ data from faq.json...');
      try {
        const faqData = JSON.parse(readFileSync(join(process.cwd(), 'faq.json'), 'utf-8'));
        for (const item of faqData) {
          await query(
            'INSERT INTO faqs (category, question, answer, tags) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING',
            [item.category, item.question, item.answer, item.tags || []]
          );
        }
        console.log(`[DB] Seeded ${faqData.length} FAQ items.`);
      } catch (e) {
        console.log('[DB] No faq.json found, skipping FAQ seed.');
      }
    }

    // Check if training table is empty
    const trainingCount = await query('SELECT COUNT(*) as count FROM agent_training');
    if (parseInt(trainingCount.rows[0].count) === 0) {
      console.log('[DB] Seeding training data from training.json...');
      try {
        const trainingData = JSON.parse(readFileSync(join(process.cwd(), 'training.json'), 'utf-8'));
        for (const [agentId, data] of Object.entries(trainingData)) {
          if (data.systemPrompt) {
            await query(
              'INSERT INTO agent_training (agent_id, system_prompt) VALUES ($1, $2) ON CONFLICT (agent_id) DO UPDATE SET system_prompt = $2',
              [agentId, data.systemPrompt]
            );
          }
        }
        console.log(`[DB] Seeded ${Object.keys(trainingData).length} training prompts.`);
      } catch (e) {
        console.log('[DB] No training.json found, skipping training seed.');
      }
    }
  } catch (err) {
    console.error('[DB] Seed error:', err.message);
  }
}

export async function initDatabase() {
  await runMigrations();
  await seedFromJson();
}
