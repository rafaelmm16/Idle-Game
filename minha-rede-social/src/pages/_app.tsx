import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { auth } from '../../lib/firebase';
import '../styles/globals.css';

import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        setLoading(false);
        if (router.pathname === '/login') {
          router.push('/');
        }
      } else {
        setLoading(false);
        if (router.pathname !== '/login' && !localStorage.getItem('guestLogin')) {
          router.push('/login');
        }
      }
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (localStorage.getItem('guestLogin')) {
      setLoading(false);
    }
  }, []);

  if (loading) return <div>Carregando...</div>;

  return <Component {...pageProps} />;
}

export default MyApp;
