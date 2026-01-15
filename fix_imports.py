#!/usr/bin/env python3
"""
Fix imports for all worksheet screens that are missing CompletionButton and useSafeAreaInsets.
"""

import re
from pathlib import Path

BASE_DIR = Path(r"C:\projects\mobileApps\manifest-the-unseen-ios\mobile\src\screens\workbook")

def fix_file(file_path):
    """Fix imports for a single file."""
    content = file_path.read_text(encoding='utf-8')
    original = content
    updated = False

    # Check if imports are needed
    needs_safe_area = "useSafeAreaInsets" not in content
    needs_completion_button = "CompletionButton" not in content or ("import" in content and "CompletionButton" in content and "from '../../../components/workbook'" in content)

    # Add useSafeAreaInsets import after react-native import
    if needs_safe_area:
        # Find the react-native import block
        pattern = r"(} from 'react-native';)"
        if re.search(pattern, content):
            content = re.sub(
                pattern,
                r"} from 'react-native';\nimport { useSafeAreaInsets } from 'react-native-safe-area-context';",
                content,
                count=1
            )
            updated = True

    # Fix workbook imports to include CompletionButton
    if needs_completion_button:
        # Find the workbook import line
        pattern = r"(import \{[^}]+)(\} from ['\"]\.\.\/\.\.\/\.\.\/components\/workbook['\"];)"
        match = re.search(pattern, content)
        if match:
            imports = match.group(1)
            rest = match.group(2)
            # Add CompletionButton if not present
            if "CompletionButton" not in imports:
                # Add before the closing brace
                new_imports = imports.rstrip() + ", CompletionButton "
                content = re.sub(
                    pattern,
                    new_imports + rest,
                    content,
                    count=1
                )
                updated = True

    if content != original:
        file_path.write_text(content, encoding='utf-8')
        return True
    return False

def main():
    """Fix all worksheet screen files."""
    print("Fixing imports in worksheet screens...")
    fixed = 0

    for tsx_file in BASE_DIR.rglob("*Screen.tsx"):
        if "Dashboard" not in tsx_file.name:
            if fix_file(tsx_file):
                print(f"  [OK] {tsx_file.name}")
                fixed += 1

    print(f"\nFixed {fixed} files")

if __name__ == "__main__":
    main()
