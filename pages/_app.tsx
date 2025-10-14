import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Providers } from '@/app/providers';
import ErrorBoundary from '@/components/ErrorBoundary';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary>
      <Providers>
        <Component {...pageProps} />
      </Providers>
    </ErrorBoundary>
  );
}
