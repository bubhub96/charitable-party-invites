export default async function handler(req, res) {
  const { method, body, query } = req;
  const { path } = query;

  if (!path) {
    return res.status(400).json({ error: 'Path is required' });
  }

  try {
    const apiUrl = 'https://ethical-partys-api.onrender.com';
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

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: error.message });
  }
}
