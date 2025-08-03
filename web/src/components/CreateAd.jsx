import React, { useState } from 'react';
import { auth } from '../firebaseConfig';

const CreateAd = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [youtubeLink, setYoutubeLink] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [prize1, setPrize1] = useState('');
  const [prize2, setPrize2] = useState('');
  const [prize3, setPrize3] = useState('');
  const [prize4, setPrize4] = useState('');
  const [minClicks, setMinClicks] = useState('');
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleImageChange = (e) => {
    if (e.target.files.length > 3) {
      setError('You can only upload a maximum of 3 images.');
      return;
    }
    setImages(Array.from(e.target.files));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const user = auth.currentUser;
    if (!user) {
      setError('You must be logged in to create an ad.');
      setSubmitting(false);
      return;
    }

    try {
      const token = await user.getIdToken();

      // 1. Get presigned URLs for all images
      const presignedUrlPromises = images.map(file =>
        fetch('/api/presigned-url', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ filename: file.name, contentType: file.type }),
        }).then(res => res.json())
      );

      const presignedResponses = await Promise.all(presignedUrlPromises);

      // 2. Upload images to R2
      const uploadPromises = presignedResponses.map((res, index) =>
        fetch(res.url, {
          method: 'PUT',
          body: images[index],
          headers: { 'Content-Type': images[index].type },
        })
      );

      await Promise.all(uploadPromises);

      const imageKeys = presignedResponses.map(res => res.key);

      // 3. Create the ad in D1
      const adData = {
        title, description, youtubeLink, startDate, endDate,
        prize1: parseFloat(prize1),
        prize2: parseFloat(prize2),
        prize3: parseFloat(prize3),
        prize4: parseFloat(prize4),
        minClicks: parseInt(minClicks),
        imageKeys,
      };

      const res = await fetch('/api/adverts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(adData),
      });

      if (!res.ok) {
        throw new Error('Failed to create ad');
      }

      alert('Ad created successfully!');
    } catch (err) {
      setError('An error occurred while creating the ad.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h2>Create New Advert</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
        <input type="url" placeholder="Optional YouTube Link" value={youtubeLink} onChange={(e) => setYoutubeLink(e.target.value)} />
        <input type="date" placeholder="Start Date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
        <input type="date" placeholder="End Date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
        <input type="number" placeholder="1st Prize" value={prize1} onChange={(e) => setPrize1(e.target.value)} required />
        <input type="number" placeholder="2nd Prize" value={prize2} onChange={(e) => setPrize2(e.target.value)} required />
        <input type="number" placeholder="3rd Prize" value={prize3} onChange={(e) => setPrize3(e.target.value)} required />
        <input type="number" placeholder="Shared Prize Pool" value={prize4} onChange={(e) => setPrize4(e.target.value)} required />
        <input type="number" placeholder="Minimum Clicks for Shared Prize" value={minClicks} onChange={(e) => setMinClicks(e.target.value)} required />
        <label>
          Ad Images (up to 3):
          <input type="file" accept="image/*" multiple onChange={handleImageChange} required />
        </label>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" disabled={submitting}>
          {submitting ? 'Creating...' : 'Create Ad'}
        </button>
      </form>
    </div>
  );
};

export default CreateAd;
