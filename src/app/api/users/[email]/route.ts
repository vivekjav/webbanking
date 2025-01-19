import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth.config';
import { getUserByEmail } from '@/lib/user';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ email: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        const resolvedParams = await params;

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Only allow users to fetch their own data
        if (session.user.email !== resolvedParams.email) {
            return NextResponse.json(
                { error: 'Forbidden' },
                { status: 403 }
            );
        }

        const user = await getUserByEmail(resolvedParams.email);

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Destructure password with underscore prefix to indicate intentionally unused
        const { password: _password, ...safeUser } = user;
        console.log(_password?.length);
        return NextResponse.json({ user: safeUser });
    } catch (error) {
        console.error('Error fetching user:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 