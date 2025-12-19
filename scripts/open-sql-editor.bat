@echo off
REM Script to open Supabase SQL Editor with migration SQL ready to paste

echo ================================================================
echo Opening Supabase SQL Editor...
echo ================================================================
echo.
echo Project: zbyszxtwzoylyygtexdr
echo Migration: 20251217000002_create_prayers_table.sql
echo.
echo Instructions:
echo 1. Browser will open to SQL Editor
echo 2. Copy the SQL from the file (next step)
echo 3. Paste into SQL Editor
echo 4. Click "Run" button
echo.
echo ================================================================

REM Open Supabase SQL Editor
start https://supabase.com/dashboard/project/zbyszxtwzoylyygtexdr/sql/new

timeout /t 3 /nobreak >nul

echo.
echo SQL migration file contents:
echo ================================================================
type "%~dp0..\supabase\migrations\20251217000002_create_prayers_table.sql"
echo.
echo ================================================================
echo.
echo Press any key to exit...
pause >nul
