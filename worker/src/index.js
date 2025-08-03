import { authenticate } from './auth';
import { createPresignedUrl } from './r2';
import { createId } from './utils';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Get presigned URL for image upload
    if (url.pathname === '/api/presigned-url' && request.method === 'POST') {
      const { userId, error, status } = await authenticate(request, env);
      if (error) {
        return new Response(JSON.stringify({ error }), { status });
      }

      const { filename, contentType } = await request.json();
      if (!filename || !contentType) {
        return new Response(JSON.stringify({ error: 'Missing filename or contentType' }), { status: 400 });
      }

      const key = `${userId}/${createId()}-${filename}`;

      try {
        const presignedUrl = await createPresignedUrl(env, key, contentType);
        return new Response(JSON.stringify({ url: presignedUrl, key }), {
          headers: { 'Content-Type': 'application/json' },
        });
      } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ error: 'Could not generate presigned URL' }), { status: 500 });
      }
    }

    // Create a new advert
    if (url.pathname === '/api/adverts' && request.method === 'POST') {
      const { userId, error, status } = await authenticate(request, env);
      if (error) {
        return new Response(JSON.stringify({ error }), { status });
      }

      try {
        const adData = await request.json();
        const adId = createId();

        // Basic validation
        if (!adData.title || !adData.description || !adData.imageKeys || adData.imageKeys.length === 0) {
          return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
        }

        await env.DB.prepare(
          `INSERT INTO adverts (id, title, description, youtube_link, start_date, end_date, prize1, prize2, prize3, prize4, min_clicks, creator_id, created_at, image1_url, image2_url, image3_url)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
          .bind(
            adId,
            adData.title,
            adData.description,
            adData.youtubeLink,
            new Date(adData.startDate).getTime(),
            new Date(adData.endDate).getTime(),
            adData.prize1,
            adData.prize2,
            adData.prize3,
            adData.prize4,
            adData.minClicks,
            userId,
            Date.now(),
            adData.imageKeys[0],
            adData.imageKeys[1] || null,
            adData.imageKeys[2] || null
          )
          .run();

        return new Response(JSON.stringify({ id: adId }), { status: 201 });
      } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ error: 'Failed to create advert' }), { status: 500 });
      }
    }

    // Get adverts
    if (url.pathname === '/api/adverts' && request.method === 'GET') {
      const status = url.searchParams.get('status') || 'active';
      const now = Date.now();
      let query;

      switch (status) {
        case 'active':
          query = 'SELECT * FROM adverts WHERE start_date <= ?1 AND end_date >= ?1';
          break;
        case 'expired':
          query = 'SELECT * FROM adverts WHERE end_date < ?1';
          break;
        case 'upcoming':
          query = 'SELECT * FROM adverts WHERE start_date > ?1';
          break;
        default:
          return new Response(JSON.stringify({ error: 'Invalid status filter' }), { status: 400 });
      }

      try {
        const { results } = await env.DB.prepare(query).bind(now).all();
        return new Response(JSON.stringify(results), {
          headers: { 'Content-Type': 'application/json' },
        });
      } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ error: 'Failed to fetch adverts' }), { status: 500 });
      }
    }

    // User participates in an advert
    const participateMatch = url.pathname.match(/^\/api\/adverts\/([a-zA-Z0-9]+)\/participate$/);
    if (participateMatch && request.method === 'POST') {
      const advertId = participateMatch[1];
      const { userId, error, status } = await authenticate(request, env);
      if (error) {
        return new Response(JSON.stringify({ error }), { status });
      }

      try {
        // Check if user is already a participant
        let participant = await env.DB.prepare('SELECT * FROM participants WHERE advert_id = ?1 AND user_id = ?2')
          .bind(advertId, userId)
          .first();

        if (participant) {
          return new Response(JSON.stringify({ unique_code: participant.unique_code }), { status: 200 });
        }

        // Create new participant
        const participantId = createId();
        const uniqueCode = createId();
        await env.DB.prepare('INSERT INTO participants (id, advert_id, user_id, unique_code) VALUES (?, ?, ?, ?)')
          .bind(participantId, advertId, userId, uniqueCode)
          .run();

        return new Response(JSON.stringify({ unique_code: uniqueCode }), { status: 201 });
      } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ error: 'Failed to process participation' }), { status: 500 });
      }
    }


    // Track a click
    if (url.pathname === '/api/clicks' && request.method === 'POST') {
      try {
        const { ref: uniqueCode, ad: advertId } = await request.json();
        if (!uniqueCode || !advertId) {
          return new Response(JSON.stringify({ error: 'Missing referral code or advert ID' }), { status: 400 });
        }

        // Find participant by unique code
        const participant = await env.DB.prepare('SELECT id FROM participants WHERE unique_code = ?1 AND advert_id = ?2')
          .bind(uniqueCode, advertId)
          .first();

        if (!participant) {
          // Don't give away that the code is invalid, just fail silently
          return new Response(JSON.stringify({ success: true }), { status: 200 });
        }

        const clickId = createId();
        await env.DB.prepare('INSERT INTO clicks (id, advert_id, participant_id, clicked_at) VALUES (?, ?, ?, ?)')
          .bind(clickId, advertId, participant.id, Date.now())
          .run();

        return new Response(JSON.stringify({ success: true }), { status: 200 });
      } catch (err) {
        console.error(err);
        // Fail silently to the client
        return new Response(JSON.stringify({ success: true }), { status: 200 });
      }
    }


    // Get advert results
    const resultsMatch = url.pathname.match(/^\/api\/adverts\/([a-zA-Z0-9]+)\/results$/);
    if (resultsMatch && request.method === 'GET') {
      const advertId = resultsMatch[1];

      try {
        const ad = await env.DB.prepare('SELECT * FROM adverts WHERE id = ?1').bind(advertId).first();
        if (!ad) {
          return new Response(JSON.stringify({ error: 'Advert not found' }), { status: 404 });
        }
        if (ad.end_date > Date.now()) {
          return new Response(JSON.stringify({ error: 'Advert has not expired yet' }), { status: 400 });
        }

        // Get top 3 winners
        const topWinnersQuery = `
          SELECT p.user_id, COUNT(c.id) as click_count
          FROM participants p
          JOIN clicks c ON p.id = c.participant_id
          WHERE p.advert_id = ?1
          GROUP BY p.user_id
          ORDER BY click_count DESC
          LIMIT 3;
        `;
        const { results: topWinners } = await env.DB.prepare(topWinnersQuery).bind(advertId).all();

        // Get participants for shared prize
        const sharedPrizeQuery = `
          SELECT p.user_id
          FROM participants p
          JOIN clicks c ON p.id = c.participant_id
          WHERE p.advert_id = ?1
          GROUP BY p.user_id
          HAVING COUNT(c.id) >= ?2;
        `;
        const { results: sharedPrizeParticipants } = await env.DB.prepare(sharedPrizeQuery).bind(advertId, ad.min_clicks).all();

        const sharedPrizeAmount = sharedPrizeParticipants.length > 0 ? ad.prize4 / sharedPrizeParticipants.length : 0;

        const results = {
          prize1: { winner: topWinners[0]?.user_id || null, amount: ad.prize1, clicks: topWinners[0]?.click_count || 0 },
          prize2: { winner: topWinners[1]?.user_id || null, amount: ad.prize2, clicks: topWinners[1]?.click_count || 0 },
          prize3: { winner: topWinners[2]?.user_id || null, amount: ad.prize3, clicks: topWinners[2]?.click_count || 0 },
          sharedPrize: {
            amountPerParticipant: sharedPrizeAmount,
            participantCount: sharedPrizeParticipants.length,
            participants: sharedPrizeParticipants.map(p => p.user_id),
          }
        };

        return new Response(JSON.stringify(results), { headers: { 'Content-Type': 'application/json' } });
      } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ error: 'Failed to calculate results' }), { status: 500 });
      }
    }

    return new Response('Hello World!');
  },
};
