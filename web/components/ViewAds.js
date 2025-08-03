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
  Select,
  NumberInput,
  NumberInputField,
  ButtonGroup,
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
  const [category, setCategory] = useState('');
  const [minPrize, setMinPrize] = useState('');
  const [maxPrize, setMaxPrize] = useState('');
  const [loading, setLoading] = useState(false);
  const [referralLinks, setReferralLinks] = useState({});

  useEffect(() => {
    const fetchAds = async () => {
      setLoading(true);
      const params = new URLSearchParams({
        status,
        category,
        minPrize1: minPrize,
        maxPrize1: maxPrize,
      });
      try {
        const res = await fetch(`/api/adverts?${params.toString()}`);
        const data = await res.json();
        setAds(data);
      } catch (error) {
        toast({ title: 'Error fetching ads', description: error.message, status: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchAds();
  }, [status, category, minPrize, maxPrize, toast]);

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
      <Stack spacing={4} mb={8} direction={{ base: 'column', md: 'row' }}>
        <ButtonGroup isAttached variant="outline">
          <Button onClick={() => setStatus('active')} isActive={status === 'active'}>Active</Button>
          <Button onClick={() => setStatus('upcoming')} isActive={status === 'upcoming'}>Upcoming</Button>
          <Button onClick={() => setStatus('expired')} isActive={status === 'expired'}>Expired</Button>
        </ButtonGroup>
        <Select placeholder="All Categories" onChange={(e) => setCategory(e.target.value)}>
          <option value="E-commerce">E-commerce</option>
          <option value="SaaS">SaaS</option>
          <option value="Fintech">Fintech</option>
          <option value="Music">Music</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Other">Other</option>
        </Select>
        <NumberInput value={minPrize} onChange={(value) => setMinPrize(value)} placeholder="Min 1st Prize">
          <NumberInputField />
        </NumberInput>
        <NumberInput value={maxPrize} onChange={(value) => setMaxPrize(value)} placeholder="Max 1st Prize">
          <NumberInputField />
        </NumberInput>
      </Stack>
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
