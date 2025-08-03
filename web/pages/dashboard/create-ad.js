import Head from 'next/head';
import Layout from '../../components/Layout';
import CreateAd from '../../components/CreateAd';
import { useAuth } from '../../context/AuthContext';
import { Box, Heading } from '@chakra-ui/react';

export default function CreateAdPage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <Layout>
        <Heading>Please log in to create an ad.</Heading>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>Create New Ad - AdvertGum</title>
      </Head>
      <Box maxW="container.md" mx="auto">
        <CreateAd />
      </Box>
    </Layout>
  );
}
