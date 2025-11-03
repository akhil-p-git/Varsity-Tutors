'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useStore } from '@/lib/store';
import { toast } from 'sonner';
import {
  HomeIcon,
  UserGroupIcon,
  TrophyIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { SparklesIcon } from '@heroicons/react/24/solid';

export function Navigation() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { rewards } = useStore();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  if (!user) return null;

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: HomeIcon },
    { name: 'Rooms', path: '/rooms', icon: UserGroupIcon },
    { name: 'Leaderboard', path: '/leaderboard', icon: TrophyIcon },
    { name: 'Profile', path: '/profile', icon: UserIcon },
  ];

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    router.push('/');
  };

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname?.startsWith(path);
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-teal-500 rounded-lg flex items-center justify-center">
              <SparklesIcon className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900">Varsity Tutors</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => router.push(item.path)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors ${
                    isActive(item.path)
                      ? 'bg-purple-100 text-purple-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </button>
              );
            })}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Gems */}
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-50 to-teal-50 rounded-lg border border-purple-200">
              <span className="text-2xl">💎</span>
              <span className="font-bold text-purple-600">{rewards.gems}</span>
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-teal-400 flex items-center justify-center text-white font-bold">
                  {user.name.charAt(0)}
                </div>
                <span className="hidden md:block font-semibold text-gray-900">{user.name}</span>
              </button>

              {showUserMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-20">
                    <button
                      onClick={() => {
                        router.push('/profile');
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700 font-medium"
                    >
                      Profile
                    </button>
                    <button
                      onClick={() => {
                        router.push('/analytics');
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700 font-medium"
                    >
                      Analytics
                    </button>
                    <hr className="my-2 border-gray-200" />
                    <button
                      onClick={() => {
                        handleLogout();
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 font-medium"
                    >
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {showMobileMenu ? (
                <XMarkIcon className="w-6 h-6 text-gray-700" />
              ) : (
                <Bars3Icon className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.path}
                    onClick={() => {
                      router.push(item.path);
                      setShowMobileMenu(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                      isActive(item.path)
                        ? 'bg-purple-100 text-purple-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.name}
                  </button>
                );
              })}
              <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-50 to-teal-50 rounded-lg border border-purple-200">
                <span className="text-2xl">💎</span>
                <span className="font-bold text-purple-600">{rewards.gems}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

