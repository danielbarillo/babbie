import { useEffect, useRef, useCallback } from 'react';
import { useStore } from '../store/useStore';

export function useUserActivity(inactivityTimeout = 5 * 60 * 1000) { // 5 minutes
  const { userState, updateStatus } = useStore();
  const timeoutRef = useRef<NodeJS.Timeout>();

  const handleActivity = useCallback(() => {
    clearTimeout(timeoutRef.current);

    if (userState?.type === 'authenticated' && userState.status !== 'online') {
      updateStatus('online');
    }

    timeoutRef.current = setTimeout(() => {
      if (userState?.type === 'authenticated') {
        updateStatus('away');
      }
    }, inactivityTimeout);
  }, [userState, updateStatus, inactivityTimeout]);

  useEffect(() => {
    if (userState?.type !== 'authenticated') return;

    // Set up event listeners
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keypress', handleActivity);
    window.addEventListener('click', handleActivity);

    const handleVisibilityChange = () => {
      if (document.hidden) {
        updateStatus('away');
      } else {
        handleActivity();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Initial status
    handleActivity();

    // Cleanup
    return () => {
      clearTimeout(timeoutRef.current);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keypress', handleActivity);
      window.removeEventListener('click', handleActivity);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [userState?.type, handleActivity, updateStatus]);
}