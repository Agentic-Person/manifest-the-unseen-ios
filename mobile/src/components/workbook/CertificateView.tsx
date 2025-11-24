/**
 * CertificateView
 *
 * Digital certificate of completion for Phase 10 Graduation.
 * Shows a beautiful certificate celebrating the user's journey completion.
 *
 * Design (from APP-DESIGN.md):
 * - Accent gold: #c9a227 (certificate border, accents)
 * - Deep purple: #4a1a6b (decorative elements)
 * - Dark spiritual theme with celebratory feel
 */

import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Certificate paper color (aged parchment effect)
const CERTIFICATE_COLORS = {
  paper: '#f8f4eb',
  paperDark: '#e8e0d0',
  text: '#2a2a2a',
  textSecondary: '#5a5a5a',
  gold: '#c9a227',
  goldLight: '#e5d39a',
  purple: '#4a1a6b',
};

export interface CertificateViewProps {
  userName: string;
  completionDate: Date;
  journeyDuration: number; // in days
  phasesCompleted: number;
  totalExercises: number;
  journalEntries: number;
  meditationMinutes: number;
}

/**
 * Format date for certificate display
 */
const formatCertificateDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * CertificateView Component
 */
export const CertificateView: React.FC<CertificateViewProps> = ({
  userName,
  completionDate,
  journeyDuration,
  phasesCompleted,
  totalExercises,
  journalEntries,
  meditationMinutes,
}) => {
  return (
    <View style={styles.container}>
      {/* Certificate Paper */}
      <View style={styles.certificate}>
        {/* Decorative Border */}
        <View style={styles.outerBorder}>
          <View style={styles.innerBorder}>
            <View style={styles.content}>
              {/* Top Decorative Element */}
              <View style={styles.topDecoration}>
                <View style={styles.decorLine} />
                <Text style={styles.decorSymbol}>{'\u2728'}</Text>
                <View style={styles.decorLine} />
              </View>

              {/* Header */}
              <Text style={styles.headerText}>Certificate of Completion</Text>
              <View style={styles.headerUnderline} />

              {/* Subheader */}
              <Text style={styles.subheaderText}>Manifest the Unseen</Text>
              <Text style={styles.journeyText}>10-Phase Transformation Journey</Text>

              {/* Presented To */}
              <Text style={styles.presentedText}>This is to certify that</Text>

              {/* Name */}
              <View style={styles.nameContainer}>
                <Text style={styles.nameText}>{userName}</Text>
                <View style={styles.nameUnderline} />
              </View>

              {/* Achievement Text */}
              <Text style={styles.achievementText}>
                has successfully completed the sacred journey of self-discovery,
                manifestation mastery, and spiritual awakening through dedicated
                practice and unwavering commitment to personal transformation.
              </Text>

              {/* Stats */}
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{phasesCompleted}</Text>
                  <Text style={styles.statLabel}>Phases</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{totalExercises}</Text>
                  <Text style={styles.statLabel}>Exercises</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{journalEntries}</Text>
                  <Text style={styles.statLabel}>Journals</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{meditationMinutes}</Text>
                  <Text style={styles.statLabel}>Min. Meditation</Text>
                </View>
              </View>

              {/* Date and Duration */}
              <View style={styles.dateContainer}>
                <Text style={styles.dateLabel}>Completed on</Text>
                <Text style={styles.dateText}>{formatCertificateDate(completionDate)}</Text>
                <Text style={styles.durationText}>Journey Duration: {journeyDuration} days</Text>
              </View>

              {/* Seal and Signature */}
              <View style={styles.sealContainer}>
                {/* Seal */}
                <View style={styles.seal}>
                  <View style={styles.sealInner}>
                    <Text style={styles.sealSymbol}>{'\u2600'}</Text>
                    <Text style={styles.sealText}>MTU</Text>
                  </View>
                </View>

                {/* Signature Area */}
                <View style={styles.signatureArea}>
                  <View style={styles.signatureLine} />
                  <Text style={styles.signatureText}>Manifest the Unseen</Text>
                  <Text style={styles.signatureSubtext}>Your Transformation Guide</Text>
                </View>
              </View>

              {/* Bottom Decoration */}
              <View style={styles.bottomDecoration}>
                <View style={styles.decorLine} />
                <Text style={styles.decorSymbol}>{'\u2728'}</Text>
                <View style={styles.decorLine} />
              </View>

              {/* Quote */}
              <Text style={styles.quote}>
                "What you seek is seeking you." - Rumi
              </Text>
            </View>
          </View>
        </View>

        {/* Corner Decorations */}
        <View style={[styles.cornerDecor, styles.topLeft]}>
          <Text style={styles.cornerSymbol}>{'\u2726'}</Text>
        </View>
        <View style={[styles.cornerDecor, styles.topRight]}>
          <Text style={styles.cornerSymbol}>{'\u2726'}</Text>
        </View>
        <View style={[styles.cornerDecor, styles.bottomLeft]}>
          <Text style={styles.cornerSymbol}>{'\u2726'}</Text>
        </View>
        <View style={[styles.cornerDecor, styles.bottomRight]}>
          <Text style={styles.cornerSymbol}>{'\u2726'}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  certificate: {
    width: SCREEN_WIDTH - 32,
    maxWidth: 380,
    backgroundColor: CERTIFICATE_COLORS.paper,
    borderRadius: 8,
    padding: 8,
    shadowColor: CERTIFICATE_COLORS.gold,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
    position: 'relative',
  },
  outerBorder: {
    borderWidth: 3,
    borderColor: CERTIFICATE_COLORS.gold,
    borderRadius: 6,
    padding: 6,
  },
  innerBorder: {
    borderWidth: 1,
    borderColor: CERTIFICATE_COLORS.goldLight,
    borderRadius: 4,
    backgroundColor: CERTIFICATE_COLORS.paper,
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },

  // Decorations
  topDecoration: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  bottomDecoration: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 12,
  },
  decorLine: {
    width: 40,
    height: 1,
    backgroundColor: CERTIFICATE_COLORS.gold,
  },
  decorSymbol: {
    fontSize: 18,
    color: CERTIFICATE_COLORS.gold,
    marginHorizontal: 8,
  },

  // Header
  headerText: {
    fontSize: 22,
    fontWeight: '700',
    color: CERTIFICATE_COLORS.purple,
    textAlign: 'center',
    letterSpacing: 1,
    marginBottom: 4,
  },
  headerUnderline: {
    width: 160,
    height: 2,
    backgroundColor: CERTIFICATE_COLORS.gold,
    marginBottom: 12,
  },
  subheaderText: {
    fontSize: 16,
    fontWeight: '600',
    color: CERTIFICATE_COLORS.gold,
    textAlign: 'center',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  journeyText: {
    fontSize: 12,
    color: CERTIFICATE_COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },

  // Presented To
  presentedText: {
    fontSize: 11,
    color: CERTIFICATE_COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  nameContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  nameText: {
    fontSize: 26,
    fontWeight: '700',
    color: CERTIFICATE_COLORS.text,
    fontStyle: 'italic',
    marginBottom: 4,
  },
  nameUnderline: {
    width: 180,
    height: 1,
    backgroundColor: CERTIFICATE_COLORS.textSecondary,
  },

  // Achievement
  achievementText: {
    fontSize: 11,
    color: CERTIFICATE_COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 10,
    marginBottom: 16,
  },

  // Stats
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: CERTIFICATE_COLORS.paperDark,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginBottom: 16,
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: CERTIFICATE_COLORS.purple,
  },
  statLabel: {
    fontSize: 8,
    color: CERTIFICATE_COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: CERTIFICATE_COLORS.gold,
    opacity: 0.4,
  },

  // Date
  dateContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  dateLabel: {
    fontSize: 10,
    color: CERTIFICATE_COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  dateText: {
    fontSize: 14,
    fontWeight: '600',
    color: CERTIFICATE_COLORS.text,
    marginTop: 2,
  },
  durationText: {
    fontSize: 10,
    color: CERTIFICATE_COLORS.textSecondary,
    marginTop: 4,
  },

  // Seal and Signature
  sealContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 8,
  },
  seal: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: CERTIFICATE_COLORS.gold,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  sealInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: CERTIFICATE_COLORS.goldLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sealSymbol: {
    fontSize: 18,
    color: CERTIFICATE_COLORS.paper,
  },
  sealText: {
    fontSize: 8,
    fontWeight: '700',
    color: CERTIFICATE_COLORS.paper,
    marginTop: -2,
  },
  signatureArea: {
    alignItems: 'center',
  },
  signatureLine: {
    width: 120,
    height: 1,
    backgroundColor: CERTIFICATE_COLORS.text,
    marginBottom: 4,
  },
  signatureText: {
    fontSize: 12,
    fontWeight: '600',
    fontStyle: 'italic',
    color: CERTIFICATE_COLORS.text,
  },
  signatureSubtext: {
    fontSize: 9,
    color: CERTIFICATE_COLORS.textSecondary,
    marginTop: 2,
  },

  // Quote
  quote: {
    fontSize: 10,
    fontStyle: 'italic',
    color: CERTIFICATE_COLORS.textSecondary,
    textAlign: 'center',
  },

  // Corner Decorations
  cornerDecor: {
    position: 'absolute',
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topLeft: {
    top: 12,
    left: 12,
  },
  topRight: {
    top: 12,
    right: 12,
  },
  bottomLeft: {
    bottom: 12,
    left: 12,
  },
  bottomRight: {
    bottom: 12,
    right: 12,
  },
  cornerSymbol: {
    fontSize: 20,
    color: CERTIFICATE_COLORS.gold,
    opacity: 0.6,
  },
});

export default CertificateView;
