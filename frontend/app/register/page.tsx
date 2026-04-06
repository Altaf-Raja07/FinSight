'use client';

import { useRouter } from 'next/navigation';
import { AuthLayout } from '@/components/auth/auth-layout';
import { RegisterForm } from '@/components/auth/register-form';

export default function RegisterPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push('/dashboard');
  };

  return (
    <AuthLayout
      title="Create an account"
      subtitle="Get started with your free FinanceFlow account"
    >
      <RegisterForm onSuccess={handleSuccess} />
    </AuthLayout>
  );
}
