'use client';

import { Transaction } from '@/types/auth';
import { Card } from './ui/Card';

interface DashboardStatsProps {
  balance: number;
  transactions: Transaction[];
}

export function DashboardStats({ balance, transactions }: DashboardStatsProps) {
  const stats = {
    totalDeposits: transactions
      .filter(t => t.type === 'deposit')
      .reduce((sum, t) => sum + t.amount, 0),
    totalWithdrawals: transactions
      .filter(t => t.type === 'withdrawal')
      .reduce((sum, t) => sum + t.amount, 0),
    totalTransfers: transactions
      .filter(t => t.type === 'transfer')
      .reduce((sum, t) => sum + t.amount, 0),
    totalFixedDeposits: transactions
      .filter(t => t.type === 'fixed_deposit')
      .reduce((sum, t) => sum + t.amount, 0),
    totalInternationalTransfers: transactions
      .filter(t => t.type === 'international_transfer')
      .reduce((sum, t) => sum + t.amount, 0),
    totalBillPayments: transactions
      .filter(t => t.type === 'bill_payment')
      .reduce((sum, t) => sum + t.amount, 0),
    totalTaxPayments: transactions
      .filter(t => t.type === 'tax_payment')
      .reduce((sum, t) => sum + t.amount, 0),
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card variant="primary" className="flex flex-col">
        <h3 className="text-lg font-medium mb-2">Current Balance</h3>
        <p className="text-3xl font-bold">${balance.toFixed(2)}</p>
      </Card>

      <Card className="flex flex-col">
        <h3 className="text-lg font-medium mb-2 text-success">Total Deposits</h3>
        <p className="text-3xl font-bold text-success">
          +${stats.totalDeposits.toFixed(2)}
        </p>
        <p className="text-sm text-muted mt-2">
          {transactions.filter(t => t.type === 'deposit').length} deposits
        </p>
      </Card>

      <Card className="flex flex-col">
        <h3 className="text-lg font-medium mb-2 text-error">Total Withdrawals</h3>
        <p className="text-3xl font-bold text-error">
          -${stats.totalWithdrawals.toFixed(2)}
        </p>
        <p className="text-sm text-muted mt-2">
          {transactions.filter(t => t.type === 'withdrawal').length} withdrawals
        </p>
      </Card>

      <Card className="flex flex-col">
        <h3 className="text-lg font-medium mb-2 text-primary">Total Transfers</h3>
        <p className="text-3xl font-bold text-primary">
          ${stats.totalTransfers.toFixed(2)}
        </p>
        <p className="text-sm text-muted mt-2">
          {transactions.filter(t => t.type === 'transfer').length} transfers
        </p>
      </Card>

      <Card className="flex flex-col">
        <h3 className="text-lg font-medium mb-2 text-primary">Fixed Deposits</h3>
        <p className="text-3xl font-bold text-primary">
          ${stats.totalFixedDeposits.toFixed(2)}
        </p>
        <p className="text-sm text-muted mt-2">
          {transactions.filter(t => t.type === 'fixed_deposit').length} deposits
        </p>
      </Card>

      <Card className="flex flex-col">
        <h3 className="text-lg font-medium mb-2 text-primary">International Transfers</h3>
        <p className="text-3xl font-bold text-primary">
          ${stats.totalInternationalTransfers.toFixed(2)}
        </p>
        <p className="text-sm text-muted mt-2">
          {transactions.filter(t => t.type === 'international_transfer').length} transfers
        </p>
      </Card>

      <Card className="flex flex-col">
        <h3 className="text-lg font-medium mb-2 text-primary">Bill Payments</h3>
        <p className="text-3xl font-bold text-primary">
          ${stats.totalBillPayments.toFixed(2)}
        </p>
        <p className="text-sm text-muted mt-2">
          {transactions.filter(t => t.type === 'bill_payment').length} payments
        </p>
      </Card>

      <Card className="flex flex-col">
        <h3 className="text-lg font-medium mb-2 text-primary">Tax Payments</h3>
        <p className="text-3xl font-bold text-primary">
          ${stats.totalTaxPayments.toFixed(2)}
        </p>
        <p className="text-sm text-muted mt-2">
          {transactions.filter(t => t.type === 'tax_payment').length} payments
        </p>
      </Card>
    </div>
  );
} 