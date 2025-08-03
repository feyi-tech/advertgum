import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Tag,
  Text,
  VStack,
  useToast,
  Input,
  Spinner,
  Skeleton,
  Stack,
} from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext';

// TODO: User needs to provide their public R2 URL
const R2_PUBLIC_URL = 'https://<YOUR_PUBLIC_R2_URL>';
const APP_URL = 'http://localhost:3000'; // Or your actual app URL

const ViewAds = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [ads, setAds] = useState([]);
  const [status, setStatus] = useState('active');
  const [loading, setLoading] = useState(false);
  const [referralLinks, setReferralLinks] = useState({});

  useEffect(() => {
    const fetchAds = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/adverts?status=${status}`);
        const data = await res.json();
        setAds(data);
      } catch (error) {
        toast({ title: 'Error fetching ads', description: error.message, status: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchAds();
  }, [status, toast]);

  const handleGetLink = async (advertId) => {
    const token = await user.getIdToken();
    try {
      const res = await fetch(`/api/adverts/${advertId}/participate`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const { unique_code } = await res.json();
      const link = `${APP_URL}/?ref=${unique_code}&ad=${advertId}`;
      setReferralLinks(prev => ({ ...prev, [advertId]: link }));
    } catch (error) {
      toast({ title: 'Error getting link', description: error.message, status: 'error' });
    }
  };

  const handleViewResults = async (advertId) => {
    try {
      const res = await fetch(`/api/adverts/${advertId}/results`);
      const results = await res.json();
      if (!res.ok) throw new Error(results.error || 'Failed to fetch results');

      const resultsString = `--- Results ---\n1st: ${results.prize1.winner || 'N/A'} (${results.prize1.clicks} clicks) - $${results.prize1.amount}\n2nd: ${results.prize2.winner || 'N/A'} (${results.prize2.clicks} clicks) - $${results.prize2.amount}\n3rd: ${results.prize3.winner || 'N/A'} (${results.prize3.clicks} clicks) - $${results.prize3.amount}\n\nShared Prize: ${results.sharedPrize.participantCount} participants get $${results.sharedPrize.amountPerParticipant.toFixed(2)} each.`;
      alert(resultsString);
    } catch (err) {
      toast({ title: 'Error fetching results', description: err.message, status: 'error' });
    }
  };

  return (
    <Box>
      <Flex mb={4}>
        <Button onClick={() => setStatus('active')} colorScheme={status === 'active' ? 'teal' : 'gray'}>Active</Button>
        <Button onClick={() => setStatus('upcoming')} colorScheme={status === 'upcoming' ? 'teal' : 'gray'} ml={2}>Upcoming</Button>
        <Button onClick={() => setStatus('expired')} colorScheme={status === 'expired' ? 'teal' : 'gray'} ml={2}>Expired</Button>
      </Flex>
      {loading ? (
        <Stack>
          <Skeleton height="150px" />
          <Skeleton height="150px" />
          <Skeleton height="150px" />
        </Stack>
      ) : (
        <VStack spacing={4} align="stretch">
          {ads.map(ad => (
            <Box key={ad.id} p={5} shadow="md" borderWidth="1px">
              <Heading fontSize="xl">{ad.title}</Heading>
              <Text mt={4}>{ad.description}</Text>
              {ad.image1_url && <Image src={`${R2_PUBLIC_URL}/${ad.image1_url}`} alt={ad.title} my={4} />}
              <Tag>Starts: {new Date(ad.start_date).toLocaleDateString()}</Tag>
              <Tag ml={2}>Ends: {new Date(ad.end_date).toLocaleDateString()}</Tag>
              {status === 'active' && (
                <Box mt={4}>
                  <Button size="sm" onClick={() => handleGetLink(ad.id)}>Get My Link</Button>
                  {referralLinks[ad.id] && <Input readOnly value={referralLinks[ad.id]} mt={2} />}
                </Box>
              )}
              {status === 'expired' && <Button mt={4} size="sm" onClick={() => handleViewResults(ad.id)}>View Results</Button>}
            </Box>
          ))}
          {ads.length === 0 && <Text>No ads in this category.</Text>}
        </VStack>
      )}
    </Box>
  );
};

export default ViewAds;
