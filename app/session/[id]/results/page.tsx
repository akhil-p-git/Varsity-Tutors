'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import { getSessionById } from '@/lib/data/mock-sessions';
import { getFriendsBySubject, getOnlineFriends } from '@/lib/data/mock-friends';
import { useAuth } from '@/lib/auth-context';
import { toast } from 'sonner';
import {
  AcademicCapIcon,
  ClockIcon,
  CheckCircleIcon,
  TrophyIcon,
  FireIcon,
  SparklesIcon,
  UserGroupIcon,
} from '@heroicons/react/24/solid';
import { Confetti } from '@/app/components/Confetti';
import { BuddyChallenge } from '@/app/components/BuddyChallenge';
import { getRoomsBySubject } from '@/lib/data/mock-rooms';
import { selectViralLoop, shouldTrigger } from '@/lib/agents/orchestrator';
import { logAgentDecision } from '@/app/components/AgentDebugger';
import { trackFunnelEvent } from '@/lib/smart-links';

export default function SessionResultsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const sessionId = params.id as string;
  const [session, setSession] = useState(getSessionById(sessionId));
  const { rewards, sendInvite, updateRewards } = useStore();
  const [showConfetti, setShowConfetti] = useState(true);
  const [showBuddyChallenge, setShowBuddyChallenge] = useState(false);

  const subjectFriends = session
    ? getFriendsBySubject(session.subject)
    : [];
  const onlineFriends = getOnlineFriends();

  useEffect(() => {
    if (!session) {
      toast.error('Session not found');
      router.push('/dashboard');
    } else {
      // Trigger confetti on mount
      setTimeout(() => setShowConfetti(false), 3000);

      // Agent decision: Check if should trigger buddy challenge
      if (user && session) {
        const accuracy = Math.round((session.correctAnswers / session.questionsAnswered) * 100);
        const decision = shouldTrigger(user.id, 'buddy_challenge', 'session_completed');
        const loopType = selectViralLoop('session_completed', {
          userId: user.id,
          event: 'session_completed',
          data: { score: accuracy },
        });

        if (decision.shouldTrigger && loopType) {
          logAgentDecision({
            timestamp: new Date(),
            agent: 'Orchestrator',
            action: `Triggered: ${loopType}`,
            reason: `Score ${accuracy}% > 70% threshold ✓, Daily limit not reached ✓`,
            status: 'triggered',
          });

          // Track funnel: session_completed
          trackFunnelEvent('session_completed', {
            sessionId: session.sessionId,
            score: accuracy,
            subject: session.subject,
          });
        }
      }
    }
  }, [session, router, user]);

  if (!session) {
    return null;
  }

  const accuracy = Math.round(
    (session.correctAnswers / session.questionsAnswered) * 100
  );
  const score = `${session.correctAnswers}/${session.questionsAnswered}`;

  const handleSendChallenge = (friendId: number, friendName: string) => {
    setShowBuddyChallenge(true);
  };

  const handleQuickChallenge = (friendId: number, friendName: string) => {
    if (!user) return;

    sendInvite({
      fromUserId: user.id,
      fromUserName: user.name,
      toUserId: friendId,
      toUserName: friendName,
      subject: session.subject,
      sessionId: session.sessionId,
      status: 'pending',
    });

    toast.success(`Challenge sent to ${friendName}! Both of you will earn 50 gems when they complete it.`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50 pb-16">
      {showConfetti && <Confetti />}
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Top Section - Session Summary Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <AcademicCapIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{session.subject}</h1>
                <p className="text-gray-600">Session completed!</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-purple-600">{accuracy}%</div>
              <div className="text-sm text-gray-600">Accuracy</div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrophyIcon className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-semibold text-gray-700">Score</span>
              </div>
              <div className="text-2xl font-bold text-purple-600">{score}</div>
            </div>

            <div className="bg-teal-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <ClockIcon className="w-5 h-5 text-teal-600" />
                <span className="text-sm font-semibold text-gray-700">Duration</span>
              </div>
              <div className="text-2xl font-bold text-teal-600">{session.duration}m</div>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircleIcon className="w-5 h-5 text-green-600" />
                <span className="text-sm font-semibold text-gray-700">Correct</span>
              </div>
              <div className="text-2xl font-bold text-green-600">
                {session.correctAnswers}
              </div>
            </div>

            <div className="bg-amber-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <SparklesIcon className="w-5 h-5 text-amber-600" />
                <span className="text-sm font-semibold text-gray-700">Skills</span>
              </div>
              <div className="text-2xl font-bold text-amber-600">
                {session.skillsImproved.length}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-gray-700">Overall Progress</span>
              <span className="text-sm font-semibold text-purple-600">{accuracy}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-500 to-teal-500 h-4 rounded-full transition-all duration-1000"
                style={{ width: `${accuracy}%` }}
              />
            </div>
          </div>

          {/* Skills Improved */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Skills Improved</h3>
            <div className="flex flex-wrap gap-2">
              {session.skillsImproved.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium"
                >
                  ✨ {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Voice Room CTA */}
        {(() => {
          const subjectRooms = getRoomsBySubject(session.subject);
          const totalParticipants = subjectRooms.reduce((sum, room) => sum + room.participantCount, 0);
          
          if (totalParticipants > 0) {
            return (
              <div className="bg-gradient-to-r from-teal-600 via-teal-500 to-purple-500 rounded-2xl shadow-2xl p-6 mb-6 text-white relative overflow-hidden cursor-pointer hover:shadow-3xl transition-all"
                onClick={() => router.push('/rooms')}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold mb-2">🎧 {totalParticipants} friends studying {session.subject} now</div>
                    <div className="text-lg text-white/90">Join them in a voice room!</div>
                  </div>
                  <button className="px-6 py-3 bg-white text-purple-600 font-bold rounded-xl hover:bg-gray-100 transition-colors">
                    Join Voice Room →
                  </button>
                </div>
              </div>
            );
          }
          return null;
        })()}

        {/* Viral Share Section - Buddy Challenge CTA */}
        <div className="bg-gradient-to-r from-purple-600 via-purple-500 to-teal-500 rounded-2xl shadow-2xl p-8 mb-6 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-teal-600/20" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <SparklesIcon className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold">Challenge a Friend!</h2>
            </div>
            <p className="text-xl mb-6 text-white/90">
              Challenge a friend and <span className="font-bold">both earn 50 gems!</span>
            </p>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6 border border-white/20">
              <p className="text-sm font-semibold mb-2 text-white/80">Your friend will see:</p>
              <div className="bg-white rounded-lg p-4 text-gray-900">
                <p className="font-semibold mb-1">
                  {user?.name || 'You'} completed a {session.subject} session!
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  Score: {score} ({accuracy}%) • {session.duration} minutes
                </p>
                <p className="text-sm font-medium text-purple-600">
                  Complete the same challenge to earn 50 gems together! 🎁
                </p>
              </div>
            </div>

            {subjectFriends.length > 0 ? (
              <div className="mb-6">
                <p className="text-sm font-semibold mb-3 text-white/80">
                  Friends online studying {session.subject}:
                </p>
                <div className="flex flex-wrap gap-3">
                  {subjectFriends.slice(0, 3).map((friend) => (
                    <button
                      key={friend.id}
                      onClick={() => handleSendChallenge(friend.id, friend.name)}
                      className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/30 transition-all hover:scale-105 flex items-center gap-3"
                    >
                      <div className="relative">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-purple-600 font-bold">
                          {friend.name.charAt(0)}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-sm">{friend.name}</div>
                        <div className="text-xs text-white/70">Online • {session.subject}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mb-6 p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                <p className="text-sm text-white/80">
                  No friends currently studying {session.subject}. Share with any friend below!
                </p>
              </div>
            )}

            <button
              onClick={() => setShowBuddyChallenge(true)}
              className="w-full bg-white text-purple-600 font-bold py-4 px-6 rounded-xl hover:bg-gray-100 transition-all hover:scale-105 shadow-lg text-lg"
            >
              Send Challenge 🚀
            </button>
          </div>
        </div>

        {/* Bottom Section - Friends Studying Now */}
        {onlineFriends.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <UserGroupIcon className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">Friends Studying Now</h2>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {onlineFriends.map((friend) => (
                <div
                  key={friend.id}
                  className="flex-shrink-0 bg-gradient-to-br from-purple-50 to-teal-50 rounded-xl p-4 border border-gray-200 min-w-[180px]"
                >
                  <div className="relative mb-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-teal-400 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto">
                      {friend.name.charAt(0)}
                    </div>
                    <div className="absolute bottom-0 right-1/2 translate-x-1/2 w-5 h-5 bg-green-500 rounded-full border-2 border-white" />
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-gray-900 mb-1">{friend.name}</div>
                    {friend.currentlyStudying ? (
                      <div className="text-sm text-purple-600 font-medium mb-2">
                        {friend.currentlyStudying}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500 mb-2">Online</div>
                    )}
                    <div className="flex items-center justify-center gap-4 text-xs">
                      <div className="flex items-center gap-1">
                        <FireIcon className="w-4 h-4 text-orange-500" />
                        <span className="text-gray-600">{friend.streak} day</span>
                      </div>
                      <div className="text-gray-600">Lv.{friend.level}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Stats</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <FireIcon className="w-8 h-8 text-orange-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{rewards.streak}</div>
              <div className="text-sm text-gray-600">Day Streak</div>
            </div>
            <div className="text-center p-4 bg-teal-50 rounded-xl">
              <SparklesIcon className="w-8 h-8 text-teal-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{rewards.gems}</div>
              <div className="text-sm text-gray-600">Total Gems</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <TrophyIcon className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{rewards.points}</div>
              <div className="text-sm text-gray-600">Points</div>
            </div>
          </div>
        </div>
      </div>

      {/* Buddy Challenge Modal */}
      {session && (
        <BuddyChallenge
          isOpen={showBuddyChallenge}
          onClose={() => setShowBuddyChallenge(false)}
          session={session}
        />
      )}
    </div>
  );
}

