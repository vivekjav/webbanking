import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import type { User } from '@/types/auth';

export async function POST(request: Request) {
  try {
    const { user } = await request.json();
    const cookieStore = await cookies();
    const usersJson = cookieStore.get('users')?.value || '[]';
    const users = JSON.parse(usersJson);

    // Update user in users array
    const updatedUsers = users.map((u: User) => 
      u.id === user.id ? { ...u, ...user } : u
    );

    // Create response
    const response = NextResponse.json({ user });

    // Update cookies
    response.cookies.set('users', JSON.stringify(updatedUsers), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });

    response.cookies.set('currentUser', JSON.stringify(user), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });

    return response;
  } catch (err: unknown) {
    console.error('Update user error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 