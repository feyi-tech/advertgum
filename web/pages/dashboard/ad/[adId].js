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
  Image,
  VStack,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Input,
  Tag,
} from '@chakra-ui/react';
import config from '../../../config';

export default function AdDetailsPage() {
  const router = useRouter();
  const { adId } = router.query;
  const { user } = useAuth();
  const toast = useToast();
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [referralLink, setReferralLink] = useState('');

  useEffect(() => {
    const fetchAdDetails = async () => {
      if (!adId) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/adverts/${adId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Could not fetch ad details');
        setAd(data);
      } catch (error) {
        toast({ title: 'Error', description: error.message, status: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchAdDetails();
  }, [adId, toast]);

  const handleGetLink = async () => {
    if (!user) return;
    try {
        const token = await user.getIdToken();
        const res = await fetch(`/api/adverts/${adId}/participate`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
        });
        const { unique_code } = await res.json();
        const link = `${config.app.url}/ad?id=${adId}&ref=${unique_code}`;
        setReferralLink(link);
    } catch (error) {
        toast({ title: 'Error getting link', description: error.message, status: 'error' });
    }
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
        <title>Ad Details: {ad.title}</title>
      </Head>
      <Container maxW="container.lg">
        <VStack spacing={8} align="stretch">
          <Box bg="white" p={8} borderRadius="lg" shadow="md">
            {ad.image1_url && <Image src={`${config.app.r2PublicUrl}/${ad.image1_url}`} alt={ad.title} mb={6} borderRadius="md" />}
            <Heading as="h1" size="xl" color="brand.800">{ad.title}</Heading>
            <Tag mt={2} colorScheme="blue">{ad.category}</Tag>
            <Text mt={4} fontSize="lg" color="gray.600">{ad.description}</Text>
          </Box>

          <Box bg="white" p={8} borderRadius="lg" shadow="md">
            <Heading size="lg" mb={4}>Prize Structure (NGN)</Heading>
            <SimpleGrid columns={{ base: 1, md: 4 }} spacing={5}>
              <Stat><StatLabel>1st Place</StatLabel><StatNumber>₦{ad.prize1}</StatNumber></Stat>
              <Stat><StatLabel>2nd Place</StatLabel><StatNumber>₦{ad.prize2}</StatNumber></Stat>
              <Stat><StatLabel>3rd Place</StatLabel><StatNumber>₦{ad.prize3}</StatNumber></Stat>
              <Stat><StatLabel>Shared Pool</StatLabel><StatNumber>₦{ad.prize4}</StatNumber></Stat>
            </SimpleGrid>
            <Text mt={4} fontSize="sm" color="gray.500">Shared pool is split among all participants who get at least {ad.min_clicks} clicks.</Text>
          </Box>

          <Box bg="white" p={8} borderRadius="lg" shadow="md">
            <Heading size="lg" mb={4}>Get Your Unique Link</Heading>
            <Text mb={4}>Click the button below to get your unique referral link. Share it to start earning!</Text>
            <Button colorScheme="brand" onClick={handleGetLink} isDisabled={!!referralLink}>
              {referralLink ? 'Link Generated!' : 'Get My Unique Link'}
            </Button>
            {referralLink && <Input readOnly value={referralLink} mt={4} />}
          </Box>
        </VStack>
      </Container>
    </Layout>
  );
}
