const axios = require('axios');

const CLIENT_ID = 'ldaq3ayh4b3r8du8l45yavob91q3fa';
const CLIENT_SECRET = '1ac7j8ldbykpsji897fjw3gdkzec82';
let accessToken = null;
let tokenExpiresAt = 0;

async function getAccessToken() {
  if (accessToken && Date.now() < tokenExpiresAt) return accessToken;

  const response = await axios.post('https://id.twitch.tv/oauth2/token', null, {
    params: {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
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
        'Client-ID': CLIENT_ID,
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
          'Client-ID': CLIENT_ID,
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



module.exports = { fetchGameByName };
