/**
 * Font Size Context
 *
 * Provides global font scaling based on user preference.
 * Scale factors: small=0.85, medium=1.0, large=1.15
 */

import React, { createContext, useContext, useMemo, useCallback } from 'react';
import { useSettingsStore } from '../stores/settingsStore';

type FontSizePreference = 'small' | 'medium' | 'large';

const SCALE_FACTORS: Record<FontSizePreference, number> = {
  small: 0.85,
  medium: 1.0,
  large: 1.15,
} as const;

interface FontSizeContextValue {
  /** Current scale factor (0.85, 1.0, or 1.15) */
  scale: number;
  /** Current font size preference */
  fontSize: FontSizePreference;
  /** Scale a base font size by the current preference */
  scaleFont: (baseSize: number) => number;
}

const FontSizeContext = createContext<FontSizeContextValue>({
  scale: 1.0,
  fontSize: 'medium',
  scaleFont: (size) => size,
});

interface FontSizeProviderProps {
  children: React.ReactNode;
}

/**
 * Font Size Provider
 *
 * Wrap your app with this provider to enable font scaling.
 *
 * @example
 * ```tsx
 * <FontSizeProvider>
 *   <App />
 * </FontSizeProvider>
 * ```
 */
export const FontSizeProvider: React.FC<FontSizeProviderProps> = ({ children }) => {
  const fontSize = useSettingsStore((state) => state.fontSize);
  const scale = SCALE_FACTORS[fontSize];

  const scaleFont = useCallback(
    (baseSize: number): number => Math.round(baseSize * scale),
    [scale]
  );

  const value = useMemo(
    () => ({
      scale,
      fontSize,
      scaleFont,
    }),
    [scale, fontSize, scaleFont]
  );

  return <FontSizeContext.Provider value={value}>{children}</FontSizeContext.Provider>;
};

/**
 * Hook to access the font size context
 *
 * @example
 * ```tsx
 * const { scale, fontSize, scaleFont } = useFontSizeContext();
 * ```
 */
export const useFontSizeContext = (): FontSizeContextValue => {
  const context = useContext(FontSizeContext);
  if (!context) {
    throw new Error('useFontSizeContext must be used within a FontSizeProvider');
  }
  return context;
};

/**
 * Hook to get a scaled font size
 *
 * @param baseSize - The base font size to scale
 * @returns The scaled font size
 *
 * @example
 * ```tsx
 * const titleSize = useScaledFontSize(24); // Returns 20, 24, or 28 based on preference
 * ```
 */
export const useScaledFontSize = (baseSize: number): number => {
  const { scaleFont } = useFontSizeContext();
  return scaleFont(baseSize);
};

/**
 * Hook to create scaled styles
 *
 * @returns A function that scales font sizes in a style object
 *
 * @example
 * ```tsx
 * const scaleStyles = useScaledStyles();
 * const scaledStyle = scaleStyles({ fontSize: 16, lineHeight: 24 });
 * ```
 */
export const useScaledStyles = () => {
  const { scaleFont } = useFontSizeContext();

  return useCallback(
    <T extends { fontSize?: number; lineHeight?: number }>(style: T): T => ({
      ...style,
      fontSize: style.fontSize ? scaleFont(style.fontSize) : undefined,
      lineHeight: style.lineHeight ? scaleFont(style.lineHeight) : undefined,
    }),
    [scaleFont]
  );
};
