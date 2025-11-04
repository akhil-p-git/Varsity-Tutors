'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useStore } from '@/lib/store';
import { useAuth } from '@/lib/auth-context';
import { selectViralLoop, shouldTrigger, resetAgentTracking } from '@/lib/agents/orchestrator';
import { personalizeMessage } from '@/lib/agents/personalization';
import { logAgentDecision } from '@/app/components/AgentDebugger';
import { showRewardNotification } from '@/app/components/RewardNotification';
import { awardGems, REWARD_AMOUNTS } from '@/lib/rewards';
import { trackFunnelEvent } from '@/lib/smart-links';
import { mockUsers } from '@/lib/mock-auth';
import { toast } from 'sonner';

type DemoStep = {
  id: number;
  name: string;
  action: (router: ReturnType<typeof useRouter>, context: any) => void;
  narration: string;
  delay: number;
};

const DEMO_STEPS: DemoStep[] = [
  {
    id: 1,
    name: 'Auto-login as Student (Alex)',
    action: (router, { login }) => {
      login(1);
    },
    narration: 'Logging in as Alex Chen (Student)...',
    delay: 2000,
  },
  {
    id: 2,
    name: 'Show Dashboard',
    action: (router) => {
      router.push('/dashboard');
    },
    narration: 'Viewing dashboard with activity feed and quick actions...',
    delay: 3000,
  },
  {
    id: 3,
    name: 'Navigate to Practice Session',
    action: (router) => {
      // Skip showing practice UI - just auto-complete immediately
      // This prevents showing the same questions multiple times
      // The actual practice session will be auto-completed in step 4
    },
    narration: 'Preparing practice session...',
    delay: 1000,
  },
  {
    id: 4,
    name: 'Auto-complete Session (85% score)',
    action: (router, { addSession, updateRewards, rewards, user }) => {
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

      updateRewards({
        points: rewards.points + 170,
        streak: rewards.streak + 1,
      });

      awardGems(1, REWARD_AMOUNTS.sessionComplete, 'Session completed!');
      
      trackFunnelEvent('session_completed', {
        sessionId,
        score: 85,
        subject: 'Algebra',
      });
      
      const decision = shouldTrigger(1, 'buddy_challenge', 'session_completed');
      const loopType = selectViralLoop('session_completed', {
        userId: 1,
        event: 'session_completed',
        data: { score: 85 },
      });

      if (decision.shouldTrigger && loopType) {
        logAgentDecision({
          timestamp: new Date(),
          agent: 'Orchestrator',
          action: `Triggered: ${loopType}`,
          reason: `Score 85% > 70% threshold ✓, Daily limit not reached ✓`,
          status: 'triggered',
        });
      }

      router.push(`/session/${sessionId}/results`);
    },
    narration: 'Session completed with 85% score! Agent detected high score → triggering Buddy Challenge',
    delay: 3000,
  },
  {
    id: 5,
    name: 'Show Results Page & Agent Decision',
    action: () => {},
    narration: 'Agent logic: Score > 70% ✓, Daily limit not reached ✓ → Triggering Buddy Challenge',
    delay: 3000,
  },
  {
    id: 6,
    name: 'Personalization Agent',
    action: (router, { addAgentLog }) => {
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
    },
    narration: 'Personalization agent customized invite message based on high score',
    delay: 2000,
  },
  {
    id: 7,
    name: 'Auto-send Challenge to Friend',
    action: (router, { sendInvite }) => {
      const sessionId = `session-demo-${Date.now()}`;
      sendInvite({
        fromUserId: 1,
        fromUserName: 'Alex Chen',
        toUserId: 101,
        toUserName: 'Jordan Kim',
        subject: 'Algebra',
        sessionId,
        status: 'pending',
      });
      
      trackFunnelEvent('link_created', {
        sessionId,
        fromUserId: 1,
        toUserId: 101,
      });
      
      toast.success('Challenge sent to Jordan Kim!');
    },
    narration: 'Challenge sent! Tracking invite through smart link with UTM params',
    delay: 2000,
  },
  {
    id: 8,
    name: 'Switch to Friend (Sarah/Jordan)',
    action: (router, { login }) => {
      login(101);
    },
    narration: 'Switching to Jordan\'s view...',
    delay: 2000,
  },
  {
    id: 9,
    name: 'Show Invite Notification',
    action: (router) => {
      router.push('/invite?code=BUDDY_DEMO&from=Alex%20Chen&subject=Algebra&reward=50');
    },
    narration: 'Invite received! Jordan sees personalized challenge from Alex',
    delay: 3000,
  },
  {
    id: 10,
    name: 'Friend Accepts Challenge',
    action: (router, { awardGems }) => {
      awardGems(101, REWARD_AMOUNTS.inviteAccepted, 'Challenge accepted!');
      // Skip showing practice UI - auto-complete in next step
    },
    narration: 'Jordan accepts challenge and starts practice session...',
    delay: 2000,
  },
  {
    id: 11,
    name: 'Friend Completes Session',
    action: (router, { addSession, completeInviteByCode }) => {
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
      
      trackFunnelEvent('conversion', {
        inviteCode: 'BUDDY_DEMO',
        sessionId,
        userId: 101,
      });
      
      awardGems(1, REWARD_AMOUNTS.buddyChallenge, 'Challenge completed!');
      awardGems(101, REWARD_AMOUNTS.buddyChallenge, 'Challenge completed!');
      
      showRewardNotification({
        type: 'gems',
        amount: 50,
        message: '🎉 Challenge completed! You both earned 50 gems!',
        icon: '💎',
        isBig: true,
      });
    },
    narration: 'Conversion completed → both users rewarded! K-factor: 1 user → 1 new user = 1.0',
    delay: 3000,
  },
  {
    id: 12,
    name: 'Voice Room Invite',
    action: (router) => {
      router.push('/rooms');
    },
    narration: 'Agent triggers voice room invite: "12 friends in Algebra room"',
    delay: 2000,
  },
  {
    id: 13,
    name: 'Both Join Voice Room',
    action: (router, { activeRooms }) => {
      // Find the first Algebra room or use room-1
      const algebraRoom = activeRooms.find((r: any) => r.subject === 'Algebra') || activeRooms[0];
      if (algebraRoom) {
        router.push(`/rooms/${algebraRoom.roomId}`);
      } else {
        router.push('/rooms/room-1');
      }
    },
    narration: 'Both users join voice room. Real-time collaboration begins!',
    delay: 3000,
  },
  {
    id: 14,
    name: 'Show Analytics Dashboard',
    action: (router) => {
      router.push('/analytics');
    },
    narration: 'Analytics dashboard shows updated metrics: Invites sent, accepted, conversions. K-factor calculation displayed.',
    delay: 3000,
  },
  {
    id: 15,
    name: 'Show K-Factor',
    action: () => {},
    narration: 'K-factor: 1 user → 1 new user = 1.0. Viral loop complete!',
    delay: 2000,
  },
];

