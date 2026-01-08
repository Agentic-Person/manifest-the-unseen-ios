#!/usr/bin/env python3
"""
Whisper Transcription Helper

Simple wrapper to transcribe audio files using OpenAI Whisper
and output JSON with timestamps.

Usage:
    python whisper_transcribe.py <audio_file> <output_dir> [--model tiny]
"""

import sys
import json
import os

# Add ffmpeg path for Windows (WinGet installation)
ffmpeg_path = r"C:\Users\jimmy\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-8.0.1-full_build\bin"
if os.name == 'nt' and ffmpeg_path not in os.environ.get('PATH', ''):
    os.environ['PATH'] = ffmpeg_path + os.pathsep + os.environ.get('PATH', '')

def main():
    if len(sys.argv) < 3:
        print("Usage: python whisper_transcribe.py <audio_file> <output_dir> [--model tiny]")
        sys.exit(1)

    audio_file = sys.argv[1]
    output_dir = sys.argv[2]
    model_name = "tiny"

    # Check for --model argument
    for i, arg in enumerate(sys.argv):
        if arg == "--model" and i + 1 < len(sys.argv):
            model_name = sys.argv[i + 1]

    # Import whisper
    try:
        import whisper
    except ImportError:
        print("Error: whisper not installed. Run: pip install openai-whisper")
        sys.exit(1)

    # Check if audio file exists
    if not os.path.exists(audio_file):
        print(f"Error: Audio file not found: {audio_file}")
        sys.exit(1)

    # Create output directory if needed
    os.makedirs(output_dir, exist_ok=True)

    print(f"Loading Whisper model: {model_name}")
    model = whisper.load_model(model_name)

    print(f"Transcribing: {audio_file}")
    result = model.transcribe(audio_file, language="en", verbose=False)

    # Write JSON output
    base_name = os.path.splitext(os.path.basename(audio_file))[0]
    output_file = os.path.join(output_dir, f"{base_name}.json")

    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(result, f, indent=2, ensure_ascii=False)

    print(f"Output saved to: {output_file}")
    print(f"Found {len(result.get('segments', []))} segments")

if __name__ == "__main__":
    main()
