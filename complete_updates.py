#!/usr/bin/env python3
"""
Complete all remaining updates for worksheet screens.
"""

import re
from pathlib import Path

BASE_DIR = Path(r"C:\projects\mobileApps\manifest-the-unseen-ios\mobile\src\screens\workbook")

def add_insets_hook(content):
    """Add const insets = useSafeAreaInsets(); in component."""
    # Pattern: Find the component function and add insets hook
    pattern = r"(const \w+Screen: React\.FC<Props> = \(\{ navigation.*?\}\) => \{[^\n]*\n(?:  .*\n)*?)(  \/\/ Load saved data from Supabase|  const \{ data: savedProgress)"

    def replace_func(match):
        before = match.group(1)
        marker = match.group(2)
        # Check if insets already added
        if "useSafeAreaInsets" in before:
            return match.group(0)
        # Add insets hook before the marker
        return before + "  const insets = useSafeAreaInsets();\n\n  " + marker

    return re.sub(pattern, replace_func, content, flags=re.MULTILINE)

def update_auto_save_destructuring(content):
    """Update useAutoSave to include completion fields."""
    pattern = r"const \{ ([^}]*?isSaving[^}]*?) \} = useAuto Save\("

    def replace_func(match):
        vars = match.group(1)
        # Add completion fields if not present
        if "isAutoCompleted" not in vars:
            vars = vars.rstrip() + ", isAutoCompleted, canComplete, markComplete "
        return f"const {{ {vars}}} = useAutoSave("

    return re.sub(pattern, replace_func, content)

def add_is_completed_to_header(content):
    """Add isCompleted prop to ExerciseHeader."""
    pattern = r"(<ExerciseHeader[^>]*?progress=\{savedProgress\?\.progress \|\| 0\})(\s*/>)"

    def replace_func(match):
        if "isCompleted" in match.group(0):
            return match.group(0)
        return match.group(1) + "\n        isCompleted={savedProgress?.completed || false}" + match.group(2)

    return re.sub(pattern, replace_func, content, flags=re.DOTALL)

def replace_save_button(content):
    """Replace Save & Continue button with CompletionButton."""
    # Find and replace the Save button section
    patterns = [
        # Pattern 1: Standard Pressable button
        (
            r"      (\{/\* Action Button \*/\}[^\n]*\n      <Pressable[^>]*?onPress=\{handleSaveAndContinue\}[^>]*?>.*?</Pressable>)",
            r"      {/* Completion Button */}\n      <CompletionButton\n        isCompleted={savedProgress?.completed || false}\n        canComplete={canComplete}\n        isAutoCompleted={isAutoCompleted}\n        isSaving={isSaving}\n        onPress={markComplete}\n      />"
        ),
        # Pattern 2: Button component (if any)
        (
            r"      <Button[^>]*?onPress=\{handleSaveAndContinue\}[^>]*?/>",
            r"      <CompletionButton\n        isCompleted={savedProgress?.completed || false}\n        canComplete={canComplete}\n        isAutoCompleted={isAutoCompleted}\n        isSaving={isSaving}\n        onPress={markComplete}\n      />"
        ),
    ]

    for pattern, replacement in patterns:
        content = re.sub(pattern, replacement, content, flags=re.DOTALL)

    return content

def update_bottom_spacer(content):
    """Update bottomSpacer to include safe area insets."""
    pattern = r"<View style=\{styles\.bottomSpacer\} />"
    replacement = r"<View style={[styles.bottomSpacer, { paddingBottom: insets.bottom }]} />"
    return re.sub(pattern, replacement, content)

def remove_handle_save_function(content):
    """Remove handleSaveAndContinue function."""
    # Pattern to match the function with various content
    patterns = [
        r"  /\*\*\s*\* Handle save and continue\s*\*/\s*const handleSaveAndContinue = async \(\) => \{[\s\S]*?\};\s*\n",
        r"  const handleSaveAndContinue = async \(\) => \{[\s\S]*?\};\s*\n",
    ]

    for pattern in patterns:
        content = re.sub(pattern, "", content)

    return content

def fix_file(file_path):
    """Apply all fixes to a file."""
    content = file_path.read_text(encoding='utf-8')
    original = content

    # Skip if already has CompletionButton component in render
    if "<CompletionButton" in content:
        return False

    # Apply all transformations
    content = add_insets_hook(content)
    content = update_auto_save_destructuring(content)
    content = add_is_completed_to_header(content)
    content = replace_save_button(content)
    content = update_bottom_spacer(content)
    content = remove_handle_save_function(content)

    if content != original:
        file_path.write_text(content, encoding='utf-8')
        return True
    return False

def main():
    """Main execution."""
    print("Completing worksheet screen updates...")
    updated = 0

    for tsx_file in BASE_DIR.rglob("*Screen.tsx"):
        if "Dashboard" not in tsx_file.name:
            if fix_file(tsx_file):
                print(f"  [OK] {tsx_file.name}")
                updated += 1
            else:
                if "<CompletionButton" in tsx_file.read_text(encoding='utf-8'):
                    pass  # Already done
                else:
                    print(f"  [SKIP] {tsx_file.name}")

    print(f"\nUpdated {updated} files")

if __name__ == "__main__":
    main()
