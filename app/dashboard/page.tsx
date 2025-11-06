'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useStore } from '@/lib/store';
import { calculateLevelProgress } from '@/lib/rewards';
import { PresenceFeed } from '@/app/components/PresenceFeed';
import { Leaderboard } from '@/app/components/Leaderboard';
import { StudyPresence } from '@/app/components/StudyPresence';
import { TutorMatcher } from '@/components/tutor-matcher';
import { ShareButton } from '@/components/share-button';
import { generateAchievementShare } from '@/lib/social-share';
import { toast } from 'sonner';
import { FireIcon, SparklesIcon, UserPlusIcon } from '@heroicons/react/24/solid';
import { AcademicCapIcon } from '@heroicons/react/24/outline';

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { rewards, invites, friends } = useStore();

  useEffect(() => {
    if (!user) {
      router.push('/');
      toast.error('Please log in to access the dashboard');
    }
  }, [user, router]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const levelProgress = calculateLevelProgress(rewards.points);
  const pendingInvites = invites.filter(inv => inv.status === 'pending' && inv.toUserId === user.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50 pb-16">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-purple-600 to-teal-500 rounded-2xl shadow-2xl p-8 mb-6 text-white">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">Welcome back, {user.name}!</h1>
              <div className="flex items-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <FireIcon className="w-6 h-6 text-orange-400" />
                  <span className="text-2xl font-bold">{rewards.streak} day streak</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-3xl">💎</span>
                  <span className="text-2xl font-bold">{rewards.gems} gems</span>
                </div>
                {rewards.streak >= 3 && (
                  <ShareButton
                    content={generateAchievementShare({
                      type: 'streak',
                      streak: rewards.streak,
                    })}
                    variant="secondary"
                    size="sm"
                  />
                )}
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
              <div className="text-sm text-white/80 mb-2">Level Progress</div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl font-bold">Level {levelProgress.level}</span>
                <span className="text-white/60">→</span>
                <span className="text-2xl font-bold">Level {levelProgress.nextLevel}</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-white h-3 rounded-full transition-all duration-500"
                  style={{ width: `${levelProgress.progress}%` }}
                />
              </div>
              <div className="text-sm text-white/80 mt-1">{Math.round(levelProgress.progress)}%</div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Presence Feed - Left Column (60%) */}
          <div className="lg:col-span-2">
            <PresenceFeed />
          </div>

          {/* Quick Actions - Right Column (40%) */}
          <div className="space-y-6">
            {/* Start Practice Session */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
              <button
                onClick={() => router.push('/session/practice')}
                className="w-full bg-gradient-to-r from-purple-600 to-teal-600 text-white font-bold py-4 px-6 rounded-xl hover:from-purple-700 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-3"
              >
                <AcademicCapIcon className="w-6 h-6" />
                Start Practice Session
              </button>
            </div>

            {/* AI Tutor Matching */}
            {user.role === 'student' && (
              <TutorMatcher />
            )}

            {/* Active Challenges */}
            {pendingInvites.length > 0 ? (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Active Challenges</h3>
                <div className="space-y-3">
                  {pendingInvites.slice(0, 3).map((invite) => (
                    <div
                      key={invite.id}
                      className="p-4 bg-gradient-to-r from-purple-50 to-teal-50 rounded-xl border border-purple-200"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-semibold text-gray-900">{invite.fromUserName}</div>
                        <span className="text-sm text-purple-600 font-medium">Challenge</span>
                      </div>
                      <div className="text-sm text-gray-600 mb-3">
                        challenged you to {invite.subject}!
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            router.push(`/session/practice?subject=${invite.subject}&invite=${invite.id}`);
                            toast.success('Challenge accepted!');
                          }}
                          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => toast.info('Challenge declined')}
                          className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Active Challenges</h3>
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">⚔️</div>
                  <p className="text-gray-600 mb-2">No challenges yet</p>
                  <p className="text-sm text-gray-500 mb-4">Complete a session to send a challenge!</p>
                  <button
                    onClick={() => router.push('/session/practice')}
                    className="px-6 py-3 bg-purple-100 hover:bg-purple-200 text-purple-700 font-semibold rounded-xl transition-colors"
                  >
                    Start Practice Session
                  </button>
                </div>
              </div>
            )}

            {/* Voice Room Presence Widget */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Study Together</h3>
              <div className="bg-gradient-to-r from-teal-50 to-purple-50 rounded-xl p-4 border border-teal-200">
                <div className="text-sm text-gray-600 mb-2">Friends studying now</div>
                <button
                  onClick={() => router.push('/rooms')}
                  className="w-full bg-gradient-to-r from-teal-600 to-purple-600 text-white font-bold py-3 px-4 rounded-xl hover:from-teal-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
                >
                  Join Voice Room →
                </button>
              </div>
            </div>

            {/* Invite Friends */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Invite Friends</h3>
              <button
                onClick={() => {
                  // In a real app, this would open an invite modal
                  toast.info('Invite feature coming soon!');
                }}
                className="w-full bg-purple-100 hover:bg-purple-200 text-purple-700 font-semibold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <UserPlusIcon className="w-5 h-5" />
                Invite Friends
              </button>
            </div>
          </div>
        </div>

        {/* Leaderboard Section */}
        <div className="mb-6">
          <Leaderboard />
        </div>
      </div>
    </div>
  );
}

