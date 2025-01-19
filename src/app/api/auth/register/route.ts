import { NextResponse } from 'next/server';
import type { RegisterCredentials } from '@/types/auth';
import { connectToDatabase } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body: RegisterCredentials = await request.json();
    
    const { db } = await connectToDatabase();

    // Check if user exists
    const existingUser = await db.collection('users').findOne({ email: body.email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(body.password, 10);

    // Create new user
    const result = await db.collection('users').insertOne({
      email: body.email,
      name: body.name,
      password: hashedPassword,
      balance: 0,
      transactions: [],
      fixedDeposits: []
    });

    // Create user object without password for response
    const userWithoutPassword = {
      id: result.insertedId.toString(),
      email: body.email,
      name: body.name,
      balance: 0,
      transactions: [],
      fixedDeposits: []
    };
    
    // Create response with user data
    const response = NextResponse.json({ user: userWithoutPassword });

    // Set session cookie
    response.cookies.set('currentUser', JSON.stringify(userWithoutPassword), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });

    return response;
  } catch (err: unknown) {
    console.error('Registration error:', err instanceof Error ? err.message : err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal server error' },
      { status: 500 }
    );
  }
} 