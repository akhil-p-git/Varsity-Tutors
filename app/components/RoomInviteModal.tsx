'use client';

import { useState } from 'react';
import { XMarkIcon, LinkIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { useStore } from '@/lib/store';
import { useAuth } from '@/lib/auth-context';
import { generateChallengeLink } from '@/lib/smart-links';
import { toast } from 'sonner';

interface RoomInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomId: string;
  roomSubject: string;
}

export function RoomInviteModal({ isOpen, onClose, roomId, roomSubject }: RoomInviteModalProps) {
  const { user } = useAuth();
  const { friends } = useStore();
  const [selectedFriends, setSelectedFriends] = useState<number[]>([]);
  const [showLinkCopied, setShowLinkCopied] = useState(false);

  if (!isOpen || !user) return null;

  const onlineFriends = friends.filter(f => f.isOnline);

  const handleToggleFriend = (friendId: number) => {
    setSelectedFriends((prev) =>
      prev.includes(friendId)
        ? prev.filter(id => id !== friendId)
        : [...prev, friendId]
    );
  };

  const handleSendInvites = () => {
    if (selectedFriends.length === 0) {
      toast.error('Please select at least one friend');
      return;
    }

    selectedFriends.forEach(friendId => {
      const friend = friends.find(f => f.id === friendId);
      if (friend) {
        // In a real app, this would send a notification
        toast.success(`Invited ${friend.name} to join the room!`);
      }
    });

    toast.success(`Sent ${selectedFriends.length} invite${selectedFriends.length > 1 ? 's' : ''}!`);
    onClose();
    setSelectedFriends([]);
  };

  const handleCopyLink = async () => {
    const inviteLink = typeof window !== 'undefined'
      ? `${window.location.origin}/rooms/${roomId}/invite?from=${encodeURIComponent(user.name)}&subject=${encodeURIComponent(roomSubject)}`
      : '';
    
    await navigator.clipboard.writeText(inviteLink);
    setShowLinkCopied(true);
    toast.success('Invite link copied!');
    setTimeout(() => setShowLinkCopied(false), 2000);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`fixed inset-x-0 bottom-0 md:inset-x-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:bottom-auto z-50 bg-gray-800 rounded-t-3xl md:rounded-3xl shadow-2xl max-h-[90vh] overflow-hidden transition-all duration-300 ${
          isOpen
            ? 'translate-y-0 opacity-100'
            : 'translate-y-full md:translate-y-0 md:opacity-0 md:scale-95 pointer-events-none'
        }`}
        style={{
          width: '100%',
          maxWidth: '500px',
          margin: '0 auto',
        }}
      >
        <div className="overflow-y-auto max-h-[90vh]">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-teal-500 text-white p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <UserGroupIcon className="w-6 h-6" />
              <h2 className="text-2xl font-bold">Invite Friends</h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-4">
            {/* Friend List */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Select friends to invite</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {onlineFriends.length > 0 ? (
                  onlineFriends.map((friend) => (
                    <button
                      key={friend.id}
                      onClick={() => handleToggleFriend(friend.id)}
                      className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                        selectedFriends.includes(friend.id)
                          ? 'border-purple-500 bg-purple-900/30'
                          : 'border-gray-700 bg-gray-700/50 hover:border-purple-400'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-teal-400 flex items-center justify-center text-white font-bold">
                          {friend.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-white">{friend.name}</div>
                          <div className="text-sm text-gray-400">
                            {friend.currentlyStudying || 'Online'}
                          </div>
                        </div>
                        {selectedFriends.includes(friend.id) && (
                          <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full" />
                          </div>
                        )}
                      </div>
                    </button>
                  ))
                ) : (
                  <p className="text-gray-400 text-center py-4">No friends online</p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-4">
              <button
                onClick={handleSendInvites}
                disabled={selectedFriends.length === 0}
                className="w-full bg-gradient-to-r from-purple-600 to-teal-600 text-white font-bold py-4 px-6 rounded-xl hover:from-purple-700 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                Send Invites ({selectedFriends.length})
              </button>
              
              <button
                onClick={handleCopyLink}
                className="w-full bg-gray-700 border-2 border-gray-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-gray-600 transition-all flex items-center justify-center gap-2"
              >
                <LinkIcon className="w-5 h-5" />
                {showLinkCopied ? 'Link Copied!' : 'Copy Invite Link'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

