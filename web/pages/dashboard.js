import Head from 'next/head';
import Layout from '../components/Layout';
import ViewAds from '../components/ViewAds';
import MyParticipations from '../components/MyParticipations';
import { useAuth } from '../context/AuthContext';
import { Box, Heading, Text, Tabs, TabList, Tab, TabPanels, TabPanel } from '@chakra-ui/react';
import Login from '../components/Login';
import Register from '../components/Register';

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) {
    return (
      <Layout>
        <Box maxW="md" mx="auto" mt={10}>
          <Tabs isFitted variant="enclosed">
            <TabList>
              <Tab>Login</Tab>
              <Tab>Register</Tab>
            </TabList>
            <TabPanels>
              <TabPanel><Login /></TabPanel>
              <TabPanel><Register /></TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>AdvertGum Dashboard</title>
      </Head>
      <Box>
        <Heading as="h1" size="lg" mb={2}>Welcome, {user.email}</Heading>
        <Text fontSize="lg" color="gray.600" mb={8}>
          Here's what's happening on the platform.
        </Text>
        <Tabs colorScheme="brand">
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
