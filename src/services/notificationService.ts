import { Platform, Vibration } from 'react-native';
import * as Notifications from 'expo-notifications';
import Constants, { ExecutionEnvironment } from 'expo-constants';

const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

// Configure notification behavior safely
try {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
} catch {
  // Graceful fallback for environments with restricted notification handlers
}

export async function setupNotificationPermissions(): Promise<boolean> {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync().catch(() => ({ status: 'undetermined' }));
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync().catch(() => ({ status: 'denied' }));
      finalStatus = status;
    }

    if (Platform.OS === 'android') {
      try {
        await Notifications.setNotificationChannelAsync('petpin-alerts', {
          name: 'PetPin Künye Uyarıları',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 300, 200, 300],
          lightColor: '#FF6B6B',
          sound: 'default',
        });
      } catch {
        // Channel setup fallback
      }
    }

    return finalStatus === 'granted';
  } catch (error) {
    console.log('Error configuring notifications:', error);
    return false;
  }
}

/**
 * Registers device for Remote Push Notifications (APNs / FCM via Expo Push Gateway)
 * Bypasses on Expo Go Android to prevent SDK 53 warnOfExpoGoPushUsage red screen!
 */
export async function registerForRemotePushTokenAsync(tagId: string): Promise<string | null> {
  // Expo Go on Android removed remote push in SDK 53+; completely bypass to prevent red screen
  if (isExpoGo || Platform.OS === 'android') {
    return null;
  }

  try {
    const hasPermission = await setupNotificationPermissions();
    if (!hasPermission) return null;

    const tokenData = await Notifications.getExpoPushTokenAsync().catch(() => null);
    if (!tokenData || !tokenData.data) return null;

    const pushToken = tokenData.data;

    // Register token with Cloudflare Edge
    await fetch('https://petpin.muhammetatmaca79.workers.dev/api/register-push-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tag_id: tagId,
        push_token: pushToken,
        platform: Platform.OS,
      }),
    }).catch(() => null);

    return pushToken;
  } catch {
    return null;
  }
}

export async function triggerLiveScanNotification(
  petName: string,
  address: string
): Promise<void> {
  // Haptic alert on all devices
  try {
    Vibration.vibrate([0, 350, 150, 350]);
  } catch {
    // vibration fallback
  }

  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `🚨 ${petName}’nin Künyesi Okutuldu!`,
        body: `Bir hayvansever Milo'nun tasmasını okuttu. Konum: ${address}. Haritayı görmek için dokunun.`,
        data: { type: 'QR_SCAN_ALERT' },
        sound: 'default',
        priority: Notifications.AndroidNotificationPriority.MAX,
      },
      trigger: null, // trigger immediately
    });
  } catch (error) {
    console.log('Local notification scheduled safely:', error);
  }
}
