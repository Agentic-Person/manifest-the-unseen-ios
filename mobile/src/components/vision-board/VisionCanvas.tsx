/**
 * VisionCanvas Component
 *
 * The main canvas area where users arrange their vision board items.
 * Provides a dark themed container for images and text overlays.
 *
 * Design (from APP-DESIGN.md):
 * - Canvas: #252547 (slightly elevated)
 * - Background: #1a1a2e (deep charcoal)
 * - Hand-drawn aesthetic where possible
 */

import React, { useCallback } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  Text,
  Pressable,
} from 'react-native';
import type { VisionBoardItem } from './types';
import VisionItem from './VisionItem';

// Design system colors from APP-DESIGN.md
const DESIGN_COLORS = {
  bgPrimary: '#1a1a2e',
  bgSecondary: '#16213e',
  bgElevated: '#252547',
  textPrimary: '#e8e8e8',
  textSecondary: '#a0a0b0',
  textTertiary: '#6b6b80',
  accentPurple: '#4a1a6b',
  accentGold: '#c9a227',
  border: '#3a3a5a',
};

// Canvas dimensions
const { width: screenWidth } = Dimensions.get('window');
const CANVAS_WIDTH = screenWidth - 32; // Account for padding
const CANVAS_HEIGHT = 500; // Fixed height for scrollable canvas

interface VisionCanvasProps {
  items: VisionBoardItem[];
  selectedItemId: string | null;
  onSelectItem: (id: string | null) => void;
  onDeleteItem: (id: string) => void;
  onUpdateItemPosition: (id: string, position: { x: number; y: number }) => void;
  onCanvasTap: () => void;
}

/**
 * VisionCanvas Component
 */
const VisionCanvas: React.FC<VisionCanvasProps> = ({
  items,
  selectedItemId,
  onSelectItem,
  onDeleteItem,
  onUpdateItemPosition,
  onCanvasTap,
}) => {
  /**
   * Handle item selection
   */
  const handleSelectItem = useCallback((id: string) => {
    onSelectItem(id);
  }, [onSelectItem]);

  /**
   * Handle item deletion
   */
  const handleDeleteItem = useCallback((id: string) => {
    onDeleteItem(id);
    onSelectItem(null);
  }, [onDeleteItem, onSelectItem]);

  /**
   * Handle position update
   */
  const handleUpdatePosition = useCallback((id: string, position: { x: number; y: number }) => {
    // Clamp position to canvas bounds
    const clampedPosition = {
      x: Math.max(0, Math.min(position.x, CANVAS_WIDTH - 50)),
      y: Math.max(0, Math.min(position.y, CANVAS_HEIGHT - 50)),
    };
    onUpdateItemPosition(id, clampedPosition);
  }, [onUpdateItemPosition]);

  /**
   * Handle tap on empty canvas area
   */
  const handleCanvasPress = () => {
    onCanvasTap();
  };

  return (
    <View style={styles.container}>
      {/* Canvas Label */}
      <View style={styles.labelContainer}>
        <Text style={styles.label}>Your Vision Board</Text>
        <Text style={styles.hint}>
          {items.length === 0
            ? 'Add images and text to visualize your dreams'
            : `${items.length} item${items.length !== 1 ? 's' : ''}`}
        </Text>
      </View>

      {/* Scrollable Canvas */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        bounces={false}
      >
        <Pressable
          style={styles.canvas}
          onPress={handleCanvasPress}
          accessibilityRole="none"
          accessibilityLabel="Vision board canvas"
        >
          {/* Decorative corner elements - hand-drawn aesthetic */}
          <View style={[styles.cornerDecor, styles.cornerTopLeft]} />
          <View style={[styles.cornerDecor, styles.cornerTopRight]} />
          <View style={[styles.cornerDecor, styles.cornerBottomLeft]} />
          <View style={[styles.cornerDecor, styles.cornerBottomRight]} />

          {/* Empty state */}
          {items.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>+</Text>
              <Text style={styles.emptyText}>
                Tap "Add Image" or "Add Text" below{'\n'}to start building your vision board
              </Text>
            </View>
          )}

          {/* Vision Board Items */}
          {items.map((item) => (
            <VisionItem
              key={item.id}
              item={item}
              isSelected={selectedItemId === item.id}
              onSelect={handleSelectItem}
              onDelete={handleDeleteItem}
              onUpdatePosition={handleUpdatePosition}
            />
          ))}
        </Pressable>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: DESIGN_COLORS.textPrimary,
    letterSpacing: 0.5,
  },
  hint: {
    fontSize: 12,
    color: DESIGN_COLORS.textTertiary,
  },
  scrollView: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  scrollContent: {
    minHeight: CANVAS_HEIGHT,
  },
  canvas: {
    width: CANVAS_WIDTH,
    minHeight: CANVAS_HEIGHT,
    backgroundColor: DESIGN_COLORS.bgElevated,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: DESIGN_COLORS.border,
    overflow: 'hidden',
    position: 'relative',
  },

  // Decorative corners
  cornerDecor: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderColor: DESIGN_COLORS.accentGold,
    opacity: 0.3,
  },
  cornerTopLeft: {
    top: 8,
    left: 8,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderTopLeftRadius: 8,
  },
  cornerTopRight: {
    top: 8,
    right: 8,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderTopRightRadius: 8,
  },
  cornerBottomLeft: {
    bottom: 8,
    left: 8,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderBottomLeftRadius: 8,
  },
  cornerBottomRight: {
    bottom: 8,
    right: 8,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderBottomRightRadius: 8,
  },

  // Empty state
  emptyState: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyIcon: {
    fontSize: 48,
    color: DESIGN_COLORS.textTertiary,
    marginBottom: 16,
    opacity: 0.5,
  },
  emptyText: {
    fontSize: 14,
    color: DESIGN_COLORS.textTertiary,
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default VisionCanvas;
