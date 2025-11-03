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
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {/* Student Login */}
          <button
            onClick={() => handleLogin(1, 'Student')}
            className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100 hover:border-purple-300 hover:-translate-y-2"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-purple-200 transition-colors">
                <BookOpenIcon className="w-10 h-10 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Student</h2>
              <p className="text-gray-600 mb-6">
                Access your courses, connect with tutors, and track your progress
              </p>
              <div className="w-full bg-purple-50 rounded-lg p-4 text-left">
                <p className="text-sm text-gray-700 mb-1">
                  <span className="font-semibold">Name:</span> {mockUsers[0].name}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Subject:</span> {mockUsers[0].subject}
                </p>
              </div>
              <div className="mt-6 px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold group-hover:bg-purple-700 transition-colors">
                Login as Student
              </div>
            </div>
          </button>

          {/* Parent Login */}
          <button
            onClick={() => handleLogin(2, 'Parent')}
            className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100 hover:border-teal-300 hover:-translate-y-2"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-teal-200 transition-colors">
                <UserGroupIcon className="w-10 h-10 text-teal-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Parent</h2>
              <p className="text-gray-600 mb-6">
                Monitor your child's progress and stay connected with their tutors
              </p>
              <div className="w-full bg-teal-50 rounded-lg p-4 text-left">
                <p className="text-sm text-gray-700 mb-1">
                  <span className="font-semibold">Name:</span> {mockUsers[1].name}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Role:</span> Parent Dashboard
                </p>
              </div>
              <div className="mt-6 px-6 py-3 bg-teal-600 text-white rounded-lg font-semibold group-hover:bg-teal-700 transition-colors">
                Login as Parent
              </div>
            </div>
          </button>

          {/* Tutor Login */}
          <button
            onClick={() => handleLogin(3, 'Tutor')}
            className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100 hover:border-purple-300 hover:-translate-y-2"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-teal-100 rounded-full flex items-center justify-center mb-6 group-hover:from-purple-200 group-hover:to-teal-200 transition-colors">
                <AcademicCapIcon className="w-10 h-10 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Tutor</h2>
              <p className="text-gray-600 mb-6">
                Manage your students, schedule sessions, and track learning outcomes
              </p>
              <div className="w-full bg-gradient-to-r from-purple-50 to-teal-50 rounded-lg p-4 text-left">
                <p className="text-sm text-gray-700 mb-1">
                  <span className="font-semibold">Name:</span> {mockUsers[2].name}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Subject:</span> {mockUsers[2].subject}
                </p>
              </div>
              <div className="mt-6 px-6 py-3 bg-gradient-to-r from-purple-600 to-teal-600 text-white rounded-lg font-semibold group-hover:from-purple-700 group-hover:to-teal-700 transition-colors">
                Login as Tutor
              </div>
            </div>
          </button>
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

        {/* Demo Flow Button */}
        <div className="max-w-4xl mx-auto mt-16 mb-16 text-center">
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
