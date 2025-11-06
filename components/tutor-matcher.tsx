'use client';

import { useState } from 'react';
import { TutorMatchResult } from '@/lib/types';
import { matchTutorForStudent } from '@/lib/agents/tutor-matcher';
import { useAuth } from '@/lib/auth-context';
import { useStore } from '@/lib/store';
import { SparklesIcon, CheckCircleIcon, ClockIcon, TrophyIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { ShareButton } from './share-button';
import { generateTutorMatchShare } from '@/lib/social-share';
import { toast } from 'sonner';

export function TutorMatcher() {
  const { user } = useAuth();
  const { sessions } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const [matchResult, setMatchResult] = useState<TutorMatchResult | null>(null);
  const [showMatch, setShowMatch] = useState(false);

  const findPerfectTutor = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const result = await matchTutorForStudent(
        {
          id: user.id,
          name: user.name,
          subject: user.subject,
        },
        sessions,
        ['Improve test scores', 'Build confidence', 'Master fundamentals']
      );

      setMatchResult(result);
      setShowMatch(true);
      toast.success('Found your perfect tutor match!');
    } catch (error) {
      toast.error('Failed to find tutor match');
    } finally {
      setIsLoading(false);
    }
  };

  if (!showMatch || !matchResult) {
    return (
      <div className="bg-gradient-to-br from-purple-50 to-teal-50 rounded-xl p-8 border border-purple-200">
        <div className="flex items-center gap-3 mb-4">
          <SparklesIcon className="w-8 h-8 text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-900">AI Tutor Matching</h2>
        </div>
        <p className="text-gray-700 mb-6">
          Let our AI analyze your learning style, performance, and goals to find the perfect tutor for you.
        </p>
        <button
          onClick={findPerfectTutor}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-purple-600 to-teal-600 text-white font-bold py-3 rounded-lg hover:from-purple-700 hover:to-teal-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Finding Your Perfect Match...
            </>
          ) : (
            <>
              <SparklesIcon className="w-5 h-5" />
              Find My Perfect Tutor
            </>
          )}
        </button>
      </div>
    );
  }

  const { tutor, matchScore, reasoning, expectedImprovement, confidence, alternativeTutors } = matchResult;

  return (
    <div className="space-y-6">
      {/* Main Match */}
      <div className="bg-gradient-to-br from-purple-600 to-teal-600 rounded-xl p-8 text-white shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <SparklesIcon className="w-8 h-8" />
          <h2 className="text-2xl font-bold">Your Perfect Match!</h2>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-6">
          <div className="flex items-start gap-6">
            <img
              src={tutor.avatar}
              alt={tutor.name}
              className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
            />
            <div className="flex-1">
              <h3 className="text-3xl font-bold mb-2">{tutor.name}</h3>
              <p className="text-purple-100 mb-3">{tutor.bio}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {tutor.subjects.map((subject) => (
                  <span
                    key={subject}
                    className="px-3 py-1 bg-white/20 rounded-full text-sm font-semibold"
                  >
                    {subject}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <div className="text-3xl font-bold">{matchScore}%</div>
              <div className="text-sm text-purple-100">Match Score</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <div className="text-3xl font-bold">{tutor.successRate}%</div>
              <div className="text-sm text-purple-100">Success Rate</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <div className="text-3xl font-bold">+{expectedImprovement}%</div>
              <div className="text-sm text-purple-100">Expected Gain</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <div className="text-3xl font-bold">{Math.round(confidence * 100)}%</div>
              <div className="text-sm text-purple-100">Confidence</div>
            </div>
          </div>
        </div>

        {/* Why This Match */}
        <div className="mb-6">
          <h4 className="text-xl font-bold mb-3">Why {tutor.name} is Perfect for You</h4>
          <p className="text-purple-100 leading-relaxed">{reasoning}</p>
        </div>

        {/* Teaching Style & Availability */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div>
            <h5 className="font-bold mb-2 flex items-center gap-2">
              <CheckCircleIcon className="w-5 h-5" />
              Teaching Style
            </h5>
            <p className="text-purple-100 text-sm">{tutor.teachingStyle}</p>
          </div>
          <div>
            <h5 className="font-bold mb-2 flex items-center gap-2">
              <ClockIcon className="w-5 h-5" />
              Availability
            </h5>
            <p className="text-purple-100 text-sm capitalize">
              {tutor.availability === 'available' ? '✅ Available Now' : `${tutor.nextAvailable}`}
            </p>
          </div>
        </div>

        {/* Recent Wins */}
        <div className="mb-6">
          <h5 className="font-bold mb-3 flex items-center gap-2">
            <TrophyIcon className="w-5 h-5" />
            Recent Success Stories
          </h5>
          <div className="space-y-2">
            {tutor.recentWins.map((win, idx) => (
              <div key={idx} className="bg-white/10 rounded-lg p-3 text-sm text-purple-100">
                ✨ {win}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="flex gap-3">
          <button className="flex-1 bg-white text-purple-600 font-bold py-4 rounded-lg hover:bg-purple-50 transition-all shadow-lg">
            Book Session with {tutor.name}
          </button>
          <div className="flex items-center">
            <ShareButton
              content={generateTutorMatchShare({
                name: tutor.name,
                subject: tutor.subjects[0],
              })}
              variant="secondary"
              size="md"
            />
          </div>
        </div>
      </div>

      {/* Alternative Tutors */}
      {alternativeTutors && alternativeTutors.length > 0 && (
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <UserGroupIcon className="w-6 h-6 text-gray-600" />
            Other Great Options
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {alternativeTutors.map((alt) => (
              <div
                key={alt.tutorId}
                className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-all"
              >
                <div className="flex items-center gap-4 mb-3">
                  <img
                    src={alt.tutor.avatar}
                    alt={alt.tutor.name}
                    className="w-16 h-16 rounded-full"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900">{alt.tutor.name}</h4>
                    <div className="text-sm text-purple-600 font-semibold">
                      {alt.matchScore}% Match
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3">{alt.reason}</p>
                <button className="w-full text-sm bg-gray-100 text-gray-700 font-semibold py-2 rounded-lg hover:bg-gray-200 transition-all">
                  View Profile
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Try Again Button */}
      <button
        onClick={() => setShowMatch(false)}
        className="w-full text-purple-600 font-semibold py-3 hover:text-purple-700 transition-all"
      >
        ← Find Another Tutor
      </button>
    </div>
  );
}
