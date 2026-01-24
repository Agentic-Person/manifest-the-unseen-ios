/**
 * Completion Detection Utility
 *
 * Provides flexible completion detection logic for workbook worksheets.
 * Each worksheet can define its own completion criteria.
 */

export interface CompletionCriteria {
  /** Minimum number of fields that must be filled */
  requiredFields?: number;
  /** Minimum character count per field */
  minCharsPerField?: number;
  /** Specific fields that MUST be filled */
  mandatoryFields?: string[];
  /** Custom validation function for complex criteria */
  customValidator?: (data: Record<string, unknown>) => boolean;
}

/**
 * Detect if a worksheet is complete based on its criteria
 *
 * @param data - The worksheet data
 * @param criteria - The completion criteria for this worksheet
 * @returns true if the worksheet meets completion criteria
 */
export const detectCompletion = (
  data: Record<string, unknown>,
  criteria: CompletionCriteria
): boolean => {
  // Count filled fields (non-null, non-undefined, non-empty)
  const filledFields = Object.values(data).filter((v) => v !== null && v !== undefined && v !== '');

  // Check if minimum number of fields are filled
  if (criteria.requiredFields !== undefined && filledFields.length < criteria.requiredFields) {
    return false;
  }

  // Check if all mandatory fields are filled and meet minimum character count
  if (criteria.mandatoryFields && criteria.mandatoryFields.length > 0) {
    const minChars = criteria.minCharsPerField ?? 0;

    const allFilled = criteria.mandatoryFields.every((key) => {
      const value = data[key];
      // Field must exist and be a non-empty string
      if (!value || typeof value !== 'string') {
        return false;
      }
      const trimmed = value.trim();
      // Field must meet minimum character count if specified
      return trimmed.length > 0 && trimmed.length >= minChars;
    });

    if (!allFilled) {
      return false;
    }
  }

  // Check if all OTHER non-mandatory STRING fields also meet minimum character count
  // Only check non-empty string fields (ignore empty fields, non-strings, timestamps, etc.)
  if (criteria.minCharsPerField !== undefined && !criteria.mandatoryFields) {
    const minChars = criteria.minCharsPerField;
    const stringFields = Object.values(data).filter(
      (v) => typeof v === 'string' && v.trim().length > 0
    );
    const hasShortFields = stringFields.some(
      (v) => typeof v === 'string' && v.trim().length < minChars
    );
    if (hasShortFields) {
      return false;
    }
  }

  // Run custom validation if provided
  if (criteria.customValidator) {
    return criteria.customValidator(data);
  }

  // If no criteria specified, consider it complete if any data exists
  return filledFields.length > 0;
};
