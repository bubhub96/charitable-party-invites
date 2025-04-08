import fetch from 'node-fetch';

// Helper to handle errors consistently
const handleError = (res, status, message, details = null) => {
  const error = { error: message };
  if (details) error.details = details;
  console.error('[Health Check] Error:', message, details || '');
  res.status(status).json(error);
};

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization,Accept');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return handleError(res, 405, 'Method not allowed');
  }

  try {
    const apiUrl = 'https://ethical-partys-api.onrender.com/api/health';
    console.log('[Health Check] Fetching from:', apiUrl);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'EthicalPartys-HealthCheck/1.0'
        },
        signal: controller.signal
      });

      clearTimeout(timeout);
      console.log('[Health Check] Response status:', response.status);

      if (!response.ok) {
        return handleError(res, response.status, `API returned ${response.status}`);
      }

      const text = await response.text();
      console.log('[Health Check] Response text:', text);

      try {
        const data = JSON.parse(text);
        console.log('[Health Check] Parsed response:', data);
        return res.status(200).json({
          status: 'ok',
          timestamp: new Date().toISOString(),
          apiResponse: data
        });
      } catch (parseError) {
        return handleError(res, 502, 'Invalid JSON from API', {
          error: parseError.message,
          responsePreview: text.substring(0, 100)
        });
      }
    } catch (fetchError) {
      clearTimeout(timeout);
      if (fetchError.name === 'AbortError') {
        return handleError(res, 504, 'API request timed out after 5s');
      }
      throw fetchError;
    }
  } catch (error) {
    return handleError(res, 500, 'Internal server error', error.message);
  }
}
