import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  useToast,
  Heading,
  Select,
  Stack,
  Divider,
  NumberInput,
  NumberInputField,
  SimpleGrid,
} from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext';

const CreateAd = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState([]);

  const handleImageChange = (e) => {
    if (e.target.files.length === 0) {
      toast({ title: 'Please select at least one image.', status: 'warning', duration: 3000, position: 'top' });
      return;
    }
    if (e.target.files.length > 3) {
      toast({ title: 'You can upload a maximum of 3 images.', status: 'warning', duration: 3000, position: 'top' });
      return;
    }
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (images.length === 0) {
      toast({ title: 'Please select at least one image.', status: 'error', duration: 5000, isClosable: true, position: 'top' });
      return;
    }
    setIsSubmitting(true);
    const token = await user.getIdToken();
    const formData = new FormData(e.target);

    try {
      // 1. Get presigned URLs for image uploads
      const presignedUrlPromises = images.map(file =>
        fetch('/api/presigned-url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ filename: file.name, contentType: file.type }),
        }).then(res => res.json())
      );
      const presignedResponses = await Promise.all(presignedUrlPromises);

      // 2. Upload images to R2
      const uploadPromises = presignedResponses.map((res, i) =>
        fetch(res.url, { method: 'PUT', body: images[i], headers: { 'Content-Type': images[i].type } })
      );
      await Promise.all(uploadPromises);
      const imageKeys = presignedResponses.map(res => res.key);

      // 3. Create the ad in D1
      const adData = {
        title: formData.get('title'),
        description: formData.get('description'),
        youtubeLink: formData.get('youtubeLink'),
        startDate: formData.get('startDate'),
        endDate: formData.get('endDate'),
        prize1: parseFloat(formData.get('prize1')),
        prize2: parseFloat(formData.get('prize2')),
        prize3: parseFloat(formData.get('prize3')),
        prize4: parseFloat(formData.get('prize4')),
        minClicks: parseInt(formData.get('minClicks')),
        destinationUrl: formData.get('destinationUrl'),
        ctaText: formData.get('ctaText'),
        category: formData.get('category'),
        imageKeys,
      };

      const res = await fetch('/api/adverts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(adData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to create ad');
      }

      toast({ title: 'Ad campaign created successfully!', status: 'success', duration: 5000, isClosable: true, position: 'top' });
      e.target.reset();
      setImages([]);
    } catch (error) {
      toast({ title: 'An error occurred.', description: error.message, status: 'error', duration: 9000, isClosable: true, position: 'top' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit} bg="white" p={{base: 4, md: 8}} borderRadius="lg" shadow="md">
      <Stack spacing={6}>
        <Heading as="h1" size="lg" color="brand.800">Create Your Ad Campaign</Heading>
        <Divider />

        <VStack spacing={4} align="stretch">
          <Heading as="h2" size="md" color="gray.600">1. Ad Details</Heading>
          <FormControl isRequired><FormLabel>Title</FormLabel><Input name="title" placeholder="e.g. My Awesome Product Launch" /></FormControl>
          <FormControl isRequired><FormLabel>Description</FormLabel><Textarea name="description" placeholder="Describe your product or service..." /></FormControl>
          <FormControl isRequired><FormLabel>Destination URL</FormLabel><Input name="destinationUrl" type="url" placeholder="https://your-website.com" /></FormControl>
          <FormControl isRequired>
            <FormLabel>Call to Action Text</FormLabel>
            <Select name="ctaText" placeholder="Select a call to action">
              <option value="Learn More">Learn More</option>
              <option value="Shop Now">Shop Now</option>
              <option value="Sign Up">Sign Up</option>
            </Select>
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Category</FormLabel>
            <Select name="category" placeholder="Select a category">
                <option value="E-commerce">E-commerce</option>
                <option value="SaaS">SaaS</option>
                <option value="Fintech">Fintech</option>
                <option value="Music">Music</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Other">Other</option>
            </Select>
          </FormControl>
           <FormControl><FormLabel>Optional YouTube Link</FormLabel><Input name="youtubeLink" type="url" /></FormControl>
        </VStack>

        <Divider />

        <VStack spacing={4} align="stretch">
          <Heading as="h2" size="md" color="gray.600">2. Schedule & Images</Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            <FormControl isRequired><FormLabel>Start Date</FormLabel><Input name="startDate" type="date" /></FormControl>
            <FormControl isRequired><FormLabel>End Date</FormLabel><Input name="endDate" type="date" /></FormControl>
          </SimpleGrid>
          <FormControl isRequired><FormLabel>Ad Images (up to 3)</FormLabel><Input type="file" accept="image/*" multiple onChange={handleImageChange} p={1.5} border="1px" borderColor="gray.200" borderRadius="md" /></FormControl>
        </VStack>

        <Divider />

        <VStack spacing={4} align="stretch">
          <Heading as="h2" size="md" color="gray.600">3. Prize Structure (in NGN)</Heading>
           <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            <FormControl isRequired><FormLabel>1st Place Prize</FormLabel><NumberInput min={0}><NumberInputField name="prize1" /></NumberInput></FormControl>
            <FormControl isRequired><FormLabel>2nd Place Prize</FormLabel><NumberInput min={0}><NumberInputField name="prize2" /></NumberInput></FormControl>
            <FormControl isRequired><FormLabel>3rd Place Prize</FormLabel><NumberInput min={0}><NumberInputField name="prize3" /></NumberInput></FormControl>
            <FormControl isRequired><FormLabel>Shared Prize Pool</FormLabel><NumberInput min={0}><NumberInputField name="prize4" /></NumberInput></FormControl>
          </SimpleGrid>
          <FormControl isRequired><FormLabel>Min Clicks for Shared Prize</FormLabel><NumberInput min={1}><NumberInputField name="minClicks" /></NumberInput></FormControl>
        </VStack>

        <Button type="submit" colorScheme="brand" size="lg" fontSize="md" isLoading={isSubmitting}>
          Create Campaign
        </Button>
      </Stack>
    </Box>
  );
};

export default CreateAd;
