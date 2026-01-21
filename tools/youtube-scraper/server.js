/**
 * YouTube Transcript Scraper Server
 *
 * Scrapes YouTube video transcripts and uploads them to the RAG knowledge base.
 *
 * Usage:
 *   npm start
 *   Open http://localhost:3456 in browser
 */

const express = require('express');
const cors = require('cors');
const { execSync, exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Validate environment variables
const requiredEnvVars = ['SUPABASE_URL', 'SUPABASE_SERVICE_KEY', 'OPENAI_API_KEY'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`❌ Missing required environment variable: ${envVar}`);
    console.error('   Please copy .env.example to .env and fill in your keys.');
    process.exit(1);
  }
}

// Initialize Supabase client with service key (bypasses RLS)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Temp directory for subtitle files
const TEMP_DIR = os.tmpdir();

/**
 * Extract video ID from various YouTube URL formats
 */
function extractVideoId(url) {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/ // Direct video ID
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  throw new Error('Invalid YouTube URL. Please use a valid youtube.com or youtu.be link.');
}

/**
 * Chunk text with overlap for better context preservation
 */
function chunkText(text, chunkSize = 1000, overlap = 200) {
  const chunks = [];
  let start = 0;

  // Clean up the text - remove extra whitespace
  text = text.replace(/\s+/g, ' ').trim();

  if (text.length <= chunkSize) {
    return [text];
  }

  while (start < text.length) {
    let end = Math.min(start + chunkSize, text.length);

    // Try to end at a sentence boundary
    if (end < text.length) {
      const lastPeriod = text.lastIndexOf('.', end);
      const lastQuestion = text.lastIndexOf('?', end);
      const lastExclamation = text.lastIndexOf('!', end);
      const lastSentenceEnd = Math.max(lastPeriod, lastQuestion, lastExclamation);

      if (lastSentenceEnd > start + (chunkSize * 0.5)) {
        end = lastSentenceEnd + 1;
      }
    }

    chunks.push(text.slice(start, end).trim());
    start = end - overlap;

    if (start >= text.length - overlap) break;
  }

  return chunks.filter(chunk => chunk.length > 0);
}

/**
 * Generate embedding via OpenAI API
 */
async function generateEmbedding(text) {
  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      input: text,
      model: 'text-embedding-3-small',
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
  }

  const data = await response.json();
  return data.data[0].embedding;
}

/**
 * Check if video already exists in database
 */
async function videoExists(videoId) {
  const { data, error } = await supabase
    .from('knowledge_embeddings')
    .select('id')
    .eq('metadata->>video_id', videoId)
    .limit(1);

  if (error) {
    console.error('Error checking for existing video:', error);
    return false;
  }

  return data && data.length > 0;
}

/**
 * Parse VTT subtitle file and extract plain text
 */
function parseVttToText(vttContent) {
  const lines = vttContent.split('\n');
  const textLines = [];
  let lastText = '';

  for (const line of lines) {
    // Skip WEBVTT header, timestamps, and metadata
    if (line.startsWith('WEBVTT') ||
        line.startsWith('Kind:') ||
        line.startsWith('Language:') ||
        line.includes('-->') ||
        line.match(/^\d{2}:\d{2}/) ||
        line.trim() === '') {
      continue;
    }

    // Remove VTT formatting tags like <c>, </c>, timestamps in tags
    let cleanLine = line
      .replace(/<[^>]+>/g, '')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .trim();

    // Skip duplicate lines (VTT often has duplicates)
    if (cleanLine && cleanLine !== lastText) {
      textLines.push(cleanLine);
      lastText = cleanLine;
    }
  }

  return textLines.join(' ').replace(/\s+/g, ' ').trim();
}

/**
 * Fetch transcript using yt-dlp (most reliable method)
 */
