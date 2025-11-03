'use client';

import { useState, useEffect } from 'react';
import { XMarkIcon, CommandLineIcon } from '@heroicons/react/24/outline';

export interface AgentLogEntry {
  timestamp: Date;
  agent: string;
  action: string;
  reason: string;
  status: 'triggered' | 'throttled' | 'blocked';
}

export function AgentDebugger() {
  const [isOpen, setIsOpen] = useState(false);
  const [logs, setLogs] = useState<AgentLogEntry[]>([]);

  useEffect(() => {
    // Listen for agent decisions
    const handleAgentDecision = (event: CustomEvent<AgentLogEntry>) => {
      setLogs((prev) => [event.detail, ...prev].slice(0, 50)); // Keep last 50
    };

    window.addEventListener('agent-decision' as any, handleAgentDecision as EventListener);

    return () => {
      window.removeEventListener('agent-decision' as any, handleAgentDecision as EventListener);
    };
  }, []);

  // Keyboard shortcut: 'A' to toggle
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'a' && (e.metaKey || e.ctrlKey)) {
        setIsOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 z-50 bg-gray-900 text-white p-3 rounded-full shadow-lg hover:bg-gray-800 transition-colors"
        title="Toggle Agent Debugger (Cmd/Ctrl + A)"
      >
        <CommandLineIcon className="w-5 h-5" />
      </button>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'triggered':
        return 'text-green-500';
      case 'throttled':
        return 'text-yellow-500';
      case 'blocked':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="fixed bottom-4 left-4 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-[600px] flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-teal-500 text-white p-4 rounded-t-xl flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CommandLineIcon className="w-5 h-5" />
          <h3 className="font-bold">Agent Debugger</h3>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="hover:bg-white/20 rounded-lg p-1 transition-colors"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Logs */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {logs.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p className="text-sm">No agent decisions yet</p>
            <p className="text-xs mt-2">Agent decisions will appear here</p>
          </div>
        ) : (
          logs.map((log, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-lg p-3 border border-gray-200 text-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-900">{log.agent}</span>
                <span className={`text-xs font-medium ${getStatusColor(log.status)}`}>
                  {log.status}
                </span>
              </div>
              <div className="text-gray-700 mb-1">{log.action}</div>
              <div className="text-xs text-gray-500">{log.reason}</div>
              <div className="text-xs text-gray-400 mt-1">
                {log.timestamp.toLocaleTimeString()}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 p-3 bg-gray-50 rounded-b-xl">
        <button
          onClick={() => setLogs([])}
          className="w-full px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium text-gray-700 transition-colors"
        >
          Clear Logs
        </button>
      </div>
    </div>
  );
}

/**
 * Log an agent decision
 */
export function logAgentDecision(entry: AgentLogEntry) {
  const event = new CustomEvent('agent-decision', { detail: entry });
  window.dispatchEvent(event);
}

