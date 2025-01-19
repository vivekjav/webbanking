'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { DashboardStats } from '@/components/DashboardStats';
import { TransactionList } from '@/components/TransactionList';
import { TransactionForm } from '@/components/TransactionForm';
import { FinancialServices } from '@/components/FinancialServices';
import { User, Transaction } from '@/types/auth';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

type TransactionRequest = {
  type: Transaction['type'];
  amount: number;
  description: string;
  status?: Transaction['status'];
  metadata?: Record<string, unknown>;
  recipientEmail?: string;
};

type BasicTransactionRequest = {
  type: 'deposit' | 'withdrawal' | 'transfer';
  amount: number;
  recipientEmail?: string;
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'basic' | 'advanced'>('basic');

  useEffect(() => {
    if (status === 'unauthenticated') {
      redirect('/login');
    }

    if (session?.user?.email) {
      const fetchUserData = async () => {
        try {
          const response = await fetch(`/api/users/${session.user.email}`);
          if (!response.ok) throw new Error('Failed to fetch user data');
          const data = await response.json();
          setUser(data.user);
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchUserData();
    }
  }, [session, status]);

  const handleTransaction = async (data: TransactionRequest | BasicTransactionRequest) => {
    try {
      // Add description for basic transactions
      const transactionData: TransactionRequest = 'description' in data ? data : {
        ...data,
        description: data.type === 'deposit' 
          ? `Deposit of $${data.amount}`
          : data.type === 'withdrawal'
          ? `Withdrawal of $${data.amount}`
          : `Transfer of $${data.amount}${data.recipientEmail ? ` to ${data.recipientEmail}` : ''}`
      };

      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Transaction failed');
      }

      const { user: updatedUser } = await response.json();
      setUser(updatedUser);
    } catch (error) {
      throw error;
    }
  };

  if (isLoading || !user) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Welcome back, {user.name}!</h1>
        <p className="text-gray-600">Here&apos;s an overview of your account</p>
      </div>

      <div className="mb-12">
        <DashboardStats 
          balance={user.balance} 
          transactions={user.transactions || []} 
        />
      </div>

      <div className="flex gap-4 mb-8">
        <Button
          onClick={() => setActiveTab('basic')}
          variant={activeTab === 'basic' ? 'primary' : 'outline'}
        >
          Basic Transactions
        </Button>
        <Button
          onClick={() => setActiveTab('advanced')}
          variant={activeTab === 'advanced' ? 'primary' : 'outline'}
        >
          Financial Services
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {activeTab === 'basic' ? (
          <>
            <TransactionForm onSubmit={handleTransaction} />
            <div>
              <h2 className="text-2xl font-bold mb-6">Recent Transactions</h2>
              <TransactionList transactions={user.transactions || []} />
            </div>
          </>
        ) : (
          <div className="lg:col-span-2">
            <FinancialServices onTransaction={handleTransaction} />
          </div>
        )}
      </div>

      {user.fixedDeposits && user.fixedDeposits.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Active Fixed Deposits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {user.fixedDeposits.map((fd, index) => (
              <Card key={index} className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted">Principal Amount</span>
                    <span className="font-medium">${fd.amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted">Interest Rate</span>
                    <span className="font-medium">{fd.interestRate}% p.a.</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted">Start Date</span>
                    <span className="font-medium">
                      {new Date(fd.startDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted">Maturity Date</span>
                    <span className="font-medium">
                      {new Date(fd.endDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t">
                    <span className="text-muted">Status</span>
                    <span className={`font-medium ${
                      fd.status === 'active' ? 'text-success' :
                      fd.status === 'matured' ? 'text-primary' :
                      'text-error'
                    }`}>
                      {fd.status.charAt(0).toUpperCase() + fd.status.slice(1)}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </main>
  );
} 