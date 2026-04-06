'use client';

import { useRouter } from 'next/navigation';
import { AuthLayout } from '@/components/auth/auth-layout';
import { LoginForm } from '@/components/auth/login-form';

export default function LoginPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push('/dashboard');
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Enter your credentials to access your dashboard"
    >
      <LoginForm onSuccess={handleSuccess} />
    </AuthLayout>
  );
}
