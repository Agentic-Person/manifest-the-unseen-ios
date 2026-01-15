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

  // Check if all fields meet minimum character count
  if (criteria.minCharsPerField !== undefined) {
    const hasShortFields = Object.values(data).some(
      (v) => typeof v === 'string' && v.trim().length < criteria.minCharsPerField
    );
    if (hasShortFields) return false;
  }

  // Check if all mandatory fields are filled
  if (criteria.mandatoryFields && criteria.mandatoryFields.length > 0) {
    const allFilled = criteria.mandatoryFields.every(
      (key) => data[key] && String(data[key]).trim().length > 0
    );
    if (!allFilled) return false;
  }

  // Run custom validation if provided
  if (criteria.customValidator) {
    return criteria.customValidator(data);
  }

  // If no criteria specified, consider it complete if any data exists
  return filledFields.length > 0;
};
