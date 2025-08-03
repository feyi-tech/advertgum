import Head from 'next/head';
import Layout from '../components/Layout';
import { Box, Heading, Text, Container, Stack, Flex, Icon, useColorModeValue } from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';

const Feature = ({ title, text }) => {
  return (
    <HStack align={'top'}>
      <Box color={'green.400'} px={2}>
        <Icon as={CheckCircleIcon} />
      </Box>
      <VStack align={'start'}>
        <Text fontWeight={600}>{title}</Text>
        <Text color={'gray.600'}>{text}</Text>
      </VStack>
    </HStack>
  );
};


export default function Advertisers() {
  return (
    <Layout>
      <Head>
        <title>For Advertisers - AdvertGum</title>
        <meta name="description" content="Learn why advertising on AdvertGum is the most cost-effective way to get real, verified traffic to your business." />
      </Head>

      <Container maxW={'5xl'} py={12}>
        <Stack spacing={4} as={Container} maxW={'3xl'} textAlign={'center'}>
          <Heading fontSize={'3xl'}>The Smart Way to Drive Traffic</Heading>
          <Text color={'gray.600'} fontSize={'xl'}>
            Stop paying for impressions and start paying for performance. At AdvertGum, you only pay for real, verified clicks from users genuinely interested in your offer.
          </Text>
        </Stack>

        <Container maxW={'6xl'} mt={10}>
          <Stack spacing={8}>
            <Feature
              title={'Pay for Performance, Not Promises'}
              text={
                'Our model is simple: you set the prizes, and you only pay when real users engage with your ad. This ensures your marketing budget is spent on tangible results, not just views.'
              }
            />
            <Feature
              title={'Advanced Bot Protection'}
              text={
                "We take click fraud seriously. Every click is verified by Cloudflare Turnstile, a state-of-the-art, privacy-friendly CAPTCHA alternative. This ensures that the traffic you receive is from real humans, maximizing your return on investment."
              }
            />
            <Feature
              title={'Engaged Promoter Network'}
              text={
                'Our promoters are financially motivated to share your ads with relevant audiences. This creates a powerful word-of-mouth marketing engine, driving high-quality, targeted traffic to your destination.'
              }
            />
             <Feature
              title={'Full Control and Transparency'}
              text={
                'You have full control over your campaign budget and duration. Our dashboard provides clear, transparent reporting on click performance, so you always know how your campaign is doing.'
              }
            />
          </Stack>
        </Container>
      </Container>
    </Layout>
  );
}
