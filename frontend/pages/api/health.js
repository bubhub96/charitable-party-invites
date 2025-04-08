import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization,Accept');
    res.status(200).end();
    return;
  }

  try {
    const apiUrl = 'https://ethical-partys-api.onrender.com/api/health';
    console.log('Fetching from:', apiUrl);

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    console.log('Response status:', response.status);
    const text = await response.text();
    console.log('Response text:', text);

    try {
      const data = JSON.parse(text);
      res.status(response.status).json(data);
    } catch (parseError) {
      console.error('Failed to parse JSON:', parseError);
      res.status(502).json({
        error: 'Invalid JSON response from API',
        details: text.substring(0, 100)
      });
    }
  } catch (error) {
    console.error('API request failed:', error);
    res.status(500).json({ error: error.message });
  }
}
