# Vision Boards Workstream

**Status**: Not Started
**Timeline**: Weeks 19-20 (Phase 3)
**Priority**: P2 - High Value Feature

---

## Overview

Vision board creator allows users to upload images and add text overlays (affirmations) to create visual representations of their goals and desires. Users can create multiple boards (tier-dependent), view daily, and share.

## Timeline

- **Planning**: Weeks 17-18
- **Implementation**: Weeks 19-20
- **Testing**: Week 20
- **Polish**: Week 23

## Key Agents Involved

- **Primary**: Frontend Specialist (image picker, editor)
- **Support**: Backend Specialist (storage, tier limits)
- **Review**: Code Review Agent

## Key Tasks

1. **Database Setup** (Backend Specialist)
   - vision_boards table
   - RLS policies with tier limits
   - Indexes

2. **Image Upload** (Frontend Specialist + Backend Specialist)
   - Image picker (camera/library)
   - Upload to Supabase Storage
   - Image compression
   - Progress indicator

3. **Vision Board Creator** (Frontend Specialist)
   - Grid layout for images
   - Add/remove images
   - Text overlay editor
   - Font selection
   - Color picker
   - Save board

4. **Vision Board Management** (Frontend Specialist)
   - List view (thumbnails)
   - Create new
   - Edit existing
   - Delete (with confirmation)
   - Set as active/favorite

5. **Tier-Based Limits** (Backend Specialist + Frontend Specialist)
   - Novice: 1 board
   - Awakening: 3 boards
   - Enlightenment: Unlimited
   - Enforce in UI and database

6. **Daily Reminder** (Frontend Specialist)
   - Daily notification
   - Customizable time
   - Opens vision board in full screen

7. **Share Functionality** (Frontend Specialist)
   - Export as image
   - iOS share sheet
   - Save to photo library

## Dependencies

**Blocks**:
- None (standalone feature)

**Blocked By**:
- Authentication
- Supabase Storage setup
- Subscription system (for tier limits)

## Success Metrics

- Users create vision board in < 5 minutes
- Image upload < 5 seconds
- Tier limits enforced correctly
- Users view vision board daily (30%+ rate)
- Share rate > 10% of users

## Testing Checklist

- [ ] Can upload images from library
- [ ] Can take photo with camera
- [ ] Images upload to Supabase Storage
- [ ] Text overlays work
- [ ] Can save vision board
- [ ] Tier limits enforced
- [ ] Daily reminder triggers
- [ ] Share to photo library works
- [ ] Can edit existing boards

## Technical Details

**Database**:
```sql
CREATE TABLE vision_boards (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  title TEXT NOT NULL,
  images JSONB, -- Array of image URLs + text overlays
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- RLS with tier limits
CREATE POLICY "Vision board tier limits" ON vision_boards
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    (
      (SELECT subscription_tier FROM users WHERE id = auth.uid()) = 'enlightenment' OR
      (SELECT subscription_tier FROM users WHERE id = auth.uid()) = 'awakening' AND
        (SELECT COUNT(*) FROM vision_boards WHERE user_id = auth.uid()) < 3 OR
      (SELECT subscription_tier FROM users WHERE id = auth.uid()) = 'novice' AND
        (SELECT COUNT(*) FROM vision_boards WHERE user_id = auth.uid()) < 1
    )
  );
```

**Image Storage**:
- Supabase Storage bucket: `vision-board-images`
- Compress images before upload (< 1MB per image)
- Support JPEG, PNG
- Max 10 images per board

**Text Overlays**:
- Position, size, rotation
- Font (3-5 options)
- Color (RGB picker)
- Stored as JSON with image URLs

## Resources

- **PRD**: Section 3.2.1 - Vision Board Creator
- **TDD**: Section 6 - Vision Boards

## Current Status

**Not Started**

## Notes

(Add notes on image compression, text overlay challenges)
