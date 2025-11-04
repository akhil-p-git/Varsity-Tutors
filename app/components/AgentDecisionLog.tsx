'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { SparklesIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';

export function AgentDecisionLog() {
  const { agentLogs } = useStore();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'a') {
        event.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Filter AI agent logs
  const aiLogs = agentLogs.filter(log => 
    log.agent.toLowerCase().includes('ai') || 
    log.agent.toLowerCase().includes('orchestrator')
  );

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 z-50 p-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all text-xs font-semibold flex items-center gap-2"
        title="Open AI Agent Decision Log (Cmd/Ctrl + A)"
      >
        <SparklesIcon className="w-4 h-4" />
        AI Agent Log
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 w-96 h-[500px] bg-gray-900 text-white rounded-xl shadow-2xl border border-gray-700 flex flex-col animate-slide-in-left">
      <div className="flex justify-between items-center p-4 border-b border-gray-700 bg-gradient-to-r from-indigo-900 to-purple-900">
        <div className="flex items-center gap-2">
          <SparklesIcon className="w-5 h-5" />
          <h3 className="font-bold text-sm">AI Agent Decision Log</h3>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors">
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto text-xs p-4 space-y-3 scrollbar-hide">
        {aiLogs.length === 0 && (
          <div className="text-center mt-8 text-gray-500">
            <SparklesIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No AI agent decisions yet.</p>
            <p className="text-[10px] mt-2">Complete a session to see AI analysis!</p>
          </div>
        )}
        
        {aiLogs.map((log, index) => (
          <div
            key={index}
            className={clsx(
              'p-3 rounded-lg border-l-4 transition-all',
              {
                'bg-green-900/30 border-green-500 text-green-200': log.status === 'triggered',
                'bg-yellow-900/30 border-yellow-500 text-yellow-200': log.status === 'throttled',
                'bg-red-900/30 border-red-500 text-red-200': log.status === 'blocked',
                'bg-blue-900/30 border-blue-500 text-blue-200': log.status === 'no_action',
                'bg-indigo-900/30 border-indigo-500 text-indigo-200': !log.status || log.status === 'analyzing',
              }
            )}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="font-semibold text-sm">{log.agent}</div>
              <div className="text-[10px] text-gray-400 ml-2">
                {new Date(log.timestamp).toLocaleTimeString()}
              </div>
            </div>
            
            <div className="font-medium mb-1 text-xs">{log.action}</div>
            
            <div className="text-gray-300 text-[11px] mt-2 leading-relaxed">
              {log.reason}
            </div>
            
            <div className="mt-2 pt-2 border-t border-white/10">
              <span className={clsx(
                'text-[10px] px-2 py-1 rounded-full font-semibold',
                {
                  'bg-green-500/20 text-green-300': log.status === 'triggered',
                  'bg-yellow-500/20 text-yellow-300': log.status === 'throttled',
                  'bg-red-500/20 text-red-300': log.status === 'blocked',
                  'bg-blue-500/20 text-blue-300': log.status === 'no_action',
                  'bg-indigo-500/20 text-indigo-300': !log.status || log.status === 'analyzing',
                }
              )}>
                {log.status?.toUpperCase() || 'PENDING'}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-3 border-t border-gray-700 bg-gray-800/50 text-[10px] text-gray-400 text-center">
        Press Cmd/Ctrl + A to toggle • {aiLogs.length} AI decisions logged
      </div>
    </div>
  );
}