async function fetchTranscript(videoId) {
  const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const timestamp = Date.now();
  const outputBase = path.join(__dirname, `temp-${videoId}-${timestamp}`);
  const vttFile = `${outputBase}.en.vtt`;

  console.log('   Using yt-dlp to fetch transcript...');

  try {
    // Step 1: Download subtitles (don't use --print as it conflicts)
    const subCmd = `python -m yt_dlp --write-auto-sub --sub-lang en --skip-download --sub-format vtt -o "${outputBase}" "${videoUrl}"`;

    console.log('   Downloading subtitles...');
    execSync(subCmd, {
      encoding: 'utf-8',
      timeout: 120000,
      cwd: __dirname
    });

    // Step 2: Get metadata separately
    let title = 'Unknown Title';
    let channel = 'Unknown Channel';
    try {
      const metaCmd = `python -m yt_dlp --skip-download --print "%(title)s" --print "%(channel)s" "${videoUrl}"`;
      const metaResult = execSync(metaCmd, {
        encoding: 'utf-8',
        timeout: 30000,
        cwd: __dirname
      });
      const metaLines = metaResult.trim().split('\n');
      if (metaLines.length >= 2) {
        title = metaLines[metaLines.length - 2] || title;
        channel = metaLines[metaLines.length - 1] || channel;
      }
    } catch (metaErr) {
      console.log('   Could not fetch metadata:', metaErr.message);
    }

    // Check if subtitle file was created
    if (!fs.existsSync(vttFile)) {
      // Try to find any vtt file with our prefix
      const files = fs.readdirSync(__dirname);
      const altVttFiles = files.filter(f => f.startsWith(`temp-${videoId}-${timestamp}`) && f.endsWith('.vtt'));

      if (altVttFiles.length > 0) {
        const altVttFile = path.join(__dirname, altVttFiles[0]);
        const vttContent = fs.readFileSync(altVttFile, 'utf-8');
        const text = parseVttToText(vttContent);

        // Clean up
        fs.unlinkSync(altVttFile);

        if (text.length > 100) {
          console.log('   ✓ Got transcript via yt-dlp (alt lang)');
          return { text, title, channel };
        }
      }

      console.log('   No subtitle file created by yt-dlp');
      return null;
    }

    // Read and parse the VTT file
    const vttContent = fs.readFileSync(vttFile, 'utf-8');
    const text = parseVttToText(vttContent);

    // Clean up temp file
    fs.unlinkSync(vttFile);

    if (text.length > 100) {
      console.log('   ✓ Got transcript via yt-dlp');
      console.log(`   Title: ${title}`);
      console.log(`   Channel: ${channel}`);
      console.log(`   Transcript length: ${text.length} chars`);
      return { text, title, channel };
    }

    console.log('   yt-dlp: transcript too short');
    return null;

  } catch (err) {
    console.error('   yt-dlp error:', err.message);

    // Clean up any temp files on error
    try {
      const files = fs.readdirSync(__dirname);
      files.filter(f => f.startsWith(`temp-${videoId}`)).forEach(f => {
        try { fs.unlinkSync(path.join(__dirname, f)); } catch {}
      });
    } catch {}

    return null;
  }
}

/**
 * Main processing endpoint
 */
