'use client';

import { useEffect, useRef } from 'react';

/**
 * Hook to track time spent on lessons
 * Starts a session when mounted, ends when unmounted or when visibility changes
 */
export function useActivityTracking(lessonId: string, phaseId: number) {
  const sessionIdRef = useRef<string | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const accumulatedTimeRef = useRef<number>(0);

  // Start activity session
  useEffect(() => {
    const startSession = async () => {
      try {
        const response = await fetch('/api/activity/start', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            lessonId,
            phaseId,
            activityType: 'coding',
          }),
        });

        if (response.ok) {
          const data = await response.json();
          sessionIdRef.current = data.sessionId;
          startTimeRef.current = Date.now();
        }
      } catch (error) {
        console.error('Failed to start activity session:', error);
      }
    };

    startSession();
  }, [lessonId, phaseId]);

  // End activity session on unmount
  useEffect(() => {
    return () => {
      if (sessionIdRef.current) {
        // Use sendBeacon for reliable tracking during page unload
        const data = JSON.stringify({ sessionId: sessionIdRef.current });
        navigator.sendBeacon('/api/activity/end', data);
      }
    };
  }, []);

  // Handle visibility changes (user switching tabs)
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.hidden) {
        // User switched away - pause session
        if (sessionIdRef.current) {
          const elapsed = Date.now() - startTimeRef.current;
          accumulatedTimeRef.current += elapsed;

          try {
            await fetch('/api/activity/end', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({ sessionId: sessionIdRef.current }),
            });
            sessionIdRef.current = null;
          } catch (error) {
            console.error('Failed to end activity session:', error);
          }
        }
      } else {
        // User returned - resume session
        try {
          const response = await fetch('/api/activity/start', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
              lessonId,
              phaseId,
              activityType: 'coding',
            }),
          });

          if (response.ok) {
            const data = await response.json();
            sessionIdRef.current = data.sessionId;
            startTimeRef.current = Date.now();
          }
        } catch (error) {
          console.error('Failed to resume activity session:', error);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [lessonId, phaseId]);

  // Handle beforeunload (user closing tab/browser)
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (sessionIdRef.current) {
        const data = JSON.stringify({ sessionId: sessionIdRef.current });
        navigator.sendBeacon('/api/activity/end', data);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
}
