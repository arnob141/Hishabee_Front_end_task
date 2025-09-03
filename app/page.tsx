'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function Home() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'PATIENT') {
        router.push('/patient/dashboard');
      } else if (user.role === 'DOCTOR') {
        router.push('/doctor/dashboard');
      }
    } else {
      router.push('/login');
    }
  }, [isAuthenticated, user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner className="w-8 h-8" />
    </div>
  );
}