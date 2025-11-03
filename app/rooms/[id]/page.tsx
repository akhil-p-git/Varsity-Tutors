'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import { useAuth } from '@/lib/auth-context';
import { voiceService } from '@/lib/voice-service';
import { getRoomById } from '@/lib/data/mock-rooms';
import { awardGems, REWARD_AMOUNTS } from '@/lib/rewards';
import { showRewardNotification } from '@/app/components/RewardNotification';
import { toast } from 'sonner';
import {
  AcademicCapIcon,
  UserGroupIcon,
  MicrophoneIcon,
  ArrowLeftIcon,
  UserPlusIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  TrophyIcon,
  SparklesIcon,
} from '@heroicons/react/24/solid';
import {
  MicrophoneIcon as MicrophoneOutlineIcon,
} from '@heroicons/react/24/outline';
import { RoomInviteModal } from '@/app/components/RoomInviteModal';

export default function VoiceRoomPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const roomId = params.id as string;
  const { activeRooms, currentRoom, friends, leaveRoom, toggleParticipantMute } = useStore();
  const [room, setRoom] = useState(currentRoom || getRoomById(roomId));
  const [isMuted, setIsMuted] = useState(false);
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60); // 25 minutes in seconds
  const [isPomodoroRunning, setIsPomodoroRunning] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);

  const friendIds = friends.map(f => f.id);

  useEffect(() => {
    if (!user) {
      router.push('/');
      return;
    }

    // Join room if not already joined
    if (!room) {
      const foundRoom = getRoomById(roomId);
      if (foundRoom) {
        voiceService.joinRoom(roomId, user.id, user.name, user.avatar || '/avatars/default.jpg');
        setRoom(foundRoom);
        
        // Award voice room join reward
        const joinReward = awardGems(user.id, REWARD_AMOUNTS.voiceRoomJoin, 'Voice room joined!');
        showRewardNotification(joinReward);
      } else {
        toast.error('Room not found');
        router.push('/rooms');
      }
    }

    // Simulate 30-minute reward after 30 seconds (for demo purposes)
    let thirtyMinTimer: NodeJS.Timeout | null = null;
    if (user && room) {
      thirtyMinTimer = setTimeout(() => {
        if (user && room) {
          const thirtyMinReward = awardGems(user.id, REWARD_AMOUNTS.voiceRoom30Min, '30 minutes in voice room!');
          showRewardNotification(thirtyMinReward);
        }
      }, 30000); // 30 seconds for demo (30 minutes in real app)
    }

    // Update room from store
    const storeRoom = activeRooms.find(r => r.roomId === roomId);
    if (storeRoom) {
      setRoom(storeRoom);
    }

    // Simulate speaking events
    const cleanup = voiceService.simulateSpeaking(roomId, 4000);

    // Pomodoro timer
    let pomodoroInterval: NodeJS.Timeout | null = null;
    if (isPomodoroRunning) {
      pomodoroInterval = setInterval(() => {
        setPomodoroTime((prev) => {
          if (prev <= 1) {
            setIsPomodoroRunning(false);
            toast.success('Pomodoro session complete! Take a break 🎉');
            return 25 * 60;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      cleanup();
      if (pomodoroInterval) clearInterval(pomodoroInterval);
      if (thirtyMinTimer) clearTimeout(thirtyMinTimer);
    };
  }, [user, roomId, router, activeRooms, isPomodoroRunning]);

  if (!user || !room) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading room...</p>
        </div>
      </div>
    );
  }

  const handleLeave = () => {
    if (!user) return;
    leaveRoom(roomId, user.id);
    toast.info('Left the voice room');
    router.push('/rooms');
  };

  const handleToggleMute = () => {
    if (!user) return;
    setIsMuted(!isMuted);
    toggleParticipantMute(roomId, user.id);
    toast.success(isMuted ? 'Microphone unmuted' : 'Microphone muted');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const visibleParticipants = room.participants.slice(0, 20);
  const overflowCount = room.participants.length - 20;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900 text-white">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Top Section - Room Header */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleLeave}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ArrowLeftIcon className="w-6 h-6" />
              </button>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-teal-500 rounded-xl flex items-center justify-center">
                <AcademicCapIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{room.subject}</h1>
                <p className="text-gray-400">{room.topic}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-gray-300">
                <UserGroupIcon className="w-5 h-5" />
                <span className="font-semibold">{room.participantCount} studying</span>
              </div>
              <button
                onClick={handleLeave}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors"
              >
                Leave Room
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content - Participant Grid */}
          <div className="lg:col-span-3">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <UserGroupIcon className="w-6 h-6" />
                Participants ({room.participantCount})
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {visibleParticipants.map((participant) => {
                  const isFriend = friendIds.includes(participant.userId);
                  const isCurrentUser = participant.userId === user.id;

                  return (
                    <div
                      key={participant.userId}
                      className={`relative p-4 rounded-xl transition-all animate-fade-in ${
                        isFriend
                          ? 'bg-purple-900/30 border-2 border-purple-500'
                          : 'bg-gray-700/50 border-2 border-gray-600'
                      } ${isCurrentUser ? 'ring-2 ring-teal-500' : ''}`}
                    >
                      {/* Speaking Indicator */}
                      {participant.isSpeaking && (
                        <div className="absolute inset-0 rounded-xl border-2 border-green-500 animate-ping opacity-75" />
                      )}

                      {/* Avatar */}
                      <div className="relative mb-3">
                        <div
                          className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center text-white font-bold text-xl ${
                            participant.isSpeaking
                              ? 'bg-gradient-to-br from-green-500 to-teal-500 ring-4 ring-green-500/50'
                              : 'bg-gradient-to-br from-purple-500 to-teal-500'
                          }`}
                        >
                          {participant.name.charAt(0)}
                        </div>
                        {participant.isSpeaking && (
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-gray-800 flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                          </div>
                        )}
                        {participant.isMuted && (
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-red-500 rounded-full border-2 border-gray-800 flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Name */}
                      <div className="text-center">
                        <div className="font-semibold text-sm text-white truncate">
                          {participant.name}
                          {isCurrentUser && ' (You)'}
                        </div>
                        {participant.isModerator && (
                          <div className="text-xs text-purple-400 mt-1 flex items-center justify-center gap-1">
                            <SparklesIcon className="w-3 h-3" />
                            Moderator
                          </div>
                        )}
                        {isFriend && !participant.isModerator && (
                          <div className="text-xs text-purple-400 mt-1">Friend</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {overflowCount > 0 && (
                <div className="mt-6 text-center">
                  <div className="inline-block bg-gray-700/50 rounded-xl px-6 py-4 border-2 border-gray-600">
                    <p className="text-gray-300 font-semibold">+{overflowCount} more participants</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Room Info */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6">
              <h3 className="text-lg font-bold mb-4">Room Info</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <div className="text-gray-400 mb-1">Moderator</div>
                  <div className="text-white font-semibold">{room.moderator}</div>
                </div>
                <div>
                  <div className="text-gray-400 mb-1">Topic</div>
                  <div className="text-white font-semibold">{room.topic}</div>
                </div>
                <div className="pt-3 border-t border-gray-700">
                  <div className="text-gray-400 mb-2">Room Rules</div>
                  <ul className="text-gray-300 space-y-1 text-xs">
                    <li>• Be respectful</li>
                    <li>• Mute when not speaking</li>
                    <li>• Help others learn</li>
                    <li>• Have fun studying!</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Pomodoro Timer */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <ClockIcon className="w-5 h-5" />
                Study Timer
              </h3>
              <div className="text-center mb-4">
                <div className="text-4xl font-bold text-purple-400 mb-2">
                  {formatTime(pomodoroTime)}
                </div>
                <button
                  onClick={() => setIsPomodoroRunning(!isPomodoroRunning)}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors text-sm"
                >
                  {isPomodoroRunning ? 'Pause' : 'Start'}
                </button>
              </div>
            </div>

            {/* Leaderboard */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <TrophyIcon className="w-5 h-5" />
                Most Active Today
              </h3>
              <div className="space-y-2">
                {room.participants.slice(0, 5).map((p, index) => (
                  <div key={p.userId} className="flex items-center gap-3 text-sm">
                    <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-xs">
                      {index + 1}
                    </div>
                    <div className="flex-1 text-white truncate">{p.name}</div>
                    <div className="text-gray-400">{Math.floor(Math.random() * 120)}m</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tutor Drop-in */}
            <div className="bg-gradient-to-r from-purple-900/50 to-teal-900/50 backdrop-blur-sm rounded-2xl border border-purple-500/50 p-6">
              <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                <SparklesIcon className="w-5 h-5 text-purple-400" />
                Tutor Drop-in
              </h3>
              <p className="text-sm text-gray-300">
                <span className="font-semibold text-purple-400">Dr. Smith</span> available in 15 min
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Control Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-lg border-t border-gray-700 p-4">
          <div className="container mx-auto max-w-7xl flex items-center justify-center gap-4">
            <button
              onClick={handleToggleMute}
              className={`p-4 rounded-xl transition-all ${
                isMuted
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {isMuted ? (
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              ) : (
                <MicrophoneIcon className="w-6 h-6 text-white" />
              )}
            </button>

            <button
              onClick={() => setShowInviteModal(true)}
              className="p-4 bg-purple-600 hover:bg-purple-700 rounded-xl transition-colors"
            >
              <UserPlusIcon className="w-6 h-6 text-white" />
            </button>

            <button className="p-4 bg-gray-700 hover:bg-gray-600 rounded-xl transition-colors opacity-50 cursor-not-allowed">
              <ChatBubbleLeftRightIcon className="w-6 h-6 text-white" />
            </button>

            <button
              onClick={handleLeave}
              className="px-6 py-4 bg-red-600 hover:bg-red-700 rounded-xl font-semibold transition-colors"
            >
              Leave Room
            </button>
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      <RoomInviteModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        roomId={roomId}
        roomSubject={room.subject}
      />
    </div>
  );
}

