import { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import {
  Box,
  Heading,
  Text,
  Button,
  Spinner,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useToast,
  VStack,
} from '@chakra-ui/react';

export default function Wallet() {
  const { user } = useAuth();
  const toast = useToast();
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWallet = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const token = await user.getIdToken();
        const res = await fetch('/api/wallet', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch wallet');
        setWallet(data);
      } catch (error) {
        toast({ title: 'Error', description: error.message, status: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchWallet();
  }, [user, toast]);

  const handleFundWallet = () => {
    // TODO: Integrate Fincra payment flow
    toast({
      title: 'Coming Soon!',
      description: 'Fincra integration is not yet implemented.',
      status: 'info',
    });
  };

  if (loading) {
    return <Layout><Spinner /></Layout>;
  }

  return (
    <Layout>
      <Head>
        <title>My Wallet - AdvertGum</title>
      </Head>
      <VStack spacing={8} align="stretch">
        <Box p={5} shadow="md" borderWidth="1px">
          <Heading fontSize="2xl">My Wallet</Heading>
          <Text fontSize="4xl" fontWeight="bold" mt={4}>
            NGN {wallet?.balance.toFixed(2) || '0.00'}
          </Text>
          <Button mt={4} colorScheme="brand" onClick={handleFundWallet}>
            Fund Wallet
          </Button>
        </Box>

        <Box p={5} shadow="md" borderWidth="1px">
          <Heading fontSize="xl" mb={4}>Transaction History</Heading>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Date</Th>
                <Th>Type</Th>
                <Th>Description</Th>
                <Th isNumeric>Amount (NGN)</Th>
              </Tr>
            </Thead>
            <Tbody>
              {wallet?.transactions.map(tx => (
                <Tr key={tx.id}>
                  <Td>{new Date(tx.created_at).toLocaleDateString()}</Td>
                  <Td>{tx.type}</Td>
                  <Td>{tx.description}</Td>
                  <Td isNumeric color={tx.amount > 0 ? 'green.500' : 'red.500'}>
                    {tx.amount.toFixed(2)}
                  </Td>
                </Tr>
              ))}
              {wallet?.transactions.length === 0 && (
                <Tr><Td colSpan={4}>No transactions yet.</Td></Tr>
              )}
            </Tbody>
          </Table>
        </Box>
      </VStack>
    </Layout>
  );
}
