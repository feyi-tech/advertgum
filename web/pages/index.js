import Head from 'next/head';
import Layout from '../components/Layout';
import { Box, Heading, Text, Button, Container, Stack, Flex } from '@chakra-ui/react';
import NextLink from 'next/link';

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>AdvertGum - Performance-Based Advertising</title>
        <meta name="description" content="Turn clicks into cash. AdvertGum connects advertisers with promoters for performance-based marketing." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Hero Section */}
      <Container maxW={'5xl'}>
        <Stack
          textAlign={'center'}
          align={'center'}
          spacing={{ base: 8, md: 10 }}
          py={{ base: 20, md: 28 }}>
          <Heading
            fontWeight={600}
            fontSize={{ base: '3xl', sm: '4xl', md: '6xl' }}
            lineHeight={'110%'}>
            Get Real Clicks.{' '}
            <Text as={'span'} color={'brand.500'}>
              Pay for Real Performance.
            </Text>
          </Heading>
          <Text color={'gray.500'} maxW={'3xl'}>
            AdvertGum is a revolutionary platform where advertisers pay for results and promoters earn cash for sharing. Stop wasting money on ads that don't convert. Start a campaign today and watch your traffic soar.
          </Text>
          <Stack spacing={6} direction={'row'}>
            <NextLink href="/dashboard" passHref>
              <Button
                rounded={'full'}
                px={6}
                colorScheme={'brand'}
                bg={'brand.500'}
                _hover={{ bg: 'brand.600' }}>
                Get Started
              </Button>
            </NextLink>
            <NextLink href="/advertisers" passHref>
              <Button rounded={'full'} px={6}>
                Learn More
              </Button>
            </NextLink>
          </Stack>
        </Stack>
      </Container>

      {/* Promoter Section */}
      <Box p={8} bg="gray.50">
        <Stack spacing={4} as={Container} maxW={'3xl'} textAlign={'center'}>
          <Heading fontSize={'3xl'}>Earn Money by Sharing</Heading>
          <Text color={'gray.600'} fontSize={'xl'}>
            No registration fees, no hidden costs. Simply find an ad you like, get your unique link, and share it on your social media, blog, or status. You earn real cash for every verified click you generate. It's that simple.
          </Text>
        </Stack>
      </Box>

      {/* Featured Ads Section Placeholder */}
      <Box id="featured" p={8}>
        <Heading textAlign={'center'} mb={8}>Featured Ad Campaigns</Heading>
        {/* TODO: Implement logic to fetch and display featured ads */}
        <Flex justify="center">
          <Text color="gray.500">Featured ads will be displayed here.</Text>
        </Flex>
      </Box>

      {/* Advertiser Section */}
      <Box p={8} bg="gray.50">
         <Stack spacing={4} as={Container} maxW={'3xl'} textAlign={'center'}>
          <Heading fontSize={'3xl'}>For Advertisers</Heading>
          <Text color={'gray.600'} fontSize={'xl'}>
            Tired of paying for ads that don't work? Get real, verified traffic and pay only for performance. Our platform connects you with motivated promoters ready to share your brand.
          </Text>
           <NextLink href="/advertisers" passHref>
              <Button rounded={'full'} px={6}>
                Learn More
              </Button>
            </NextLink>
        </Stack>
      </Box>
    </Layout>
  );
}
