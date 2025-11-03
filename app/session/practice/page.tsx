'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useStore } from '@/lib/store';
import { awardGems, checkStreak, checkLevelUp, REWARD_AMOUNTS } from '@/lib/rewards';
import { showRewardNotification } from '@/app/components/RewardNotification';
import { trackFunnelEvent } from '@/lib/smart-links';
import { toast } from 'sonner';
import { ClockIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { Confetti } from '@/app/components/Confetti';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

const mockQuestions: Question[] = [
  {
    id: 1,
    question: 'What is the solution to 2x + 5 = 15?',
    options: ['x = 5', 'x = 10', 'x = 7.5', 'x = 3'],
    correctAnswer: 0,
  },
  {
    id: 2,
    question: 'What is the slope of the line y = 3x + 2?',
    options: ['2', '3', '5', '1'],
    correctAnswer: 1,
  },
  {
    id: 3,
    question: 'Solve for x: 3x - 7 = 14',
    options: ['x = 7', 'x = 21', 'x = 9', 'x = 3'],
    correctAnswer: 0,
  },
  {
    id: 4,
    question: 'What is the y-intercept of y = -2x + 8?',
    options: ['-2', '8', '4', '0'],
    correctAnswer: 1,
  },
  {
    id: 5,
    question: 'Simplify: 2(x + 3) - 4',
    options: ['2x + 2', '2x + 6', '2x - 1', '2x + 10'],
    correctAnswer: 0,
  },
];

function PracticeSessionPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { addSession, completeInvite, completeInviteByCode, updateRewards, rewards } = useStore();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
  const [isComplete, setIsComplete] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [inviteCode, setInviteCode] = useState<string | null>(null);

  const subject = searchParams.get('subject') || 'Algebra';
  const invite = searchParams.get('invite');

  useEffect(() => {
    if (invite) {
      setInviteCode(invite);
    }

    if (!isAuthenticated) {
      toast.error('Please log in to practice');
      router.push('/');
      return;
    }

    // Timer countdown
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isAuthenticated, router, invite]);

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < mockQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(answers[currentQuestion + 1] ?? null);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (!user) return;
    
    setIsComplete(true);
    
    // Calculate score
    let correctAnswers = 0;
    mockQuestions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });

    // Create session record
    const sessionId = `session-${Date.now()}`;
    const newSession = {
      sessionId,
      subject,
      duration: Math.floor((120 - timeLeft) / 60),
      questionsAnswered: mockQuestions.length,
      correctAnswers,
      skillsImproved: correctAnswers >= 4 
        ? ['Linear Equations', 'Graphing', 'Problem Solving']
        : correctAnswers >= 3
        ? ['Linear Equations', 'Problem Solving']
        : ['Problem Solving'],
      timestamp: new Date(),
    };

    addSession(newSession);

    // Award session completion reward
    const previousPoints = rewards.points;
    const previousStreak = rewards.streak;
    
    // Update points
    updateRewards({
      points: rewards.points + correctAnswers * 10,
      streak: rewards.streak + 1, // Increment streak
    });

    // Award session completion gems
    const sessionReward = awardGems(user.id, REWARD_AMOUNTS.sessionComplete, 'Session completed!');
    showRewardNotification(sessionReward);

    // Check for streak milestone
    const streakReward = checkStreak(user.id, previousStreak + 1);
    if (streakReward) {
      showRewardNotification(streakReward);
    }

    // Check for level up
    const levelUpReward = checkLevelUp(user.id, previousPoints, rewards.points + correctAnswers * 10);
    if (levelUpReward) {
      showRewardNotification(levelUpReward);
    }

    // Check if this was from an invite
    if (inviteCode) {
      // Complete the invite by code
      completeInviteByCode(inviteCode);
      
      // Award buddy challenge reward
      const challengeReward = awardGems(user.id, REWARD_AMOUNTS.buddyChallenge, 'Challenge completed!');
      showRewardNotification(challengeReward);
      
      // Track conversion
      trackFunnelEvent('conversion', {
        inviteCode,
        sessionId: sessionId,
        userId: user.id,
      });
      
      // Show celebration
      setShowConfetti(true);
    }

    setShowResults(true);
    
    // Redirect to results page after a short delay
    setTimeout(() => {
      router.push(`/session/${sessionId}/results`);
    }, 3000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (showResults) {
    const correctAnswers = mockQuestions.filter(
      (q, i) => answers[i] === q.correctAnswer
    ).length;
    const accuracy = Math.round((correctAnswers / mockQuestions.length) * 100);

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50 flex items-center justify-center">
        {showConfetti && <Confetti />}
        <div className="text-center p-8 bg-white rounded-2xl shadow-2xl max-w-md mx-4">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Session Complete!</h2>
          <div className="text-5xl font-bold text-purple-600 mb-2">
            {correctAnswers}/{mockQuestions.length}
          </div>
          <div className="text-2xl font-semibold text-gray-700 mb-6">
            {accuracy}% Accuracy
          </div>
          {inviteCode && (
            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-4 mb-6 border-2 border-amber-200">
              <div className="text-2xl mb-2">🎁</div>
              <div className="font-semibold text-amber-900">
                You both earned 50 gems!
              </div>
            </div>
          )}
          <p className="text-gray-600">Redirecting to results page...</p>
        </div>
      </div>
    );
  }

  const question = mockQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / mockQuestions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{subject} Practice</h1>
              <p className="text-gray-600">Question {currentQuestion + 1} of {mockQuestions.length}</p>
            </div>
            <div className="flex items-center gap-2 bg-red-50 px-4 py-2 rounded-lg border border-red-200">
              <ClockIcon className="w-5 h-5 text-red-600" />
              <span className="font-bold text-red-600">{formatTime(timeLeft)}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-500 to-teal-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {question.question}
          </h2>

          <div className="space-y-3">
            {question.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = index === question.correctAnswer;
              const showAnswer = isComplete;

              return (
                <button
                  key={index}
                  onClick={() => !isComplete && handleAnswerSelect(index)}
                  disabled={isComplete}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    isSelected
                      ? showAnswer && isCorrect
                        ? 'bg-green-50 border-green-500 text-green-900'
                        : showAnswer && !isCorrect
                        ? 'bg-red-50 border-red-500 text-red-900'
                        : 'bg-purple-50 border-purple-500 text-purple-900'
                      : 'bg-gray-50 border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                  } ${isComplete ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        isSelected
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="flex-1">{option}</span>
                    {showAnswer && isCorrect && (
                      <CheckCircleIcon className="w-6 h-6 text-green-600" />
                    )}
                    {showAnswer && isSelected && !isCorrect && (
                      <XCircleIcon className="w-6 h-6 text-red-600" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-4">
          {currentQuestion > 0 && (
            <button
              onClick={() => {
                setCurrentQuestion(currentQuestion - 1);
                setSelectedAnswer(answers[currentQuestion - 1] ?? null);
              }}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-4 px-6 rounded-xl transition-colors"
            >
              Previous
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={selectedAnswer === null}
            className="flex-1 bg-gradient-to-r from-purple-600 to-teal-600 text-white font-bold py-4 px-6 rounded-xl hover:from-purple-700 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {currentQuestion === mockQuestions.length - 1 ? 'Submit' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PracticeSessionPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading practice session...</p>
          </div>
        </div>
      }
    >
      <PracticeSessionPageContent />
    </Suspense>
  );
}

