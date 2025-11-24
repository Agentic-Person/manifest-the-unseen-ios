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

import React, { memo } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  ViewStyle,
} from 'react-native';
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
 */
const VisionItem: React.FC<VisionItemProps> = ({
  item,
  isSelected,
  onSelect,
  onDelete,
  onUpdatePosition,
}) => {
  const { id, type, content, position, size, style } = item;

  /**
   * Handle item press - select it
   */
  const handlePress = () => {
    onSelect(id);
  };

  /**
   * Handle delete button press
   */
  const handleDelete = () => {
    onDelete(id);
  };

  /**
   * Move item in a direction (simple tap-to-move controls)
   */
  const moveItem = (direction: 'up' | 'down' | 'left' | 'right') => {
    const step = 20; // pixels to move
    let newX = position.x;
    let newY = position.y;

    switch (direction) {
      case 'up':
        newY = Math.max(0, position.y - step);
        break;
      case 'down':
        newY = position.y + step;
        break;
      case 'left':
        newX = Math.max(0, position.x - step);
        break;
      case 'right':
        newX = position.x + step;
        break;
    }

    onUpdatePosition(id, { x: newX, y: newY });
  };

  /**
   * Get container style based on item properties
   */
  const getContainerStyle = (): ViewStyle[] => {
    const containerStyles: ViewStyle[] = [
      styles.container,
      {
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
      },
    ];

    if (isSelected) {
      containerStyles.push(styles.selected);
    }

    if (style?.hasShadow) {
      containerStyles.push(styles.shadow);
    }

    return containerStyles;
  };

  /**
   * Render image item
   */
  const renderImage = () => {
    const imageStyle: ViewStyle[] = [styles.imageWrapper];

    // Polaroid frame effect
    if (style?.hasFrame) {
      imageStyle.push(styles.polaroidFrame);
    }

    return (
      <View style={imageStyle}>
        <Image
          source={{ uri: content }}
          style={[
            styles.image,
            {
              borderRadius: style?.borderRadius || 4,
              opacity: style?.opacity || 1,
            },
          ]}
          resizeMode="cover"
        />
        {style?.hasFrame && (
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
              fontSize: style?.fontSize || 18,
              fontWeight: style?.fontWeight || 'bold',
              textAlign: style?.textAlign || 'center',
              color: style?.color || DESIGN_COLORS.textPrimary,
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
    <Pressable
      style={getContainerStyle()}
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={type === 'image' ? 'Vision board image' : content}
      accessibilityHint="Tap to select this item"
    >
      {/* Content */}
      {type === 'image' ? renderImage() : renderText()}

      {/* Selection Controls - Only show when selected */}
      {isSelected && (
        <View style={styles.controls}>
          {/* Delete Button */}
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDelete}
            accessibilityRole="button"
            accessibilityLabel="Delete item"
          >
            <Text style={styles.deleteButtonText}>X</Text>
          </TouchableOpacity>

          {/* Move Controls */}
          <View style={styles.moveControls}>
            <TouchableOpacity
              style={styles.moveButton}
              onPress={() => moveItem('up')}
              accessibilityLabel="Move up"
            >
              <Text style={styles.moveButtonText}>^</Text>
            </TouchableOpacity>
            <View style={styles.moveButtonRow}>
              <TouchableOpacity
                style={styles.moveButton}
                onPress={() => moveItem('left')}
                accessibilityLabel="Move left"
              >
                <Text style={styles.moveButtonText}>{'<'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.moveButton}
                onPress={() => moveItem('right')}
                accessibilityLabel="Move right"
              >
                <Text style={styles.moveButtonText}>{'>'}</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.moveButton}
              onPress={() => moveItem('down')}
              accessibilityLabel="Move down"
            >
              <Text style={styles.moveButtonText}>v</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </Pressable>
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

  // Controls
  controls: {
    position: 'absolute',
    top: -40,
    right: -8,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  deleteButton: {
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
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },

  // Move controls
  moveControls: {
    alignItems: 'center',
  },
  moveButtonRow: {
    flexDirection: 'row',
    gap: 4,
  },
  moveButton: {
    width: 24,
    height: 24,
    borderRadius: 4,
    backgroundColor: DESIGN_COLORS.accentPurple,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 1,
  },
  moveButtonText: {
    color: DESIGN_COLORS.textPrimary,
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default memo(VisionItem);