export function DemoRunner() {
  const router = useRouter();
  const pathname = usePathname();
  const { login, user } = useAuth();
  const { demoState, setDemoState, addSession, sendInvite, completeInviteByCode, updateRewards, rewards, addAgentLog } = useStore();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastExecutedStepRef = useRef<number>(-1);
  const isExecutingRef = useRef(false);
  const [lastPathname, setLastPathname] = useState<string>('');

  useEffect(() => {
    if (!demoState || !demoState.isPlaying) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      lastExecutedStepRef.current = -1;
      isExecutingRef.current = false;
      setLastPathname('');
      return;
    }

    // Only advance if pathname changed (navigation completed) or if we're on the same pathname
    // This prevents duplicate executions when the component re-renders
    const pathnameChanged = pathname !== lastPathname;
    const shouldAdvance = pathnameChanged || lastPathname === '';

    // Prevent re-executing the same step
    if (isExecutingRef.current || (!shouldAdvance && lastExecutedStepRef.current === demoState.currentStep)) {
      return;
    }

    setLastPathname(pathname);

    const executeStep = (stepIndex: number) => {
      if (stepIndex >= DEMO_STEPS.length) {
        setDemoState(null);
        lastExecutedStepRef.current = -1;
        isExecutingRef.current = false;
        toast.success('Demo complete! 🎉');
        return;
      }

      // Prevent duplicate execution
      if (lastExecutedStepRef.current >= stepIndex) {
        return;
      }

      const step = DEMO_STEPS[stepIndex];
      lastExecutedStepRef.current = stepIndex;
      isExecutingRef.current = true;

      // Update narration
      setDemoState({
        ...demoState,
        currentStep: stepIndex,
        narration: step.narration,
      });

      // Execute step action
      const { activeRooms } = useStore.getState();
      const context = {
        login,
        user,
        router,
        addSession,
        sendInvite,
        completeInviteByCode,
        updateRewards,
        rewards,
        addAgentLog,
        activeRooms,
        awardGems: (userId: number, amount: number, message: string) => {
          return awardGems(userId, amount, message);
        },
      };

      step.action(router, context);
      isExecutingRef.current = false;

      // Schedule next step
      timeoutRef.current = setTimeout(() => {
        const currentState = useStore.getState().demoState;
        if (currentState?.isPlaying && currentState.currentStep === stepIndex && lastExecutedStepRef.current === stepIndex) {
          // Only advance if we're still on the same step and haven't moved forward
          setDemoState({
            ...currentState,
            currentStep: stepIndex + 1,
          });
        }
      }, step.delay);
    };

    // Execute current step
    executeStep(demoState.currentStep);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [demoState?.isPlaying, demoState?.currentStep]); // Removed pathname dependency

  return null; // This component doesn't render anything
}

