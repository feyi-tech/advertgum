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
} from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext';

const CreateAd = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState([]);

  const handleImageChange = (e) => {
    if (e.target.files.length === 0) {
      toast({ title: 'Please select at least one image.', status: 'warning', duration: 3000 });
      return;
    }
    if (e.target.files.length > 3) {
      toast({ title: 'You can upload a maximum of 3 images.', status: 'warning', duration: 3000 });
      return;
    }
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const token = await user.getIdToken();
    const formData = new FormData(e.target);

    try {
      // 1. Get presigned URLs
      const presignedUrlPromises = images.map(file =>
        fetch('/api/presigned-url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ filename: file.name, contentType: file.type }),
        }).then(res => res.json())
      );
      const presignedResponses = await Promise.all(presignedUrlPromises);

      // 2. Upload images
      const uploadPromises = presignedResponses.map((res, i) =>
        fetch(res.url, { method: 'PUT', body: images[i], headers: { 'Content-Type': images[i].type } })
      );
      await Promise.all(uploadPromises);
      const imageKeys = presignedResponses.map(res => res.key);

      // 3. Create ad
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
        imageKeys,
      };

      await fetch('/api/adverts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(adData),
      });

      toast({ title: 'Ad created successfully!', status: 'success' });
      e.target.reset();
      setImages([]);
    } catch (error) {
      toast({ title: 'An error occurred.', description: error.message, status: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <VStack spacing={4}>
        <Heading>Create an Advert</Heading>
        <FormControl isRequired><FormLabel>Title</FormLabel><Input name="title" /></FormControl>
        <FormControl isRequired><FormLabel>Description</FormLabel><Textarea name="description" /></FormControl>
        <FormControl><FormLabel>YouTube Link</FormLabel><Input name="youtubeLink" type="url" /></FormControl>
        <FormControl isRequired><FormLabel>Start Date</FormLabel><Input name="startDate" type="date" /></FormControl>
        <FormControl isRequired><FormLabel>End Date</FormLabel><Input name="endDate" type="date" /></FormControl>
        <FormControl isRequired><FormLabel>1st Prize</FormLabel><Input name="prize1" type="number" /></FormControl>
        <FormControl isRequired><FormLabel>2nd Prize</FormLabel><Input name="prize2" type="number" /></FormControl>
        <FormControl isRequired><FormLabel>3rd Prize</FormLabel><Input name="prize3" type="number" /></FormControl>
        <FormControl isRequired><FormLabel>Shared Prize Pool</FormLabel><Input name="prize4" type="number" /></FormControl>
        <FormControl isRequired><FormLabel>Min Clicks for Shared Prize</FormLabel><Input name="minClicks" type="number" /></FormControl>
        <FormControl isRequired><FormLabel>Destination URL</FormLabel><Input name="destinationUrl" type="url" /></FormControl>
        <FormControl isRequired>
          <FormLabel>Call to Action Text</FormLabel>
          <Select name="ctaText" placeholder="Select a call to action">
            <option value="Learn More">Learn More</option>
            <option value="Shop Now">Shop Now</option>
            <option value="Sign Up">Sign Up</option>
            <option value="View Profile">View Profile</option>
            <option value="Get Offer">Get Offer</option>
          </Select>
        </FormControl>
        <FormControl isRequired><FormLabel>Images (up to 3)</FormLabel><Input type="file" accept="image/*" multiple onChange={handleImageChange} p={1} /></FormControl>
        <Button type="submit" colorScheme="teal" isLoading={isSubmitting} isDisabled={images.length === 0}>Create Ad</Button>
      </VStack>
    </Box>
  );
};

export default CreateAd;
