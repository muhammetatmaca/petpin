import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notification behavior for instant foreground alert
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
