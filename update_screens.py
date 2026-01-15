#!/usr/bin/env python3
"""
Script to batch update all worksheet screens with CompletionButton pattern.
This applies the same pattern that was manually applied to AbcModelScreen and AbilitiesRatingScreen.
"""

import re
import os
from pathlib import Path

# Base directory
BASE_DIR = Path(r"C:\projects\mobileApps\manifest-the-unseen-ios\mobile\src\screens\workbook")

# List of screens to update (all except dashboards, and already-updated screens)
SCREENS_TO_UPDATE = [
    "Phase1/ComfortZoneScreen.tsx",
    "Phase1/FeelWheelScreen.tsx",
    "Phase1/HabitsAuditScreen.tsx",
    "Phase1/KnowYourselfScreen.tsx",
    "Phase1/StrengthsWeaknessesScreen.tsx",
    "Phase1/SWOTAnalysisScreen.tsx",
    "Phase1/SWOTScreen.tsx",
    "Phase1/ThoughtAwarenessScreen.tsx",
    "Phase1/ValuesAssessmentScreen.tsx",
    "Phase1/WheelOfLifeScreen.tsx",
    "Phase2/PurposeStatementScreen.tsx",
    "Phase2/VisionBoardScreen.tsx",
    "Phase3/ActionPlanScreen.tsx",
    "Phase3/SMARTGoalsScreen.tsx",
    "Phase3/TimelineScreen.tsx",
    "Phase4/FearFacingPlanScreen.tsx",
    "Phase4/FearInventoryScreen.tsx",
    "Phase4/LimitingBeliefsScreen.tsx",
    "Phase5/InnerChildScreen.tsx",
    "Phase5/SelfCareRoutineScreen.tsx",
    "Phase5/SelfLoveAffirmationsScreen.tsx",
    "Phase6/ScriptingScreen.tsx",
    "Phase6/ThreeSixNineScreen.tsx",
    "Phase6/WOOPScreen.tsx",
    "Phase7/GratitudeJournalScreen.tsx",
    "Phase7/GratitudeLettersScreen.tsx",
    "Phase7/GratitudeMeditationScreen.tsx",
    "Phase8/EnvyInventoryScreen.tsx",
    "Phase8/InspirationReframeScreen.tsx",
    "Phase8/RoleModelsScreen.tsx",
    "Phase9/SignsScreen.tsx",
    "Phase9/SurrenderPracticeScreen.tsx",
    "Phase9/TrustAssessmentScreen.tsx",
    "Phase10/FutureLetterScreen.tsx",
    "Phase10/GraduationScreen.tsx",
    "Phase10/JourneyReviewScreen.tsx",
]

def update_imports(content):
    """Add useSafeAreaInsets import and CompletionButton to workbook imports."""
    # Add useSafeAreaInsets import if not present
    if "useSafeAreaInsets" not in content:
        content = re.sub(
            r"(import.*from 'react-native';)",
            r"\1\nimport { useSafeAreaInsets } from 'react-native-safe-area-context';",
            content,
            count=1
        )

    # Add CompletionButton to workbook imports if not present
    if "CompletionButton" not in content:
        content = re.sub(
            r"(from ['\"]\.\.\/\.\.\/\.\.\/components\/workbook['\"];)",
            lambda m: m.group(0).replace("'", "'").replace(
                "} from", ", CompletionButton } from"
            ) if "} from" in m.group(0) else m.group(0),
            content
        )

    return content

def add_insets_hook(content):
    """Add const insets = useSafeAreaInsets(); after state declarations."""
    # Find the component function
    pattern = r"(const \w+Screen: React\.FC<Props> = \(\{ navigation.*?\}\) => \{)(.*?)(const.*?useWorkbookProgress)"

    def replace_func(match):
        func_start = match.group(1)
        middle = match.group(2)
        use_workbook = match.group(3)

        if "useSafeAreaInsets" not in middle:
            # Add insets hook before useWorkbookProgress
            return f"{func_start}{middle}  const insets = useSafeAreaInsets();\n\n  {use_workbook}"
        return match.group(0)

    return re.sub(pattern, replace_func, content, flags=re.DOTALL)

