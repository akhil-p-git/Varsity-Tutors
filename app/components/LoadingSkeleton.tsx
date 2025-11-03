'use client';

export function DashboardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-32 bg-gray-200 rounded-2xl mb-6"></div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded-xl"></div>
          ))}
        </div>
        <div className="space-y-4">
          <div className="h-48 bg-gray-200 rounded-xl"></div>
          <div className="h-32 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="animate-pulse bg-gray-200 rounded-xl h-32"></div>
  );
}

export function TableSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
      ))}
    </div>
  );
}

