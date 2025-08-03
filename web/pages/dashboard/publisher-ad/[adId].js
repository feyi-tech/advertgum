import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from '../../../components/Layout';
import { useAuth } from '../../../context/AuthContext';
import {
  Box,
  Heading,
  Text,
  Button,
  Spinner,
  useToast,
  Container,
  VStack,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Divider,
} from '@chakra-ui/react';

export default function PublisherAdDetailsPage() {
  const router = useRouter();
  const { adId } = router.query;
  const { user } = useAuth();
  const toast = useToast();
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);

  // TODO: Fetch detailed analytics for the ad (e.g., total clicks, participants)
  // This will require a new backend endpoint.

  useEffect(() => {
    const fetchAdDetails = async () => {
      if (!adId) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/adverts/${adId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Could not fetch ad details');
        // TODO: Add a check to ensure the logged-in user is the creator of the ad
        setAd(data);
      } catch (error) {
        toast({ title: 'Error', description: error.message, status: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchAdDetails();
  }, [adId, toast]);

  const handleAddPrizes = () => {
    // TODO: Implement logic to open a modal and handle adding prizes
    toast({ title: 'Coming Soon!', description: 'This feature is not yet implemented.', status: 'info' });
  };

  if (loading) {
    return <Layout><Container centerContent py={20}><Spinner /></Container></Layout>;
  }

  if (!ad) {
    return <Layout><Container centerContent py={20}><Heading>Ad not found</Heading></Container></Layout>;
  }

  return (
    <Layout>
      <Head>
        <title>Manage Ad: {ad.title}</title>
      </Head>
      <Container maxW="container.lg">
        <VStack spacing={8} align="stretch">
          <Box>
            <Heading as="h1" size="xl" color="brand.800">Manage Campaign</Heading>
            <Text fontSize="lg" color="gray.500">{ad.title}</Text>
          </Box>

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5}>
            <Stat p={5} shadow="md" borderWidth="1px" borderRadius="md">
              <StatLabel>Total Clicks</StatLabel>
              <StatNumber>0</StatNumber>
            </Stat>
            <Stat p={5} shadow="md" borderWidth="1px" borderRadius="md">
              <StatLabel>Total Participants</StatLabel>
              <StatNumber>0</StatNumber>
            </Stat>
             <Stat p={5} shadow="md" borderWidth="1px" borderRadius="md">
              <StatLabel>Status</StatLabel>
              <StatNumber>{ad.end_date > Date.now() ? 'Active' : 'Expired'}</StatNumber>
            </Stat>
          </SimpleGrid>

          <Box bg="white" p={8} borderRadius="lg" shadow="md">
            <Heading size="lg" mb={4}>Current Prize Structure (NGN)</Heading>
            <SimpleGrid columns={{ base: 1, md: 4 }} spacing={5}>
              <Stat><StatLabel>1st Place</StatLabel><StatNumber>₦{ad.prize1}</StatNumber></Stat>
              <Stat><StatLabel>2nd Place</StatLabel><StatNumber>₦{ad.prize2}</StatNumber></Stat>
              <Stat><StatLabel>3rd Place</StatLabel><StatNumber>₦{ad.prize3}</StatNumber></Stat>
              <Stat><StatLabel>Shared Pool</StatLabel><StatNumber>₦{ad.prize4}</StatNumber></Stat>
            </SimpleGrid>
            <Divider my={6} />
            <Button colorScheme="brand" onClick={handleAddPrizes}>Add More Prizes</Button>
            <Text mt={2} fontSize="sm" color="gray.500">You can only increase prize amounts for active campaigns.</Text>
          </Box>
        </VStack>
      </Container>
    </Layout>
  );
}
