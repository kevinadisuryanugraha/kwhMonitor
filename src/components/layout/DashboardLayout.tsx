import type { ReactNode } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="max-w-6xl mx-auto w-full min-h-screen flex flex-col gap-4 sm:gap-5 p-3 sm:p-5 lg:p-6">
      {children}
    </div>
  );
}