app.post('/process', async (req, res) => {
  const startTime = Date.now();

  try {
    const { url } = req.body;

    if (!url) {
      return res.json({ success: false, error: 'URL is required' });
    }

    // 1. Extract video ID
    const videoId = extractVideoId(url);
    console.log(`\n📺 Processing video: ${videoId}`);

    // 2. Check if already processed
    if (await videoExists(videoId)) {
      return res.json({
        success: false,
        error: 'This video has already been processed. Delete existing chunks first if you want to re-process.'
      });
    }

    // 3. Fetch transcript
    console.log('   Fetching transcript...');
    const transcriptData = await fetchTranscript(videoId);

    if (!transcriptData || !transcriptData.text || transcriptData.text.length < 100) {
      return res.json({
        success: false,
        error: 'No transcript available for this video. Only videos with captions can be processed.'
      });
    }

    const fullText = transcriptData.text;
    console.log(`   Transcript length: ${fullText.length} characters`);
    console.log(`   Title: ${transcriptData.title}`);
    console.log(`   Channel: ${transcriptData.channel}`);

    // 4. Chunk the transcript
    const chunks = chunkText(fullText);
    console.log(`   Created ${chunks.length} chunks`);

    // 5. Generate embeddings and prepare uploads
    console.log('   Generating embeddings...');
    const uploads = [];

    for (let i = 0; i < chunks.length; i++) {
      process.stdout.write(`   Embedding chunk ${i + 1}/${chunks.length}\r`);

      const embedding = await generateEmbedding(chunks[i]);

      uploads.push({
        content: chunks[i],
        embedding,
        metadata: {
          source: 'youtube',
          video_id: videoId,
          title: transcriptData.title,
          channel: transcriptData.channel,
          chunk_index: i,
          total_chunks: chunks.length,
          url: `https://youtube.com/watch?v=${videoId}`,
          processed_at: new Date().toISOString()
        }
      });

      // Small delay to avoid rate limits
      if (i < chunks.length - 1) {
        await new Promise(r => setTimeout(r, 100));
      }
    }
    console.log('\n   Embeddings complete');

    // 6. Batch insert to Supabase
    console.log('   Uploading to database...');
    const { error: insertError } = await supabase
      .from('knowledge_embeddings')
      .insert(uploads);

    if (insertError) {
      throw new Error(`Database error: ${insertError.message}`);
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`✅ Complete! Processed ${chunks.length} chunks in ${duration}s\n`);

    res.json({
      success: true,
      title: transcriptData.title,
      channel: transcriptData.channel,
      chunks: chunks.length,
      videoId,
      duration: parseFloat(duration)
    });

  } catch (err) {
    console.error('❌ Error:', err.message);
    res.json({
      success: false,
      error: err.message
    });
  }
});

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    env: {
      supabase: !!process.env.SUPABASE_URL,
      openai: !!process.env.OPENAI_API_KEY
    }
  });
});

/**
 * Get stats from database
 */
app.get('/stats', async (req, res) => {
  try {
    // Use raw SQL for accurate counting
    const { data: stats, error } = await supabase.rpc('get_youtube_stats');

    if (error) {
      // Fallback: manual query if RPC doesn't exist
      const { data: allData, error: fetchError } = await supabase
        .from('knowledge_embeddings')
        .select('metadata')
        .filter('metadata->>source', 'eq', 'youtube');

      if (fetchError) throw fetchError;

      const videoIds = new Set();
      (allData || []).forEach(row => {
        if (row.metadata?.video_id) {
          videoIds.add(row.metadata.video_id);
        }
      });

      return res.json({
        totalChunks: allData?.length || 0,
        totalVideos: videoIds.size
      });
    }

    res.json({
      totalChunks: stats?.total_chunks || 0,
      totalVideos: stats?.total_videos || 0
    });
  } catch (err) {
    console.error('Stats error:', err.message);
    res.json({ totalChunks: 0, totalVideos: 0, error: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 3456;
app.listen(PORT, () => {
  console.log('');
  console.log('╔═══════════════════════════════════════════════════════╗');
  console.log('║     YouTube Transcript Scraper                        ║');
  console.log('║     Knowledge Base Ingestion Tool                     ║');
  console.log('╠═══════════════════════════════════════════════════════╣');
  console.log(`║  🌐 Server: http://localhost:${PORT}                     ║`);
  console.log('║  📋 Open in browser to use the interface              ║');
  console.log('║                                                       ║');
  console.log('║  Endpoints:                                           ║');
  console.log('║    POST /process  - Process a YouTube URL             ║');
  console.log('║    GET  /health   - Health check                      ║');
  console.log('║    GET  /stats    - Database statistics               ║');
  console.log('╚═══════════════════════════════════════════════════════╝');
  console.log('');
});
