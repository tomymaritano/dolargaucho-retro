import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Providers } from '@/app/providers';
import ErrorBoundary from '@/components/ErrorBoundary';
import { VercelBackground } from '@/components/ui/VercelBackground';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary>
      <Providers>
        <VercelBackground />
        <Component {...pageProps} />
      </Providers>
    </ErrorBoundary>
  );
}
