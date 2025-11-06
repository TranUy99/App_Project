// hooks/useOneSignal.ts
import { useEffect } from 'react'
import { OneSignal, LogLevel } from 'react-native-onesignal'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { ONE_SIGNAL_APP_ID } from '../Utils/KeynameAsynstorage'

export function useOneSignal() {
  useEffect(() => {
    const initOneSignal = async () => {
      try {
        // Debug log
        OneSignal.Debug.setLogLevel(LogLevel.Verbose)

        // Init
        OneSignal.initialize(ONE_SIGNAL_APP_ID)

        // Xin quyền (iOS)
        OneSignal.Notifications.requestPermission(true)

        // Lấy OneSignal ID (player_id cũ)
        const oneSignalId = await OneSignal.User.pushSubscription.getIdAsync()

        if (oneSignalId) {
          await AsyncStorage.setItem('player_id', oneSignalId)
          console.log('OneSignal Player ID:', oneSignalId)
        }
      } catch (error) {
        console.error('OneSignal init error:', error)
      }
    }

    initOneSignal()
  }, [])
}
