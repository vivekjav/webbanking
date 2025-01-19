import { Transaction } from '@/types/auth';
import { Card } from './ui/Card';

interface TransactionListProps {
  transactions: Transaction[];
}

export function TransactionList({ transactions }: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 text-muted">
        <svg className="w-12 h-12 mx-auto mb-4 text-muted/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p>No transactions yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <Card
          key={transaction.id}
          variant={transaction.type === 'deposit' ? 'success' : 'error'}
          className="flex justify-between items-center hover:scale-[1.02] cursor-pointer"
        >
          <div>
            <p className="font-medium">{transaction.description}</p>
            <p className="text-sm opacity-75">
              {new Date(transaction.date).toLocaleDateString()} at{' '}
              {new Date(transaction.date).toLocaleTimeString()}
            </p>
            {transaction.type === 'transfer' && transaction.recipientEmail && (
              <p className="text-sm opacity-75">To: {transaction.recipientEmail}</p>
            )}
          </div>
          <p className="text-lg font-bold">
            {transaction.type === 'deposit' ? '+' : '-'}$
            {transaction.amount.toFixed(2)}
          </p>
        </Card>
      ))}
    </div>
  );
} 