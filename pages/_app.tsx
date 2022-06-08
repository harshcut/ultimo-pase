import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { CssBaseline, GeistProvider } from '@geist-ui/core';
import { Footer } from '@/components/.';
import { UserMenu } from '@/libs/components/.';
import { supabase } from '@/supabase/.';
import 'tailwindcss/tailwind.css';
import 'inter-ui/inter.css';

const MyApp: NextPage<AppProps> = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      await fetch('/api/cookie', {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        credentials: 'same-origin',
        body: JSON.stringify({ event, session }),
      });
      if (event === 'SIGNED_IN') return await router.push('/u/overview');
      await router.push('/login');
    });
    return () => authListener?.unsubscribe();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <GeistProvider>
        <CssBaseline />
        <UserMenu />
        <Component {...pageProps} />
        <Footer />
      </GeistProvider>
      <style global jsx>{`
        * {
          box-sizing: border-box !important;
        }
        .canvas {
          background-color: #ff4800;
          background-image: radial-gradient(#e3e3e3 1px, transparent 0),
            radial-gradient(#e3e3e3 1px, transparent 0);
          background-position: 0 0, 25px 25px;
          background-size: 50px 50px;
        }
      `}</style>
    </>
  );
};

export default MyApp;
