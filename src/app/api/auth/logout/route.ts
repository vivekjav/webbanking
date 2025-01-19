import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true });
  
  // Clear all auth-related cookies
  response.cookies.delete('currentUser');
  response.cookies.delete('users');

  return response;
} 