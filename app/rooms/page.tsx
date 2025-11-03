'use client';

import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { useAuth } from '@/lib/auth-context';
import { getRoomsWithFriends } from '@/lib/data/mock-rooms';
import { AcademicCapIcon, UserGroupIcon } from '@heroicons/react/24/solid';
import { toast } from 'sonner';

export default function RoomsLobbyPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { activeRooms, friends, joinRoom } = useStore();

  if (!user) {
    router.push('/');
    return null;
  }

  const friendIds = friends.map(f => f.id);

  // Sort rooms: friends inside first, then by participant count
  const sortedRooms = [...activeRooms].sort((a, b) => {
    const aHasFriends = a.participants.some(p => friendIds.includes(p.userId));
    const bHasFriends = b.participants.some(p => friendIds.includes(p.userId));
    
    if (aHasFriends && !bHasFriends) return -1;
    if (!aHasFriends && bHasFriends) return 1;
    
    return b.participantCount - a.participantCount;
  });

  const getFriendsInRoom = (room: typeof sortedRooms[0]) => {
    return room.participants.filter(p => friendIds.includes(p.userId));
  };

  const handleJoinRoom = (roomId: string) => {
    if (!user) return;
    
    joinRoom(roomId, user.id, user.name, user.avatar || '/avatars/default.jpg');
    toast.success('Joined voice room!');
    router.push(`/rooms/${roomId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900 text-white">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Study Together Voice Rooms</h1>
          <p className="text-gray-300 text-lg">
            Join a room and study with friends in real-time
          </p>
        </div>

        {/* Room Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedRooms.map((room) => {
            const friendsInRoom = getFriendsInRoom(room);
            const hasFriends = friendsInRoom.length > 0;

            return (
              <div
                key={room.roomId}
                className={`bg-gray-800/50 backdrop-blur-sm rounded-2xl border-2 transition-all hover:scale-105 hover:shadow-2xl ${
                  hasFriends
                    ? 'border-purple-500 shadow-purple-500/20'
                    : 'border-gray-700 hover:border-gray-600'
                }`}
              >
                <div className="p-6">
                  {/* Room Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-teal-500 rounded-xl flex items-center justify-center">
                        <AcademicCapIcon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{room.subject}</h3>
                        <p className="text-sm text-gray-400">{room.topic}</p>
                      </div>
                    </div>
                  </div>

                  {/* Participant Count */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-2 text-gray-300">
                      <UserGroupIcon className="w-5 h-5" />
                      <span className="font-semibold">{room.participantCount} studying</span>
                    </div>
                    {hasFriends && (
                      <div className="flex items-center gap-2 text-purple-400">
                        <span className="text-sm">✨</span>
                        <span className="text-sm font-semibold">
                          {friendsInRoom.length} {friendsInRoom.length === 1 ? 'friend' : 'friends'} inside
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Friend Avatars */}
                  {hasFriends && (
                    <div className="flex -space-x-2 mb-4">
                      {friendsInRoom.slice(0, 4).map((friend) => (
                        <div
                          key={friend.userId}
                          className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-teal-400 border-2 border-gray-800 flex items-center justify-center text-white text-xs font-bold"
                        >
                          {friend.name.charAt(0)}
                        </div>
                      ))}
                      {friendsInRoom.length > 4 && (
                        <div className="w-8 h-8 rounded-full bg-gray-700 border-2 border-gray-800 flex items-center justify-center text-gray-300 text-xs font-bold">
                          +{friendsInRoom.length - 4}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Join Button */}
                  <button
                    onClick={() => handleJoinRoom(room.roomId)}
                    className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg hover:shadow-xl"
                  >
                    Join Room 🎧
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {sortedRooms.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎧</div>
            <p className="text-gray-300 text-lg font-semibold mb-2">No active rooms at the moment</p>
            <p className="text-gray-400 text-sm mb-6">Check back later or create your own!</p>
            <button
              onClick={() => toast.info('Room creation coming soon!')}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-teal-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl"
            >
              Create Room
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

