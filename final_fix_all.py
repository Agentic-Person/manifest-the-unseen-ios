#!/usr/bin/env python3
"""
Final comprehensive fix for ALL remaining worksheet screens.
Handles all edge cases including Button component variants.
"""

import re
from pathlib import Path

BASE_DIR = Path(r"C:\projects\mobileApps\manifest-the-unseen-ios\mobile\src\screens\workbook")

def fix_screen(filepath):
    """Fix a single screen file."""
    content = filepath.read_text(encoding='utf-8')

    # Skip if already has CompletionButton in render
    if re.search(r'<CompletionButton[\s\n]', content):
        return False, "Already has CompletionButton"

    # Find SaveIndicator section and insert CompletionButton after it
    # Pattern: Find SaveIndicator block followed by any save button variant
    pattern1 = r'(<SaveIndicator[\s\S]*?/>)\s*(\{/\* (?:Save Button|Action Button) \*/\}[\s\S]*?(?:</Pressable>|</Button>|</View>))\s*(\{/\* Bottom (?:Spacing|spacing) \*/\})'

    def replace_save_section(match):
        save_indicator = match.group(1)
        button_section = match.group(2)  # We'll replace this entire section
        bottom_comment = match.group(3)

        # Extract indentation from the save indicator line
        indent_match = re.search(r'^(\s*)<SaveIndicator', save_indicator, re.MULTILINE)
        indent = indent_match.group(1) if indent_match else "      "

        completion_button = f"""{indent}{{/* Completion Button */}}
{indent}<CompletionButton
{indent}  isCompleted={{savedProgress?.completed || false}}
{indent}  canComplete={{canComplete}}
{indent}  isAutoCompleted={{isAutoCompleted}}
{indent}  isSaving={{isSaving}}
{indent}  onPress={{markComplete}}
{indent}/>

{indent}{bottom_comment}"""

        return save_indicator + "\n\n" + completion_button

    new_content = re.sub(pattern1, replace_save_section, content, flags=re.MULTILINE)

    # If pattern1 didn't match, try simpler pattern (direct button replacement)
    if new_content == content:
        # Pattern 2: Just find any save button and replace it
        patterns = [
            (r'(\s*)(\{/\* (?:Save Button|Action Button) \*/\}[\s\S]*?</Pressable>)', 'Pressable'),
            (r'(\s*)(\{/\* Save Button \*/\}[\s\S]*?</View>[\s\S]*?</View>)', 'View'),
            (r'(\s*)(<View style=\{styles\.saveContainer\}>[\s\S]*?</View>)', 'Container'),
        ]

        for pattern, button_type in patterns:
            match = re.search(pattern, content)
            if match:
                indent = match.group(1)
                completion = f"""{indent}{{/* Completion Button */}}
{indent}<CompletionButton
{indent}  isCompleted={{savedProgress?.completed || false}}
{indent}  canComplete={{canComplete}}
{indent}  isAutoCompleted={{isAutoCompleted}}
{indent}  isSaving={{isSaving}}
{indent}  onPress={{markComplete}}
{indent}/>"""
                new_content = re.sub(pattern, completion, content, count=1)
                if new_content != content:
                    break

    if new_content != content:
        filepath.write_text(new_content, encoding='utf-8')
        return True, "Updated successfully"

    return False, "No save button pattern matched"

def main():
    """Main execution."""
    print("Final comprehensive fix for all worksheet screens...\n")

    updated = []
    skipped = []
    errors = []

    for tsx_file in sorted(BASE_DIR.rglob("*Screen.tsx")):
        if "Dashboard" in tsx_file.name:
            continue

        success, message = fix_screen(tsx_file)
        if success:
            updated.append(tsx_file.name)
            print(f"[OK] {tsx_file.name}")
        elif "Already has" in message:
            skipped.append(tsx_file.name)
        else:
            errors.append((tsx_file.name, message))
            print(f"[SKIP] {tsx_file.name}: {message}")

    print(f"\n{'='*60}")
    print(f"Summary:")
    print(f"  Updated: {len(updated)}")
    print(f"  Already done: {len(skipped)}")
    print(f"  Could not update: {len(errors)}")
    print(f"{'='*60}")

    if errors:
        print("\nCouldn't update (may need manual review):")
        for name, msg in errors:
            print(f"  - {name}")

if __name__ == "__main__":
    main()
