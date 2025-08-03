import { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  Spinner,
  VStack,
  useToast,
  Tag,
} from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext';
import NextLink from 'next/link';

const MyCreatedAds = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCreatedAds = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const token = await user.getIdToken();
        const res = await fetch('/api/users/created-ads', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch created ads');
        setAds(data);
      } catch (error) {
        toast({ title: 'Error', description: error.message, status: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchCreatedAds();
  }, [user, toast]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <Box>
      <Heading size="lg" mb={4}>My Ad Campaigns</Heading>
      <VStack spacing={4} align="stretch">
        {ads.map(ad => (
          <NextLink href={`/dashboard/publisher-ad/${ad.id}`} key={ad.id} passHref>
            <Box as="a" p={5} shadow="md" borderWidth="1px" _hover={{ shadow: 'lg', transform: 'translateY(-2px)' }} transition="all 0.2s">
              <Heading fontSize="xl">{ad.title}</Heading>
              <Text mt={4} noOfLines={2}>{ad.description}</Text>
              <Tag mt={4}>{ad.category}</Tag>
            </Box>
          </NextLink>
        ))}
        {ads.length === 0 && <Text>You haven't created any ad campaigns yet.</Text>}
      </VStack>
    </Box>
  );
};

export default MyCreatedAds;
