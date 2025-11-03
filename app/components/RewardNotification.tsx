'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';
import { RewardNotification as RewardNotificationType } from '@/lib/rewards';
import confetti from 'canvas-confetti';

interface RewardNotificationProps {
  notification: RewardNotificationType;
}

export function showRewardNotification(notification: RewardNotificationType) {
  // Show confetti for big rewards
  if (notification.isBig) {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#7c3aed', '#14b8a6', '#fbbf24', '#ef4444'],
    });
  }

  // Show toast notification
  toast.success(notification.message, {
    duration: notification.isBig ? 5000 : 3000,
    icon: notification.icon,
    style: {
      background: notification.isBig ? 'linear-gradient(135deg, #7c3aed 0%, #14b8a6 100%)' : '#7c3aed',
      color: 'white',
      fontSize: notification.isBig ? '16px' : '14px',
      fontWeight: 'bold',
      padding: notification.isBig ? '20px' : '16px',
    },
  });
}

// React component for showing reward notifications (can be used in components)
export function RewardNotification({ notification }: RewardNotificationProps) {
  useEffect(() => {
    showRewardNotification(notification);
  }, [notification]);

  return null;
}

