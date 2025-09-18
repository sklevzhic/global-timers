'use client';

import { TimersPage } from '@/components';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-center">Multi Timer</h1>
        <TimersPage />
      </div>
    </main>
  );
}
