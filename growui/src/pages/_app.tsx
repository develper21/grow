import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { SessionProvider } from 'next-auth/react';
import { theme } from '@/theme/theme';
import Layout from '@/components/Layout';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { OnboardingProvider } from '@/context/OnboardingContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { OrdersProvider } from '@/context/OrdersContext';

// List of routes that should use the DashboardLayout
const DASHBOARD_ROUTES = [
  '/dashboard',
  '/orders',
  '/portfolio',
  '/watchlist',
  '/funds',
  '/statements',
  '/compliance',
  '/support',
  '/profile',
  '/admin',
  '/seller',
  '/customer',
  '/company-head'
];

// Add page title based on route
const getPageTitle = (pathname: string) => {
  const path = pathname.split('/')[1];
  if (!path) return 'Dashboard';
  
  return path.charAt(0).toUpperCase() + path.slice(1);
};

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const router = useRouter();
  const isDashboardRoute = DASHBOARD_ROUTES.some(route => 
    router.pathname.startsWith(route)
  );

  // Set page title based on route if not provided in pageProps
  if (!pageProps.title && router.pathname !== '/') {
    pageProps.title = getPageTitle(router.pathname);
  }

  return (
    <SessionProvider session={session}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <NotificationProvider>
          <OnboardingProvider>
            <OrdersProvider>
              {isDashboardRoute ? (
                <DashboardLayout title={pageProps.title}>
                  <Component {...pageProps} />
                </DashboardLayout>
              ) : (
                <Layout>
                  <Component {...pageProps} />
                </Layout>
              )}
            </OrdersProvider>
          </OnboardingProvider>
        </NotificationProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
