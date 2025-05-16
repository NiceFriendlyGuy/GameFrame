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

  const response = await axios.post(
    'https://api.igdb.com/v4/games',
    `search "${gameName}"; fields name, cover.url; limit 1;`,
    {
      headers: {
        'Client-ID': CLIENT_ID,
        Authorization: `Bearer ${token}`,
        'Content-Type': 'text/plain'
      }
    }
  );

  const game = response.data[0];
  
  // Modify the image URL to get a higher quality version
  const imageUrl = game?.cover?.url
    ? 'https:' + game.cover.url.replace('t_thumb', 't_1080p')
    : null;

  // Return a cleaned-up object instead of the raw IGDB response
  return {
    name: game?.name || 'Unknown',
    image: imageUrl
  };
}


module.exports = { fetchGameByName };
