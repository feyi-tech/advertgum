import { useEffect } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { AuthProvider } from '../context/AuthContext';
import customTheme from '../theme';
import Head from 'next/head';

function App({ Component, pageProps }) {
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
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <ChakraProvider theme={customTheme}>
        <AuthProvider>
          <Component {...pageProps} />
        </AuthProvider>
      </ChakraProvider>
    </>
  );
}

export default App;
