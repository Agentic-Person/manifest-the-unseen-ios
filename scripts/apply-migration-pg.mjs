#!/usr/bin/env node

/**
 * Script to apply migrations using node-postgres
 * Usage: node scripts/apply-migration-pg.mjs <migration-file>
 */

import pg from 'pg';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const { Client } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Database connection configuration
// Using direct connection (NOT pooler)
const connectionConfig = {
  host: 'db.zbyszxtwzoylyygtexdr.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'Jameswill77!',
  ssl: {
    rejectUnauthorized: false
  }
};

async function runMigration(migrationFile) {
  const client = new Client(connectionConfig);

  try {
    console.log('Connecting to database...');
    await client.connect();
    console.log('✓ Connected successfully\n');

    console.log(`Running migration: ${migrationFile}`);
    console.log('=' .repeat(80));

    // Read the migration file
    const migrationPath = join(__dirname, '..', 'supabase', 'migrations', migrationFile);
    const sql = readFileSync(migrationPath, 'utf8');

    console.log('\nExecuting SQL...\n');

    // Execute the entire migration as a single transaction
    await client.query('BEGIN');

    try {
      await client.query(sql);
      await client.query('COMMIT');

      console.log('✓ Migration executed successfully!');
      console.log('=' .repeat(80));

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    }

  } catch (error) {
    console.error('\n✗ Error running migration:');
    console.error(error.message);

    if (error.stack) {
      console.error('\nStack trace:');
      console.error(error.stack);
    }

    process.exit(1);
  } finally {
    await client.end();
  }
}

// Get migration file from command line argument
const migrationFile = process.argv[2];

if (!migrationFile) {
  console.error('Usage: node scripts/apply-migration-pg.mjs <migration-file>');
  console.error('Example: node scripts/apply-migration-pg.mjs 20251217000002_create_prayers_table.sql');
  process.exit(1);
}

runMigration(migrationFile);
