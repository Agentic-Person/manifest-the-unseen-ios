/**
 * VisionItem Component
 *
 * Individual item (image or text) on the vision board canvas.
 * Supports selection, positioning controls, and deletion.
 *
 * Design (from APP-DESIGN.md):
 * - Dark theme compatible
 * - Polaroid-style frames for images (optional)
 * - Hand-drawn aesthetic where possible
 * - Muted gold (#c9a227) for selected items
 */

import React, { memo, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Animated,
  PanResponder,
  type ViewStyle,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import type { VisionBoardItem } from './types';

// Design system colors from APP-DESIGN.md
const DESIGN_COLORS = {
  bgPrimary: '#1a1a2e',
  bgElevated: '#252547',
  textPrimary: '#e8e8e8',
  textSecondary: '#a0a0b0',
  accentGold: '#c9a227',
  accentPurple: '#4a1a6b',
  border: '#3a3a5a',
  error: '#dc2626',
};

interface VisionItemProps {
  item: VisionBoardItem;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdatePosition: (id: string, position: { x: number; y: number }) => void;
}

/**
 * VisionItem Component
 *
 * Supports direct drag-and-drop for repositioning.
 * Tap to select, then drag anywhere to move.
 */
const VisionItem: React.FC<VisionItemProps> = ({
  item,
  isSelected,
  onSelect,
  onDelete,
  onUpdatePosition,
}) => {
  const { id, type, content, position, size, style: itemStyle } = item;

  // Animation values for drag feedback
  const pan = useRef(new Animated.ValueXY({ x: position.x, y: position.y })).current;
  const scale = useRef(new Animated.Value(1)).current;

  // Track if we're currently dragging
  const isDragging = useRef(false);

  // Update pan position when item position changes externally
  React.useEffect(() => {
    if (!isDragging.current) {
      pan.setValue({ x: position.x, y: position.y });
    }
  }, [position.x, position.y]);

  /**
   * PanResponder for drag-and-drop
   */
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only capture pan if user has moved significantly
        return Math.abs(gestureState.dx) > 5 || Math.abs(gestureState.dy) > 5;
      },
      onPanResponderGrant: () => {
        // Select the item and provide haptic feedback
        onSelect(id);
        isDragging.current = true;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        // Scale up slightly when picked up
        Animated.spring(scale, {
          toValue: 1.05,
          useNativeDriver: true,
        }).start();

        // Set offset to current position
        pan.setOffset({
          x: (pan.x as any)._value || position.x,
          y: (pan.y as any)._value || position.y,
        });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: () => {
        isDragging.current = false;

        // Flatten offset into value
        pan.flattenOffset();

        // Get final position
        const newX = Math.max(0, (pan.x as any)._value || 0);
        const newY = Math.max(0, (pan.y as any)._value || 0);

        // Scale back down
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
        }).start();

        // Update position in parent
        onUpdatePosition(id, { x: newX, y: newY });

        // Haptic feedback on drop
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      },
    })
  ).current;

  /**
   * Handle delete button press
   */
  const handleDelete = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    onDelete(id);
  };

  /**
   * Get container style based on item properties
   */
  const getContainerStyle = (): ViewStyle[] => {
    const containerStyles: ViewStyle[] = [
      styles.container,
      {
        width: size.width,
        height: size.height,
      },
    ];

    if (isSelected) {
      containerStyles.push(styles.selected);
    }

    if (itemStyle?.hasShadow) {
      containerStyles.push(styles.shadow);
    }

    return containerStyles;
  };

  /**
   * Render image item
   */
  const renderImage = () => {
    const imageStyles: ViewStyle[] = [styles.imageWrapper];

    // Polaroid frame effect
    if (itemStyle?.hasFrame) {
      imageStyles.push(styles.polaroidFrame);
    }

    return (
      <View style={imageStyles}>
        <Image
          source={{ uri: content }}
          style={[
            styles.image,
            {
              borderRadius: itemStyle?.borderRadius || 4,
              opacity: itemStyle?.opacity || 1,
            },
          ]}
          resizeMode="cover"
        />
        {itemStyle?.hasFrame && (
          <View style={styles.polaroidBottom} />
        )}
      </View>
    );
  };

  /**
   * Render text item
   */
  const renderText = () => {
    return (
      <View style={styles.textWrapper}>
        <Text
          style={[
            styles.text,
            {
              fontSize: itemStyle?.fontSize || 18,
              fontWeight: itemStyle?.fontWeight || 'bold',
              textAlign: itemStyle?.textAlign || 'center',
              color: itemStyle?.color || DESIGN_COLORS.textPrimary,
            },
          ]}
          numberOfLines={5}
        >
          {content}
        </Text>
      </View>
    );
  };

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        ...getContainerStyle(),
        {
          transform: [
            { translateX: pan.x },
            { translateY: pan.y },
            { scale },
          ],
        },
      ]}
      accessibilityRole="button"
      accessibilityLabel={type === 'image' ? 'Vision board image - drag to move' : `${content} - drag to move`}
      accessibilityHint="Touch and drag to reposition this item"
    >
      {/* Content */}
      {type === 'image' ? renderImage() : renderText()}

      {/* Delete Button - Only show when selected */}
      {isSelected && (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDelete}
          accessibilityRole="button"
          accessibilityLabel="Delete item"
        >
          <Text style={styles.deleteButtonText}>×</Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    borderRadius: 8,
    overflow: 'visible',
  },
  selected: {
    borderWidth: 2,
    borderColor: DESIGN_COLORS.accentGold,
    borderStyle: 'dashed',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  // Image styles
  imageWrapper: {
    flex: 1,
    borderRadius: 4,
    overflow: 'hidden',
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  polaroidFrame: {
    backgroundColor: DESIGN_COLORS.bgElevated,
    padding: 8,
    paddingBottom: 32,
    borderRadius: 4,
  },
  polaroidBottom: {
    height: 24,
    backgroundColor: DESIGN_COLORS.bgElevated,
  },

  // Text styles
  textWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    backgroundColor: 'rgba(37, 37, 71, 0.8)',
    borderRadius: 8,
  },
  text: {
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },

  // Delete button - positioned at top-right corner
  deleteButton: {
    position: 'absolute',
    top: -12,
    right: -12,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: DESIGN_COLORS.error,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 10,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 20,
  },
});

export default memo(VisionItem);
