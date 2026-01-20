/**
 * Update Prayer Content in Database
 *
 * Updates the content field for prayers with actual prayer text
 * instead of placeholder "[Audio prayer - listen for full content]"
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env.local') });

// Validate environment
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Load prayer content from extracted JSON file
const prayerContentFile = path.join(__dirname, 'prayer-content.json');
let PRAYER_CONTENT_RAW;

try {
  PRAYER_CONTENT_RAW = JSON.parse(fs.readFileSync(prayerContentFile, 'utf8'));
} catch (err) {
  console.error(`Error loading prayer content: ${err.message}`);
  console.error('Run extract-prayers-from-csv.js first to generate prayer-content.json');
  process.exit(1);
}

// Map from underscore format (CSV) to space format (database)
const PRAYER_CONTENT_OLD = {
  'I Speak Healing': `I stand in the truth of who I am.

I am not my diagnosis.
I am not my symptoms.
I am not the story of what has been broken.

I am energy.
I am frequency.
I am a being designed for wholeness.

The Kingdom of God is within me...
and so is my healing.

I speak to every cell in my body...
Align.

I speak to every organ...
every tissue...
every system...
Remember your original design.

My body is not fighting against me.
My body is fighting for me.
And today...
I partner with it.

I release the vibration of sickness.
I release the frequency of fear.
I release every belief that says healing is not for me.

I am worthy of health.
I am worthy of vitality.
I am worthy of waking up in a body that feels alive.

Yeshua said...
by His stripes I am healed.
Not I will be healed.
I am healed.

I do not beg for healing.
I receive it.

I do not hope for restoration.
I embody it.

My body hears the frequency of wholeness.
My cells respond to the signal I am broadcasting.

And that signal is health.
That signal is restoration.
That signal is life.

I am healed.
I am whole.
I am restored.

And so it is.`,

  'Complete Declaration Of Restoration': `Before I speak...
I breathe.

Before I declare...
I align.

I place my hand on my heart...
And I remember that this body has carried me through everything.

I am not here to fight my body.
I am here to speak life into it.

I stand now in the frequency of healing.
The Kingdom is within me.
The healer is within me.

I release every word ever spoken over me that was not life.
I release the vibration of worry.
I release the pattern of bracing for bad news.

I speak to my mind...
You are sound.
You are clear.
You are at peace.

I speak to my heart...
You beat in perfect rhythm.
You are strong.
You are faithful.

I speak to my immune system...
You are intelligent.
You are powerful.
You protect me.

I am not a sick person trying to get well.
I am a whole person remembering my wholeness.

I was designed to heal.
I was built to restore.
I was created to thrive.

I am a tuning fork for healing.
And everything in my field begins to resonate with that frequency.

I am healed.
I am whole.
I am restored.

And so it is.`,

  'I Am Open To Receive': `I open my hands.
I open my heart.
I open my life to receive.

The universe is not withholding from me.
I am not unworthy of abundance.

I release the belief that I must struggle.
I release the pattern of pushing and striving.

I am a magnet for blessings.
Opportunities flow to me easily.

I receive with grace.
I receive with gratitude.
I receive with open arms.

And so it is.`,

  'Breaking The Chains': `I stand in my freedom today.

Every chain that has bound me...
I name it now and release it.

The chain of fear...
broken.

The chain of unworthiness...
shattered.

The chain of past mistakes...
dissolved.

I am not defined by what was.
I am created for what is.

I step forward in liberty.
I walk in wholeness.
I am free.

And so it is.`,

  'I Am At Peace': `I release the need to control outcomes.
I release the anxiety of tomorrow.
I release the regret of yesterday.

I am here.
I am present.
I am at peace.

My mind is calm.
My heart is open.
My spirit is free.

Peace flows through me like a river.
I rest in the stillness of this moment.

I am at peace.

And so it is.`,

  'The Courage To Be Still': `I do not need to move to prove my worth.
I do not need to speak to be heard.

In the stillness...
I find my strength.

In the silence...
I hear my truth.

In the pause...
I discover my power.

I am brave enough to be still.
I am courageous enough to rest.
I am strong enough to simply be.

And so it is.`,

  'The Frequency Of Thankfulness': `I give thanks for the breath in my lungs.
I give thanks for the beat of my heart.
I give thanks for the light in my eyes.

I give thanks for challenges that made me stronger.
I give thanks for losses that taught me value.
I give thanks for the journey that brought me here.

Gratitude is my frequency.
Thankfulness is my vibration.
Appreciation is my state of being.

And so it is.`,

};

// Convert from CSV format (underscores) to database format (spaces with Title Case)
// Database format: "Breaking The Chains" (ALL words capitalized)
// CSV format: "Breaking_the_Chains" (some words lowercase)
const PRAYER_CONTENT = {};
for (const [key, value] of Object.entries(PRAYER_CONTENT_RAW)) {
  // Convert I_Speak_Healing -> I Speak Healing
  // And capitalize ALL words (including "the", "of", "to", etc.)
  const dbKey = key
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  PRAYER_CONTENT[dbKey] = value;
}

console.log('Loaded prayers:', Object.keys(PRAYER_CONTENT));

const PRAYER_CONTENT_MANUAL = {
  'Communion With The Divine Manual': `I enter the sacred space within.
I meet the Divine in the temple of my heart.

This is not a distant God.
This is the presence that dwells in me.

The Kingdom is within.
The Holy Spirit resides here.
The Christ consciousness lives in me.

I am one with the Divine.
I am never separate.
I am always connected.

In this communion...
I find peace.
I find purpose.
I find home.

And so it is.`,
};

/**
 * Update prayer content in database
 */
async function updatePrayerContent() {
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║     Update Prayer Content in Database                 ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');

  let updated = 0;
  let errors = 0;

  for (const [title, content] of Object.entries(PRAYER_CONTENT)) {
    try {
      console.log(`Updating: "${title}"...`);

      // Update prayer with new content
      const { data, error } = await supabase
        .from('prayers')
        .update({ content })
        .eq('title', title)
        .select();

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        console.log(`  ✅ Updated (${content.split('\n').length} lines)`);
        updated++;
      } else {
        console.log(`  ⚠️  No prayer found with title: "${title}"`);
      }
    } catch (err) {
      console.error(`  ❌ Error: ${err.message}`);
      errors++;
    }
  }

  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║                     SUMMARY                            ║');
  console.log('╠════════════════════════════════════════════════════════╣');
  console.log(`║  Prayers updated: ${updated}`);
  console.log(`║  Errors: ${errors}`);
  console.log('╚════════════════════════════════════════════════════════╝');

  if (updated > 0) {
    console.log('\n✅ Prayer content successfully updated!');
    console.log('   Users can now read the full prayer text during playback.');
  }
}

// Run
updatePrayerContent().catch(err => {
  console.error('\n❌ Fatal error:', err.message);
  process.exit(1);
});
