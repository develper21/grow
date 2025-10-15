import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Layout from '@/components/Layout';
import CommissionDashboard from '@/components/CommissionDashboard';

export default function SellerDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push('/signin');
      return;
    }

    if (session.user?.role !== 'seller') {
      router.push('/');
      return;
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session || session.user?.role !== 'seller') {
    return null;
  }

  return (
    <Layout>
      <CommissionDashboard userRole="seller" />
    </Layout>
  );
}
