'use client';

import { useState, useEffect } from 'react';
import { XMarkIcon, LinkIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { SparklesIcon } from '@heroicons/react/24/solid';
import { useStore } from '@/lib/store';
import { useAuth } from '@/lib/auth-context';
import { generateChallengeLink, trackFunnelEvent } from '@/lib/smart-links';
import { getFriendsBySubject, getOnlineFriends } from '@/lib/data/mock-friends';
import { selectViralLoop, shouldTrigger } from '@/lib/agents/orchestrator';
import { PersonalizationContext } from '@/lib/ai/openai-service';
import { logAgentDecision } from '@/app/components/AgentDebugger';
import { toast } from 'sonner';
import { Session } from '@/lib/types';

interface BuddyChallengeProps {
  isOpen: boolean;
  onClose: () => void;
  session: Session;
}

export function BuddyChallenge({ isOpen, onClose, session }: BuddyChallengeProps) {
  const { user } = useAuth();
  const { friends, sendInvite } = useStore();
  const [selectedFriendId, setSelectedFriendId] = useState<number | null>(null);
  const [customMessage, setCustomMessage] = useState('');
  const [showLinkCopied, setShowLinkCopied] = useState(false);
  const [aiPersonalizing, setAiPersonalizing] = useState(false);
  const [aiMessage, setAiMessage] = useState<string | null>(null);

  // Generate AI message when friend is selected
  useEffect(() => {
    if (selectedFriendId && user && session && !aiMessage && !aiPersonalizing) {
      const selectedFriend = friends.find(f => f.id === selectedFriendId);
      if (selectedFriend) {
        setAiPersonalizing(true);
        const accuracy = Math.round((session.correctAnswers / session.questionsAnswered) * 100);
        
        // Get time of day
        const hour = new Date().getHours();
        const timeOfDay = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
        
        // Call API route for personalization
        const context: PersonalizationContext = {
          sender: {
            name: user.name,
            role: user.role,
            streak: useStore.getState().rewards.streak,
          },
          recipient: {
            name: selectedFriend.name,
            role: 'student',
          },
          loopType: 'buddy_challenge',
          sessionData: {
            subject: session.subject,
            score: accuracy,
            skillsImproved: session.skillsImproved || [],
          },
          timeOfDay,
        };
        
        fetch('/api/ai/personalize-message', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(context),
        })
          .then(res => res.json())
          .then(data => {
            setAiMessage(data.message || null);
            setAiPersonalizing(false);
          })
          .catch((error) => {
            console.error('Error personalizing message:', error);
            setAiPersonalizing(false);
          });
      }
    }
  }, [selectedFriendId, user, session, friends, aiMessage, aiPersonalizing]);

  if (!isOpen || !user || !session) return null;

  const subjectFriends = getFriendsBySubject(session.subject);
  const onlineFriends = getOnlineFriends();
  const allFriends = [...subjectFriends, ...onlineFriends.filter(f => !subjectFriends.find(sf => sf.id === f.id))];

  const selectedFriend = selectedFriendId
    ? friends.find(f => f.id === selectedFriendId)
    : null;

  const accuracy = Math.round((session.correctAnswers / session.questionsAnswered) * 100);

  const handleSendChallenge = async () => {
    if (!selectedFriendId || !selectedFriend || !user) {
      toast.error('Please select a friend to challenge');
      return;
    }

    // Agent decision logic
    const accuracy = Math.round((session.correctAnswers / session.questionsAnswered) * 100);
    const decision = shouldTrigger(user.id, 'buddy_challenge', 'session_completed');
    const loopType = selectViralLoop('session_completed', {
      userId: user.id,
      event: 'session_completed',
      data: { score: accuracy },
    });

    if (!decision.shouldTrigger) {
      toast.error(decision.reason);
      return;
    }

    // Log agent decision
    logAgentDecision({
      timestamp: new Date(),
      agent: 'Orchestrator',
      action: `Triggered: ${loopType}`,
      reason: decision.reason,
      status: 'triggered',
    });

    // Use AI-generated message if available, otherwise fallback
    const personalizedMsg = aiMessage || `Hey! I just scored ${accuracy}% on ${session.subject}. Think you can beat that? 🎯`;

    // Create invite link
    const inviteLink = generateChallengeLink(
      session.sessionId,
      user.id,
      user.name,
      session.subject,
      'beat_score',
      50
    );

    // Track funnel: link_created
    trackFunnelEvent('link_created', {
      sessionId: session.sessionId,
      fromUserId: user.id,
      toUserId: selectedFriend.id,
      link: inviteLink,
    });

    // Add to store
    sendInvite({
      fromUserId: user.id,
      fromUserName: user.name,
      toUserId: selectedFriend.id,
      toUserName: selectedFriend.name,
      subject: session.subject,
      sessionId: session.sessionId,
      status: 'pending',
    });

    // Also call API to create invite record
    try {
      await fetch('/api/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientId: selectedFriend.id,
          sessionId: session.sessionId,
          senderId: user.id,
          senderName: user.name,
          subject: session.subject,
          message: customMessage || aiMessage || personalizedMsg,
        }),
      });
    } catch (error) {
      console.error('Error creating invite via API:', error);
    }

    toast.success(`Challenge sent to ${selectedFriend.name}! 🎉`);
    onClose();
  };

  const handleCopyLink = async () => {
    if (!selectedFriend) {
      const inviteLink = generateChallengeLink(
        session.sessionId,
        user.id,
        user.name,
        session.subject,
        'beat_score',
        50
      );

      await navigator.clipboard.writeText(inviteLink);
      setShowLinkCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setShowLinkCopied(false), 2000);
    } else {
      const inviteLink = generateChallengeLink(
        session.sessionId,
        user.id,
        user.name,
        session.subject,
        'beat_score',
        50
      );

      await navigator.clipboard.writeText(inviteLink);
      setShowLinkCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setShowLinkCopied(false), 2000);
    }
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
        className={`fixed inset-x-0 bottom-0 md:inset-x-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:bottom-auto z-50 bg-white rounded-t-3xl md:rounded-3xl shadow-2xl max-h-[90vh] overflow-hidden transition-all duration-300 ${
          isOpen
            ? 'translate-y-0 opacity-100'
            : 'translate-y-full md:translate-y-0 md:opacity-0 md:scale-95 pointer-events-none'
        }`}
        style={{
          width: '100%',
          maxWidth: '600px',
          margin: '0 auto',
        }}
      >
        <div className="overflow-y-auto max-h-[90vh]">
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-teal-500 text-white p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <SparklesIcon className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold">Challenge a Friend</h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Preview Section */}
            <div className="bg-gradient-to-r from-purple-50 to-teal-50 rounded-xl p-6 border border-purple-200">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <SparklesIcon className="w-5 h-5 text-purple-600" />
                What your friend will see:
              </h3>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <p className="font-semibold text-gray-900 mb-2">
                  {user.name} challenged you to beat their {session.subject} score!
                </p>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Score: {session.correctAnswers}/{session.questionsAnswered} ({accuracy}%)</p>
                  <p>Duration: {session.duration} minutes</p>
                  <p className="text-purple-600 font-medium mt-2">
                    Complete a session and you both earn 50 gems! 🎁
                  </p>
                </div>
              </div>
            </div>

            {/* Friend Selector */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <UserGroupIcon className="w-5 h-5 text-purple-600" />
                Select a friend
              </h3>
              
              {subjectFriends.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-3 font-medium">
                    Friends studying {session.subject}:
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {subjectFriends.map((friend) => (
                      <button
                        key={friend.id}
                        onClick={() => setSelectedFriendId(friend.id)}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                          selectedFriendId === friend.id
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-purple-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-teal-400 rounded-full flex items-center justify-center text-white font-bold">
                              {friend.name.charAt(0)}
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-gray-900 truncate">{friend.name}</div>
                            <div className="text-xs text-purple-600">Online • {session.subject}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {onlineFriends.length > 0 && (
                <div>
                  <p className="text-sm text-gray-600 mb-3 font-medium">
                    Other online friends:
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {onlineFriends
                      .filter(f => !subjectFriends.find(sf => sf.id === f.id))
                      .slice(0, 4)
                      .map((friend) => (
                        <button
                          key={friend.id}
                          onClick={() => setSelectedFriendId(friend.id)}
                          className={`p-4 rounded-xl border-2 transition-all text-left ${
                            selectedFriendId === friend.id
                              ? 'border-purple-500 bg-purple-50'
                              : 'border-gray-200 hover:border-purple-300 bg-white'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-teal-400 rounded-full flex items-center justify-center text-white font-bold">
                                {friend.name.charAt(0)}
                              </div>
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-gray-900 truncate">{friend.name}</div>
                              <div className="text-xs text-gray-500">
                                {friend.currentlyStudying || 'Online'}
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* AI-Generated Message */}
            {aiPersonalizing ? (
              <div className="mt-4 bg-indigo-50 rounded-xl p-4 border border-indigo-200">
                <div className="flex items-center gap-2 mb-2">
                  <SparklesIcon className="w-5 h-5 text-indigo-600 animate-pulse" />
                  <span className="text-sm font-semibold text-indigo-900">AI Personalizing Message...</span>
                </div>
                <div className="h-4 bg-indigo-200 rounded animate-pulse" />
              </div>
            ) : aiMessage ? (
              <div className="mt-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-200">
                <div className="flex items-start gap-2 mb-2">
                  <SparklesIcon className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-xs font-semibold text-purple-900 mb-1">✨ AI-Generated Message</div>
                    <div className="text-sm text-gray-800 bg-white rounded-lg p-2 border border-purple-200">
                      "{aiMessage}"
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {/* Custom Message */}
            <div className="mt-4">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Custom message (optional, overrides AI)
              </label>
              <textarea
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder={aiMessage || "Add a personal message..."}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                rows={3}
              />
            </div>

            {/* Reward Callout */}
            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-4 border border-amber-200">
              <div className="flex items-center gap-2 text-amber-800">
                <SparklesIcon className="w-5 h-5" />
                <span className="font-semibold">Both earn 50 gems when your friend completes a session!</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-4">
              <button
                onClick={handleSendChallenge}
                disabled={!selectedFriendId}
                className="w-full bg-gradient-to-r from-purple-600 to-teal-600 text-white font-bold py-4 px-6 rounded-xl hover:from-purple-700 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Send Challenge 🚀
              </button>
              
              <button
                onClick={handleCopyLink}
                className="w-full bg-white border-2 border-purple-300 text-purple-600 font-semibold py-3 px-6 rounded-xl hover:bg-purple-50 transition-all flex items-center justify-center gap-2"
              >
                <LinkIcon className="w-5 h-5" />
                {showLinkCopied ? 'Link Copied!' : 'Copy Shareable Link'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

