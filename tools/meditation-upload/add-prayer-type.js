/**
 * Add 'prayer' type to meditation_type enum
 */
const { Client } = require('pg');
require('dotenv').config({ path: require('path').join(__dirname, '../../.env.local') });

async function addPrayerType() {
  // Extract connection details from Supabase URL
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  // Extract project ref from URL (e.g., https://abc123.supabase.co -> abc123)
  const projectRef = supabaseUrl.match(/https:\/\/([^.]+)/)[1];

  // Construct database URL
  // Format: postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
  const dbPassword = process.env.SUPABASE_DB_PASSWORD || process.env.DB_PASSWORD;

  if (!dbPassword) {
    console.error('❌ Missing SUPABASE_DB_PASSWORD in .env.local');
    console.error('   You can find this in your Supabase project settings under Database -> Connection string');
    process.exit(1);
  }

  const connectionString = `postgresql://postgres.${projectRef}:${dbPassword}@aws-0-us-east-1.pooler.supabase.com:6543/postgres`;

  console.log('Connecting to database...');
  const client = new Client({ connectionString });

  try {
    await client.connect();
    console.log('✅ Connected');

    // Check if 'prayer' type already exists
    const checkResult = await client.query(`
      SELECT EXISTS (
        SELECT 1 FROM pg_enum e
        JOIN pg_type t ON e.enumtypid = t.oid
        WHERE t.typname = 'meditation_type' AND e.enumlabel = 'prayer'
      ) AS exists;
    `);

    if (checkResult.rows[0].exists) {
      console.log('✅ Prayer type already exists in meditation_type enum');
    } else {
      console.log('Adding prayer type to enum...');
      await client.query("ALTER TYPE meditation_type ADD VALUE 'prayer';");
      console.log('✅ Prayer type added successfully');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

addPrayerType();
