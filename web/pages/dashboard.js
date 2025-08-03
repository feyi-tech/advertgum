import Head from 'next/head';
import Layout from '../components/Layout';
import ViewAds from '../components/ViewAds';
import MyParticipations from '../components/MyParticipations';
import { useAuth } from '../context/AuthContext';
import { Box, Heading, Text, Tabs, TabList, Tab, TabPanels, TabPanel, SimpleGrid } from '@chakra-ui/react';
import Login from '../components/Login';
import Register from '../components/Register';

import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return (
      <Layout>
        {/* You can add a spinner here */}
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>AdvertGum Dashboard</title>
      </Head>
      <Box>
        <Heading as="h1" size="lg" mb={2}>Welcome, {user.displayName || user.email}</Heading>
        <Text fontSize="lg" color="gray.500" mb={8}>
          Here's your performance summary and what's happening on the platform.
        </Text>

        {/* Stats Section */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 5, lg: 8 }} mb={8}>
          <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
            <Heading fontSize="2xl">0</Heading>
            <Text mt={2} color="gray.500">Total Clicks Generated</Text>
          </Box>
           <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
            <Heading fontSize="2xl">NGN 0.00</Heading>
            <Text mt={2} color="gray.500">Total Earnings</Text>
          </Box>
           <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
            <Heading fontSize="2xl">0</Heading>
            <Text mt={2} color="gray.500">Active Participations</Text>
          </Box>
        </SimpleGrid>

        <Tabs colorScheme="brand" variant="enclosed-colored">
          <TabList>
            <Tab>Browse All Ads</Tab>
            <Tab>My Participations</Tab>
          </TabList>
          <TabPanels>
            <TabPanel><ViewAds /></TabPanel>
            <TabPanel><MyParticipations /></TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Layout>
  );
}
