'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { parseInviteLink, trackLinkClick, trackFunnelEvent } from '@/lib/smart-links';
import { getSessionById } from '@/lib/data/mock-sessions';
import { useAuth } from '@/lib/auth-context';
import { useStore } from '@/lib/store';
import { awardGems, REWARD_AMOUNTS } from '@/lib/rewards';
import { showRewardNotification } from '@/app/components/RewardNotification';
import { toast } from 'sonner';
import {
  AcademicCapIcon,
  TrophyIcon,
  SparklesIcon,
  UserGroupIcon,
} from '@heroicons/react/24/solid';
import { Confetti } from '@/app/components/Confetti';

function InvitePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { acceptInvite, completeInvite } = useStore();
  const [inviteData, setInviteData] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Parse invite link from URL
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const parsed = parseInviteLink(url);

    if (parsed) {
      setInviteData(parsed);
      
      // Track page view immediately
      trackLinkClick(parsed.code);
      
      // Track funnel: link_clicked
      const urlParams = new URLSearchParams(window.location.search);
      const utmSource = urlParams.get('utm_source') || 'unknown';
      const utmMedium = urlParams.get('utm_medium') || 'unknown';
      const utmCampaign = urlParams.get('utm_campaign') || 'unknown';
      
      trackFunnelEvent('link_clicked', {
        code: parsed.code,
        utm_source: utmSource,
        utm_medium: utmMedium,
        utm_campaign: utmCampaign,
      });

      // If sessionId exists, load session data
      if (parsed.sessionId) {
        const sessionData = getSessionById(parsed.sessionId);
        if (sessionData) {
          setSession(sessionData);
        }
      }

      // Show confetti briefly
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    } else {
      toast.error('Invalid invite link');
      router.push('/');
    }
  }, [router]);

  if (!inviteData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading invite...</p>
        </div>
      </div>
    );
  }

  const handleAcceptChallenge = () => {
    if (!isAuthenticated) {
      toast.info('Please log in to accept the challenge');
      router.push('/');
      return;
    }

    // Accept invite
    if (inviteData.code && user) {
      // Accept invite in store
      acceptInvite(inviteData.code);
      
      // Award invite acceptance reward
      const acceptReward = awardGems(user.id, REWARD_AMOUNTS.inviteAccepted, 'Challenge accepted!');
      showRewardNotification(acceptReward);
      
      toast.success('Challenge accepted! Let\'s do this! 🎉');
      
      // Redirect to practice session
      router.push(`/session/practice?subject=${encodeURIComponent(inviteData.subject)}&invite=${inviteData.code}`);
    }
  };

  const handleSignUp = () => {
    router.push('/');
  };

  const accuracy = session
    ? Math.round((session.correctAnswers / session.questionsAnswered) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50">
      {showConfetti && <Confetti />}

      <div className="container mx-auto px-4 py-16 max-w-3xl">
        {/* Challenge Header */}
        <div className="bg-gradient-to-r from-purple-600 via-purple-500 to-teal-500 rounded-2xl shadow-2xl p-8 mb-6 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-teal-600/20" />
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <TrophyIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">
                  {inviteData.from} challenged you!
                </h1>
                <p className="text-xl text-white/90">
                  Can you beat their {inviteData.subject} score?
                </p>
                {typeof window !== 'undefined' && (
                  <p className="text-sm text-white/70 mt-2">
                    via {new URLSearchParams(window.location.search).get('utm_source') || 'invite'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Session Preview */}
        {session && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <AcademicCapIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{session.subject}</h2>
                <p className="text-gray-600">Their session results</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {session.correctAnswers}/{session.questionsAnswered}
                </div>
                <div className="text-sm text-gray-600">Score</div>
              </div>
              <div className="bg-teal-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-teal-600 mb-1">{accuracy}%</div>
                <div className="text-sm text-gray-600">Accuracy</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">{session.duration}m</div>
                <div className="text-sm text-gray-600">Duration</div>
              </div>
              <div className="bg-amber-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-amber-600 mb-1">
                  {session.skillsImproved.length}
                </div>
                <div className="text-sm text-gray-600">Skills</div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-teal-50 rounded-xl p-4">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Skills improved:</span>{' '}
                {session.skillsImproved.join(', ')}
              </p>
            </div>
          </div>
        )}

        {/* Reward Callout */}
        <div className="bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 rounded-2xl shadow-xl border-2 border-amber-200 p-8 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-yellow-400 rounded-full flex items-center justify-center">
              <SparklesIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-amber-900 mb-2">
                Complete a session and you both earn 50 gems! 🎁
              </h2>
              <p className="text-amber-800 text-lg">
                Beat their score and earn bonus rewards!
              </p>
            </div>
          </div>
        </div>

        {/* Voice Room CTA */}
        {isAuthenticated && (
          <div className="bg-gradient-to-r from-teal-600 via-teal-500 to-purple-500 rounded-2xl shadow-xl p-6 mb-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xl font-bold mb-2">🎧 Study together in voice rooms</div>
                <div className="text-white/90 text-sm">Join friends studying {inviteData.subject} now!</div>
              </div>
              <button
                onClick={() => router.push('/rooms')}
                className="px-6 py-3 bg-white text-purple-600 font-bold rounded-xl hover:bg-gray-100 transition-colors"
              >
                Join Room →
              </button>
            </div>
          </div>
        )}

        {/* CTA Buttons */}
        <div className="space-y-4">
          {isAuthenticated ? (
            <>
              <button
                onClick={handleAcceptChallenge}
                className="w-full bg-gradient-to-r from-purple-600 to-teal-600 text-white font-bold py-5 px-8 rounded-xl hover:from-purple-700 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 text-lg flex items-center justify-center gap-3"
              >
                <TrophyIcon className="w-6 h-6" />
                Accept Challenge & Start Practice Session
              </button>
              <p className="text-center text-gray-600 text-sm">
                You'll complete a {inviteData.subject} quiz and try to beat {inviteData.from}'s score!
              </p>
            </>
          ) : (
            <>
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-4">
                <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">
                  Sign up to accept this challenge
                </h3>
                <p className="text-gray-600 text-center mb-6">
                  Create an account to compete and earn rewards together!
                </p>
                <div className="grid grid-cols-3 gap-4">
                  <button
                    onClick={handleSignUp}
                    className="p-4 bg-purple-100 hover:bg-purple-200 rounded-xl transition-colors border-2 border-purple-300 text-center"
                  >
                    <div className="text-2xl mb-2">👨‍🎓</div>
                    <div className="font-semibold text-purple-700 text-sm">Student</div>
                  </button>
                  <button
                    onClick={handleSignUp}
                    className="p-4 bg-teal-100 hover:bg-teal-200 rounded-xl transition-colors border-2 border-teal-300 text-center"
                  >
                    <div className="text-2xl mb-2">👨‍👩‍👧</div>
                    <div className="font-semibold text-teal-700 text-sm">Parent</div>
                  </button>
                  <button
                    onClick={handleSignUp}
                    className="p-4 bg-gradient-to-br from-purple-100 to-teal-100 hover:from-purple-200 hover:to-teal-200 rounded-xl transition-colors border-2 border-purple-300 text-center"
                  >
                    <div className="text-2xl mb-2">👨‍🏫</div>
                    <div className="font-semibold text-purple-700 text-sm">Tutor</div>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function InvitePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading invite...</p>
          </div>
        </div>
      }
    >
      <InvitePageContent />
    </Suspense>
  );
}

