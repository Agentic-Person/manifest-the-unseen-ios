#!/usr/bin/env python3
"""
Script to apply SQL migrations to Supabase database
Usage: python scripts/apply_migration.py <migration-file>
"""

import sys
import os
import psycopg2
from pathlib import Path

# Database connection string
# Format: postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres
DB_URL = "postgresql://postgres.zbyszxtwzoylyygtexdr:Jameswill77!@aws-0-us-east-1.pooler.supabase.com:5432/postgres"

def run_migration(migration_file):
    """Execute a SQL migration file"""

    # Read migration file
    migration_path = Path(__file__).parent.parent / 'supabase' / 'migrations' / migration_file

    if not migration_path.exists():
        print(f"Error: Migration file not found: {migration_path}")
        sys.exit(1)

    with open(migration_path, 'r', encoding='utf-8') as f:
        sql = f.read()

    print(f"Running migration: {migration_file}")
    print("=" * 80)

    try:
        # Connect to database
        conn = psycopg2.connect(DB_URL)
        conn.autocommit = False
        cursor = conn.cursor()

        # Execute SQL
        cursor.execute(sql)

        # Commit transaction
        conn.commit()

        print("✓ Migration executed successfully!")

        # Close connection
        cursor.close()
        conn.close()

    except psycopg2.Error as e:
        print(f"✗ Database error: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"✗ Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python scripts/apply_migration.py <migration-file>")
        print("Example: python scripts/apply_migration.py 20251217000002_create_prayers_table.sql")
        sys.exit(1)

    migration_file = sys.argv[1]
    run_migration(migration_file)
