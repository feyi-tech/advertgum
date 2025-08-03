import { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  Spinner,
  VStack,
  useToast,
  Tag,
  Image,
} from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext';

// TODO: User needs to provide their public R2 URL
const R2_PUBLIC_URL = 'https://<YOUR_PUBLIC_R2_URL>';

const MyParticipations = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [participations, setParticipations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchParticipations = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const token = await user.getIdToken();
        const res = await fetch('/api/users/participations', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch participations');
        setParticipations(data);
      } catch (error) {
        toast({ title: 'Error', description: error.message, status: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchParticipations();
  }, [user, toast]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <Box>
      <Heading size="lg" mb={4}>My Active Campaigns</Heading>
      <VStack spacing={4} align="stretch">
        {participations.map(ad => (
          <Box key={ad.id} p={5} shadow="md" borderWidth="1px">
            <Heading fontSize="xl">{ad.title}</Heading>
            <Text mt={4}>{ad.description}</Text>
            {ad.image1_url && <Image src={`${R2_PUBLIC_URL}/${ad.image1_url}`} alt={ad.title} my={4} />}
            <Tag>Ends: {new Date(ad.end_date).toLocaleDateString()}</Tag>
             {/* TODO: Add logic to show user's current click count for this ad */}
             <Text mt={2} fontWeight="bold">My Clicks: [Coming Soon]</Text>
          </Box>
        ))}
        {participations.length === 0 && <Text>You haven't participated in any campaigns yet.</Text>}
      </VStack>
    </Box>
  );
};

export default MyParticipations;
