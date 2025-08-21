const axios = require('axios');
require('dotenv').config();

let accessToken = null;
let tokenExpiresAt = 0;

async function getAccessToken() {
  if (accessToken && Date.now() < tokenExpiresAt) return accessToken;

  const response = await axios.post('https://id.twitch.tv/oauth2/token', null, {
    params: {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      grant_type: 'client_credentials'
    }
  });

  accessToken = response.data.access_token;
  tokenExpiresAt = Date.now() + response.data.expires_in * 1000;
  return accessToken;
}

async function fetchGameByName(gameName) {
  const token = await getAccessToken();

  // Step 1: Get game ID and name
  const gameRes = await axios.post(
    'https://api.igdb.com/v4/games',
    `search "${gameName}"; fields id, name; limit 1;`,
    {
      headers: {
        'Client-ID': process.env.CLIENT_ID,
        Authorization: `Bearer ${token}`,
        'Content-Type': 'text/plain'
      }
    }
  );

  const game = gameRes.data[0];
  if (!game) throw new Error('Game not found');
  const gameId = game.id;

  // Helper to fetch images from IGDB endpoints
  const fetchImages = async (endpoint) => {
    const res = await axios.post(
      `https://api.igdb.com/v4/${endpoint}`,
      `fields url, image_id; where game = ${gameId};`,
      {
        headers: {
          'Client-ID': process.env.CLIENT_ID,
          Authorization: `Bearer ${token}`,
          'Content-Type': 'text/plain'
        }
      }
    );
    return res.data.map(img => ({
      url: 'https:' + img.url.replace('t_thumb', 't_1080p'),
      id: img.image_id
    }));
  };

  // Step 2: Fetch all image types in parallel
  const [artworks, screenshots, covers] = await Promise.all([
    fetchImages('artworks'),
    fetchImages('screenshots'),
    fetchImages('covers')
  ]);

  return {
    name: game.name,
    cover: covers[0]?.url || null,
    artworks,
    screenshots
  };
}

async function fetchGamesByQuery(query) {
  const token = await getAccessToken();

  const response = await axios.post(
    'https://api.igdb.com/v4/games',
    `search "${query}"; fields id, name, cover.url; limit 10;`,
    {
      headers: {
        'Client-ID': process.env.CLIENT_ID,
        Authorization: `Bearer ${token}`,
        'Content-Type': 'text/plain'
      }
    }
  );

  return response.data.map(game => ({
    id: game.id,
    name: game.name,
    image: game.cover?.url
      ? 'https:' + game.cover.url.replace('t_thumb', 't_cover_big')
      : null
  }));
}




module.exports = {
  getAccessToken,
  fetchGamesByQuery,
  fetchGameByName // ← if you use that too
};

