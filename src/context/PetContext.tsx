import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { generateUniqueTagId } from '../utils/tagGenerator';
import {
  setupNotificationPermissions,
  triggerLiveScanNotification,
  registerForRemotePushTokenAsync,
} from '../services/notificationService';

export interface ScanAlert {
  id: string;
  tag_id: string;
  pet_name: string;
  latitude: number;
  longitude: number;
  accuracy: string;
  address: string;
  device: string;
  timestamp: string;
  timeFormatted: string;
}

export interface PetProfile {
  petName: string;
  petBreed: string;
  petAge: string;
  petPhoto: string;
  ownerName: string;
  ownerPhone: string;
  ownerWhatsApp: string;
  vetInfo: string;
  medicalNotes: string;
  tagId: string;
  isLostMode: boolean;
}

const DEFAULT_PROFILE: PetProfile = {
  petName: 'Milo',
  petBreed: 'Golden Retriever',
  petAge: '3 Yaşında',
  petPhoto: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80',
  ownerName: 'Sarah Jenkins',
  ownerPhone: '+90 555 234 56 78',
  ownerWhatsApp: '+90 555 234 56 78',
  vetInfo: 'Dr. Aris • Kadıköy Hayvan Kliniği',
  medicalNotes: 'Tavuk ve buğday alerjisi vardır. Lütfen sadece su veriniz.',
  tagId: generateUniqueTagId(),
  isLostMode: false,
};

const STORAGE_KEY = '@petpin_profile_v1';

interface PetContextType {
  profile: PetProfile;
  activeScanAlert: ScanAlert | null;
  updateProfile: (updates: Partial<PetProfile>) => Promise<void>;
  pickPetPhoto: () => Promise<void>;
  toggleLostMode: () => Promise<void>;
  regenerateTagId: () => Promise<string>;
  pairPhysicalTag: (newTagId: string) => Promise<void>;
  clearActiveScanAlert: () => void;
}

const PetContext = createContext<PetContextType | undefined>(undefined);

export const PetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<PetProfile>(DEFAULT_PROFILE);
  const [activeScanAlert, setActiveScanAlert] = useState<ScanAlert | null>(null);
  const lastProcessedScanIdRef = useRef<string | null>(null);

  // Initialize notifications & load profile from storage
  useEffect(() => {
    setupNotificationPermissions();

    async function loadSavedProfile() {
      try {
        if (AsyncStorage && AsyncStorage.getItem) {
          const stored = await AsyncStorage.getItem(STORAGE_KEY);
          if (stored) {
            const parsed = JSON.parse(stored);
            if (!parsed.tagId) {
              parsed.tagId = generateUniqueTagId();
            }
            setProfile(parsed);
          }
        }
      } catch {
        // Fallback to default in-memory state gracefully
      }
    }
    loadSavedProfile();
  }, []);

  // Real-time Cloud Telemetry Listener: Polls Cloudflare Edge Worker API for live scans
  useEffect(() => {
    if (!profile.tagId) return;

    registerForRemotePushTokenAsync(profile.tagId);

    async function pollLiveScans() {
      try {
        // Poll Cloudflare Worker API with current tagId and global fallback
        const urls = [
          `https://petpin.muhammetatmaca79.workers.dev/api/scan?tag_id=${encodeURIComponent(profile.tagId)}`,
          `https://petpin.muhammetatmaca79.workers.dev/api/scan?tag_id=PETPIN-TR-DEFAULT`,
          `https://petpin.muhammetatmaca79.workers.dev/api/scan`,
        ];

        for (const u of urls) {
          try {
            const res = await fetch(u);
            const data = await res.json();

            if (data && data.success && data.has_scan && data.scan) {
              const incomingScan: ScanAlert = data.scan;
              if (incomingScan.id && incomingScan.id !== lastProcessedScanIdRef.current) {
                lastProcessedScanIdRef.current = incomingScan.id;
                console.log('🚨 [PetContext] Live Scan Received from Finder:', incomingScan.address);
                setActiveScanAlert(incomingScan);
                await triggerLiveScanNotification(profile.petName, incomingScan.address);
                return;
              }
            }
          } catch {
            // single url retry
          }
        }
      } catch (err) {
        // Silent network retry
      }
    }

    // Immediate check on mount
    pollLiveScans();

    // Poll every 2.5 seconds for instant real-time detection
    const interval = setInterval(pollLiveScans, 2500);

    return () => {
      clearInterval(interval);
    };
  }, [profile.tagId, profile.petName]);

  const updateProfile = async (updates: Partial<PetProfile>) => {
    try {
      const newProfile = { ...profile, ...updates };
      setProfile(newProfile);
      if (AsyncStorage && AsyncStorage.setItem) {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newProfile));
      }
    } catch {
      // In-memory state updated
    }
  };

  const toggleLostMode = async () => {
    await updateProfile({ isLostMode: !profile.isLostMode });
  };

  const regenerateTagId = async (): Promise<string> => {
    const newId = generateUniqueTagId();
    await updateProfile({ tagId: newId });
    return newId;
  };

  const pairPhysicalTag = async (newTagId: string) => {
    const cleanId = newTagId.trim().toUpperCase();
    if (cleanId.length > 3) {
      await updateProfile({ tagId: cleanId });
    }
  };

  const clearActiveScanAlert = () => {
    setActiveScanAlert(null);
  };

  const pickPetPhoto = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        alert('Fotoğraf seçebilmek için galeri izni gereklidir.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.85,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        await updateProfile({ petPhoto: result.assets[0].uri });
      }
    } catch (e) {
      console.log('Error picking image:', e);
    }
  };

  return (
    <PetContext.Provider
      value={{
        profile,
        activeScanAlert,
        updateProfile,
        pickPetPhoto,
        toggleLostMode,
        regenerateTagId,
        pairPhysicalTag,
        clearActiveScanAlert,
      }}
    >
      {children}
    </PetContext.Provider>
  );
};

export const usePet = (): PetContextType => {
  const context = useContext(PetContext);
  if (!context) {
    throw new Error('usePet must be used within a PetProvider');
  }
  return context;
};
