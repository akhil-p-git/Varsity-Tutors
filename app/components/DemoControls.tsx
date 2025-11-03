'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useStore } from '@/lib/store';
import { resetAgentTracking } from '@/lib/agents/orchestrator';
import { mockUsers } from '@/lib/mock-auth';
import { toast } from 'sonner';
import {
  ArrowPathIcon,
  UserIcon,
  CommandLineIcon,
  BoltIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

export function DemoControls() {
  const router = useRouter();
  const { user, login } = useAuth();
  const { setActiveRooms, setCurrentRoom } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [showAgentDebugger, setShowAgentDebugger] = useState(false);

  // Only show in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      return;
    }
  }, []);

  // Keyboard shortcut: 'D' to toggle
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'd' && (e.metaKey || e.ctrlKey)) {
        setIsOpen((prev) => !prev);
      }
      // 'A' for agent debugger
      if (e.key === 'a' && (e.metaKey || e.ctrlKey)) {
        setShowAgentDebugger((prev) => !prev);
      }
      // '1/2/3' for user switching
      if (e.key === '1' && (e.metaKey || e.ctrlKey)) {
        login(1);
        toast.success('Switched to Alex Chen (Student)');
      }
      if (e.key === '2' && (e.metaKey || e.ctrlKey)) {
        login(2);
        toast.success('Switched to Maria Rodriguez (Parent)');
      }
      if (e.key === '3' && (e.metaKey || e.ctrlKey)) {
        login(3);
        toast.success('Switched to Dr. Smith (Tutor)');
      }
      // 'R' for reset
      if (e.key === 'r' && (e.metaKey || e.ctrlKey)) {
        handleReset();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [login]);

  const handleReset = () => {
    resetAgentTracking();
    setActiveRooms([]);
    setCurrentRoom(null);
    router.push('/');
    toast.success('Demo state reset!');
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 z-50 bg-gray-900 text-white p-3 rounded-full shadow-lg hover:bg-gray-800 transition-colors"
        title="Toggle Demo Controls (Cmd/Ctrl + D)"
      >
        <BoltIcon className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-white rounded-xl shadow-2xl border border-gray-200 w-80">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-teal-500 text-white p-4 rounded-t-xl flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BoltIcon className="w-5 h-5" />
          <h3 className="font-bold">Demo Controls</h3>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="hover:bg-white/20 rounded-lg p-1 transition-colors"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Reset */}
        <button
          onClick={handleReset}
          className="w-full flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 font-semibold rounded-lg transition-colors"
        >
          <ArrowPathIcon className="w-5 h-5" />
          Reset All Data
        </button>

        {/* User Switching */}
        <div className="border-t border-gray-200 pt-3">
          <div className="text-sm font-semibold text-gray-700 mb-2">Switch User:</div>
          <div className="grid grid-cols-3 gap-2">
            {mockUsers.map((mockUser) => (
              <button
                key={mockUser.id}
                onClick={() => {
                  login(mockUser.id);
                  toast.success(`Switched to ${mockUser.name} (${mockUser.role})`);
                }}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  user?.id === mockUser.id
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {mockUser.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="border-t border-gray-200 pt-3">
          <div className="text-sm font-semibold text-gray-700 mb-2">Quick Actions:</div>
          <div className="space-y-2">
            <button
              onClick={() => {
                router.push('/dashboard');
                toast.info('Navigated to dashboard');
              }}
              className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm"
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => {
                router.push('/rooms');
                toast.info('Navigated to rooms');
              }}
              className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm"
            >
              Go to Rooms
            </button>
            <button
              onClick={() => {
                router.push('/demo');
                toast.info('Starting demo flow');
              }}
              className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm"
            >
              Run Demo Flow
            </button>
          </div>
        </div>

        {/* Keyboard Shortcuts */}
        <div className="border-t border-gray-200 pt-3">
          <div className="text-xs text-gray-600 space-y-1">
            <div><kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Cmd/Ctrl + D</kbd> Toggle controls</div>
            <div><kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Cmd/Ctrl + A</kbd> Agent debugger</div>
            <div><kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Cmd/Ctrl + 1/2/3</kbd> Switch user</div>
            <div><kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Cmd/Ctrl + R</kbd> Reset</div>
          </div>
        </div>
      </div>
    </div>
  );
}

