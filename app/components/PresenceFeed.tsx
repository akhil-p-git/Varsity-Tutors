'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ActivityFeedItem } from '@/lib/types';
import { getActivityFeed } from '@/lib/data/mock-activity';
import { formatDistanceToNow } from 'date-fns';

export function PresenceFeed() {
  const router = useRouter();
  const [activities, setActivities] = useState<ActivityFeedItem[]>([]);

  useEffect(() => {
    // Load initial activities
    setActivities(getActivityFeed(10));

    // Simulate new activities every 10 seconds
    const interval = setInterval(() => {
      const newActivities = getActivityFeed(10);
      setActivities(newActivities);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleActivityClick = (activity: ActivityFeedItem) => {
    if (activity.type === 'voiceRoom' && activity.roomId) {
      router.push(`/rooms/${activity.roomId}`);
    } else if (activity.type === 'session' && activity.sessionId) {
      router.push(`/session/${activity.sessionId}/results`);
    }
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'session':
        return '📚';
      case 'voiceRoom':
        return '🎧';
      case 'challenge':
        return '⚔️';
      case 'study':
        return '📖';
      default:
        return '✨';
    }
  };

  const formatTime = (timestamp: Date | string) => {
    try {
      const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
      return formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return 'just now';
    }
  };

  if (activities.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Activity Feed</h2>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">👋</div>
          <p className="text-lg font-semibold text-gray-700 mb-2">No friends online yet</p>
          <p className="text-sm text-gray-500 mb-6">Invite friends to see their activity here!</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-teal-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl"
          >
            Invite Friends
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Activity Feed</h2>
      <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-hide">
        {activities.map((activity, index) => (
          <button
            key={activity.id}
            onClick={() => handleActivityClick(activity)}
            className="w-full text-left p-4 rounded-xl hover:bg-purple-50 transition-all border border-gray-200 hover:border-purple-300 animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-teal-400 flex items-center justify-center text-white font-bold flex-shrink-0">
                {activity.userName.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{getActionIcon(activity.type)}</span>
                  <span className="font-semibold text-gray-900 truncate">{activity.userName}</span>
                  <span className="text-gray-600 text-sm truncate">{activity.action}</span>
                  {activity.subject && (
                    <span className="text-purple-600 font-medium text-sm">{activity.subject}</span>
                  )}
                </div>
                <div className="text-xs text-gray-500">{formatTime(activity.timestamp)}</div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

