import { useState } from 'react';
import Head from 'next/head';
import Layout from '../../components/Layout';
import { Box, Heading, Text, Button, Container, Image, Spinner, useToast } from '@chakra-ui/react';
import Turnstile from 'react-turnstile';
import { useRouter } from 'next/router';

// TODO: User needs to provide their public R2 URL
const R2_PUBLIC_URL = 'https://<YOUR_PUBLIC_R2_URL>';

export async function getServerSideProps(context) {
    const { adId } = context.params;
    // In a real app, you would fetch this from your worker.
    // For now, we just pass the ID to the client to fetch.
    // This is a workaround because the sandbox can't easily call the worker during SSR.
    // The ideal implementation would be a direct fetch here.
    return {
        props: { adId },
    };
}

export default function AdLandingPage({ adId }) {
    const [ad, setAd] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const toast = useToast();
    const router = useRouter();

    useEffect(() => {
        const fetchAd = async () => {
            setLoading(true);
            try {
                // This is a public endpoint, so no auth needed
                const res = await fetch(`/api/adverts/${adId}`);
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Could not fetch ad');
                setAd(data);
            } catch (error) {
                toast({ title: 'Error', description: error.message, status: 'error' });
            } finally {
                setLoading(false);
            }
        };

        if (adId) {
            fetchAd();
        }
    }, [adId, toast]);

    const handleClick = async () => {
        if (!token) {
            toast({ title: 'Please complete the challenge', status: 'warning' });
            return;
        }
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/clicks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ref: router.query.ref,
                    ad: adId,
                    turnstileToken: token,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to process click');

            // Redirect to the destination
            window.location.href = data.destinationUrl;

        } catch (error) {
            toast({ title: 'Error', description: error.message, status: 'error' });
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return <Layout><Spinner /></Layout>;
    }

    if (!ad) {
        return <Layout><Heading>Ad not found</Heading></Layout>;
    }

    return (
        <Layout>
            <Head>
                <title>{ad.title}</title>
            </Head>
            <Container maxW="container.md" centerContent>
                <Box textAlign="center" p={5} shadow="md" borderWidth="1px">
                    <Heading mb={4}>{ad.title}</Heading>
                    <Text mb={4}>{ad.description}</Text>
                    {ad.image1_url && <Image src={`${R2_PUBLIC_URL}/${ad.image1_url}`} alt={ad.title} my={4} />}

                    <Turnstile
                        sitekey="<YOUR_TURNSTILE_SITE_KEY>" // TODO: User must provide this
                        onVerify={(token) => setToken(token)}
                    />

                    <Button
                        mt={4}
                        colorScheme="brand"
                        onClick={handleClick}
                        isLoading={isSubmitting}
                        isDisabled={!token}
                    >
                        {ad.cta_text || 'Learn More'}
                    </Button>
                </Box>
            </Container>
        </Layout>
    );
}
