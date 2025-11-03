'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { useAuth } from '@/lib/auth-context';
import { getRoomsBySubject } from '@/lib/data/mock-rooms';
import { UserGroupIcon } from '@heroicons/react/24/solid';

export function StudyPresence() {
  const router = useRouter();
  const { user } = useAuth();
  const { activeRooms, friends } = useStore();
  const [isVisible, setIsVisible] = useState(false);
  const [presenceData, setPresenceData] = useState<{
    subject: string;
    count: number;
    friendAvatars: string[];
  } | null>(null);

  useEffect(() => {
    if (!user || !user.subject) return;

    // Find rooms with friends studying the same subject
    const friendIds = friends.filter(f => f.isOnline && f.currentlyStudying === user.subject).map(f => f.id);
    const subjectRooms = getRoomsBySubject(user.subject);
    
    let totalParticipants = 0;
    const friendAvatars: string[] = [];

    subjectRooms.forEach(room => {
      totalParticipants += room.participantCount;
      room.participants.forEach(p => {
        if (friendIds.includes(p.userId) && !friendAvatars.includes(p.avatar)) {
          friendAvatars.push(p.avatar);
        }
      });
    });

    if (totalParticipants > 0) {
      setPresenceData({
        subject: user.subject,
        count: totalParticipants,
        friendAvatars: friendAvatars.slice(0, 4),
      });
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [user, friends, activeRooms]);

  if (!isVisible || !presenceData) return null;

  const handleClick = () => {
    router.push('/rooms');
  };

  return (
    <div
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-purple-600 to-teal-500 text-white rounded-2xl shadow-2xl p-4 cursor-pointer hover:shadow-3xl transition-all duration-300 animate-slide-in-up hover:scale-105 max-w-xs"
    >
      <div className="flex items-center gap-3">
        <div className="relative flex -space-x-2">
          {presenceData.friendAvatars.slice(0, 3).map((avatar, index) => (
            <div
              key={index}
              className="w-10 h-10 rounded-full bg-white border-2 border-white flex items-center justify-center text-purple-600 font-bold text-sm"
              style={{ zIndex: 3 - index }}
            >
              {avatar ? (
                <img src={avatar} alt="" className="w-full h-full rounded-full object-cover" />
              ) : (
                <span>?</span>
              )}
            </div>
          ))}
          {presenceData.count > 3 && (
            <div
              className="w-10 h-10 rounded-full bg-white/80 border-2 border-white flex items-center justify-center text-purple-600 font-bold text-xs"
              style={{ zIndex: 0 }}
            >
              +{presenceData.count - 3}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <UserGroupIcon className="w-4 h-4" />
            <span className="font-bold text-sm">{presenceData.count} friends</span>
          </div>
          <div className="text-xs text-white/90 truncate">
            studying {presenceData.subject} right now
          </div>
        </div>
        <div className="text-2xl">🎧</div>
      </div>
    </div>
  );
}

