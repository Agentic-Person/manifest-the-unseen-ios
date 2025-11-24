/**
 * Vision Board Types
 *
 * Type definitions for the Vision Board feature.
 * Follows the data schema defined in the task requirements.
 */

/**
 * Vision Board Item - represents a single item on the canvas
 */
export interface VisionBoardItem {
  id: string;
  type: 'image' | 'text';
  content: string; // URL for images, text content for text
  position: { x: number; y: number };
  size: { width: number; height: number };
  rotation?: number;
  style?: VisionItemStyle;
  createdAt: string;
  updatedAt: string;
}

/**
 * Style options for vision board items
 */
export interface VisionItemStyle {
  // Text styling
  fontSize?: number;
  fontWeight?: 'normal' | 'bold';
  textAlign?: 'left' | 'center' | 'right';
  color?: string;
  // Image styling
  borderRadius?: number;
  borderWidth?: number;
  borderColor?: string;
  opacity?: number;
  // Frame styling (Polaroid effect)
  hasFrame?: boolean;
  frameColor?: string;
  // Shadow
  hasShadow?: boolean;
}

/**
 * Vision Board Data - the complete board structure
 */
export interface VisionBoardData {
  id: string;
  userId?: string;
  name: string;
  items: VisionBoardItem[];
  template: string | null;
  backgroundColor?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Canvas dimensions and settings
 */
export interface CanvasSettings {
  width: number;
  height: number;
  backgroundColor: string;
  gridEnabled: boolean;
  snapToGrid: boolean;
  gridSize: number;
}

/**
 * Default item dimensions
 */
export const DEFAULT_IMAGE_SIZE = { width: 150, height: 150 };
export const DEFAULT_TEXT_SIZE = { width: 200, height: 50 };

/**
 * Default styles for new items
 */
export const DEFAULT_TEXT_STYLE: VisionItemStyle = {
  fontSize: 18,
  fontWeight: 'bold',
  textAlign: 'center',
  color: '#e8e8e8',
  hasShadow: true,
};

export const DEFAULT_IMAGE_STYLE: VisionItemStyle = {
  borderRadius: 8,
  borderWidth: 0,
  opacity: 1,
  hasFrame: true,
  frameColor: '#252547',
  hasShadow: true,
};

/**
 * Generate unique ID for items
 */
export const generateItemId = (): string => {
  return `item_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * Generate unique ID for boards
 */
export const generateBoardId = (): string => {
  return `board_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};
