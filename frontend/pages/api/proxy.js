// Helper to safely parse JSON
const safeJsonParse = async (response) => {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch (error) {
    console.error('Failed to parse JSON:', { text, error });
    throw new Error(`Invalid JSON response: ${text.substring(0, 100)}...`);
  }
};

// Handle CORS preflight requests
const allowCors = fn => async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  return await fn(req, res);
};

// Main handler function
async function handler(req, res) {
  const { method, body, query } = req;
  const { path } = query;

  if (!path) {
    return res.status(400).json({ error: 'Path is required' });
  }

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ethical-partys-api.onrender.com';
    console.log('Using API URL:', apiUrl);
    const targetUrl = `${apiUrl}${path}`;
    
    console.log('Proxying request:', {
      method,
      targetUrl,
      body: method !== 'GET' ? body : undefined
    });

    const response = await fetch(targetUrl, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: method !== 'GET' ? JSON.stringify(body) : undefined
    });

    // Log the raw response
    console.log('Proxy received response:', {
      status: response.status,
      headers: Object.fromEntries(response.headers.entries())
    });

    // Try to parse the response as JSON
    const data = await safeJsonParse(response);
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: error.message });
  }
}

// Export the wrapped handler
export default allowCors(handler);
