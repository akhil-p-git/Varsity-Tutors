'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useStore } from '@/lib/store';
import { calculateLevelProgress } from '@/lib/rewards';
import { toast } from 'sonner';
import { ArrowRightOnRectangleIcon, TrophyIcon, FireIcon, SparklesIcon } from '@heroicons/react/24/solid';

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { rewards, sessions, invites } = useStore();

  useEffect(() => {
    if (!user) {
      router.push('/');
      toast.error('Please log in to view your profile');
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
  const completedChallenges = invites.filter(inv => inv.status === 'completed').length;
  const totalSessions = sessions.length;

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50 pb-16">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-6">
          <div className="flex items-center gap-6 mb-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-teal-500 flex items-center justify-center text-white font-bold text-4xl">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{user.name}</h1>
              <p className="text-lg text-gray-600 capitalize">
                {user.role}
                {user.subject && (
                  <>
                    {' • '}
                    <span className="font-semibold text-purple-600">{user.subject}</span>
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Level Progress */}
          <div className="bg-gradient-to-r from-purple-50 to-teal-50 rounded-xl p-6 border border-purple-200">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-gray-900">Level {levelProgress.level}</span>
              <span className="font-semibold text-gray-900">Level {levelProgress.nextLevel}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden mb-2">
              <div
                className="bg-gradient-to-r from-purple-500 to-teal-500 h-4 rounded-full transition-all duration-500"
                style={{ width: `${levelProgress.progress}%` }}
              />
            </div>
            <div className="text-sm text-gray-600">{Math.round(levelProgress.progress)}% to next level</div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 text-center">
            <TrophyIcon className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 mb-1">{totalSessions}</div>
            <div className="text-sm text-gray-600">Total Sessions</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 text-center">
            <SparklesIcon className="w-8 h-8 text-teal-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 mb-1">{rewards.gems}</div>
            <div className="text-sm text-gray-600">Gems Earned</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 text-center">
            <FireIcon className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 mb-1">{rewards.streak}</div>
            <div className="text-sm text-gray-600">Day Streak</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 text-center">
            <TrophyIcon className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 mb-1">{completedChallenges}</div>
            <div className="text-sm text-gray-600">Challenges Won</div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {sessions.slice(0, 5).map((session) => (
              <div
                key={session.sessionId}
                className="p-4 bg-gradient-to-r from-purple-50 to-teal-50 rounded-xl border border-purple-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-900">{session.subject}</div>
                    <div className="text-sm text-gray-600">
                      {session.correctAnswers}/{session.questionsAnswered} correct • {session.duration} minutes
                    </div>
                  </div>
                  <button
                    onClick={() => router.push(`/session/${session.sessionId}/results`)}
                    className="text-purple-600 font-semibold hover:text-purple-700 transition-colors"
                  >
                    View →
                  </button>
                </div>
              </div>
            ))}
            {sessions.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>No sessions yet</p>
                <p className="text-sm mt-2">Start practicing to see your activity here!</p>
              </div>
            )}
          </div>
        </div>

        {/* Achievement Badges */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Achievement Badges</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'First Session', icon: '🎯', earned: totalSessions > 0 },
              { name: '7 Day Streak', icon: '🔥', earned: rewards.streak >= 7 },
              { name: 'Challenge Master', icon: '⚔️', earned: completedChallenges >= 1 },
              { name: 'Level 5', icon: '⭐', earned: levelProgress.level >= 5 },
            ].map((badge, index) => (
              <div
                key={index}
                className={`p-4 rounded-xl border-2 text-center transition-all ${
                  badge.earned
                    ? 'bg-gradient-to-r from-purple-50 to-teal-50 border-purple-500'
                    : 'bg-gray-50 border-gray-300 opacity-50'
                }`}
              >
                <div className="text-4xl mb-2">{badge.icon}</div>
                <div className={`font-semibold text-sm ${badge.earned ? 'text-gray-900' : 'text-gray-500'}`}>
                  {badge.name}
                </div>
                {badge.earned && (
                  <div className="text-xs text-purple-600 font-medium mt-1">Earned!</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Logout Button */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

