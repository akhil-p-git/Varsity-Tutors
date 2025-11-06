'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { mockUsers } from '@/lib/mock-auth';
import { toast } from 'sonner';
import { AcademicCapIcon, UserGroupIcon, BookOpenIcon, PlayIcon } from '@heroicons/react/24/outline';

export default function Home() {
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = (userId: number, role: string) => {
    login(userId);
    toast.success(`Logged in as ${role}`);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16 mt-20">
          <h1 className="text-6xl font-bold text-gray-900 mb-6 tracking-tight">
            Varsity Tutors
          </h1>
          <p className="text-3xl font-semibold text-purple-600 mb-4">
            Study Together, Grow Together
          </p>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mt-6">
            Connect students, parents, and tutors in a collaborative learning environment
            designed to help everyone succeed.
          </p>
        </div>

        {/* Login Cards */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Select a User to Login</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {mockUsers.map((user) => {
              const getRoleIcon = (role: string) => {
                switch (role) {
                  case 'student':
                    return <BookOpenIcon className="w-8 h-8 text-purple-600" />;
                  case 'parent':
                    return <UserGroupIcon className="w-8 h-8 text-teal-600" />;
                  case 'tutor':
                    return <AcademicCapIcon className="w-8 h-8 text-purple-600" />;
                  default:
                    return <BookOpenIcon className="w-8 h-8 text-purple-600" />;
                }
              };

              const getRoleColors = (role: string) => {
                switch (role) {
                  case 'student':
                    return {
                      border: 'hover:border-purple-300',
                      bg: 'bg-purple-100 group-hover:bg-purple-200',
                      badge: 'bg-purple-100 text-purple-700',
                      button: 'bg-purple-600 group-hover:bg-purple-700'
                    };
                  case 'parent':
                    return {
                      border: 'hover:border-teal-300',
                      bg: 'bg-teal-100 group-hover:bg-teal-200',
                      badge: 'bg-teal-100 text-teal-700',
                      button: 'bg-teal-600 group-hover:bg-teal-700'
                    };
                  case 'tutor':
                    return {
                      border: 'hover:border-indigo-300',
                      bg: 'bg-indigo-100 group-hover:bg-indigo-200',
                      badge: 'bg-indigo-100 text-indigo-700',
                      button: 'bg-indigo-600 group-hover:bg-indigo-700'
                    };
                  default:
                    return {
                      border: 'hover:border-purple-300',
                      bg: 'bg-purple-100 group-hover:bg-purple-200',
                      badge: 'bg-purple-100 text-purple-700',
                      button: 'bg-purple-600 group-hover:bg-purple-700'
                    };
                }
              };

              const colors = getRoleColors(user.role);

              return (
                <button
                  key={user.id}
                  onClick={() => handleLogin(user.id, user.role)}
                  className={`group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 ${colors.border} hover:-translate-y-1`}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className={`w-16 h-16 ${colors.bg} rounded-full flex items-center justify-center mb-4 transition-colors`}>
                      {getRoleIcon(user.role)}
                    </div>
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-16 h-16 rounded-full mb-3 border-2 border-gray-200"
                    />
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{user.name}</h3>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${colors.badge} mb-3 capitalize`}>
                      {user.role}
                    </span>
                    {user.subject && (
                      <p className="text-sm text-gray-600 mb-3">{user.subject}</p>
                    )}
                    <div className={`mt-auto w-full px-4 py-2 ${colors.button} text-white text-sm rounded-lg font-semibold transition-colors`}>
                      Login
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-4xl mx-auto mt-24 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Personalized Learning</h3>
              <p className="text-gray-600 text-sm">
                Tailored learning paths for every student
              </p>
            </div>
            <div className="p-6">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Collaborative Environment</h3>
              <p className="text-gray-600 text-sm">
                Connect students, parents, and tutors seamlessly
              </p>
            </div>
            <div className="p-6">
              <div className="text-4xl mb-4">📈</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Track Progress</h3>
              <p className="text-gray-600 text-sm">
                Monitor growth and celebrate achievements
              </p>
            </div>
          </div>
        </div>

        {/* Auth Actions */}
        <div className="max-w-4xl mx-auto mt-16 mb-8 text-center">
          <div className="bg-white rounded-xl shadow-lg p-6 inline-block border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-4">New to Varsity Tutors?</h3>
            <div className="flex gap-4">
              <a
                href="/register"
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-teal-600 text-white font-bold rounded-lg hover:from-purple-700 hover:to-teal-700 transition-all"
              >
                Create Account
              </a>
              <a
                href="/login"
                className="px-6 py-3 bg-white text-purple-600 font-bold rounded-lg border-2 border-purple-600 hover:bg-purple-50 transition-all"
              >
                Login
              </a>
            </div>
          </div>
        </div>

        {/* Demo Flow Button */}
        <div className="max-w-4xl mx-auto mt-8 mb-16 text-center">
          <a
            href="/demo"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-teal-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 text-lg"
          >
            <PlayIcon className="w-6 h-6" />
            Run Full Demo Flow
          </a>
          <p className="text-gray-600 text-sm mt-3">
            Watch the complete viral loop in action with automated walkthrough
          </p>
        </div>
      </div>
    </div>
  );
}
