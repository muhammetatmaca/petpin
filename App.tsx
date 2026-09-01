import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { Map, User, QrCode, Bell } from 'lucide-react-native';
import { PetProvider } from './src/context/PetContext';
import { HomeScreen } from './src/screens/HomeScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { TagScreen } from './src/screens/TagScreen';
import { AlertScreen } from './src/screens/AlertScreen';
import { COLORS, SHADOWS } from './src/theme/colors';

function MainApp() {
  const [activeTab, setActiveTab] = useState<'map' | 'tag' | 'alert' | 'profile'>('map');
  const insets = useSafeAreaInsets();

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
          />
        )}
      </View>

      {/* Global Pro Max Floating Glass Navigation Bar for Pet Owner */}
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
            >
              Harita
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
            >
              Künyem
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
            </View>
            <Text
              style={[
                styles.tabLabel,
                activeTab === 'alert' && styles.tabLabelActiveAlert,
              ]}
            >
              Bildirimler
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
            >
              Profil
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
      <PetProvider>
        <MainApp />
      </PetProvider>
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
  },
  bottomNavBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    borderRadius: 36,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.9)',
    ...SHADOWS.card,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    minWidth: 64,
  },
  tabIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
    position: 'relative',
  },
  tabIconBadgeActive: {
    backgroundColor: COLORS.primary,
    ...SHADOWS.glowTeal,
  },
  tabIconBadgeActiveAlert: {
    backgroundColor: COLORS.coral,
    ...SHADOWS.alert,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  tabLabelActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  tabLabelActiveAlert: {
    color: COLORS.coral,
    fontWeight: '700',
  },
});
