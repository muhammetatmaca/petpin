import { Vibration, Alert } from 'react-native';

/**
 * PetPin Alert & Notification Service
 * Reliable, zero-crash vibration and alert notification engine
 */

export async function setupNotificationPermissions(): Promise<boolean> {
  return true;
}

export async function registerForRemotePushTokenAsync(_tagId: string): Promise<string | null> {
  return null;
}

export async function triggerLiveScanNotification(
  petName: string,
  address: string
): Promise<void> {
  try {
    // High-priority multi-pattern tactile vibration
    Vibration.vibrate([0, 400, 200, 400, 200, 600]);
  } catch (error) {
    console.log('Vibration error:', error);
  }

  try {
    Alert.alert(
      `🚨 ${petName}’nin Künyesi Okutuldu!`,
      `Bir hayvansever Milo'nun tasmasını okuttu.\n\n📍 Konum: ${address}\n\nDetayları ve haritayı görmek için Bildirimler sekmesini inceleyin.`,
      [{ text: 'Anladım', style: 'default' }]
    );
  } catch (error) {
    console.log('Alert error:', error);
  }
}
