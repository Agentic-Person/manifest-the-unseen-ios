# YouTube Transcript Scraper

A simple tool to scrape YouTube video transcripts and add them to the Manifest the Unseen RAG knowledge base.

## Features

- Paste any YouTube URL to extract its transcript
- Automatically chunks text with overlap for better context
- Generates embeddings using OpenAI text-embedding-3-small
- Uploads directly to Supabase knowledge_embeddings table
- Dark-themed UI matching the app design
- Session statistics and history tracking
- Duplicate detection (won't re-process same video)

## Quick Start

### 1. Install Dependencies

```bash
cd tools/youtube-scraper
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your actual keys:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=eyJ...your-service-role-key
OPENAI_API_KEY=sk-...your-openai-key
```

**Where to find these:**
- **Supabase URL & Service Key**: [Supabase Dashboard](https://supabase.com/dashboard) → Your Project → Settings → API
- **OpenAI API Key**: [OpenAI Platform](https://platform.openai.com/api-keys)

### 3. Start the Server

```bash
npm start
```

### 4. Open in Browser

Navigate to [http://localhost:3456](http://localhost:3456)

### 5. Process Videos

1. Paste a YouTube URL (e.g., `https://youtube.com/watch?v=dQw4w9WgXcQ`)
2. Click "Process Video"
3. Wait for processing (typically 10-30 seconds depending on video length)
4. Done! The transcript is now in your knowledge base

## Supported URL Formats

- `https://youtube.com/watch?v=VIDEO_ID`
- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://youtube.com/embed/VIDEO_ID`
- Direct video ID: `VIDEO_ID`

## How It Works

```
YouTube URL
    │
    ▼
Extract Video ID
    │
    ▼
Fetch Transcript (youtube-transcript npm)
    │
    ▼
Chunk Text (1000 chars, 200 overlap)
    │
    ▼
Generate Embeddings (OpenAI text-embedding-3-small)
    │
    ▼
Upload to Supabase (knowledge_embeddings table)
    │
    ▼
Available in AI Chat!
```

## Metadata Stored

Each chunk is stored with rich metadata:

```json
{
  "source": "youtube",
  "video_id": "dQw4w9WgXcQ",
  "title": "Video Title",
  "channel": "Channel Name",
  "chunk_index": 0,
  "total_chunks": 42,
  "url": "https://youtube.com/watch?v=dQw4w9WgXcQ",
  "processed_at": "2025-11-30T12:00:00.000Z"
}
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | HTML interface |
| `/process` | POST | Process a YouTube URL |
| `/health` | GET | Server health check |
| `/stats` | GET | Database statistics |

### Example: Process via cURL

```bash
curl -X POST http://localhost:3456/process \
  -H "Content-Type: application/json" \
  -d '{"url": "https://youtube.com/watch?v=VIDEO_ID"}'
```

## Cost Estimate

| Item | Cost |
|------|------|
| Transcript extraction | Free |
| Embeddings (~2000 words) | ~$0.001 per video |
| Storage | ~50KB per video |
| **Monthly (40 videos)** | **~$0.04** |

## Troubleshooting

### "No transcript available"
- The video must have captions (auto-generated or manual)
- Some videos have captions disabled by the creator
- Try a different video

### "Invalid YouTube URL"
- Make sure you're using a valid YouTube URL format
- Check for extra characters or spaces

### "Connection Error"
- Make sure the server is running (`npm start`)
- Check that port 3456 is not in use

### "Database error"
- Verify your Supabase credentials in `.env`
- Make sure the `knowledge_embeddings` table exists
- Check that pgvector extension is enabled

### "OpenAI API error"
- Verify your OpenAI API key in `.env`
- Check your OpenAI account has credits
- Rate limits: add delay between videos if processing many

## Development

```bash
# Run with auto-reload on changes
npm run dev
```

## Integration with AI Chat

Once transcripts are in the database, the AI monk companion can access them:

1. User asks a question in the app's "Wisdom" tab
2. The ai-chat Edge Function generates a query embedding
3. `match_knowledge()` searches for relevant chunks (including YouTube content)
4. Claude receives the context and generates a response
5. The response can reference YouTube content with attribution

## File Structure

```
tools/youtube-scraper/
├── index.html      # Web interface
├── server.js       # Express server
├── package.json    # Dependencies
├── .env.example    # Environment template
├── .env            # Your actual config (gitignored)
└── README.md       # This file
```

## Security Notes

- The `.env` file contains sensitive API keys - never commit it
- Uses Supabase service role key (bypasses RLS) - keep secure
- Server runs on localhost only - not exposed to internet
- No authentication required (local tool only)
