'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useStore } from '@/lib/store';
import { toast } from 'sonner';
import { ChartBarIcon, UserGroupIcon, TrophyIcon, SparklesIcon } from '@heroicons/react/24/solid';

export default function AnalyticsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { analytics, voiceRoomAnalytics } = useStore();

  useEffect(() => {
    if (!user) {
      router.push('/');
      toast.error('Please log in to view analytics');
    }
    // In a real app, only tutors/admins would see this
    if (user && user.role !== 'tutor' && user.role !== 'parent') {
      toast.info('Analytics available for tutors and admins only');
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

  const conversionRate = analytics.invitesSent > 0
    ? Math.round((analytics.invitesAccepted / analytics.invitesSent) * 100)
    : 0;

  // Calculate K-factor: (Invites sent × Conversion rate) / Active users
  // Simplified: conversions / invites sent
  const kFactor = analytics.invitesSent > 0
    ? (analytics.conversions / analytics.invitesSent).toFixed(2)
    : '0.00';
  
  // Show calculation explanation
  const kFactorExplanation = analytics.invitesSent > 0
    ? `${analytics.conversions} conversions ÷ ${analytics.invitesSent} invites = ${kFactor}`
    : 'No data yet';

  // Mock daily invites data (for chart)
  const dailyInvites = [
    { day: 'Mon', sent: 8, accepted: 6 },
    { day: 'Tue', sent: 12, accepted: 9 },
    { day: 'Wed', sent: 10, accepted: 7 },
    { day: 'Thu', sent: 9, accepted: 6 },
    { day: 'Fri', sent: 15, accepted: 11 },
    { day: 'Sat', sent: 7, accepted: 5 },
    { day: 'Sun', sent: 5, accepted: 4 },
  ];

  const maxInvites = Math.max(...dailyInvites.map(d => d.sent));

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50 pb-16">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Analytics Dashboard</h1>

        {/* Big Number Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <SparklesIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Invites Sent</div>
                <div className="text-3xl font-bold text-gray-900">{analytics.invitesSent}</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                <UserGroupIcon className="w-6 h-6 text-teal-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Invites Accepted</div>
                <div className="text-3xl font-bold text-gray-900">{analytics.invitesAccepted}</div>
                <div className="text-sm text-teal-600 font-semibold">{conversionRate}% conversion</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <TrophyIcon className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Voice Room Joins</div>
                <div className="text-3xl font-bold text-gray-900">{voiceRoomAnalytics.roomJoins}</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <ChartBarIcon className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Total Conversions</div>
                <div className="text-3xl font-bold text-gray-900">{analytics.conversions}</div>
              </div>
            </div>
          </div>
        </div>

        {/* K-Factor */}
        <div className="bg-gradient-to-r from-purple-600 to-teal-500 rounded-2xl shadow-xl p-6 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">K-Factor Estimate</h2>
              <p className="text-white/90">Viral coefficient measurement</p>
              <p className="text-white/70 text-sm mt-2">{kFactorExplanation}</p>
            </div>
            <div className="text-right">
              <div className="text-6xl font-bold mb-2">{kFactor}</div>
              <div className="text-sm text-white/80">
                {parseFloat(kFactor) >= 1.0 ? 'Viral! 🚀' : parseFloat(kFactor) >= 0.5 ? 'Growing 📈' : 'Early stage 🌱'}
              </div>
            </div>
          </div>
        </div>

        {/* Daily Invites Chart */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Daily Invites (Last 7 Days)</h2>
          <div className="space-y-4">
            {dailyInvites.map((day, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-16 text-sm font-semibold text-gray-700">{day.day}</div>
                <div className="flex-1 flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-8 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-teal-500 h-8 rounded-full flex items-center justify-end pr-2 transition-all"
                      style={{ width: `${(day.sent / maxInvites) * 100}%` }}
                    >
                      <span className="text-xs font-semibold text-white">{day.sent}</span>
                    </div>
                  </div>
                  <div className="w-24 text-right">
                    <span className="text-sm font-semibold text-gray-700">{day.accepted} accepted</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity Table */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Activity</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Event</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Count</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 text-sm text-gray-700">Today</td>
                  <td className="py-3 px-4 text-sm text-gray-700">Invites Sent</td>
                  <td className="py-3 px-4 text-sm text-gray-700 text-right">{analytics.invitesSent}</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 text-sm text-gray-700">Today</td>
                  <td className="py-3 px-4 text-sm text-gray-700">Invites Accepted</td>
                  <td className="py-3 px-4 text-sm text-gray-700 text-right">{analytics.invitesAccepted}</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 text-sm text-gray-700">Today</td>
                  <td className="py-3 px-4 text-sm text-gray-700">Voice Room Joins</td>
                  <td className="py-3 px-4 text-sm text-gray-700 text-right">{voiceRoomAnalytics.roomJoins}</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-sm text-gray-700">Today</td>
                  <td className="py-3 px-4 text-sm text-gray-700">Conversions</td>
                  <td className="py-3 px-4 text-sm text-gray-700 text-right">{analytics.conversions}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

