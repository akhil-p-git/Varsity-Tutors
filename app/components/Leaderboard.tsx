'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { useAuth } from '@/lib/auth-context';
import { LeaderboardEntry } from '@/lib/types';
import { getFriendsLeaderboard, getGlobalLeaderboard, getWeeklyLeaderboard } from '@/lib/data/mock-leaderboard';
import { TrophyIcon, FireIcon } from '@heroicons/react/24/solid';

type TabType = 'friends' | 'global' | 'week';

export function Leaderboard() {
  const { user } = useAuth();
  const { friends } = useStore();
  const [activeTab, setActiveTab] = useState<TabType>('friends');

  const friendIds = friends.map(f => f.id);

  const getLeaderboardData = (): LeaderboardEntry[] => {
    switch (activeTab) {
      case 'friends':
        return getFriendsLeaderboard(friendIds);
      case 'global':
        return getGlobalLeaderboard();
      case 'week':
        return getWeeklyLeaderboard();
      default:
        return [];
    }
  };

  const leaderboardData = getLeaderboardData();
  const currentUserRank = user ? leaderboardData.findIndex(entry => entry.userId === user.id) : -1;

  const getMedal = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Leaderboard</h2>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {(['friends', 'global', 'week'] as TabType[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-semibold transition-colors ${
              activeTab === tab
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab === 'friends' ? 'Friends' : tab === 'global' ? 'Global' : 'This Week'}
          </button>
        ))}
      </div>

      {/* Leaderboard Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Rank</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Name</th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Points</th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Streak</th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Level</th>
            </tr>
          </thead>
          <tbody>
            {leaderboardData.map((entry, index) => {
              const isCurrentUser = user && entry.userId === user.id;
              const medal = getMedal(entry.rank);

              return (
                <tr
                  key={entry.userId}
                  className={`border-b border-gray-100 transition-colors animate-fade-in ${
                    isCurrentUser ? 'bg-purple-50' : 'hover:bg-gray-50'
                  }`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      {medal ? (
                        <span className="text-2xl">{medal}</span>
                      ) : (
                        <span className="font-bold text-gray-700">#{entry.rank}</span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-teal-400 flex items-center justify-center text-white font-bold">
                        {entry.name.charAt(0)}
                      </div>
                      <span className={`font-semibold ${isCurrentUser ? 'text-purple-600' : 'text-gray-900'}`}>
                        {entry.name}
                        {isCurrentUser && ' (You)'}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="font-semibold text-gray-900">{entry.points.toLocaleString()}</span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <FireIcon className="w-4 h-4 text-orange-500" />
                      <span className="font-semibold text-gray-900">{entry.streak}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="font-semibold text-gray-900">Lv.{entry.level}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {leaderboardData.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No data available</p>
        </div>
      )}
    </div>
  );
}

