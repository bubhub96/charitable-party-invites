import { NextResponse } from 'next/server';

export async function middleware(request) {
  // Only handle API requests
  if (!request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Get the target path from the URL
  const path = request.nextUrl.pathname.replace('/api/proxy', '');
  if (!path) {
    return NextResponse.json({ error: 'Path is required' }, { status: 400 });
  }

  try {
    const apiUrl = 'https://ethical-partys-api.onrender.com';
    const targetUrl = `${apiUrl}${path}`;

    console.log('Proxying request:', {
      method: request.method,
      targetUrl,
    });

    // Forward the request
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: ['GET', 'HEAD'].includes(request.method) ? null : request.body
    });

    // Get the response data
    const data = await response.json();

    // Return the response
    return NextResponse.json(data, {
      status: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept'
      }
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export const config = {
  matcher: '/api/:path*'
};
