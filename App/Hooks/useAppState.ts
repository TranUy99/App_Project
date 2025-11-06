// src/Hooks/useAppState.ts
import {useEffect, useRef, useState} from 'react';
import {AppState, AppStateStatus} from 'react-native';

export const useAppState = () => {
  const appState = useRef<AppStateStatus>(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState<AppStateStatus>(
    AppState.currentState,
  );

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );
    return () => subscription.remove();
  }, []);

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    appState.current = nextAppState;
    setAppStateVisible(nextAppState);
  };

  return {
    currentAppState: appStateVisible,
    isActive: appStateVisible === 'active',
    isBackground: appStateVisible === 'background',
    isInactive: appStateVisible === 'inactive',
  };
};
