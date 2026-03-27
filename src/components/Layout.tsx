import React from 'react';
import { Sidebar } from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar className="fixed inset-y-0 left-0 z-50 transition-all duration-300" />
      <main className="flex-1 ml-64 min-h-screen text-gray-900">
        <div className="max-w-[1200px] mx-auto p-10 pt-12">
          {children}
        </div>
      </main>
    </div>
  );
}
