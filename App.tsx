import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { Map, User, QrCode, Bell } from 'lucide-react-native';
import { LanguageProvider, useTranslation } from './src/i18n/LanguageContext';
import { PetProvider, usePet } from './src/context/PetContext';
import { HomeScreen } from './src/screens/HomeScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { TagScreen } from './src/screens/TagScreen';
import { AlertScreen } from './src/screens/AlertScreen';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { COLORS, SHADOWS } from './src/theme/colors';

const ONBOARDING_KEY = '@petpin_onboarding_completed_v2';

function MainApp() {
  const { activeScanAlert } = usePet();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'map' | 'tag' | 'alert' | 'profile'>('map');
  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    async function checkOnboardingStatus() {
      try {
        const value = await AsyncStorage.getItem(ONBOARDING_KEY);
        setShowOnboarding(value !== 'true');
      } catch {
        setShowOnboarding(false);
      }
    }
    checkOnboardingStatus();
  }, []);

  const handleCompleteOnboarding = async () => {
    setShowOnboarding(false);
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    } catch {
      // storage fallback
    }
  };

  if (showOnboarding === true) {
    return <OnboardingScreen onComplete={handleCompleteOnboarding} />;
  }

  const bottomNavOffset = insets.bottom > 0 ? insets.bottom + 4 : 18;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.background}
      />

      <View style={styles.contentContainer}>
        {activeTab === 'map' && (
          <HomeScreen
            onTagPress={() => setActiveTab('tag')}
            onProfilePress={() => setActiveTab('profile')}
            onAlertPress={() => setActiveTab('alert')}
          />
        )}

        {activeTab === 'tag' && (
          <TagScreen
            onViewAlerts={() => setActiveTab('alert')}
          />
        )}

        {activeTab === 'alert' && (
          <AlertScreen
            onBackPress={() => setActiveTab('map')}
            onNavigatePress={() => setActiveTab('map')}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileScreen
            onBackPress={() => setActiveTab('map')}
            onTagPress={() => setActiveTab('tag')}
            onShowOnboarding={() => setShowOnboarding(true)}
          />
        )}
      </View>

      {/* Global Floating Glass Navigation Bar with 20-Language Support */}
      <View style={[styles.bottomNavContainer, { bottom: bottomNavOffset }]}>
        <View style={styles.bottomNavBar}>
          {/* Tab 1: Map Dashboard */}
          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => setActiveTab('map')}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.tabIconBadge,
                activeTab === 'map' && styles.tabIconBadgeActive,
              ]}
            >
              <Map
                size={20}
                color={activeTab === 'map' ? '#FFFFFF' : COLORS.textSecondary}
              />
            </View>
            <Text
              style={[
                styles.tabLabel,
                activeTab === 'map' && styles.tabLabelActive,
              ]}
              numberOfLines={1}
            >
              {t('tab_map')}
            </Text>
          </TouchableOpacity>

          {/* Tab 2: My Smart Tag */}
          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => setActiveTab('tag')}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.tabIconBadge,
                activeTab === 'tag' && styles.tabIconBadgeActive,
              ]}
            >
              <QrCode
                size={20}
                color={activeTab === 'tag' ? '#FFFFFF' : COLORS.textSecondary}
              />
            </View>
            <Text
              style={[
                styles.tabLabel,
                activeTab === 'tag' && styles.tabLabelActive,
              ]}
              numberOfLines={1}
            >
              {t('tab_tags')}
            </Text>
          </TouchableOpacity>

          {/* Tab 3: Alerts */}
          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => setActiveTab('alert')}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.tabIconBadge,
                activeTab === 'alert' && styles.tabIconBadgeActiveAlert,
              ]}
            >
              <Bell
                size={20}
                color={
                  activeTab === 'alert' ? '#FFFFFF' : COLORS.textSecondary
                }
              />
              {activeScanAlert && activeTab !== 'alert' && (
                <View style={styles.alertDot} />
              )}
            </View>
            <Text
              style={[
                styles.tabLabel,
                activeTab === 'alert' && styles.tabLabelActiveAlert,
              ]}
              numberOfLines={1}
            >
              {t('tab_alerts')}
            </Text>
          </TouchableOpacity>

          {/* Tab 4: Profile */}
          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => setActiveTab('profile')}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.tabIconBadge,
                activeTab === 'profile' && styles.tabIconBadgeActive,
              ]}
            >
              <User
                size={20}
                color={
                  activeTab === 'profile' ? '#FFFFFF' : COLORS.textSecondary
                }
              />
            </View>
            <Text
              style={[
                styles.tabLabel,
                activeTab === 'profile' && styles.tabLabelActive,
              ]}
              numberOfLines={1}
            >
              {t('tab_profile')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <PetProvider>
          <MainApp />
        </PetProvider>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    flex: 1,
  },
  bottomNavContainer: {
    position: 'absolute',
    left: 18,
    right: 18,
    alignItems: 'center',
    zIndex: 999,
  },
  bottomNavBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    borderRadius: 28,
    paddingVertical: 8,
    paddingHorizontal: 12,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(15, 76, 92, 0.08)',
    ...SHADOWS.card,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  tabIconBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 3,
    position: 'relative',
  },
  tabIconBadgeActive: {
    backgroundColor: '#0F4C5C',
    ...SHADOWS.glowTeal,
  },
  tabIconBadgeActiveAlert: {
    backgroundColor: COLORS.coral,
    ...SHADOWS.alert,
  },
  alertDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: COLORS.coral,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  tabLabel: {
    fontSize: 10.5,
    fontWeight: '700',
    color: COLORS.textSecondary,
    letterSpacing: -0.2,
  },
  tabLabelActive: {
    color: '#0F4C5C',
    fontWeight: '800',
  },
  tabLabelActiveAlert: {
    color: COLORS.coral,
    fontWeight: '800',
  },
});
