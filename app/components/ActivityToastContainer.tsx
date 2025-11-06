'use client';

import { useStore } from '@/lib/store';
import { ActivityToast } from './ActivityToast';

export function ActivityToastContainer() {
  const { activityNotifications, removeActivityNotification, demoState } = useStore();

  // Only show notifications when demo is running
  if (!demoState?.isPlaying || activityNotifications.length === 0) return null;

  return (
    <div className="fixed bottom-20 right-4 z-50 flex flex-col gap-3 pointer-events-none">
      {activityNotifications.map((notification) => (
        <div key={notification.id} className="pointer-events-auto">
          <ActivityToast
            id={notification.id}
            type={notification.type}
            message={notification.message}
            onDismiss={removeActivityNotification}
          />
        </div>
      ))}
    </div>
  );
}

