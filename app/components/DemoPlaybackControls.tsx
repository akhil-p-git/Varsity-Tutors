'use client';

import { useStore } from '@/lib/store';
import { PlayIcon, PauseIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

// Import DEMO_STEPS from DemoRunner to keep them in sync
// This ensures the step list is always accurate
const DEMO_STEP_NAMES = [
  'Auto-login as Student (Alex)',
  'Show Dashboard',
  'Navigate to Practice Session',
  'Auto-complete Session (85% score)',
  'Show Results Page & Agent Decision',
  'Personalization Agent',
  'Auto-send Challenge to Friend',
  'Switch to Friend (Sarah/Jordan)',
  'Show Invite Notification',
  'Friend Accepts Challenge',
  'Friend Completes Session',
  'Voice Room Invite',
  'Both Join Voice Room',
  'Show Analytics Dashboard',
  'Show K-Factor',
];

export function DemoPlaybackControls() {
  const { demoState, setDemoState } = useStore();
  const router = useRouter();

  // Only show when demo is active
  if (!demoState) return null;

  const handlePause = () => {
    if (demoState.isPlaying) {
      setDemoState({
        ...demoState,
        isPlaying: false,
      });
    }
  };

  const handleResume = () => {
    setDemoState({
      ...demoState,
      isPlaying: true,
    });
  };

  const handleJumpToStep = (stepIndex: number) => {
    setDemoState({
      ...demoState,
      currentStep: stepIndex,
    });
  };

  const currentStep = demoState.currentStep;

  return (
    <div className="fixed top-20 right-4 z-40 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 max-w-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900">Demo Controls</h3>
        <span className="text-xs text-gray-500">
          Step {currentStep + 1} of {DEMO_STEP_NAMES.length}
        </span>
      </div>

      {/* Play/Pause Controls */}
      <div className="flex items-center gap-2 mb-4">
        {demoState.isPlaying ? (
          <button
            onClick={handlePause}
            className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            <PauseIcon className="w-4 h-4" />
            Pause
          </button>
        ) : (
          <button
            onClick={handleResume}
            className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            <PlayIcon className="w-4 h-4" />
            Resume
          </button>
        )}
      </div>

      {/* Jump to Step - Always Visible */}
      <div className="border-t border-gray-200 pt-3">
        <div className="text-sm font-semibold text-gray-700 mb-2">Jump to Step:</div>
        <div className="max-h-64 overflow-y-auto space-y-1">
          {DEMO_STEP_NAMES.map((stepName, index) => (
            <button
              key={`step-${index}`}
              onClick={() => handleJumpToStep(index)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                currentStep === index
                  ? 'bg-purple-100 text-purple-700 font-semibold'
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
              }`}
            >
              {index + 1}. {stepName}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

