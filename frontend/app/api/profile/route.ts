// Proxy API route for profile endpoints
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/profile`;
  
  try {
    // Get authorization header from request
    const authHeader = request.headers.get('authorization');
    
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { 'Authorization': authHeader })
      },
    });
    
    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: 'Proxy error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

export async function PUT(request: NextRequest) {
  const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/profile`;
  
  try {
    const body = await request.json();
    const authHeader = request.headers.get('authorization');
    
    const response = await fetch(backendUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { 'Authorization': authHeader })
      },
      body: JSON.stringify(body),
    });
    
    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: 'Proxy error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
