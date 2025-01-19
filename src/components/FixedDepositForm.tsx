'use client';

import { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

const FIXED_DEPOSIT_OPTIONS = [
  { duration: 3, rate: 4.5 },
  { duration: 6, rate: 5.0 },
  { duration: 12, rate: 5.5 },
  { duration: 24, rate: 6.0 },
];

interface FixedDepositFormProps {
  onSubmit: (data: {
    type: 'fixed_deposit';
    amount: number;
    duration: number;
    interestRate: number;
  }) => Promise<void>;
}

export function FixedDepositForm({ onSubmit }: FixedDepositFormProps) {
  const [amount, setAmount] = useState('');
  const [duration, setDuration] = useState(FIXED_DEPOSIT_OPTIONS[0].duration);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const selectedOption = FIXED_DEPOSIT_OPTIONS.find(opt => opt.duration === duration);
  const maturityAmount = selectedOption 
    ? parseFloat(amount) * (1 + (selectedOption.rate / 100) * (duration / 12))
    : 0;

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

    if (numAmount < 1000) {
      setError('Minimum fixed deposit amount is $1,000');
      setIsLoading(false);
      return;
    }

    try {
      await onSubmit({
        type: 'fixed_deposit',
        amount: numAmount,
        duration,
        interestRate: selectedOption?.rate || 0,
      });
      
      // Reset form
      setAmount('');
      setDuration(FIXED_DEPOSIT_OPTIONS[0].duration);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create fixed deposit');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-2xl font-bold mb-6">Create Fixed Deposit</h2>
        
        {error && (
          <div className="bg-error/10 text-error rounded-lg p-3">
            {error}
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
            min="1000"
            step="100"
            placeholder="Minimum $1,000"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-muted mb-1">
            Duration (Months)
          </label>
          <select
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value))}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            {FIXED_DEPOSIT_OPTIONS.map(option => (
              <option key={option.duration} value={option.duration}>
                {option.duration} months ({option.rate}% p.a.)
              </option>
            ))}
          </select>
        </div>

        {amount && (
          <div className="bg-primary/5 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Maturity Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted">Principal Amount</p>
                <p className="font-medium">${parseFloat(amount).toFixed(2)}</p>
              </div>
              <div>
                <p className="text-muted">Interest Rate</p>
                <p className="font-medium">{selectedOption?.rate}% p.a.</p>
              </div>
              <div>
                <p className="text-muted">Duration</p>
                <p className="font-medium">{duration} months</p>
              </div>
              <div>
                <p className="text-muted">Maturity Amount</p>
                <p className="font-medium text-success">${maturityAmount.toFixed(2)}</p>
              </div>
            </div>
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          className="w-full"
        >
          Create Fixed Deposit
        </Button>
      </form>
    </Card>
  );
} 