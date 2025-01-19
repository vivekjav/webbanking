import { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

interface TransactionFormProps {
  onSubmit: (data: {
    type: 'deposit' | 'withdrawal' | 'transfer';
    amount: number;
    recipientEmail?: string;
  }) => Promise<void>;
}

export function TransactionForm({ onSubmit }: TransactionFormProps) {
  const [amount, setAmount] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [transactionType, setTransactionType] = useState<'deposit' | 'withdrawal' | 'transfer'>('deposit');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    const numAmount = parseFloat(amount);

    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid amount');
      setIsLoading(false);
      return;
    }

    try {
      await onSubmit({
        type: transactionType,
        amount: numAmount,
        recipientEmail: transactionType === 'transfer' ? recipientEmail : undefined,
      });
      
      // Reset form
      setAmount('');
      setRecipientEmail('');
      setTransactionType('deposit');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Transaction failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-2xl font-bold mb-6">New Transaction</h2>
        
        {error && (
          <div className="bg-error/10 text-error rounded-lg p-3">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-muted mb-1">
            Transaction Type
          </label>
          <select
            value={transactionType}
            onChange={(e) => setTransactionType(e.target.value as 'deposit' | 'withdrawal' | 'transfer')}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="deposit">Deposit</option>
            <option value="withdrawal">Withdrawal</option>
            <option value="transfer">Transfer</option>
          </select>
        </div>

        {transactionType === 'transfer' && (
          <div>
            <label className="block text-sm font-medium text-muted mb-1">
              Recipient Email
            </label>
            <input
              type="email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              placeholder="recipient@example.com"
              required
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-muted mb-1">
            Amount
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            min="0"
            step="0.01"
            placeholder="0.00"
            required
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          className="w-full"
        >
          Submit Transaction
        </Button>
      </form>
    </Card>
  );
} 