def update_auto_save_hook(content):
    """Add completion-related destructured returns to useAutoSave."""
    pattern = r"const \{ ([^}]*) \} = useAutoSave\("

    def replace_func(match):
        destructured = match.group(1)
        if "isAutoCompleted" not in destructured:
            # Add the completion fields
            return f"const {{ {destructured}, isAutoCompleted, canComplete, markComplete }} = useAutoSave("
        return match.group(0)

    return re.sub(pattern, replace_func, content)

def update_exercise_header(content):
    """Add isCompleted prop to ExerciseHeader."""
    pattern = r"(<ExerciseHeader[^>]*progress=\{savedProgress\?\.progress \|\| 0\})\s*(/>)"

    def replace_func(match):
        if "isCompleted" not in match.group(0):
            return f"{match.group(1)}\n        isCompleted={{savedProgress?.completed || false}}\n      {match.group(2)}"
        return match.group(0)

    return re.sub(pattern, replace_func, content, flags=re.DOTALL)

def replace_save_button_with_completion(content):
    """Replace Save & Continue button with CompletionButton."""
    # Pattern to match the save button section
    pattern = r"(\s*)\{/\* Action Button \*/\}\s*<Pressable[^>]*onPress=\{handleSaveAndContinue\}[^>]*>.*?</Pressable>\s*(\{/\* Bottom spacing \*/\}\s*<View style=\{styles\.bottomSpacer\} />)"

    replacement = r"""\1{/* Completion Button */}
\1<CompletionButton
\1  isCompleted={savedProgress?.completed || false}
\1  canComplete={canComplete}
\1  isAutoCompleted={isAutoCompleted}
\1  isSaving={isSaving}
\1  onPress={markComplete}
\1/>

\1\2"""

    content = re.sub(pattern, replacement, content, flags=re.DOTALL)

    # Update bottomSpacer to include insets
    content = re.sub(
        r"<View style=\{styles\.bottomSpacer\} />",
        r"<View style={[styles.bottomSpacer, { paddingBottom: insets.bottom }]} />",
        content
    )

    return content

def remove_handle_save_and_continue(content):
    """Remove handleSaveAndContinue function."""
    pattern = r"\s*/\*\*\s*\* Handle save and continue\s*\*/\s*const handleSaveAndContinue = async \(\) => \{[^}]*\};\s*"
    return re.sub(pattern, "\n", content, flags=re.DOTALL)

def update_screen(file_path):
    """Apply all updates to a single screen file."""
    print(f"Updating {file_path.name}...")

    try:
        content = file_path.read_text(encoding='utf-8')
        original = content

        # Skip if already has CompletionButton
        if "CompletionButton" in content and "<CompletionButton" in content:
            print(f"  [OK] {file_path.name} already updated, skipping")
            return True

        # Apply transformations
        content = update_imports(content)
        content = add_insets_hook(content)
        content = update_auto_save_hook(content)
        content = update_exercise_header(content)
        content = replace_save_button_with_completion(content)
        content = remove_handle_save_and_continue(content)

        # Write back only if changed
        if content != original:
            file_path.write_text(content, encoding='utf-8')
            print(f"  [OK] {file_path.name} updated successfully")
            return True
        else:
            print(f"  [SKIP] {file_path.name} no changes needed")
            return True

    except Exception as e:
        print(f"  [FAIL] {file_path.name} failed: {e}")
        return False

def main():
    """Main execution."""
    print("Starting batch update of worksheet screens...\n")

    updated = 0
    failed = 0

    for screen_path in SCREENS_TO_UPDATE:
        full_path = BASE_DIR / screen_path
        if full_path.exists():
            if update_screen(full_path):
                updated += 1
            else:
                failed += 1
        else:
            print(f"  [FAIL] {screen_path} not found")
            failed += 1

    print(f"\n{'='*60}")
    print(f"Batch update complete!")
    print(f"  Updated: {updated}")
    print(f"  Failed: {failed}")
    print(f"{'='*60}")

if __name__ == "__main__":
    main()
