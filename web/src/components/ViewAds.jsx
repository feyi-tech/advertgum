import React, { useState, useEffect } from 'react';

// TODO: The user needs to set up a public URL for their R2 bucket.
// This is done in the R2 bucket settings in the Cloudflare dashboard.
const R2_PUBLIC_URL = 'https://<YOUR_PUBLIC_R2_URL>';

import React, { useState, useEffect } from 'react';
import { auth } from '../firebaseConfig';

// TODO: The user needs to set up a public URL for their R2 bucket.
const R2_PUBLIC_URL = 'https://<YOUR_PUBLIC_R2_URL>';
const APP_URL = 'http://localhost:5173'; // Or your actual app URL

const ViewAds = () => {
  const [ads, setAds] = useState([]);
  const [status, setStatus] = useState('active');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [referralLinks, setReferralLinks] = useState({});

  const handleViewResults = async (advertId) => {
    try {
      const res = await fetch(`/api/adverts/${advertId}/results`);
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to fetch results');
      }
      const results = await res.json();

      const resultsString = `
        --- Results ---
        1st Place: ${results.prize1.winner || 'N/A'} with ${results.prize1.clicks} clicks, winning $${results.prize1.amount}
        2nd Place: ${results.prize2.winner || 'N/A'} with ${results.prize2.clicks} clicks, winning $${results.prize2.amount}
        3rd Place: ${results.prize3.winner || 'N/A'} with ${results.prize3.clicks} clicks, winning $${results.prize3.amount}

        Shared Prize:
        - Participants who qualified: ${results.sharedPrize.participantCount}
        - Prize per participant: $${results.sharedPrize.amountPerParticipant.toFixed(2)}
      `;
      alert(resultsString);
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  useEffect(() => {
    const fetchAds = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/adverts?status=${status}`);
        if (!res.ok) {
          throw new Error('Failed to fetch ads');
        }
        const data = await res.json();
        setAds(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAds();
  }, [status]);

  const handleGetLink = async (advertId) => {
    const user = auth.currentUser;
    if (!user) {
      alert('You must be logged in to get a referral link.');
      return;
    }

    try {
      const token = await user.getIdToken();
      const res = await fetch(`/api/adverts/${advertId}/participate`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to get link');
      const { unique_code } = await res.json();
      const link = `${APP_URL}/?ref=${unique_code}&ad=${advertId}`;
      setReferralLinks(prev => ({ ...prev, [advertId]: link }));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <h2>View Adverts</h2>
      <div>
        <button onClick={() => setStatus('active')} disabled={status === 'active'}>Active</button>
        <button onClick={() => setStatus('upcoming')} disabled={status === 'upcoming'}>Upcoming</button>
        <button onClick={() => setStatus('expired')} disabled={status === 'expired'}>Expired</button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ marginTop: '20px' }}>
        {ads.length === 0 && !loading && <p>No ads found for this category.</p>}
        {ads.map(ad => (
          <div key={ad.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
            <h3>{ad.title}</h3>
            <p>{ad.description}</p>
            {ad.image1_url && <img src={`${R2_PUBLIC_URL}/${ad.image1_url}`} alt={ad.title} width="200" />}
            <p><strong>Starts:</strong> {new Date(ad.start_date).toLocaleDateString()}</p>
            <p><strong>Ends:</strong> {new Date(ad.end_date).toLocaleDateString()}</p>
            {status === 'active' && (
              <div>
                <button onClick={() => handleGetLink(ad.id)}>Get my link</button>
                {referralLinks[ad.id] && (
                  <input type="text" readOnly value={referralLinks[ad.id]} style={{ width: '100%', marginTop: '5px' }} />
                )}
              </div>
            )}
            {status === 'expired' && (
              <button onClick={() => handleViewResults(ad.id)}>View Results</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewAds;
