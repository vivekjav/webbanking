import { User, Transaction } from '@/types/auth';
import { connectToDatabase } from './mongodb';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';

interface UserDocument extends Omit<User, 'id'> {
  _id: ObjectId;
}

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

export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const { db } = await connectToDatabase();
    const user = await db.collection<UserDocument>('users').findOne({ email });
    
    if (!user) return null;

    return {
      ...user,
      id: user._id.toString(),
    };
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}

export async function createUser(user: {
  name: string;
  email: string;
  password: string;
}): Promise<User | null> {
  try {
    const { db } = await connectToDatabase();
    
    // Check if user already exists
    const existingUser = await getUserByEmail(user.email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(user.password, 10);

    // Create new user document
    const userDoc: Omit<UserDocument, '_id'> = {
      name: user.name,
      email: user.email,
      password: hashedPassword,
      balance: 0,
      transactions: [],
      fixedDeposits: []
    };

    const result = await db.collection<UserDocument>('users').insertOne({
      ...userDoc,
      _id: new ObjectId()
    });

    return {
      ...userDoc,
      id: result.insertedId.toString()
    };
  } catch (error) {
    console.error('Error creating user:', error);
    return null;
  }
}

export async function updateUserBalance(
  userId: string,
  newBalance: number
): Promise<User | null> {
  try {
    const { db } = await connectToDatabase();
    const result = await db.collection<UserDocument>('users').findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $set: { balance: newBalance } },
      { returnDocument: 'after' }
    );

    if (!result) return null;

    return {
      ...result,
      id: result._id.toString()
    };
  } catch (error) {
    console.error('Error updating user balance:', error);
    return null;
  }
}

export async function addTransactionToUser(
  userId: string,
  transaction: Omit<Transaction, 'id'>
): Promise<User | null> {
  try {
    const { db } = await connectToDatabase();
    
    // Add id to transaction
    const completeTransaction = {
      ...transaction,
      id: new ObjectId().toString()
    } as Transaction;

    // For fixed deposits, we need to update the fixedDeposits array as well
    if (transaction.type === 'fixed_deposit' && 'metadata' in transaction && transaction.metadata) {
      const metadata = transaction.metadata as TransactionMetadata;
      if (!metadata.duration || !metadata.interestRate || !metadata.maturityDate) {
        throw new Error('Invalid fixed deposit metadata');
      }

      const fixedDeposit = {
        amount: transaction.amount,
        startDate: new Date(),
        endDate: metadata.maturityDate,
        interestRate: metadata.interestRate,
        status: 'active' as const
      };

      const result = await db.collection<UserDocument>('users').findOneAndUpdate(
        { _id: new ObjectId(userId) },
        { 
          $push: { 
            transactions: completeTransaction,
            fixedDeposits: fixedDeposit
          }
        },
        { returnDocument: 'after' }
      );

      if (!result) return null;

      return {
        ...result,
        id: result._id.toString()
      };
    }

    // For other transaction types
    const result = await db.collection<UserDocument>('users').findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $push: { transactions: completeTransaction } },
      { returnDocument: 'after' }
    );

    if (!result) return null;

    return {
      ...result,
      id: result._id.toString()
    };
  } catch (error) {
    console.error('Error adding transaction:', error);
    return null;
  }
} 