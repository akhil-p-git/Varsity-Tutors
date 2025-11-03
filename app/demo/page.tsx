'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useStore } from '@/lib/store';
import { selectViralLoop, shouldTrigger, resetAgentTracking } from '@/lib/agents/orchestrator';
import { personalizeMessage } from '@/lib/agents/personalization';
import { logAgentDecision } from '@/app/components/AgentDebugger';
import { showRewardNotification } from '@/app/components/RewardNotification';
import { awardGems, REWARD_AMOUNTS } from '@/lib/rewards';
import { trackFunnelEvent } from '@/lib/smart-links';
import { mockUsers } from '@/lib/mock-auth';
import { toast } from 'sonner';
import { PlayIcon, PauseIcon, ForwardIcon, XMarkIcon } from '@heroicons/react/24/outline';

type DemoStep = {
  id: number;
  name: string;
  action: () => void;
  narration: string;
  delay: number;
};

export default function DemoPage() {
  const router = useRouter();
  const { login, user } = useAuth();
  const { addSession, sendInvite, completeInviteByCode, updateRewards, rewards, addAgentLog } = useStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [narration, setNarration] = useState('');
  const [showNarration, setShowNarration] = useState(true);

  useEffect(() => {
    // Reset demo state on mount
    resetAgentTracking();
  }, []);

  const steps: DemoStep[] = [
    {
      id: 1,
      name: 'Auto-login as Student (Alex)',
      action: () => {
        login(1);
        setNarration('Logging in as Alex Chen (Student)...');
      },
      narration: 'Logging in as Alex Chen (Student)...',
      delay: 2000,
    },
    {
      id: 2,
      name: 'Show Dashboard',
      action: () => {
        router.push('/dashboard');
        setNarration('Viewing dashboard with activity feed and quick actions...');
      },
      narration: 'Viewing dashboard with activity feed and quick actions...',
      delay: 3000,
    },
    {
      id: 3,
      name: 'Navigate to Practice Session',
      action: () => {
        router.push('/session/practice?subject=Algebra');
        setNarration('Starting Algebra practice session...');
      },
      narration: 'Starting Algebra practice session...',
      delay: 2000,
    },
    {
      id: 4,
      name: 'Auto-complete Session (85% score)',
      action: () => {
        // Simulate completing session
        const sessionId = `session-demo-${Date.now()}`;
        addSession({
          sessionId,
          subject: 'Algebra',
          duration: 45,
          questionsAnswered: 20,
          correctAnswers: 17, // 85%
          skillsImproved: ['Linear Equations', 'Graphing'],
          timestamp: new Date(),
        });

        // Award rewards
        updateRewards({
          points: rewards.points + 170,
          streak: rewards.streak + 1,
        });

        awardGems(1, REWARD_AMOUNTS.sessionComplete, 'Session completed!');
        
        // Agent decision
        const decision = shouldTrigger(1, 'buddy_challenge', 'session_completed');
        const loopType = selectViralLoop('session_completed', {
          userId: 1,
          event: 'session_completed',
          data: { score: 85 },
        });

        if (decision.shouldTrigger && loopType) {
          addAgentLog({
            agent: 'Orchestrator',
            action: `Triggered: ${loopType}`,
            reason: `Score 85% > 70% threshold ✓, Daily limit not reached ✓`,
            status: 'triggered',
          });
          logAgentDecision({
            timestamp: new Date(),
            agent: 'Orchestrator',
            action: `Triggered: ${loopType}`,
            reason: `Score 85% > 70% threshold ✓, Daily limit not reached ✓`,
            status: 'triggered',
          });
        }

        router.push(`/session/${sessionId}/results`);
        setNarration('Session completed with 85% score! Agent detected high score → triggering Buddy Challenge');
      },
      narration: 'Session completed with 85% score! Agent detected high score → triggering Buddy Challenge',
      delay: 3000,
    },
    {
      id: 5,
      name: 'Show Results Page & Agent Decision',
      action: () => {
        setNarration('Agent logic: Score > 70% ✓, Daily limit not reached ✓ → Triggering Buddy Challenge');
      },
      narration: 'Agent logic: Score > 70% ✓, Daily limit not reached ✓ → Triggering Buddy Challenge',
      delay: 3000,
    },
    {
      id: 6,
      name: 'Personalization Agent',
      action: () => {
        const personalized = personalizeMessage('buddy_challenge', {
          user: mockUsers[0],
          subject: 'Algebra',
          score: 85,
          performanceLevel: 'high',
        });
        addAgentLog({
          agent: 'Personalization',
          action: 'Selected template: high_achiever_student',
          reason: personalized,
          status: 'triggered',
        });
        logAgentDecision({
          timestamp: new Date(),
          agent: 'Personalization',
          action: 'Selected template: high_achiever_student',
          reason: personalized,
          status: 'triggered',
        });
        setNarration('Personalization agent customized invite message based on high score');
      },
      narration: 'Personalization agent customized invite message based on high score',
      delay: 2000,
    },
    {
      id: 7,
      name: 'Auto-send Challenge to Friend',
      action: () => {
        // Send invite to friend
        sendInvite({
          fromUserId: 1,
          fromUserName: 'Alex Chen',
          toUserId: 101, // Jordan Kim
          toUserName: 'Jordan Kim',
          subject: 'Algebra',
          sessionId: `session-demo-${Date.now()}`,
          status: 'pending',
        });
        toast.success('Challenge sent to Jordan Kim!');
        setNarration('Challenge sent! Tracking invite through smart link with UTM params');
      },
      narration: 'Challenge sent! Tracking invite through smart link with UTM params',
      delay: 2000,
    },
    {
      id: 8,
      name: 'Switch to Friend (Sarah/Jordan)',
      action: () => {
        login(101); // Switch to friend (using mock friend ID)
        setNarration('Switching to Jordan\'s view...');
      },
      narration: 'Switching to Jordan\'s view...',
      delay: 2000,
    },
    {
      id: 9,
      name: 'Show Invite Notification',
      action: () => {
        router.push('/invite?code=BUDDY_DEMO&from=Alex%20Chen&subject=Algebra&reward=50');
        setNarration('Invite received! Jordan sees personalized challenge from Alex');
      },
      narration: 'Invite received! Jordan sees personalized challenge from Alex',
      delay: 3000,
    },
    {
      id: 10,
      name: 'Friend Accepts Challenge',
      action: () => {
        awardGems(101, REWARD_AMOUNTS.inviteAccepted, 'Challenge accepted!');
        router.push('/session/practice?subject=Algebra&invite=BUDDY_DEMO');
        setNarration('Jordan accepts challenge and starts practice session...');
      },
      narration: 'Jordan accepts challenge and starts practice session...',
      delay: 3000,
    },
    {
      id: 11,
      name: 'Friend Completes Session',
      action: () => {
        const sessionId = `session-friend-${Date.now()}`;
        addSession({
          sessionId,
          subject: 'Algebra',
          duration: 40,
          questionsAnswered: 20,
          correctAnswers: 16, // 80%
          skillsImproved: ['Linear Equations'],
          timestamp: new Date(),
        });

        completeInviteByCode('BUDDY_DEMO');
        
        // Track conversion
        trackFunnelEvent('conversion', {
          inviteCode: 'BUDDY_DEMO',
          sessionId,
          userId: 101,
        });
        
        // Both get rewards
        awardGems(1, REWARD_AMOUNTS.buddyChallenge, 'Challenge completed!');
        awardGems(101, REWARD_AMOUNTS.buddyChallenge, 'Challenge completed!');
        
        showRewardNotification({
          type: 'gems',
          amount: 50,
          message: '🎉 Challenge completed! You both earned 50 gems!',
          icon: '💎',
          isBig: true,
        });

        setNarration('Conversion completed → both users rewarded! K-factor: 1 user → 1 new user = 1.0');
      },
      narration: 'Conversion completed → both users rewarded! K-factor: 1 user → 1 new user = 1.0',
      delay: 3000,
    },
    {
      id: 12,
      name: 'Voice Room Invite',
      action: () => {
        router.push('/rooms');
        setNarration('Agent triggers voice room invite: "12 friends in Algebra room"');
      },
      narration: 'Agent triggers voice room invite: "12 friends in Algebra room"',
      delay: 2000,
    },
    {
      id: 13,
      name: 'Both Join Voice Room',
      action: () => {
        router.push('/rooms/room-1');
        setNarration('Both users join voice room. Real-time collaboration begins!');
      },
      narration: 'Both users join voice room. Real-time collaboration begins!',
      delay: 3000,
    },
    {
      id: 14,
      name: 'Show Analytics Dashboard',
      action: () => {
        router.push('/analytics');
        setNarration('Analytics dashboard shows updated metrics: Invites sent, accepted, conversions. K-factor calculation displayed.');
      },
      narration: 'Analytics dashboard shows updated metrics: Invites sent, accepted, conversions. K-factor calculation displayed.',
      delay: 3000,
    },
    {
      id: 15,
      name: 'Show K-Factor',
      action: () => {
        setNarration('K-factor: 1 user → 1 new user = 1.0. Viral loop complete!');
      },
      narration: 'K-factor: 1 user → 1 new user = 1.0. Viral loop complete!',
      delay: 2000,
    },
  ];

  const startDemo = () => {
    setIsPlaying(true);
    executeStep(0);
  };

  const executeStep = (stepIndex: number) => {
    if (stepIndex >= steps.length) {
      setIsPlaying(false);
      toast.success('Demo complete! 🎉');
      return;
    }

    const step = steps[stepIndex];
    setCurrentStep(stepIndex);
    step.action();

    setTimeout(() => {
      if (isPlaying) {
        executeStep(stepIndex + 1);
      }
    }, step.delay);
  };

  const pauseDemo = () => {
    setIsPlaying(false);
  };

  const skipToStep = (stepIndex: number) => {
    setCurrentStep(stepIndex);
    steps[stepIndex].action();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50">
      {/* Narration Overlay */}
      {showNarration && narration && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-black/80 text-white px-6 py-4 rounded-xl shadow-2xl max-w-2xl animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <p className="font-medium">{narration}</p>
          </div>
        </div>
      )}

      {/* Demo Controls */}
      <div className="fixed top-4 right-4 z-50 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900">Demo Controls</h3>
          <button
            onClick={() => setShowNarration(!showNarration)}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            {showNarration ? 'Hide' : 'Show'} Narration
          </button>
        </div>

        <div className="space-y-3">
          {!isPlaying ? (
            <button
              onClick={startDemo}
              className="w-full bg-gradient-to-r from-purple-600 to-teal-600 text-white font-bold py-3 px-4 rounded-lg hover:from-purple-700 hover:to-teal-700 transition-all flex items-center justify-center gap-2"
            >
              <PlayIcon className="w-5 h-5" />
              Start Demo
            </button>
          ) : (
            <button
              onClick={pauseDemo}
              className="w-full bg-red-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-700 transition-all flex items-center justify-center gap-2"
            >
              <PauseIcon className="w-5 h-5" />
              Pause Demo
            </button>
          )}

          <div className="border-t border-gray-200 pt-3">
            <div className="text-sm font-semibold text-gray-700 mb-2">Jump to Step:</div>
            <div className="max-h-48 overflow-y-auto space-y-1">
              {steps.map((step, index) => (
                <button
                  key={step.id}
                  onClick={() => skipToStep(index)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    currentStep === index
                      ? 'bg-purple-100 text-purple-700 font-semibold'
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  {index + 1}. {step.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-white rounded-xl shadow-2xl border border-gray-200 px-6 py-3">
        <div className="flex items-center gap-4">
          <div className="text-sm font-semibold text-gray-700">
            Step {currentStep + 1} of {steps.length}
          </div>
          <div className="w-48 bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-500 to-teal-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Demo Content Area */}
      <div className="pt-20 pb-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Automated Demo Flow</h1>
          <p className="text-lg text-gray-600 mb-8">
            Watch the complete viral loop in action
          </p>
        </div>
      </div>
    </div>
  );
}

