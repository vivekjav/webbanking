import { NextAuthOptions, Session } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { getUserByEmail } from '@/lib/user';
import { UserWithoutPassword } from '@/types/auth';

declare module 'next-auth' {
    interface User {
        id: string;
        balance: number;
    }
    interface Session {
        user: {
            id: string;
            name: string;
            email: string;
            balance: number;
        };
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id: string;
        balance: number;
    }
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials: { email: string; password: string; } | undefined): Promise<UserWithoutPassword | null> {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Please enter your email and password');
                }

                const user = await getUserByEmail(credentials.email);

                if (!user || !user.password) {
                    throw new Error('No user found with this email');
                }

                const isValid = await bcrypt.compare(credentials.password, user.password);

                if (!isValid) {
                    throw new Error('Invalid password');
                }

                const { password, ...userWithoutPassword } = user;
                console.log(password?.length);
                return userWithoutPassword;
            }
        })
    ],
    pages: {
        signIn: '/login',
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.balance = user.balance;
            }
            return token;
        },
        async session({ session, token }): Promise<Session> {
            if (token && session.user) {
                session.user.id = token.id;
                session.user.balance = token.balance;
            }
            return session;
        }
    },
    session: {
        strategy: 'jwt',
    },
}; 