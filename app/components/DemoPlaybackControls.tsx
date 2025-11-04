'use client';

import { useStore } from '@/lib/store';
import { PlayIcon, PauseIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

export function DemoPlaybackControls() {
  const { demoState, setDemoState } = useStore();
  const router = useRouter();

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

  const handleGoToDemo = () => {
    router.push('/demo');
  };

  return (
    <div className="fixed top-20 right-4 z-40 bg-white rounded-xl shadow-2xl border border-gray-200 p-3 flex items-center gap-2">
      <span className="text-sm font-semibold text-gray-700 mr-2">
        Demo: Step {demoState.currentStep + 1} of 15
      </span>
      {demoState.isPlaying ? (
        <button
          onClick={handlePause}
          className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
          title="Pause Demo"
        >
          <PauseIcon className="w-4 h-4" />
        </button>
      ) : (
        <button
          onClick={handleResume}
          className="p-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors"
          title="Resume Demo"
        >
          <PlayIcon className="w-4 h-4" />
        </button>
      )}
      <button
        onClick={handleGoToDemo}
        className="px-3 py-1 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        Controls
      </button>
    </div>
  );
}

