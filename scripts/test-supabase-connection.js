/**
 * Supabase Connection Test Script
 *
 * Tests the connection to Supabase and verifies:
 * - Database connectivity
 * - Authentication (signup/login)
 * - RLS policies
 * - Storage access
 *
 * Usage:
 *   node scripts/test-supabase-connection.js
 *
 * Prerequisites:
 *   - .env file with SUPABASE_URL and SUPABASE_ANON_KEY
 *   - npm install @supabase/supabase-js dotenv
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// =============================================================================
// Configuration
// =============================================================================

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing environment variables!');
  console.error('Please ensure .env file contains:');
  console.error('  SUPABASE_URL=https://your-project-id.supabase.co');
  console.error('  SUPABASE_ANON_KEY=your-anon-key-here');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test user credentials
const testEmail = `test-${Date.now()}@example.com`;
const testPassword = 'test-password-12345';

// =============================================================================
// Test Functions
// =============================================================================

async function testDatabaseConnection() {
  console.log('\n📊 Test 1: Database Connection');
  console.log('─────────────────────────────────────────────────────────');

  try {
    const { data, error } = await supabase.from('meditations').select('count', { count: 'exact', head: true });

    if (error) throw error;

    console.log('✅ Database connection successful');
    console.log(`   Meditations table exists (count: ${data?.length || 0})`);
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
}

async function testAuthSignup() {
  console.log('\n🔐 Test 2: Authentication - Signup');
  console.log('─────────────────────────────────────────────────────────');

  try {
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          full_name: 'Test User',
        },
      },
    });

    if (error) throw error;

    console.log('✅ Auth signup successful');
    console.log(`   User ID: ${data.user?.id}`);
    console.log(`   Email: ${data.user?.email}`);
    console.log(`   Email confirmed: ${data.user?.email_confirmed_at ? 'Yes' : 'No (check email)'}`);

    return data.user;
  } catch (error) {
    console.error('❌ Auth signup failed:', error.message);
    return null;
  }
}

async function testAuthLogin() {
  console.log('\n🔓 Test 3: Authentication - Login');
  console.log('─────────────────────────────────────────────────────────');

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword,
    });

    if (error) throw error;

    console.log('✅ Auth login successful');
    console.log(`   User ID: ${data.user?.id}`);
    console.log(`   Session token: ${data.session?.access_token.substring(0, 20)}...`);

    return data.session;
  } catch (error) {
    console.error('❌ Auth login failed:', error.message);
    return null;
  }
}

async function testUserProfile() {
  console.log('\n👤 Test 4: User Profile (RLS)');
  console.log('─────────────────────────────────────────────────────────');

  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('No authenticated user');
    }

    // Try to read own profile
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) throw error;

    console.log('✅ User profile query successful (RLS working)');
    console.log(`   User: ${data.email}`);
    console.log(`   Tier: ${data.subscription_tier}`);
    console.log(`   Trial ends: ${data.trial_end_date ? new Date(data.trial_end_date).toLocaleDateString() : 'N/A'}`);

    return true;
  } catch (error) {
    console.error('❌ User profile query failed:', error.message);
    return false;
  }
}

async function testJournalEntry() {
  console.log('\n📝 Test 5: Journal Entry (Create & Read)');
  console.log('─────────────────────────────────────────────────────────');

  try {
    const { data: { user } } = await supabase.auth.getUser();

    // Create journal entry
    const { data: created, error: createError } = await supabase
      .from('journal_entries')
      .insert({
        user_id: user.id,
        content: 'This is a test journal entry created by the connection test script.',
        tags: ['test', 'connection'],
        mood: 'hopeful',
      })
      .select()
      .single();

    if (createError) throw createError;

    console.log('✅ Journal entry created');
    console.log(`   Entry ID: ${created.id}`);

    // Read journal entry
    const { data: entries, error: readError } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1);

    if (readError) throw readError;

    console.log('✅ Journal entry retrieved');
    console.log(`   Content: ${entries[0].content.substring(0, 50)}...`);
    console.log(`   Tags: ${entries[0].tags.join(', ')}`);

    return true;
  } catch (error) {
    console.error('❌ Journal entry test failed:', error.message);
    return false;
  }
}

async function testRLSIsolation() {
  console.log('\n🔒 Test 6: RLS Isolation (Security)');
  console.log('─────────────────────────────────────────────────────────');

  try {
    // Try to read ALL users (should fail or return only current user)
    const { data, error } = await supabase.from('users').select('*');

    if (error) {
      console.log('✅ RLS correctly blocks unauthorized access');
      console.log(`   Error: ${error.message}`);
      return true;
    }

    if (data.length === 1) {
      console.log('✅ RLS correctly returns only current user');
      console.log(`   Returned ${data.length} user (expected: 1)`);
      return true;
    } else {
      console.warn('⚠️  RLS may not be configured correctly');
      console.warn(`   Returned ${data.length} users (expected: 1)`);
      return false;
    }
  } catch (error) {
    console.error('❌ RLS isolation test failed:', error.message);
    return false;
  }
}

async function testMeditationsList() {
  console.log('\n🧘 Test 7: Meditations List (Public Access)');
  console.log('─────────────────────────────────────────────────────────');

  try {
    const { data, error } = await supabase
      .from('meditations')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) throw error;

    console.log('✅ Meditations query successful');
    console.log(`   Total meditations: ${data.length}`);

    if (data.length > 0) {
      console.log(`   First meditation: "${data[0].title}" (${data[0].duration_seconds}s, ${data[0].narrator_gender})`);
    }

    return true;
  } catch (error) {
    console.error('❌ Meditations query failed:', error.message);
    return false;
  }
}

async function testCleanup() {
  console.log('\n🧹 Cleanup: Delete Test Data');
  console.log('─────────────────────────────────────────────────────────');

  try {
    const { data: { user } } = await supabase.auth.getUser();

    // Delete test journal entries
    await supabase.from('journal_entries').delete().eq('user_id', user.id);

    // Sign out
    await supabase.auth.signOut();

    console.log('✅ Test data cleaned up');
    console.log('   Note: Test user account remains (delete manually if needed)');

    return true;
  } catch (error) {
    console.error('⚠️  Cleanup failed:', error.message);
    return false;
  }
}

// =============================================================================
// Main Test Suite
// =============================================================================

async function runTests() {
  console.log('═════════════════════════════════════════════════════════');
  console.log('   SUPABASE CONNECTION TEST SUITE');
  console.log('   Manifest the Unseen - Backend Verification');
  console.log('═════════════════════════════════════════════════════════');
  console.log(`\n🔗 Supabase URL: ${supabaseUrl}`);
  console.log(`🔑 Anon Key: ${supabaseAnonKey.substring(0, 20)}...`);

  const results = {
    passed: 0,
    failed: 0,
  };

  // Run tests sequentially
  const tests = [
    testDatabaseConnection,
    testAuthSignup,
    testAuthLogin,
    testUserProfile,
    testJournalEntry,
    testRLSIsolation,
    testMeditationsList,
    testCleanup,
  ];

  for (const test of tests) {
    const result = await test();
    if (result) {
      results.passed++;
    } else {
      results.failed++;
    }
  }

  // Summary
  console.log('\n═════════════════════════════════════════════════════════');
  console.log('   TEST SUMMARY');
  console.log('═════════════════════════════════════════════════════════');
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`📊 Total:  ${results.passed + results.failed}`);

  if (results.failed === 0) {
    console.log('\n🎉 All tests passed! Supabase is ready for development.');
  } else {
    console.log('\n⚠️  Some tests failed. Review errors above and check:');
    console.log('   - Supabase project is running');
    console.log('   - Database migrations have been applied');
    console.log('   - RLS policies are enabled');
    console.log('   - Environment variables are correct');
  }

  console.log('\n═════════════════════════════════════════════════════════\n');
}

// Run the test suite
runTests().catch((error) => {
  console.error('💥 Test suite crashed:', error);
  process.exit(1);
});
