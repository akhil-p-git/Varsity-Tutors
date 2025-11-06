'use client';

import { ShareButton } from './share-button';
import { generateAchievementShare, generateChallengeShare, generateTutorMatchShare } from '@/lib/social-share';
import { TrophyIcon, FireIcon, SparklesIcon, AcademicCapIcon } from '@heroicons/react/24/solid';

interface AchievementCardProps {
  type: 'high_score' | 'streak' | 'improvement' | 'tutor_match' | 'challenge';
  data: {
    score?: number;
    subject?: string;
    streak?: number;
    improvement?: number;
    tutorName?: string;
    challengerName?: string;
    userName?: string;
  };
  variant?: 'full' | 'compact';
}

export function AchievementCard({ type, data, variant = 'full' }: AchievementCardProps) {
  const getIcon = () => {
    switch (type) {
      case 'high_score':
        return <TrophyIcon className="w-16 h-16 text-yellow-400" />;
      case 'streak':
        return <FireIcon className="w-16 h-16 text-orange-500" />;
      case 'improvement':
        return <SparklesIcon className="w-16 h-16 text-purple-500" />;
      case 'tutor_match':
        return <AcademicCapIcon className="w-16 h-16 text-teal-500" />;
      case 'challenge':
        return <span className="text-6xl">⚔️</span>;
    }
  };

  const getGradient = () => {
    switch (type) {
      case 'high_score':
        return 'from-yellow-400 to-orange-500';
      case 'streak':
        return 'from-orange-500 to-red-500';
      case 'improvement':
        return 'from-purple-500 to-pink-500';
      case 'tutor_match':
        return 'from-teal-500 to-cyan-500';
      case 'challenge':
        return 'from-indigo-500 to-purple-500';
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'high_score':
        return `Perfect ${data.score}% Score!`;
      case 'streak':
        return `${data.streak} Day Streak!`;
      case 'improvement':
        return `+${data.improvement}% Improvement!`;
      case 'tutor_match':
        return `Matched with ${data.tutorName}!`;
      case 'challenge':
        return `Challenge Accepted!`;
    }
  };

  const getDescription = () => {
    switch (type) {
      case 'high_score':
        return `Achieved a perfect score in ${data.subject}`;
      case 'streak':
        return `Studied consistently for ${data.streak} days straight`;
      case 'improvement':
        return `Improved ${data.subject} performance by ${data.improvement}%`;
      case 'tutor_match':
        return `AI matched me with the perfect tutor for ${data.subject}`;
      case 'challenge':
        return `Competing with ${data.challengerName} in ${data.subject}`;
    }
  };

  const getShareContent = () => {
    switch (type) {
      case 'challenge':
        return generateChallengeShare({
          fromName: data.challengerName || 'a friend',
          subject: data.subject || 'study',
          score: data.score,
        });
      case 'tutor_match':
        return generateTutorMatchShare({
          name: data.tutorName || 'my tutor',
          subject: data.subject || 'my studies',
        });
      default:
        return generateAchievementShare({
          type,
          score: data.score,
          subject: data.subject,
          streak: data.streak,
          improvement: data.improvement,
        });
    }
  };

  if (variant === 'compact') {
    return (
      <div className={`bg-gradient-to-r ${getGradient()} rounded-lg p-4 text-white shadow-lg`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl">{type === 'challenge' ? '⚔️' : getIcon()}</div>
            <div>
              <h3 className="font-bold text-lg">{getTitle()}</h3>
              <p className="text-sm text-white/80">{getDescription()}</p>
            </div>
          </div>
          <ShareButton content={getShareContent()} variant="secondary" size="sm" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
      {/* Header with gradient */}
      <div className={`bg-gradient-to-r ${getGradient()} p-8 text-white text-center`}>
        <div className="flex justify-center mb-4">{getIcon()}</div>
        <h2 className="text-3xl font-bold mb-2">{getTitle()}</h2>
        <p className="text-lg text-white/90">{getDescription()}</p>
      </div>

      {/* Body */}
      <div className="p-6">
        <div className="text-center mb-6">
          <p className="text-gray-600 mb-4">
            Share this achievement with your friends and inspire them to study with you!
          </p>
        </div>

        {/* Share Button */}
        <div className="flex justify-center">
          <ShareButton content={getShareContent()} size="lg" />
        </div>
      </div>

      {/* Footer with branding */}
      <div className="bg-gray-50 px-6 py-4 text-center border-t border-gray-200">
        <p className="text-sm text-gray-500">
          <span className="font-semibold text-purple-600">Varsity Tutors</span> - Study Together, Grow Together
        </p>
      </div>
    </div>
  );
}
