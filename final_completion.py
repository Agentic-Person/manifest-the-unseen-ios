#!/usr/bin/env python3
"""
Final comprehensive update for all worksheet screens.
"""

import re
from pathlib import Path

BASE_DIR = Path(r"C:\projects\mobileApps\manifest-the-unseen-ios\mobile\src\screens\workbook")

def update_file(filepath):
    """Update a single file with all necessary changes."""
    try:
        content = filepath.read_text(encoding='utf-8')

        # Skip if already has CompletionButton in render
        if "<CompletionButton" in content:
            return False, "Already has CompletionButton"

        # 1. Add useSafe AreaInsets to component state
        if "const insets = useSafeAreaInsets();" not in content:
            # Find pattern after hasLoadedInitialData
            pattern = r"(const hasLoadedInitialData = useRef[^;]+;)\n"
            content = re.sub(pattern, r"\1\n  const insets = useSafeAreaInsets();\n", content)

        # 2. Update useAutoSave destructuring
        pattern = r"const \{ ([^}]*isSaving[^}]*) \} = useAutoSave\("
        match = re.search(pattern, content)
        if match:
            vars_str = match.group(1)
            if "isAutoCompleted" not in vars_str:
                # Add completion fields
                new_vars = vars_str.strip() + ", isAutoCompleted, canComplete, markComplete"
                content = content.replace(match.group(0), f"const {{ {new_vars} }} = useAutoSave(")

        # 3. Add isCompleted to ExerciseHeader
        pattern = r"(<ExerciseHeader[^>]+progress=\{savedProgress\?\.progress \|\| 0\})([\s\n]*/>)"
        match = re.search(pattern, content, re.DOTALL)
        if match and "isCompleted" not in match.group(0):
            content = content.replace(
                match.group(0),
                match.group(1) + "\n        isCompleted={savedProgress?.completed || false}" + match.group(2)
            )

        # 4. Replace Save button with CompletionButton
        #    Find the section starting with "Action Button" comment
        pattern = r'(\s+)\{/\* Action Button \*/\}\s+<Pressable[^>]*onPress=\{handleSaveAndContinue\}[^>]*>.*?</Pressable>'
        replacement = (
            r'\1{/* Completion Button */}\n'
            r'\1<CompletionButton\n'
            r'\1  isCompleted={savedProgress?.completed || false}\n'
            r'\1  canComplete={canComplete}\n'
            r'\1  isAutoCompleted={isAutoCompleted}\n'
            r'\1  isSaving={isSaving}\n'
            r'\1  onPress={markComplete}\n'
            r'\1/>'
        )
        content = re.sub(pattern, replacement, content, flags=re.DOTALL)

        # 5. Update bottomSpacer if not already updated
        if "{ paddingBottom: insets.bottom }" not in content:
            content = re.sub(
                r'<View style=\{styles\.bottomSpacer\} />',
                r'<View style={[styles.bottomSpacer, { paddingBottom: insets.bottom }]} />',
                content
            )

        # 6. Remove handleSaveAndContinue function
        pattern = r'(\s+)(?:/\*\*\s+\*\s+Handle save and continue\s+\*/\s+)?const handleSaveAndContinue = async \(\) => \{[^}]+\};?\s*\n'
        content = re.sub(pattern, '', content)

        # Write back
        filepath.write_text(content, encoding='utf-8')
        return True, "Updated successfully"

    except Exception as e:
        return False, f"Error: {e}"

def main():
    """Main execution."""
    print("Final completion of worksheet screen updates...\n")

    updated = []
    skipped = []
    errors = []

    for tsx_file in sorted(BASE_DIR.rglob("*Screen.tsx")):
        if "Dashboard" in tsx_file.name:
            continue

        success, message = update_file(tsx_file)
        if success:
            updated.append(tsx_file.name)
            print(f"[OK] {tsx_file.name}")
        elif "Already has" in message:
            skipped.append(tsx_file.name)
        else:
            errors.append((tsx_file.name, message))
            print(f"[ERROR] {tsx_file.name}: {message}")

    print(f"\n{'='*60}")
    print(f"Summary:")
    print(f"  Updated: {len(updated)}")
    print(f"  Already done: {len(skipped)}")
    print(f"  Errors: {len(errors)}")
    print(f"{'='*60}")

    if errors:
        print("\nErrors:")
        for name, msg in errors:
            print(f"  - {name}: {msg}")

if __name__ == "__main__":
    main()
