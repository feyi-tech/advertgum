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
import config from '../config';
import NextLink from 'next/link';

const ViewAds = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [ads, setAds] = useState([]);
  const [status, setStatus] = useState('active');
  const [category, setCategory] = useState('');
  const [minPrize, setMinPrize] = useState('');
  const [maxPrize, setMaxPrize] = useState('');
  const [loading, setLoading] = useState(false);

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
            <NextLink href={`/dashboard/ad/${ad.id}`} key={ad.id} passHref>
              <Box as="a" p={5} shadow="md" borderWidth="1px" _hover={{ shadow: 'lg', transform: 'translateY(-2px)' }} transition="all 0.2s">
                <Heading fontSize="xl">{ad.title}</Heading>
                <Text mt={4} noOfLines={2}>{ad.description}</Text>
                <Tag mt={4}>{ad.category}</Tag>
                {status === 'expired' && <Button mt={4} size="sm" onClick={(e) => { e.preventDefault(); handleViewResults(ad.id); }}>View Results</Button>}
              </Box>
            </NextLink>
          ))}
          {ads.length === 0 && <Text>No ads in this category.</Text>}
        </VStack>
      )}
    </Box>
  );
};

export default ViewAds;
