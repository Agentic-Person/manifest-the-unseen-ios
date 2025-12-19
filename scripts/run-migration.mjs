#!/usr/bin/env node

/**
 * Script to run database migrations using Supabase client
 * Usage: node scripts/run-migration.mjs <migration-file>
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env.local');
  process.exit(1);
}

// Create Supabase admin client
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  },
  db: {
    schema: 'public'
  }
});

async function executeSQLStatements(sql) {
  // Split SQL into individual statements (basic splitting on semicolons)
  // This is a simple approach - may need refinement for complex SQL
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  console.log(`Executing ${statements.length} SQL statements...`);

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i];

    // Skip comments and empty statements
    if (!statement || statement.startsWith('--')) continue;

    console.log(`\nStatement ${i + 1}/${statements.length}:`);
    console.log(statement.substring(0, 100) + (statement.length > 100 ? '...' : ''));

    try {
      const { data, error } = await supabase.rpc('exec_sql', { sql: statement });

      if (error) {
        // If exec_sql doesn't exist, we need a different approach
        console.error(`Error: ${error.message}`);
        console.error('Note: Cannot execute DDL statements directly via PostgREST API');
        console.error('Please run migrations using Supabase Studio SQL Editor or CLI');
        return false;
      }

      console.log('✓ Success');
    } catch (err) {
      console.error(`Error: ${err.message}`);
      return false;
    }
  }

  return true;
}

async function runMigration(migrationFile) {
  try {
    console.log(`Running migration: ${migrationFile}`);
    console.log('=' * 80);

    // Read the migration file
    const migrationPath = join(__dirname, '..', 'supabase', 'migrations', migrationFile);
    const sql = readFileSync(migrationPath, 'utf8');

    console.log('Attempting to execute SQL via Supabase client...\n');

    const success = await executeSQLStatements(sql);

    if (!success) {
      console.log('\n' + '=' * 80);
      console.log('MANUAL MIGRATION REQUIRED');
      console.log('=' * 80);
      console.log('\nPlease apply this migration manually using one of these methods:');
      console.log('\n1. Supabase Studio SQL Editor:');
      console.log('   https://supabase.com/dashboard/project/zbyszxtwzoylyygtexdr/sql/new');
      console.log('\n2. Or use the following SQL:\n');
      console.log(sql);
      process.exit(1);
    }

  } catch (error) {
    console.error('Error running migration:', error.message);
    process.exit(1);
  }
}

// Get migration file from command line argument
const migrationFile = process.argv[2];

if (!migrationFile) {
  console.error('Usage: node scripts/run-migration.mjs <migration-file>');
  console.error('Example: node scripts/run-migration.mjs 20251217000002_create_prayers_table.sql');
  process.exit(1);
}

runMigration(migrationFile);
