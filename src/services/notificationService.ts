import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notification behavior for instant alert display
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function setupNotificationPermissions(): Promise<boolean> {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('petpin-alerts', {
        name: 'PetPin Künye Uyarıları',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF6B6B',
        sound: 'default',
      });
    }

    return finalStatus === 'granted';
  } catch (error) {
    console.log('Error configuring notifications:', error);
    return false;
  }
}

/**
 * Registers device for Remote Push Notifications (APNs / FCM via Expo Push Gateway)
 * This allows the phone to wake up even when the app is completely closed/killed!
 */
export async function registerForRemotePushTokenAsync(tagId: string): Promise<string | null> {
  try {
    const hasPermission = await setupNotificationPermissions();
    if (!hasPermission) return null;

    // Get unique Expo Push Token for this physical phone
    const tokenData = await Notifications.getExpoPushTokenAsync().catch(() => null);
    if (!tokenData || !tokenData.data) return null;

    const pushToken = tokenData.data;

    // Register token with Cloudflare Edge so it knows which phone to wake up
    await fetch('https://petpin.muhammetatmaca79.workers.dev/api/register-push-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tag_id: tagId,
        push_token: pushToken,
        platform: Platform.OS,
      }),
    }).catch((e) => console.log('Token registration sync error:', e));

    return pushToken;
  } catch (err) {
    console.log('Remote push registration error:', err);
    return null;
  }
}

export async function triggerLiveScanNotification(
  petName: string,
  address: string
): Promise<void> {
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
    console.log('Error sending notification:', error);
  }
}
