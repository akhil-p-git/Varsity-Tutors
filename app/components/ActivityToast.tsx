'use client';

import { useEffect, useState } from 'react';
import { ActivityNotificationType } from '@/lib/types';
import {
  CpuChipIcon,
  Squares2X2Icon,
  SparklesIcon,
  RocketLaunchIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

interface ActivityToastProps {
  id: string;
  type: ActivityNotificationType;
  message: string;
  onDismiss: (id: string) => void;
}

const notificationConfig: Record<ActivityNotificationType, {
  icon: typeof CpuChipIcon;
  bgColor: string;
  iconColor: string;
  borderColor: string;
  pulseColor: string;
}> = {
  ai_analysis: {
    icon: CpuChipIcon,
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600',
    borderColor: 'border-blue-200',
    pulseColor: 'bg-blue-600',
  },
  orchestration: {
    icon: Squares2X2Icon,
    bgColor: 'bg-purple-50',
    iconColor: 'text-purple-600',
    borderColor: 'border-purple-200',
    pulseColor: 'bg-purple-600',
  },
  personalization: {
    icon: SparklesIcon,
    bgColor: 'bg-pink-50',
    iconColor: 'text-pink-600',
    borderColor: 'border-pink-200',
    pulseColor: 'bg-pink-600',
  },
  viral_trigger: {
    icon: RocketLaunchIcon,
    bgColor: 'bg-green-50',
    iconColor: 'text-green-600',
    borderColor: 'border-green-200',
    pulseColor: 'bg-green-600',
  },
  session_event: {
    icon: CheckCircleIcon,
    bgColor: 'bg-gray-50',
    iconColor: 'text-gray-600',
    borderColor: 'border-gray-200',
    pulseColor: 'bg-gray-600',
  },
};

export function ActivityToast({ id, type, message, onDismiss }: ActivityToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const config = notificationConfig[type];
  const Icon = config.icon;

  useEffect(() => {
    // Slide in animation
    setIsVisible(true);

    // Auto-dismiss after 4-5 seconds
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        onDismiss(id);
      }, 300); // Wait for fade-out animation
    }, 4000 + Math.random() * 1000); // Random between 4-5 seconds

    return () => clearTimeout(timer);
  }, [id, onDismiss]);

  return (
    <div
      className={`
        relative flex items-start gap-3 p-4 rounded-lg shadow-lg border
        ${config.bgColor} ${config.borderColor}
        transition-all duration-300 ease-out
        ${isVisible && !isExiting ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
      style={{
        minWidth: '320px',
        maxWidth: '400px',
      }}
    >
      {/* Icon */}
      <div className={`flex-shrink-0 ${config.iconColor}`}>
        <Icon className="w-5 h-5" />
      </div>

      {/* Message */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 leading-relaxed">
          {message}
        </p>
      </div>

      {/* Subtle pulse animation */}
      <div className={`absolute top-2 right-2 w-2 h-2 rounded-full ${config.pulseColor} opacity-60 animate-pulse`} />
    </div>
  );
}

