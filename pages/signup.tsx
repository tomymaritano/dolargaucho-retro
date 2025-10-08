import React from 'react';
import { useRouter } from 'next/router';

export default function SignupPage() {
  const router = useRouter();

  // Redirigir automáticamente al home
  // Auth deshabilitado temporalmente
  React.useEffect(() => {
    router.push('/');
  }, [router]);

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center">
      <p className="text-secondary">Redirigiendo...</p>
    </div>
  );
}
