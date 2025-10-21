import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Providers } from '@/app/providers';
import ErrorBoundary from '@/components/ErrorBoundary';
import { VercelBackground } from '@/components/ui/VercelBackground';
import { Analytics } from '@vercel/analytics/react';
import { ChangelogProvider } from '@/components/WhatsNew';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary>
      <Providers>
        <ChangelogProvider>
          <VercelBackground />
          <Component {...pageProps} />
          <Analytics />
        </ChangelogProvider>
      </Providers>
    </ErrorBoundary>
  );
}
