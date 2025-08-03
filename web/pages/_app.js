import { useEffect } from 'react';
import '@/styles/globals.css'
import { ChakraProvider } from '@chakra-ui/react'
import { AuthProvider } from '../context/AuthContext'

export default function App({ Component, pageProps }) {
  useEffect(() => {
    const handleReferral = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const ref = urlParams.get('ref');
      const ad = urlParams.get('ad');

      if (ref && ad) {
        try {
          await fetch('/api/clicks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ref, ad }),
          });
        } catch (error) {
          console.error('Failed to record click:', error);
        } finally {
          window.history.replaceState(null, '', window.location.pathname);
        }
      }
    };

    handleReferral();
  }, []);

  return (
    <ChakraProvider>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </ChakraProvider>
  )
}
