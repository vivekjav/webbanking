import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth.config';
import { getUserByEmail, updateUserBalance, addTransactionToUser } from '@/lib/user';
import { Transaction } from '@/types/auth';

type TransactionMetadata = {
    // Fixed Deposit
    duration?: number;
    interestRate?: number;
    maturityDate?: Date;
    // International Transfer
    recipientName?: string;
    recipientBank?: string;
    recipientCountry?: string;
    swiftCode?: string;
    accountNumber?: string;
    currency?: string;
    exchangeRate?: number;
    // Bill Payment
    billType?: 'electricity' | 'water' | 'gas' | 'internet' | 'phone';
    providerId?: string;
    billNumber?: string;
    // Tax Payment
    taxType?: 'income' | 'property' | 'sales' | 'corporate';
    taxYear?: number;
    taxReference?: string;
};

type TransactionRequest = {
    type: Transaction['type'];
    amount: number;
    description: string;
    status?: Transaction['status'];
    metadata?: TransactionMetadata;
    recipientEmail?: string;
};

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await request.json() as TransactionRequest;
        const { type, amount, description, status = 'completed', metadata } = data;

        if (!type || !amount || amount <= 0) {
            return NextResponse.json(
                { error: 'Invalid transaction data' },
                { status: 400 }
            );
        }

        const user = await getUserByEmail(session.user.email);
        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Handle different transaction types
        switch (type) {
            case 'deposit':
            case 'withdrawal': {
                if (type === 'withdrawal' && user.balance < amount) {
                    return NextResponse.json(
                        { error: 'Insufficient funds' },
                        { status: 400 }
                    );
                }
                const newBalance = type === 'deposit'
                    ? user.balance + amount
                    : user.balance - amount;
                await updateUserBalance(user.id, newBalance);
                break;
            }

            case 'transfer': {
                if (user.balance < amount) {
                    return NextResponse.json(
                        { error: 'Insufficient funds' },
                        { status: 400 }
                    );
                }
                const recipientEmail = data.recipientEmail;
                if (!recipientEmail) {
                    return NextResponse.json(
                        { error: 'Recipient email is required' },
                        { status: 400 }
                    );
                }
                const recipient = await getUserByEmail(recipientEmail);
                if (!recipient) {
                    return NextResponse.json(
                        { error: 'Recipient not found' },
                        { status: 404 }
                    );
                }
                await updateUserBalance(user.id, user.balance - amount);
                await updateUserBalance(recipient.id, recipient.balance + amount);
                await addTransactionToUser(recipient.id, {
                    type: 'deposit',
                    amount,
                    description: `Transfer from ${user.email}`,
                    date: new Date(),
                    status: 'completed'
                });
                break;
            }

            case 'fixed_deposit': {
                if (user.balance < amount) {
                    return NextResponse.json(
                        { error: 'Insufficient funds' },
                        { status: 400 }
                    );
                }
                if (!metadata?.duration || !metadata?.interestRate) {
                    return NextResponse.json(
                        { error: 'Invalid fixed deposit data' },
                        { status: 400 }
                    );
                }
                await updateUserBalance(user.id, user.balance - amount);
                const maturityDate = new Date();
                maturityDate.setDate(maturityDate.getDate() + metadata.duration * 30);
                metadata.maturityDate = maturityDate;
                break;
            }

            case 'international_transfer': {
                if (user.balance < amount) {
                    return NextResponse.json(
                        { error: 'Insufficient funds' },
                        { status: 400 }
                    );
                }
                if (!metadata?.recipientName || !metadata?.swiftCode || !metadata?.accountNumber ||
                    !metadata?.recipientBank || !metadata?.recipientCountry || !metadata?.currency) {
                    return NextResponse.json(
                        { error: 'Invalid international transfer data' },
                        { status: 400 }
                    );
                }
                await updateUserBalance(user.id, user.balance - amount);
                metadata.exchangeRate = metadata.exchangeRate || 1; // Default exchange rate
                break;
            }

            case 'bill_payment': {
                if (user.balance < amount) {
                    return NextResponse.json(
                        { error: 'Insufficient funds' },
                        { status: 400 }
                    );
                }
                if (!metadata?.billType || !metadata?.providerId || !metadata?.billNumber) {
                    return NextResponse.json(
                        { error: 'Invalid bill payment data' },
                        { status: 400 }
                    );
                }
                await updateUserBalance(user.id, user.balance - amount);
                break;
            }

            case 'tax_payment': {
                if (user.balance < amount) {
                    return NextResponse.json(
                        { error: 'Insufficient funds' },
                        { status: 400 }
                    );
                }
                if (!metadata?.taxType || !metadata?.taxYear || !metadata?.taxReference) {
                    return NextResponse.json(
                        { error: 'Invalid tax payment data' },
                        { status: 400 }
                    );
                }
                await updateUserBalance(user.id, user.balance - amount);
                break;
            }

            default:
                return NextResponse.json(
                    { error: 'Invalid transaction type' },
                    { status: 400 }
                );
        }

        // Add transaction to user's history
        const transaction: Omit<Transaction, 'id'> = {
            type,
            amount,
            description,
            date: new Date(),
            status,
            ...(metadata && { metadata }),
            ...(type === 'transfer' && { recipientEmail: data.recipientEmail })
        } as Omit<Transaction, 'id'>;

        const updatedUser = await addTransactionToUser(user.id, transaction);
        return NextResponse.json({ user: updatedUser });

    } catch (error) {
        console.error('Transaction error:', error);
        return NextResponse.json(
            { error: 'Failed to process transaction' },
            { status: 500 }
        );
    }
} 