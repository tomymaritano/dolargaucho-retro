import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabase';

/**
 * OAuth Callback Handler
 * Handles the redirect from OAuth providers (Google, GitHub)
 */
export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    // Handle the OAuth callback
    const handleCallback = async () => {
      const { error } = await supabase.auth.getSession();

      if (error) {
        console.error('Error during OAuth callback:', error);
        router.push('/login?error=oauth_failed');
        return;
      }

      // Success - redirect to dashboard
      router.push('/dashboard');
    };

    handleCallback();
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark via-dark-light to-dark flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-accent-emerald border-t-transparent" />
        <p className="mt-4 text-white text-lg">Autenticando...</p>
      </div>
    </div>
  );
}
