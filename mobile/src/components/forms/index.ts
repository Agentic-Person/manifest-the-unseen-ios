/**
 * Form Components
 *
 * Reusable form components for workbook exercises
 * Import these components for building workbook screens
 *
 * @example
 * ```tsx
 * import {
 *   SliderInput,
 *   RatingScale,
 *   MultiSelect,
 *   TagInput,
 * } from '@/components/forms';
 *
 * <SliderInput
 *   label="Life Satisfaction"
 *   value={satisfaction}
 *   onValueChange={setSatisfaction}
 * />
 * ```
 */

export { SliderInput, type SliderInputProps } from './SliderInput';
export { RatingScale, type RatingScaleProps } from './RatingScale';
export { MultiSelect, type MultiSelectProps } from './MultiSelect';
export { TagInput, type TagInputProps } from './TagInput';
