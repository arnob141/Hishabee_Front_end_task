'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function Home() {
  const { user, isAuthenticated, isInitialized } = useAuthStore();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && isInitialized) {
      if (isAuthenticated && user) {
        if (user.role === 'PATIENT') {
          router.push('/patient/dashboard');
        } else if (user.role === 'DOCTOR') {
          router.push('/doctor/dashboard');
        }
      } else {
        router.push('/login');
      }
    }
  }, [isAuthenticated, user, router, isClient, isInitialized]);

  if (!isClient || !isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner className="w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner className="w-8 h-8" />
    </div>
  );
}