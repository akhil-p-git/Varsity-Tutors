'use client';

import { useState } from 'react';
import { ShareIcon } from '@heroicons/react/24/outline';
import { ShareContent, shareToPlatform } from '@/lib/social-share';
import { toast } from 'sonner';

interface ShareButtonProps {
  content: ShareContent;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'ghost';
  showMenu?: boolean;
}

export function ShareButton({ content, size = 'md', variant = 'primary', showMenu = true }: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const variantClasses = {
    primary: 'bg-gradient-to-r from-purple-600 to-teal-600 text-white hover:from-purple-700 hover:to-teal-700',
    secondary: 'bg-white text-purple-600 border-2 border-purple-600 hover:bg-purple-50',
    ghost: 'bg-transparent text-gray-600 hover:bg-gray-100',
  };

  const handleShare = async (platform: 'twitter' | 'facebook' | 'linkedin' | 'native') => {
    shareToPlatform(platform, content);
    setIsOpen(false);
    toast.success(`Shared to ${platform.charAt(0).toUpperCase() + platform.slice(1)}!`);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(content.url);
    toast.success('Link copied to clipboard!');
    setIsOpen(false);
  };

  if (!showMenu) {
    return (
      <button
        onClick={() => handleShare('native')}
        className={`${sizeClasses[size]} ${variantClasses[variant]} font-semibold rounded-lg transition-all flex items-center gap-2`}
      >
        <ShareIcon className="w-5 h-5" />
        Share
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${sizeClasses[size]} ${variantClasses[variant]} font-semibold rounded-lg transition-all flex items-center gap-2`}
      >
        <ShareIcon className="w-5 h-5" />
        Share
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
            <div className="p-3 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-sm">Share this</h3>
            </div>

            <div className="p-2">
              {/* Twitter */}
              <button
                onClick={() => handleShare('twitter')}
                className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 rounded-lg transition-colors text-left"
              >
                <div className="w-10 h-10 bg-[#1DA1F2] rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">Twitter (X)</div>
                  <div className="text-xs text-gray-500">Share on X</div>
                </div>
              </button>

              {/* Facebook */}
              <button
                onClick={() => handleShare('facebook')}
                className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 rounded-lg transition-colors text-left"
              >
                <div className="w-10 h-10 bg-[#1877F2] rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">Facebook</div>
                  <div className="text-xs text-gray-500">Share on Facebook</div>
                </div>
              </button>

              {/* LinkedIn */}
              <button
                onClick={() => handleShare('linkedin')}
                className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 rounded-lg transition-colors text-left"
              >
                <div className="w-10 h-10 bg-[#0A66C2] rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">LinkedIn</div>
                  <div className="text-xs text-gray-500">Share on LinkedIn</div>
                </div>
              </button>

              {/* Copy Link */}
              <button
                onClick={handleCopyLink}
                className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 rounded-lg transition-colors text-left border-t border-gray-100 mt-2 pt-3"
              >
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">Copy Link</div>
                  <div className="text-xs text-gray-500">Copy to clipboard</div>
                </div>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
