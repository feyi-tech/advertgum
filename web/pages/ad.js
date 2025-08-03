import { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import { Box, Heading, Text, Button, Container, Image, Spinner, useToast, VStack } from '@chakra-ui/react';
import Turnstile from 'react-turnstile';
import { useRouter } from 'next/router';
import config from '../config';

export default function AdLandingPage() {
    const router = useRouter();
    const { id: adId, ref: refCode } = router.query;

    const [ad, setAd] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const toast = useToast();

    useEffect(() => {
        const fetchAd = async () => {
            if (!adId) {
                setLoading(false);
                return;
            }
            setLoading(true);
            try {
                const res = await fetch(`/api/adverts/${adId}`);
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Could not fetch ad');
                setAd(data);
            } catch (error) {
                toast({ title: 'Error', description: error.message, status: 'error', position: 'top' });
            } finally {
                setLoading(false);
            }
        };
        fetchAd();
    }, [adId, toast]);

    const handleClick = async () => {
        if (!token) {
            toast({ title: 'Please complete the challenge', status: 'warning', position: 'top' });
            return;
        }
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/clicks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ref: refCode,
                    ad: adId,
                    turnstileToken: token,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to process click');

            window.location.href = data.destinationUrl;

        } catch (error) {
            toast({ title: 'Error', description: error.message, status: 'error', position: 'top' });
            setIsSubmitting(false);
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
                <title>{ad.title}</title>
            </Head>
            <Container maxW="container.md" centerContent>
                <VStack spacing={6} textAlign="center" p={{base: 4, md: 8}} shadow="xl" borderWidth="1px" borderRadius="lg" bg="white">
                    <Heading as="h1" size="xl" color="brand.800">{ad.title}</Heading>
                    {ad.image1_url && <Image src={`${config.app.r2PublicUrl}/${ad.image1_url}`} alt={ad.title} my={4} borderRadius="md" />}
                    <Text fontSize="lg" color="gray.600">{ad.description}</Text>

                    <Turnstile
                        sitekey={config.turnstile.siteKey}
                        onVerify={(token) => setToken(token)}
                    />

                    <Button
                        mt={4}
                        size="lg"
                        colorScheme="brand"
                        onClick={handleClick}
                        isLoading={isSubmitting}
                        isDisabled={!token}
                    >
                        {ad.cta_text || 'Learn More'}
                    </Button>
                </VStack>
            </Container>
        </Layout>
    );
}
